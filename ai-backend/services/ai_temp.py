from groq import Groq
import os
# Initialize client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))  # Replace with your actual API key

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

conversation_history = [
    {"role": "system", "content": SYSTEM_PROMPT}
]

def get_bot_reply(user_message):
    global conversation_history
    
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
    
    return bot_message


if __name__ == "__main__":
    print("Health-Bot is running. Type 'end' to exit.\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "end"]:
            print("Bot: Take care! Ending the session now.")
            break
        reply = get_bot_reply(user_input)
        print("Bot:", reply)
