from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
import base64
from io import BytesIO
from PIL import Image
import uvicorn
from pydantic import BaseModel
from typing import Dict, List, Optional
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Emotion Detection API",
    description="Real-time emotion detection from video frames",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class EmotionRequest(BaseModel):
    image: str  # base64 encoded image
    confidence_threshold: Optional[float] = 0.4

class EmotionResponse(BaseModel):
    emotion: str
    confidence: float
    emotions: Dict[str, float]
    timestamp: str

class HealthResponse(BaseModel):
    status: str
    message: str

# Mock emotion detection (replace with actual ML model)
class EmotionDetector:
    def __init__(self):
        self.emotions = [
            "happy", "sad", "angry", "surprised", 
            "fear", "disgust", "neutral"
        ]
    
    def detect_emotion(self, image_array: np.ndarray) -> Dict[str, float]:
        """
        Mock emotion detection - replace with actual model inference
        """
        # For now, return random but realistic emotion scores
        import random
        
        # Generate random scores that sum to 1.0
        scores = [random.random() for _ in self.emotions]
        total = sum(scores)
        normalized_scores = {
            emotion: score / total 
            for emotion, score in zip(self.emotions, scores)
        }
        
        return normalized_scores

# Initialize detector
detector = EmotionDetector()

def decode_base64_image(base64_string: str) -> np.ndarray:
    """Decode base64 image string to numpy array"""
    try:
        # Remove data URL prefix if present
        if base64_string.startswith('data:image'):
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_string)
        image = Image.open(BytesIO(image_data))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        image_array = np.array(image)
        
        return image_array
    except Exception as e:
        logger.error(f"Error decoding image: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid image data: {str(e)}")

@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="Emotion Detection API is running"
    )

@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="ML Backend is operational"
    )

@app.post("/detect_emotion", response_model=EmotionResponse)
async def detect_emotion(request: EmotionRequest):
    """
    Detect emotions from a base64 encoded image
    """
    try:
        # Decode the image
        image_array = decode_base64_image(request.image)
        logger.info(f"Processing image with shape: {image_array.shape}")
        
        # Detect emotions
        emotion_scores = detector.detect_emotion(image_array)
        
        # Find the dominant emotion
        dominant_emotion = max(emotion_scores.items(), key=lambda x: x[1])
        
        # Check confidence threshold
        if dominant_emotion[1] < request.confidence_threshold:
            dominant_emotion = ("neutral", emotion_scores.get("neutral", 0.5))
        
        # Get current timestamp
        from datetime import datetime
        timestamp = datetime.now().isoformat()
        
        return EmotionResponse(
            emotion=dominant_emotion[0],
            confidence=dominant_emotion[1],
            emotions=emotion_scores,
            timestamp=timestamp
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in emotion detection: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Emotion detection failed: {str(e)}")

@app.post("/detect_emotion_file")
async def detect_emotion_from_file(file: UploadFile = File(...)):
    """
    Detect emotions from an uploaded image file
    """
    try:
        # Read file
        contents = await file.read()
        
        # Convert to PIL Image
        image = Image.open(BytesIO(contents))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        image_array = np.array(image)
        
        # Detect emotions
        emotion_scores = detector.detect_emotion(image_array)
        
        # Find the dominant emotion
        dominant_emotion = max(emotion_scores.items(), key=lambda x: x[1])
        
        # Get current timestamp
        from datetime import datetime
        timestamp = datetime.now().isoformat()
        
        return EmotionResponse(
            emotion=dominant_emotion[0],
            confidence=dominant_emotion[1],
            emotions=emotion_scores,
            timestamp=timestamp
        )
        
    except Exception as e:
        logger.error(f"Error processing uploaded file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")

@app.get("/emotions")
async def get_available_emotions():
    """Get list of available emotions"""
    return {
        "emotions": detector.emotions,
        "total": len(detector.emotions)
    }

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8002,
        reload=True,
        log_level="info"
    )
