"""
Life Advisor — AI-powered cross-domain insights engine
Uses Google Gemini 2.0 directly using google-generativeai SDK
"""

import os
import json
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

from app.services.promptTemplates import (
    LIFE_ADVISOR_SYSTEM_PROMPT,
    INSIGHT_GENERATION_PROMPT,
)

import google.generativeai as genai

# Configure Gemini
api_key = os.getenv("GOOGLE_API_KEY")
is_configured = False
if api_key:
    try:
        genai.configure(api_key=api_key)
        # We use gemini-2.0-flash-exp as requested
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        is_configured = True
        print("✅ Gemini Model loaded: gemini-2.0-flash-exp")
    except Exception as e:
        print(f"⚠️  Failed to configure Gemini: {e}")
else:
    print("⚠️  No GOOGLE_API_KEY found. Using mock responses.")

# Mock user profile for generating insights
MOCK_PROFILE = {
    "name": "User",
    "education": {"degree": "B.Tech CS", "institution": "MIT Pune", "certifications": ["AWS SA"]},
    "employment": {"current": "Senior Software Engineer at Infosys", "years": 4},
    "finance": {"credit_score": 742, "monthly_income": 85000, "active_loans": 1},
    "health": {"insurance_active": True, "insurance_expiry": "2025-12-31", "last_checkup": "2025-01-15"},
}

async def generate_insights(user_profile: Optional[dict] = None) -> List[dict]:
    """
    Generate 5 proactive insights from user data using Gemini 2.0.
    Falls back to mock insights if LLM is unavailable.
    """
    profile = user_profile or MOCK_PROFILE

    if is_configured:
        try:
            prompt = f"{LIFE_ADVISOR_SYSTEM_PROMPT}\n\n{INSIGHT_GENERATION_PROMPT.format(user_data=json.dumps(profile, indent=2))}"
            response = await model.generate_content_async(prompt)
            text = response.text
            
            # Extract JSON array if wrapped in markdown
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            
            return json.loads(text.strip())
        except Exception as e:
            print(f"Gemini insight generation failed: {e}")

    # Fallback mock insights
    return [
        {"category": "finance", "text": "Your income growth suggests you could increase SIP investments by 20%.", "urgency": "medium", "action": "Review investments"},
        {"category": "health", "text": "Your health insurance expires in 30 days. Renew to maintain your health score.", "urgency": "high", "action": "Renew insurance"},
        {"category": "jobs", "text": "Based on your 2 years at Infosys, consider updating certifications for career growth.", "urgency": "low", "action": "Explore certifications"},
        {"category": "finance", "text": "Your credit score (742) has improved. You may qualify for better loan rates.", "urgency": "medium", "action": "Check rates"},
        {"category": "health", "text": "No dental checkup recorded in 8 months. Schedule one for your health score.", "urgency": "low", "action": "Book appointment"},
    ]

async def chat(message: str, history: List[dict], user_context: Optional[dict] = None) -> str:
    """
    Conversational chat with the AI advisor using Gemini.
    """
    if is_configured:
        try:
            # Format history for Gemini SDK
            # user, model, user, model
            formatted_history = []
            
            # Add system prompt as initial user context trick if needed, or prepend to current message
            system_instruction = LIFE_ADVISOR_SYSTEM_PROMPT
            if user_context:
                system_instruction += f"\n\nContext about the user: {json.dumps(user_context)}"
            
            for h in history[-10:]:
                role = "model" if h.get("role") == "ai" else "user"
                formatted_history.append({
                    "role": role,
                    "parts": [h.get("text", "")]
                })
            
            # Start chat session
            chat_session = model.start_chat(history=formatted_history)
            
            # Send message with system instructions prepended if this is the first real message
            # Otherwise just send the message
            full_message = f"System Instructions: {system_instruction}\n\nUser Question: {message}"
            
            response = await chat_session.send_message_async(full_message)
            return response.text
            
        except Exception as e:
            print(f"Gemini chat failed: {e}")

    # Fallback response
    return (
        f"Thank you for your question about '{message}'. "
        "I'm currently operating in offline mode. Here are some general tips:\n\n"
        "1. Keep your data sources synced for an accurate trust score.\n"
        "2. Review pending consent requests regularly.\n"
        "3. Use data cards to share verified information securely.\n\n"
        "Please reconnect the AI service for personalized insights."
    )
