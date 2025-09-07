from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
import multiprocessing
import sys
from dotenv import load_dotenv

# Fix for Windows multiprocessing issues
if sys.platform == "win32":
    multiprocessing.set_start_method("spawn", force=True)

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

# Create temp directory for audio files
os.makedirs("temp", exist_ok=True)

# Mount static files for audio and video serving
app.mount("/audio", StaticFiles(directory="temp"), name="audio")
app.mount("/video", StaticFiles(directory="temp"), name="video")

# Initialize services lazily to avoid import issues
gemini_service = None
tts_service = None
avatar_service = None

def get_services():
    """Lazy initialization of services"""
    global gemini_service, tts_service, avatar_service
    if gemini_service is None:
        from services.ai_service import GeminiService
        from services.tts_service import TTSService
        from services.avatar_service import AvatarService
        
        gemini_service = GeminiService()
        tts_service = TTSService()
        avatar_service = AvatarService()
    
    return gemini_service, tts_service, avatar_service

@app.get("/") # this is known as a decorator and gets executed when the root endpoint is hit
async def root():
    return {"message": "AI Therapist Backend API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-backend"}

@app.post("/chat") # This is also a decorator and gets executed when the /chat endpoint is hit and post is the method that is used to send data to the endpoint
async def chat_with_therapist(message: dict):
    """Generate therapeutic response using Gemini"""
    try:
        gemini_service, _, _ = get_services()
        
        user_message = message.get("message", "")
        emotion = message.get("emotion", "neutral")
        # session_id = message.get("session_id", None)  # Commented out session functionality

        response = await gemini_service.generate_therapy_response(user_message, emotion)
        return {"response": response, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tts")
async def text_to_speech(text_data: dict):
    """Convert text to speech"""
    try:
        _, tts_service, _ = get_services()
        
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
        _, _, avatar_service = get_services()
        
        text = avatar_data.get("text", "")
        avatar_id = avatar_data.get("avatar_id", "default")
        
        video_url = await avatar_service.create_talking_avatar(text, avatar_id)
        return {"video_url": video_url, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @app.post("/session")
# async def create_session(session_data: dict):
#     """Create new therapy session"""
#     try:
#         user_id = session_data.get("user_id")
#         session_id = await db_service.create_session(user_id)
#         return {"session_id": session_id, "status": "success"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/session/{session_id}")
# async def get_session(session_id: str):
#     """Get session data"""
#     try:
#         session = await db_service.get_session(session_id)
#         return {"session": session, "status": "success"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Add multiprocessing support for Windows
    multiprocessing.freeze_support()
    
    uvicorn.run(
        app,  # Pass app object directly instead of string
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8001)),
        reload=False,  # Disable reload to prevent multiprocessing issues
        workers=1
    )
