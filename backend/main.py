import base64
import os
import uuid
from typing import List

import boto3
import modal
import requests
from class_definitions import (
    GenerateFromDescribedLyricsRequest,
    GenerateFromDescriptionRequest,
    GenerateFromLyricsRequest,
    GenerateMusicResponse,
    GenerateMusicResponseS3,
)
from prompts import (
    get_category_generator_prompt,
    get_lyrics_generator_prompt,
    get_prompt_generator_prompt,
)

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
    .add_local_python_source("class_definitions")
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
        from diffusers import AutoPipelineForText2Image
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

        self.image_pipe = AutoPipelineForText2Image.from_pretrained(
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

    def generate_categories(self, description) -> List[str]:
        prompt = get_category_generator_prompt(description)
        result = self.prompt_qwen(prompt)
        categories = result.split(",")
        categories = [category.strip() for category in categories if category.strip()]

        return categories

    def generate_and_upload_to_s3(
        self,
        prompt: str,
        lyrics: str,
        isInstrumental: bool,
        audio_duration: float,
        infer_step: int,
        guidance_scale: float,
        seed: int,
        category_description: str,
    ) -> GenerateMusicResponseS3:
        final_lyrics = "[instrumental]" if isInstrumental else lyrics

        s3_client = boto3.client("s3")
        bucket_name = os.environ["AWS_S3_BUCKET_NAME"]

        output_dir = "/tmp/output"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"{uuid.uuid4()}.wav")

        self.music_model(
            prompt=prompt,
            lyrics=final_lyrics,
            audio_duration=audio_duration,
            infer_step=infer_step,
            guidance_scale=guidance_scale,
            save_path=output_path,
            manual_seeds=str(seed),
        )

        audio_s3_filekey = f"audios/{uuid.uuid4()}.wav"
        s3_client.upload_file(
            output_path,
            bucket_name,
            audio_s3_filekey,
        )
        os.remove(output_path)

        thumbnail_prompt = f"{prompt}, album cover art"

        image = self.image_pipe(
            prompt=thumbnail_prompt, num_inference_steps=1, guidance_scale=0.0
        ).images[0]
        image_output_path = os.path.join(output_dir, f"{uuid.uuid4()}.png")
        image.save(image_output_path)
        image_s3_filekey = f"thumbnails/{uuid.uuid4()}.png"
        s3_client.upload_file(
            image_output_path,
            bucket_name,
            image_s3_filekey,
        )
        os.remove(image_output_path)

        categories = self.generate_categories(category_description)

        return GenerateMusicResponseS3(
            s3_filekey=audio_s3_filekey,
            cover_image_s3_filekey=image_s3_filekey,
            categories=categories,
        )

    @modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
    def generate_from_description(
        self, request: GenerateFromDescriptionRequest
    ) -> GenerateMusicResponseS3:
        prompt = self.generate_prompt(request.full_song_description)
        lyrics = None

        if not request.instrumental:
            lyrics = self.generate_lyrics(request.full_song_description)

        return self.generate_and_upload_to_s3(
            prompt=prompt,
            lyrics=lyrics,
            isInstrumental=request.instrumental,
            category_description=request.full_song_description,
            **request.model_dump(
                exclude={"prompt", "lyrics", "full_song_description", "instrumental"}
            ),
        )

    @modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
    def generate_from_lyrics(
        self, request: GenerateFromLyricsRequest
    ) -> GenerateMusicResponseS3:
        return self.generate_and_upload_to_s3(
            prompt=request.prompt,
            lyrics=request.lyrics,
            isInstrumental=request.instrumental,
            category_description=request.prompt,
            **request.model_dump(exclude={"prompt", "lyrics", "instrumental"}),
        )

    @modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
    def generate_from_described_lyrics(
        self, request: GenerateFromDescribedLyricsRequest
    ) -> GenerateMusicResponseS3:
        lyrics = None

        if not request.instrumental:
            lyrics = self.generate_lyrics(request.lyrics_description)

        return self.generate_and_upload_to_s3(
            prompt=request.prompt,
            lyrics=lyrics,
            isInstrumental=request.instrumental,
            category_description=request.prompt,
            **request.model_dump(
                exclude={"prompt", "lyrics", "lyrics_description", "instrumental"}
            ),
        )


@app.local_entrypoint()
def main():
    server = MusicGeneratorServer()
