from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import uvicorn
import os
from dotenv import load_dotenv

from services.openai_service import OpenAIService
from services.tts_service import TTSService
from services.avatar_service import AvatarService
from services.database_service import DatabaseService

load_dotenv()

app = FastAPI(
    title="AI Therapist Backend",
    description="AI-powered therapy backend with OpenAI, TTS, and Avatar services",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize services
openai_service = OpenAIService()
tts_service = TTSService()
avatar_service = AvatarService()
db_service = DatabaseService()

@app.get("/")
async def root():
    return {"message": "AI Therapist Backend API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-backend"}

@app.post("/chat")
async def chat_with_therapist(message: dict):
    """Generate therapeutic response using OpenAI"""
    try:
        user_message = message.get("message", "")
        emotion = message.get("emotion", "neutral")
        
        response = await openai_service.generate_therapy_response(user_message, emotion)
        return {"response": response, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tts")
async def text_to_speech(text_data: dict):
    """Convert text to speech"""
    try:
        text = text_data.get("text", "")
        voice = text_data.get("voice", "default")
        
        audio_url = await tts_service.generate_speech(text, voice)
        return {"audio_url": audio_url, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/avatar")
async def generate_avatar(avatar_data: dict):
    """Generate talking avatar video"""
    try:
        text = avatar_data.get("text", "")
        avatar_id = avatar_data.get("avatar_id", "default")
        
        video_url = await avatar_service.create_talking_avatar(text, avatar_id)
        return {"video_url": video_url, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/session")
async def create_session(session_data: dict):
    """Create new therapy session"""
    try:
        user_id = session_data.get("user_id")
        session_id = await db_service.create_session(user_id)
        return {"session_id": session_id, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get session data"""
    try:
        session = await db_service.get_session(session_id)
        return {"session": session, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8001)),
        reload=True
    )
