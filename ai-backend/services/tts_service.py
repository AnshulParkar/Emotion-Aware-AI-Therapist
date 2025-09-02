import httpx
import aiofiles
import os
import logging
from typing import Optional
import base64
import soundfile as sf
import numpy as np

logger = logging.getLogger(__name__)

class TTSService:
    def __init__(self):
        self.elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
        self.elevenlabs_url = "https://api.elevenlabs.io/v1"
        self.default_voice_id = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # Rachel voice
        
    async def generate_speech(self, text: str, voice: str = "default") -> str:
        """Generate speech from text using ElevenLabs API"""
        try:
            voice_id = self.default_voice_id if voice == "default" else voice
            
            async with httpx.AsyncClient() as client:
                headers = {
                    "Accept": "audio/mpeg",
                    "Content-Type": "application/json",
                    "xi-api-key": self.elevenlabs_api_key
                }
                
                data = {
                    "text": text,
                    "model_id": "eleven_monolingual_v1",
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.5
                    }
                }
                
                response = await client.post(
                    f"{self.elevenlabs_url}/text-to-speech/{voice_id}",
                    headers=headers,
                    json=data
                )
                
                if response.status_code == 200:
                    # Save audio file
                    audio_filename = f"audio_{hash(text)}.mp3"
                    audio_path = f"temp/{audio_filename}"
                    
                    # Ensure temp directory exists
                    os.makedirs("temp", exist_ok=True)
                    
                    async with aiofiles.open(audio_path, "wb") as f:
                        await f.write(response.content)
                    
                    return audio_path
                else:
                    raise Exception(f"TTS API error: {response.status_code} - {response.text}")
                    
        except Exception as e:
            logger.error(f"Error generating speech: {str(e)}")
            raise e
    
    async def get_available_voices(self) -> list:
        """Get list of available voices from ElevenLabs"""
        try:
            async with httpx.AsyncClient() as client:
                headers = {
                    "Accept": "application/json",
                    "xi-api-key": self.elevenlabs_api_key
                }
                
                response = await client.get(
                    f"{self.elevenlabs_url}/voices",
                    headers=headers
                )
                
                if response.status_code == 200:
                    return response.json()["voices"]
                else:
                    raise Exception(f"Failed to get voices: {response.status_code}")
                    
        except Exception as e:
            logger.error(f"Error getting voices: {str(e)}")
            return []
    
    async def enhance_audio(self, audio_path: str) -> str:
        """Enhance audio quality using basic processing"""
        try:
            # Load audio file
            data, samplerate = sf.read(audio_path)
            
            # Basic enhancement (normalize volume)
            if len(data.shape) > 1:
                data = np.mean(data, axis=1)  # Convert to mono
            
            # Normalize
            data = data / np.max(np.abs(data))
            
            # Save enhanced audio
            enhanced_path = audio_path.replace('.mp3', '_enhanced.wav')
            sf.write(enhanced_path, data, samplerate)
            
            return enhanced_path
            
        except Exception as e:
            logger.error(f"Error enhancing audio: {str(e)}")
            return audio_path  # Return original if enhancement fails
