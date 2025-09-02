from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import os
from datetime import datetime, timezone
from typing import Dict, List, Optional
import logging
from bson import ObjectId

logger = logging.getLogger(__name__)

class DatabaseService:
    def __init__(self):
        self.mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        self.database_name = os.getenv("DATABASE_NAME", "ai_therapist")
        self.client = None
        self.db = None
        
    async def connect(self):
        """Connect to MongoDB"""
        try:
            self.client = AsyncIOMotorClient(self.mongodb_url)
            self.db = self.client[self.database_name]
            
            # Test connection
            await self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
            
        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            raise e
    
    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            logger.info("Disconnected from MongoDB")
    
    async def create_session(self, user_id: str) -> str:
        """Create a new therapy session"""
        try:
            if not self.db:
                await self.connect()
                
            session_data = {
                "user_id": user_id,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                "messages": [],
                "emotions_detected": [],
                "session_notes": "",
                "status": "active"
            }
            
            result = await self.db.sessions.insert_one(session_data)
            return str(result.inserted_id)
            
        except Exception as e:
            logger.error(f"Error creating session: {str(e)}")
            raise e
    
    async def get_session(self, session_id: str) -> Optional[Dict]:
        """Get session by ID"""
        try:
            if not self.db:
                await self.connect()
                
            session = await self.db.sessions.find_one({"_id": ObjectId(session_id)})
            
            if session:
                session["_id"] = str(session["_id"])
                return session
            return None
            
        except Exception as e:
            logger.error(f"Error getting session: {str(e)}")
            raise e
    
    async def update_session(self, session_id: str, update_data: Dict) -> bool:
        """Update session with new data"""
        try:
            if not self.db:
                await self.connect()
                
            update_data["updated_at"] = datetime.now(timezone.utc)
            
            result = await self.db.sessions.update_one(
                {"_id": ObjectId(session_id)},
                {"$set": update_data}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Error updating session: {str(e)}")
            raise e
    
    async def add_message(self, session_id: str, message: Dict) -> bool:
        """Add message to session"""
        try:
            if not self.db:
                await self.connect()
                
            message["timestamp"] = datetime.now(timezone.utc)
            
            result = await self.db.sessions.update_one(
                {"_id": ObjectId(session_id)},
                {
                    "$push": {"messages": message},
                    "$set": {"updated_at": datetime.now(timezone.utc)}
                }
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Error adding message: {str(e)}")
            raise e
    
    async def add_emotion_data(self, session_id: str, emotion_data: Dict) -> bool:
        """Add emotion detection data to session"""
        try:
            if not self.db:
                await self.connect()
                
            emotion_data["timestamp"] = datetime.now(timezone.utc)
            
            result = await self.db.sessions.update_one(
                {"_id": ObjectId(session_id)},
                {
                    "$push": {"emotions_detected": emotion_data},
                    "$set": {"updated_at": datetime.now(timezone.utc)}
                }
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Error adding emotion data: {str(e)}")
            raise e
    
    async def get_user_sessions(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Get recent sessions for a user"""
        try:
            if not self.db:
                await self.connect()
                
            cursor = self.db.sessions.find({"user_id": user_id}).sort("created_at", -1).limit(limit)
            sessions = []
            
            async for session in cursor:
                session["_id"] = str(session["_id"])
                sessions.append(session)
                
            return sessions
            
        except Exception as e:
            logger.error(f"Error getting user sessions: {str(e)}")
            raise e
    
    async def create_user(self, user_data: Dict) -> str:
        """Create a new user"""
        try:
            if not self.db:
                await self.connect()
                
            user_data["created_at"] = datetime.now(timezone.utc)
            user_data["updated_at"] = datetime.now(timezone.utc)
            
            result = await self.db.users.insert_one(user_data)
            return str(result.inserted_id)
            
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            raise e
    
    async def get_user(self, user_id: str) -> Optional[Dict]:
        """Get user by ID"""
        try:
            if not self.db:
                await self.connect()
                
            user = await self.db.users.find_one({"_id": ObjectId(user_id)})
            
            if user:
                user["_id"] = str(user["_id"])
                return user
            return None
            
        except Exception as e:
            logger.error(f"Error getting user: {str(e)}")
            raise e
