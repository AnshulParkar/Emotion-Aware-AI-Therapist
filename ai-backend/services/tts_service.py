import httpx
import aiofiles
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class TTSService:
    def __init__(self):
        self.elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
        self.elevenlabs_url = "https://api.elevenlabs.io/v1"
        self.default_voice_id = os.getenv("ELEVENLABS_VOICE_ID", "nLiZs38w2b9S5WVDWipV")  # Sia voice ID
        
        if self.elevenlabs_api_key:
            logger.info(f"✅ ElevenLabs API key loaded")
            logger.info(f"✅ Using voice ID: {self.default_voice_id}")
        else:
            logger.warning("❌ ElevenLabs API key not found in environment variables")
        
    async def generate_speech(self, text: str, voice: str = "default") -> str:
        """Generate speech from text using ElevenLabs API or create dummy audio"""
        try:
            # Check if API key is available
            if not self.elevenlabs_api_key:
                logger.warning("ElevenLabs API key not found, creating dummy audio response")
                return self._create_dummy_audio(text)
            
            voice_id = self.default_voice_id if voice == "default" else voice
            logger.info(f"🎤 Generating speech for: '{text[:50]}...' with voice: {voice_id}")
            
            # Generate speech using ElevenLabs API
            async def make_elevenlabs_request():
                async with httpx.AsyncClient(timeout=60.0) as client:
                    headers = {"xi-api-key": self.elevenlabs_api_key}
                    data = {
                        "text": text,
                        "model_id": "eleven_monolingual_v1",
                        "voice_settings": {
                            "stability": 0.5,
                            "similarity_boost": 0.5
                        }
                    }
                    url = f"{self.elevenlabs_url}/text-to-speech/{voice_id}"
                    
                    response = await client.post(url, headers=headers, json=data)
                    return response
            
            response = await make_elevenlabs_request()
            
            logger.info(f"📡 ElevenLabs API response: {response.status_code}")
            
            if response.status_code == 200:
                # Save audio file
                audio_filename = f"elevenlabs_audio_{hash(text)}.mp3"
                audio_path = f"temp/{audio_filename}"
                
                # Ensure temp directory exists
                os.makedirs("temp", exist_ok=True)
                
                async with aiofiles.open(audio_path, "wb") as f:
                    await f.write(response.content)
                
                logger.info(f"✅ Successfully generated real TTS audio: {audio_filename}")
                # Return URL path instead of local path
                return f"/audio/{audio_filename}"
            
            elif response.status_code == 401:
                logger.error(f"❌ ElevenLabs API: Unauthorized - {response.text}")
                return self._create_dummy_audio(text)
            
            elif response.status_code == 422:
                logger.error(f"❌ ElevenLabs API: Invalid request data - {response.text}")
                return self._create_dummy_audio(text)
            
            else:
                logger.error(f"❌ ElevenLabs API error: {response.status_code} - {response.text}")
                return self._create_dummy_audio(text)
                    
        except httpx.TimeoutException:
            logger.error("❌ ElevenLabs API request timed out")
            return self._create_dummy_audio(text)
        except Exception as e:
            logger.error(f"❌ Error generating speech: {str(e)}")
            logger.exception("Full traceback:")
            return self._create_dummy_audio(text)
    
    def _create_dummy_audio(self, text: str) -> str:
        """Create a dummy audio response when API is not available"""
        logger.warning("🔄 Creating dummy audio as fallback")
        try:
            # Create a dummy audio file with WAV extension
            audio_filename = f"dummy_audio_{hash(text)}.wav"
            audio_path = f"temp/{audio_filename}"
            
            # Ensure temp directory exists
            os.makedirs("temp", exist_ok=True)
            
            # Always create a new WAV file (don't reuse old files)
            if os.path.exists(audio_path):
                os.remove(audio_path)  # Remove existing file to ensure fresh creation
            
            # Try to copy a placeholder audio file if it exists
            placeholder_path = "placeholder_audio.wav"
            if os.path.exists(placeholder_path):
                import shutil
                shutil.copy2(placeholder_path, audio_path)
                logger.info(f"📁 Copied placeholder audio to: {audio_path}")
                return f"/audio/{audio_filename}"
            
            # Otherwise create a simple WAV file with a tone
            self._create_simple_wav(audio_path, duration=max(2.0, len(text) * 0.05))
            
            logger.info(f"🎵 Created dummy audio file: {audio_path}")
            return f"/audio/{audio_filename}"
            
        except Exception as e:
            logger.error(f"❌ Error creating dummy audio: {str(e)}")
            return "/audio/placeholder.wav"  # Return WAV extension
    
    def _create_simple_wav(self, filename: str, duration: float = 2.0, sample_rate: int = 22050):
        """Create a simple WAV file with a tone"""
        try:
            import wave
            import math
            import struct
            
            # Generate a simple sine wave with higher volume
            frames = []
            for i in range(int(duration * sample_rate)):
                # Generate a 440Hz tone (A note) with higher amplitude
                value = int(32767 * 0.3 * math.sin(2 * math.pi * 440 * i / sample_rate))
                frames.append(struct.pack('<h', value))
            
            # Write WAV file
            with wave.open(filename, 'wb') as wav_file:
                wav_file.setnchannels(1)  # Mono
                wav_file.setsampwidth(2)  # 16-bit
                wav_file.setframerate(sample_rate)
                wav_file.writeframes(b''.join(frames))
                
            logger.info(f"🎼 Created WAV file with {duration:.1f}s duration: {filename}")
                
        except Exception as e:
            logger.error(f"❌ Error creating WAV file: {str(e)}")
            # Create a minimal WAV file as fallback
            with open(filename, "wb") as f:
                # Minimal WAV header for a short beep
                wav_header = b'RIFF\x24\x08\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x22\x56\x00\x00\x44\xAC\x00\x00\x02\x00\x10\x00data\x00\x08\x00\x00'
                # Add some actual audio data (simple beep pattern)
                audio_data = b'\x00\x7F' * 1000  # Simple alternating pattern
                f.write(wav_header + audio_data)
    
    async def get_available_voices(self) -> list:
        """Get list of available voices from ElevenLabs"""
        try:
            if not self.elevenlabs_api_key:
                return []
                
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
                    voices = response.json()["voices"]
                    logger.info(f"✅ Retrieved {len(voices)} voices from ElevenLabs")
                    return voices
                else:
                    logger.error(f"❌ Failed to get voices: {response.status_code}")
                    return []
                    
        except Exception as e:
            logger.error(f"❌ Error getting voices: {str(e)}")
            return []
    
    async def enhance_audio(self, audio_path: str) -> str:
        """Enhance audio quality using basic processing"""
        try:
            # Audio enhancement disabled for now due to missing dependencies
            logger.info("🔧 Audio enhancement not available, returning original path")
            return audio_path
            
        except Exception as e:
            logger.error(f"❌ Error enhancing audio: {str(e)}")
            return audio_path  # Return original if enhancement fails