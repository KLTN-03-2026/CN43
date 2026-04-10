"""Application configuration using Pydantic Settings.

Loads from .env file with sensible defaults.
All settings can be overridden via environment variables.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings from .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # App
    app_name: str = "Job Portal API"

    # Security
    secret_key: str = "change-me-in-production-use-long-random-string"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # Database
    database_url: str = "sqlite+aiosqlite:///./job_portal.db"

    # Gemini AI
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"

    # File Upload
    upload_dir: str = "./uploads"
    max_upload_mb: int = 10

    # Email/OTP
    otp_expire_minutes: int = 10
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_from_email: str = ""
    smtp_from_name: str = "HOT CV"
    smtp_use_tls: bool = True
    smtp_debug: bool = True  # Set False in production


settings = Settings()
