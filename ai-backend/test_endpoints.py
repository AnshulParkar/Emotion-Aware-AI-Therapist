#!/usr/bin/env python3
"""
Simple test to verify backend endpoints work
"""

import requests
import time
import subprocess
import os
import signal

def test_backend_endpoints():
    """Test that backend serves audio and video files correctly"""
    
    base_url = "http://localhost:8001"
    
    print("🧪 Testing Backend API Endpoints\n")
    
    try:
        # Test health endpoint
        print("1. Testing health endpoint...")
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("   ✅ Health endpoint working")
        else:
            print(f"   ❌ Health endpoint failed: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Cannot connect to backend: {e}")
        print("   💡 Make sure the backend is running on port 8001")
        return False
    
    # Test TTS endpoint
    print("2. Testing TTS endpoint...")
    try:
        tts_data = {"text": "Hello, this is a test", "voice": "default"}
        response = requests.post(f"{base_url}/tts", json=tts_data, timeout=10)
        if response.status_code == 200:
            data = response.json()
            audio_url = data.get("audio_url")
            print(f"   ✅ TTS endpoint working")
            print(f"   🔊 Audio URL: {audio_url}")
            
            # Test if audio file is accessible
            if audio_url:
                full_audio_url = f"{base_url}{audio_url}"
                audio_response = requests.get(full_audio_url, timeout=5)
                if audio_response.status_code == 200:
                    print(f"   ✅ Audio file accessible ({len(audio_response.content)} bytes)")
                else:
                    print(f"   ❌ Audio file not accessible: {audio_response.status_code}")
        else:
            print(f"   ❌ TTS endpoint failed: {response.status_code}")
            print(f"   📄 Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ TTS endpoint error: {e}")
    
    # Test Avatar endpoint
    print("3. Testing Avatar endpoint...")
    try:
        avatar_data = {"text": "Hello, this is a test", "avatar_id": "default"}
        response = requests.post(f"{base_url}/avatar", json=avatar_data, timeout=10)
        if response.status_code == 200:
            data = response.json()
            video_url = data.get("video_url")
            print(f"   ✅ Avatar endpoint working")
            print(f"   📹 Video URL: {video_url}")
            
            # Test if video file is accessible
            if video_url:
                full_video_url = f"{base_url}{video_url}"
                video_response = requests.get(full_video_url, timeout=5)
                if video_response.status_code == 200:
                    print(f"   ✅ Video file accessible ({len(video_response.content)} bytes)")
                else:
                    print(f"   ❌ Video file not accessible: {video_response.status_code}")
        else:
            print(f"   ❌ Avatar endpoint failed: {response.status_code}")
            print(f"   📄 Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Avatar endpoint error: {e}")
    
    print("\n🏁 Backend endpoint testing complete!")
    return True

if __name__ == "__main__":
    test_backend_endpoints()