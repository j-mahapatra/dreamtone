import base64
import os
import uuid

import modal
import requests
from classes import (
    GenerateFromDescribedLyricsRequest,
    GenerateFromDescriptionRequest,
    GenerateFromLyricsRequest,
    GenerateMusicResponse,
    GenerateMusicResponseS3,
)
from prompts import get_lyrics_generator_prompt, get_prompt_generator_prompt

app = modal.App("music-generator")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("git")
    .pip_install_from_requirements("requirements.txt")
    .run_commands(
        "git clone https://github.com/ace-step/ACE-Step.git /tmp/ACE-Step",
        "cd /tmp/ACE-Step && pip install .",
    )
    .env({"HF_HOME": "/.cache/huggingface"})
    .add_local_python_source("prompts")
)

model_volume = modal.Volume.from_name("ace-step-models", create_if_missing=True)
huggigface_volume = modal.Volume.from_name("qwen-hf-cache", create_if_missing=True)

music_generator_secrets = modal.Secret.from_name("music-generator-secret")


@app.cls(
    image=image,
    gpu="L40S",
    volumes={"/models": model_volume, "/.cache/huggingface": huggigface_volume},
    secrets=[music_generator_secrets],
    scaledown_window=15,
)
class MusicGeneratorServer:
    @modal.enter()
    def load_model(self):
        import torch
        from acestep.pipeline_ace_step import ACEStepPipeline
        from diffusers import AutoPipelineForImage2Image
        from transformers import AutoModelForCausalLM, AutoTokenizer

        self.music_model = ACEStepPipeline(
            checkpoint_dir="/models",
            dtype="bfloat16",
            torch_compile=False,
            cpu_offload=False,
            overlapped_decode=False,
        )

        model_id = "Qwen/Qwen2-7B-Instruct"
        self.tokenizer = AutoTokenizer.from_pretrained(model_id)
        self.llm_model = AutoModelForCausalLM.from_pretrained(
            model_id,
            torch_dtype="auto",
            device_map="auto",
            cache_dir="/.cache/huggingface",
        )

        self.image_pipe = AutoPipelineForImage2Image.from_pretrained(
            "stabilityai/sdxl-turbo",
            torch_dtype=torch.float16,
            variant="fp16",
            cache_dir="/.cache/huggingface",
        )
        self.image_pipe.to("cuda")

    def prompt_qwen(self, prompt: str):
        messages = [{"role": "user", "content": prompt}]
        text = self.tokenizer.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True
        )
        model_inputs = self.tokenizer([text], return_tensors="pt").to(
            self.llm_model.device
        )

        generated_ids = self.llm_model.generate(
            model_inputs.input_ids, max_new_tokens=512
        )
        generated_ids = [
            output_ids[len(input_ids) :]
            for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
        ]

        response = self.tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[
            0
        ]
        return response

    def generate_prompt(self, user_prompt: str):
        full_prompt = get_prompt_generator_prompt(user_prompt)
        return self.prompt_qwen(full_prompt)

    def generate_lyrics(self, description: str):
        full_prompt = get_lyrics_generator_prompt(description)
        return self.prompt_qwen(full_prompt)

    @modal.fastapi_endpoint(method="POST")
    def generate(self) -> GenerateMusicResponse:
        output_dir = "/tmp/output"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"{uuid.uuid4()}.wav")

        self.music_model(
            prompt="country rock, folk rock, southern rock, bluegrass, country pop",
            lyrics="[verse]\nWoke up to the sunrise glow\nTook my heart and hit the road\nWheels hummin' the only tune I know\nStraight to where the wildflowers grow\n\n[verse]\nGot that old map all wrinkled and torn\nDestination unknown but I'm reborn\nWith a smile that the wind has worn\nChasin' dreams that can't be sworn\n\n[chorus]\nRidin' on a highway to sunshine\nGot my shades and my radio on fine\nLeave the shadows in the rearview rhyme\nHeart's racing as we chase the time\n\n[verse]\nMet a girl with a heart of gold\nTold stories that never get old\nHer laugh like a tale that's been told\nA melody so bold yet uncontrolled\n\n[bridge]\nClouds roll by like silent ghosts\nAs we drive along the coast\nWe toast to the days we love the most\nFreedom's song is what we post\n\n[chorus]\nRidin' on a highway to sunshine\nGot my shades and my radio on fine\nLeave the shadows in the rearview rhyme\nHeart's racing as we chase the time",
            audio_duration=224.23997916666667,
            infer_step=60,
            guidance_scale=15,
            save_path=output_path,
        )

        with open(output_path, "rb") as f:
            audio_bytes = f.read()

        audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")

        os.remove(output_path)

        return GenerateMusicResponse(audio_data=audio_base64)

    @modal.fastapi_endpoint(method="POST")
    def generate_from_description(
        self, request: GenerateFromDescriptionRequest
    ) -> GenerateMusicResponseS3:
        pass

    @modal.fastapi_endpoint(method="POST")
    def generate_from_lyrics(
        self, request: GenerateFromLyricsRequest
    ) -> GenerateMusicResponseS3:
        pass

    @modal.fastapi_endpoint(method="POST")
    def generate_from_described_lyrics(
        self, request: GenerateFromDescribedLyricsRequest
    ) -> GenerateMusicResponseS3:
        pass


@app.local_entrypoint()
def main():
    server = MusicGeneratorServer()
    endpoint_url = server.generate.get_web_url()

    response = requests.post(endpoint_url)
    response.raise_for_status()
    result = GenerateMusicResponse(**response.json())

    audio_bytes = base64.b64decode(result.audio_data)

    output_filename = "generated.wav"

    with open(output_filename, "wb") as f:
        f.write(audio_bytes)
