# Create a test file: test_elevenlabs.py
import os
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv()

async def test_elevenlabs_api():
    api_key = os.getenv("ELEVENLABS_API_KEY")
    
    if not api_key:
        print("❌ ELEVENLABS_API_KEY not found in environment variables")
        return
    
    print(f"✅ API Key found: {api_key[:10]}..." if len(api_key) > 10 else api_key)
    
    # Test API connection
    try:
        async with httpx.AsyncClient() as client:
            headers = {"xi-api-key": api_key}
            
            # Test 1: Get user info
            response = await client.get("https://api.elevenlabs.io/v1/user", headers=headers)
            print(f"User API Status: {response.status_code}")
            if response.status_code == 200:
                user_data = response.json()
                print(f"✅ API Key is valid! User: {user_data.get('first_name', 'Unknown')}")
                print(f"Character limit: {user_data.get('subscription', {}).get('character_limit', 'N/A')}")
                print(f"Tokens available: {user_data.get('subscription', {}).get('character_count', 'N/A')}")
            else:
                print(f"❌ API Key validation failed: {response.text}")
                return
            
            # Test 2: Get available voices
            response = await client.get("https://api.elevenlabs.io/v1/voices", headers=headers)
            print(f"Voices API Status: {response.status_code}")
            if response.status_code == 200:
                voices = response.json()
                print(f"✅ Available voices: {len(voices.get('voices', []))}")
                for voice in voices.get('voices', []):
                    print(f"  - {voice['name']} ({voice['voice_id']})")
            
    except Exception as e:
        print(f"❌ Error testing API: {e}")

if __name__ == "__main__":
    asyncio.run(test_elevenlabs_api())