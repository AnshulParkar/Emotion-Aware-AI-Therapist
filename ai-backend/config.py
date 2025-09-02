import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Configuration
    app_name: str = "AI Therapist Backend"
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    port: int = int(os.getenv("PORT", 8001))
    host: str = os.getenv("HOST", "0.0.0.0")
    
    # OpenAI Configuration
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4")
    max_tokens: int = int(os.getenv("MAX_TOKENS", "500"))
    
    # ElevenLabs Configuration
    elevenlabs_api_key: str = os.getenv("ELEVENLABS_API_KEY", "")
    elevenlabs_voice_id: str = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")
    
    # D-ID Configuration
    did_api_key: str = os.getenv("DID_API_KEY", "")
    did_presenter_id: str = os.getenv("DID_PRESENTER_ID", "amy-jcwCkr1grs")
    
    # Database Configuration
    mongodb_url: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name: str = os.getenv("DATABASE_NAME", "ai_therapist")
    
    # Redis Configuration (for caching)
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Security
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # CORS
    allowed_origins: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ]
    
    class Config:
        env_file = ".env"

settings = Settings()
