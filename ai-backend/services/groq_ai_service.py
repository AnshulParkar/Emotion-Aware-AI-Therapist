import os
from dotenv import load_dotenv
from groq import Groq

# Load .env variables
load_dotenv()

# Get API key
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("❌ GROQ_API_KEY is not set in environment variables!")

# Initialize Groq client
client = Groq(api_key=api_key)

# System prompt (same as your Groq version)
SYSTEM_PROMPT = """
You are a supportive, non-clinical mental health assistant for college students. 
Your goals:
1. Act like a therapist: listen empathetically, ask reflective questions, build on prior conversations, and guide students through their emotions.
2. Provide stress management, mindfulness, positive self-talk, and healthy coping strategies.
3. Encourage journaling, exercise, rest, and social connection when relevant.
4. If a student shows heavy distress (e.g., extreme hopelessness, self-harm, or suicidal thoughts) AND you cannot help through conversation, then and only then gently suggest professional counselling.
5. Never act like a doctor or prescribe medication.
6. Keep tone: warm, conversational, supportive — like a peer counselor, not a generic chatbot.
7. Always validate the student’s feelings before offering suggestions.
8. Your style:
- Speak like a caring therapist, not like a rigid Q&A bot.
- Acknowledge feelings first, then gently explore with short, open-ended questions.
- Use grounding techniques, affirmations, and coping strategies.
- Maintain context from earlier in the conversation.
- Only suggest counselling if user seems very distressed or at risk of self-harm.
- Keep responses natural, warm, and 3–6 sentences long.
"""

# Conversation history to maintain context
conversation_history = [
    {"role": "system", "content": SYSTEM_PROMPT}
]

# Main function to use in UI (same interface as before)
def get_bot_reply(user_message: str) -> str:
    """
    Takes a user message, sends it to Groq, returns the reply.
    Preserves conversation history within the session.
    """
    global conversation_history
    
    try:
        # Add user message to history
        conversation_history.append({"role": "user", "content": user_message})
        
        # Call Groq API with full history
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=conversation_history,
            max_tokens=300,
            temperature=0.7
        )
        
        bot_message = response.choices[0].message.content
        
        # Add bot reply to history
        conversation_history.append({"role": "assistant", "content": bot_message})
        
        return bot_message.strip()
    except Exception as e:
        return f"❌ Groq Error: {str(e)}"

class GeminiService:
    """
    Groq-powered AI service for therapy responses
    (Named GeminiService to maintain compatibility with existing FastAPI app)
    """
    
    def __init__(self):
        self.conversation_history = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
    
    async def generate_therapy_response(self, user_message: str, emotion: str = "neutral") -> str:
        """
        Generate therapeutic response using Groq API
        
        Args:
            user_message: The user's message
            emotion: Detected emotion (currently not used but kept for compatibility)
            
        Returns:
            AI-generated therapeutic response
        """
        try:
            # Add user message to history
            self.conversation_history.append({"role": "user", "content": user_message})
            
            # Call Groq API with full history
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=self.conversation_history,
                max_tokens=300,
                temperature=0.7
            )
            
            bot_message = response.choices[0].message.content
            
            # Add bot reply to history
            self.conversation_history.append({"role": "assistant", "content": bot_message})
            
            return bot_message.strip()
        except Exception as e:
            return f"❌ Groq Error: {str(e)}"

# Optional: test from terminal
if __name__ == "__main__":
    print("Groq Health-Bot is running. Type 'exit' to quit.\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit", "bye"]:
            print("Bot: Take care! Ending the session now.")
            break
        reply = get_bot_reply(user_input)
        print("Bot:", reply)
