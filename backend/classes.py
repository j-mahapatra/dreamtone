from typing import List

from pydantic import BaseModel


class GenerateMusicResponse(BaseModel):
    audio_data: str


class AudioGenerationBase(BaseModel):
    audio_duration: float = 15.0
    seed: int = -1
    guidance_scale: float = 15.0
    infer_step: int = 60
    instrumental: bool = False


class GenerateFromDescriptionRequest(AudioGenerationBase):
    full_song_description: str


class GenerateFromLyricsRequest(AudioGenerationBase):
    prompt: str
    lyrics: str


class GenerateFromDescribedLyricsRequest(AudioGenerationBase):
    prompt: str
    lyrics_description: str


class GenerateMusicResponseS3(BaseModel):
    s3_filekey: str
    cover_image_s3_filekey: str
    categories: List[str]
