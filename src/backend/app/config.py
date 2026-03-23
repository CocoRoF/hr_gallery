"""Application settings via environment variables."""

from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    app_name: str = "HR Gallery"
    app_env: str = "production"

    # Backend
    backend_port: int = 8000
    backend_workers: int = 4
    max_upload_size_mb: int = 50
    allowed_origins: list[str] = ["http://localhost", "http://localhost:3000"]

    # Googer
    googer_default_region: str = "us-en"
    googer_default_max_results: int = 10
    googer_timeout: int = 15
    googer_max_retries: int = 3

    # f2a
    f2a_max_file_size_mb: int = 50
    f2a_default_lang: str = "en"
    f2a_upload_dir: str = "/app/uploads"

    # Contextifier
    contextifier_max_file_size_mb: int = 50
    contextifier_upload_dir: str = "/app/uploads/contextifier"

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_origins(cls, v: object) -> object:
        if isinstance(v, str) and not v.startswith("["):
            return [s.strip() for s in v.split(",") if s.strip()]
        return v

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "env_ignore_empty": True,
    }


settings = Settings()
