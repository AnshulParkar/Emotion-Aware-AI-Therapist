import openai
import os
import tiktoken
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class OpenAIService:
    def __init__(self):
        self.client = openai.AsyncOpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )
        self.model = os.getenv("OPENAI_MODEL", "gpt-4")
        self.max_tokens = int(os.getenv("MAX_TOKENS", "500"))
        
    async def generate_therapy_response(self, user_message: str, emotion: str = "neutral") -> str:
        """Generate empathetic therapy response based on user message and detected emotion"""
        try:
            # Create emotion-aware system prompt
            system_prompt = self._create_system_prompt(emotion)
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=0.7,
                top_p=0.9
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Error generating therapy response: {str(e)}")
            raise e
    
    def _create_system_prompt(self, emotion: str) -> str:
        """Create emotion-aware system prompt for therapy responses"""
        base_prompt = """You are an empathetic AI therapist. Your role is to provide supportive, 
        understanding, and professionally appropriate responses to help users explore their feelings 
        and thoughts. Always maintain professional boundaries and encourage users to seek professional 
        help when appropriate."""
        
        emotion_prompts = {
            "happy": "The user seems to be in a positive mood. Acknowledge their happiness while exploring what contributes to their well-being.",
            "sad": "The user appears to be feeling sad. Respond with extra empathy and help them process these feelings.",
            "angry": "The user seems frustrated or angry. Help them explore the source of their anger in a constructive way.",
            "fearful": "The user appears anxious or fearful. Provide reassurance while helping them understand their concerns.",
            "surprised": "The user seems surprised or shocked. Help them process unexpected events or revelations.",
            "disgusted": "The user appears disgusted or frustrated. Help them work through these difficult feelings.",
            "neutral": "Provide balanced, supportive therapeutic guidance."
        }
        
        emotion_context = emotion_prompts.get(emotion.lower(), emotion_prompts["neutral"])
        
        return f"{base_prompt}\n\nCurrent context: {emotion_context}"
    
    async def count_tokens(self, text: str) -> int:
        """Count tokens in text for the current model"""
        try:
            encoding = tiktoken.encoding_for_model(self.model)
            return len(encoding.encode(text))
        except Exception as e:
            logger.error(f"Error counting tokens: {str(e)}")
            return 0
