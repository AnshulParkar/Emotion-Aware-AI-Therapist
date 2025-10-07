"""
Debug script to test ElevenLabs API key
"""
import os
import asyncio
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_elevenlabs_api():
    """Test ElevenLabs API key directly"""
    
    api_key = os.getenv("ELEVENLABS_API_KEY")
    
    print("🔍 ElevenLabs API Key Debug:")
    print(f"   API Key found: {'Yes' if api_key else 'No'}")
    if api_key:
        print(f"   API Key length: {len(api_key)}")
        print(f"   API Key starts with: {api_key[:8]}...")
    else:
        print("   ❌ No API key found in environment variables")
        return False
    
    # Test the API key
    try:
        url = "https://api.elevenlabs.io/v1/user"
        headers = {
            "Accept": "application/json",
            "xi-api-key": api_key
        }
        
        print(f"🔗 Testing API endpoint: {url}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, headers=headers)
            
            print(f"📡 Response status: {response.status_code}")
            
            if response.status_code == 200:
                user_data = response.json()
                print("✅ API Key is VALID!")
                print(f"   User: {user_data.get('first_name', 'Unknown')} {user_data.get('last_name', '')}")
                print(f"   Email: {user_data.get('email', 'Unknown')}")
                
                # Check subscription
                subscription = user_data.get('subscription', {})
                if subscription:
                    print(f"   Plan: {subscription.get('tier', 'Unknown')}")
                    print(f"   Character limit: {subscription.get('character_limit', 'N/A')}")
                    print(f"   Characters used: {subscription.get('character_count', 'N/A')}")
                
                return True
                
            elif response.status_code == 401:
                print("❌ API Key is INVALID or EXPIRED")
                print(f"   Response: {response.text}")
                return False
                
            else:
                print(f"❌ Unexpected response: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ Error testing API: {str(e)}")
        return False

async def test_voice_id():
    """Test if the voice ID is valid"""
    api_key = os.getenv("ELEVENLABS_API_KEY")
    voice_id = os.getenv("ELEVENLABS_VOICE_ID", "nLiZs38w2b9S5WVDWipV")
    
    if not api_key:
        print("⚠️ No API key available, skipping voice test")
        return False
    
    try:
        url = "https://api.elevenlabs.io/v1/voices"
        headers = {
            "Accept": "application/json", 
            "xi-api-key": api_key
        }
        
        print(f"🎤 Testing voice ID: {voice_id}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, headers=headers)
            
            if response.status_code == 200:
                voices = response.json().get("voices", [])
                voice_names = [v.get("name") for v in voices if v.get("voice_id") == voice_id]
                
                if voice_names:
                    print(f"✅ Voice ID is valid: {voice_names[0]}")
                    return True
                else:
                    print(f"❌ Voice ID '{voice_id}' not found in your account")
                    print("Available voices:")
                    for voice in voices[:5]:  # Show first 5 voices
                        print(f"   - {voice.get('name')} ({voice.get('voice_id')})")
                    return False
                    
            else:
                print(f"❌ Failed to get voices: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Error testing voice: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 ElevenLabs API Debug Test\n")
    
    # Test API key
    api_valid = asyncio.run(test_elevenlabs_api())
    
    if api_valid:
        print("\n" + "="*50)
        # Test voice ID
        asyncio.run(test_voice_id())
    
    print("\n" + "="*50)
    print("🎯 Next steps:")
    if not api_valid:
        print("1. Check your .env file has: ELEVENLABS_API_KEY=your_actual_key")
        print("2. Get a valid API key from: https://elevenlabs.io/")
        print("3. Make sure the key hasn't expired")
    else:
        print("✅ Your ElevenLabs API key is working correctly!")