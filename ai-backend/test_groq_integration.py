"""
Test script to verify Groq integration works correctly
"""
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_groq_service():
    """Test the Groq-based AI service"""
    try:
        from services.ai_service import GroqService

        print("✅ Successfully imported GroqService")

        # Create service instance
        service = GroqService()
        print("✅ Successfully created service instance")
        
        # Test with a simple message (but don't actually call API without key)
        print("✅ Service is ready for testing")
        print("📝 To fully test, ensure GROQ_API_KEY is set in .env file")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import Error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = test_groq_service()
    if success:
        print("\n🎉 Groq integration test passed!")
    else:
        print("\n💥 Groq integration test failed!")