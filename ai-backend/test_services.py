#!/usr/bin/env python3
"""
Test script to verify avatar and TTS services work correctly
"""

import os
import sys
import asyncio
import logging

# Add the current directory to the path so we can import services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(level=logging.INFO)

async def test_avatar_service():
    """Test the avatar service"""
    print("=== Testing Avatar Service ===")
    
    try:
        from services.avatar_service import AvatarService
        service = AvatarService()
        
        # Test creating a dummy video
        result = await service.create_talking_avatar("Hello, this is a test message for the avatar")
        print(f"✅ Avatar service test passed!")
        print(f"📹 Avatar URL: {result}")
        
        # Check if the file actually exists
        if result.startswith("/video/"):
            filename = result.replace("/video/", "")
            filepath = f"temp/{filename}"
            if os.path.exists(filepath):
                file_size = os.path.getsize(filepath)
                print(f"📁 Video file exists: {filepath} ({file_size} bytes)")
            else:
                print(f"❌ Video file not found: {filepath}")
        
        return True
        
    except Exception as e:
        print(f"❌ Avatar service test failed: {str(e)}")
        return False

async def test_tts_service():
    """Test the TTS service"""
    print("\n=== Testing TTS Service ===")
    
    try:
        from services.tts_service import TTSService
        service = TTSService()
        
        # Test creating audio
        result = await service.generate_speech("Hello, this is a test message for text to speech")
        print(f"✅ TTS service test passed!")
        print(f"🔊 Audio URL: {result}")
        
        # Check if the file actually exists
        if result.startswith("/audio/"):
            filename = result.replace("/audio/", "")
            filepath = f"temp/{filename}"
            if os.path.exists(filepath):
                file_size = os.path.getsize(filepath)
                print(f"📁 Audio file exists: {filepath} ({file_size} bytes)")
            else:
                print(f"❌ Audio file not found: {filepath}")
        
        return True
        
    except Exception as e:
        print(f"❌ TTS service test failed: {str(e)}")
        return False

async def main():
    """Run all tests"""
    print("🧪 Testing AI Backend Services\n")
    
    # Create temp directory if it doesn't exist
    os.makedirs("temp", exist_ok=True)
    
    # Run tests
    avatar_success = await test_avatar_service()
    tts_success = await test_tts_service()
    
    print(f"\n=== Test Results ===")
    print(f"Avatar Service: {'✅ PASS' if avatar_success else '❌ FAIL'}")
    print(f"TTS Service: {'✅ PASS' if tts_success else '❌ FAIL'}")
    
    if avatar_success and tts_success:
        print(f"🎉 All services working correctly!")
        
        # List files in temp directory
        print(f"\n📂 Files in temp directory:")
        for file in os.listdir("temp"):
            filepath = f"temp/{file}"
            size = os.path.getsize(filepath)
            print(f"   {file} ({size} bytes)")
    else:
        print(f"❌ Some services failed. Check the logs above.")

if __name__ == "__main__":
    asyncio.run(main())