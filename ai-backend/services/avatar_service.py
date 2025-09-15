import httpx
import os
import logging
import asyncio
from typing import Optional, Dict
import base64
import json

logger = logging.getLogger(__name__)

class AvatarService:
    def __init__(self):
        self.did_api_key = os.getenv("DID_API_KEY")
        self.did_url = "https://api.d-id.com"
        self.default_presenter_id = os.getenv("DID_PRESENTER_ID", "amy-jcwCkr1grs")
        # Path to dummy video for development
        self.dummy_video_path = "dummy_avatar.mp4"
        
    async def create_talking_avatar(self, text: str, avatar_id: str = "default") -> str:
        """Create talking avatar video using D-ID API or return dummy video"""
        try:
            # For now, return dummy video URL instead of calling D-ID API
            # This allows testing without API costs
            if not self.did_api_key:
                logger.info("D-ID API key not found, returning dummy video")
                return self._create_dummy_video()
            
            # If D-ID API is available, use the original implementation
            presenter_id = self.default_presenter_id if avatar_id == "default" else avatar_id
            
            async with httpx.AsyncClient() as client:
                headers = {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "authorization": f"Basic {self.did_api_key}"
                }
                
                # First, create the talk
                talk_data = {
                    "script": {
                        "type": "text",
                        "input": text
                    },
                    "source_url": f"https://create.d-id.com/api/presenters/{presenter_id}/image"
                }
                
                # Create talk request
                response = await client.post(
                    f"{self.did_url}/talks",
                    headers=headers,
                    json=talk_data
                )
                
                if response.status_code == 201:
                    talk_response = response.json()
                    talk_id = talk_response["id"]
                    
                    # Wait for video to be ready and return URL
                    video_url = await self._wait_for_video(talk_id)
                    return video_url
                else:
                    raise Exception(f"D-ID API error: {response.status_code} - {response.text}")
                    
        except Exception as e:
            logger.error(f"Error creating talking avatar: {str(e)}")
            # Fallback to dummy video if API fails
            return self._create_dummy_video()
    
    def _create_dummy_video(self) -> str:
        """Return dummy video URL for testing"""
        # Copy the client's aiVideo.mp4 to temp directory and serve it
        import shutil
        
        client_video_path = "../client/public/aiVideo.mp4"
        dummy_video_filename = f"avatar_dummy_{hash('dummy_video')}.mp4"
        dummy_video_path = f"temp/{dummy_video_filename}"
        
        try:
            # Ensure temp directory exists
            os.makedirs("temp", exist_ok=True)
            
            # Copy video file if it exists
            if os.path.exists(client_video_path):
                shutil.copy2(client_video_path, dummy_video_path)
                logger.info(f"Copied dummy video to {dummy_video_path}")
            else:
                logger.warning(f"Dummy video not found at {client_video_path}")
                # Create a placeholder file or return a default URL
                return "/video/placeholder.mp4"
            
            return f"/video/{dummy_video_filename}"
            
        except Exception as e:
            logger.error(f"Error creating dummy video: {str(e)}")
            return "/video/placeholder.mp4"
    
    async def _wait_for_video(self, talk_id: str, max_attempts: int = 30) -> str:
        """Wait for D-ID video to be ready"""
        try:
            async with httpx.AsyncClient() as client:
                headers = {
                    "accept": "application/json",
                    "authorization": f"Basic {self.did_api_key}"
                }
                
                for attempt in range(max_attempts):
                    response = await client.get(
                        f"{self.did_url}/talks/{talk_id}",
                        headers=headers
                    )
                    
                    if response.status_code == 200:
                        result = response.json()
                        status = result.get("status")
                        
                        if status == "done":
                            return result.get("result_url")
                        elif status == "error":
                            raise Exception(f"Video generation failed: {result.get('error', {}).get('description')}")
                        
                        # Wait 2 seconds before next attempt
                        await asyncio.sleep(2)
                    else:
                        raise Exception(f"Failed to check video status: {response.status_code}")
                
                raise Exception("Video generation timed out")
                
        except Exception as e:
            logger.error(f"Error waiting for video: {str(e)}")
            raise e
    
    async def get_available_presenters(self) -> list:
        """Get list of available D-ID presenters"""
        try:
            async with httpx.AsyncClient() as client:
                headers = {
                    "accept": "application/json",
                    "authorization": f"Basic {self.did_api_key}"
                }
                
                response = await client.get(
                    f"{self.did_url}/presenters",
                    headers=headers
                )
                
                if response.status_code == 200:
                    return response.json()["presenters"]
                else:
                    raise Exception(f"Failed to get presenters: {response.status_code}")
                    
        except Exception as e:
            logger.error(f"Error getting presenters: {str(e)}")
            return []
    
    async def upload_custom_avatar(self, image_data: bytes, name: str) -> str:
        """Upload custom avatar image to D-ID"""
        try:
            async with httpx.AsyncClient() as client:
                headers = {
                    "accept": "application/json",
                    "authorization": f"Basic {self.did_api_key}"
                }
                
                # Convert image to base64
                image_b64 = base64.b64encode(image_data).decode('utf-8')
                
                data = {
                    "name": name,
                    "image": f"data:image/jpeg;base64,{image_b64}"
                }
                
                response = await client.post(
                    f"{self.did_url}/images",
                    headers=headers,
                    json=data
                )
                
                if response.status_code == 201:
                    return response.json()["id"]
                else:
                    raise Exception(f"Failed to upload avatar: {response.status_code} - {response.text}")
                    
        except Exception as e:
            logger.error(f"Error uploading custom avatar: {str(e)}")
            raise e
