"""
Life Advisor — AI-powered cross-domain insights engine
Uses LangChain with OpenAI GPT-4 or Google Gemini
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

# Try to import LLM providers
llm = None
try:
    use_model = os.getenv("USE_MODEL", "gemini")
    if use_model == "openai":
        from langchain_openai import ChatOpenAI
        llm = ChatOpenAI(model="gpt-4-turbo", temperature=0.7)
    else:
        from langchain_google_genai import ChatGoogleGenerativeAI
        llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.7)
    print(f"✅ AI Model loaded: {use_model}")
except Exception as e:
    print(f"⚠️  LLM not available: {e}. Using mock responses.")


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
    Generate 5 proactive insights from user data using LLM.
    Falls back to mock insights if LLM is unavailable.
    """
    profile = user_profile or MOCK_PROFILE

    if llm:
        try:
            prompt = INSIGHT_GENERATION_PROMPT.format(user_data=json.dumps(profile, indent=2))
            response = await llm.ainvoke([
                {"role": "system", "content": LIFE_ADVISOR_SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ])
            # Try to parse JSON from response
            text = response.content
            # Extract JSON array if wrapped in markdown
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            return json.loads(text.strip())
        except Exception as e:
            print(f"LLM insight generation failed: {e}")

    # Fallback mock insights
    return [
        {"category": "finance", "text": "Your income growth suggests you could increase SIP investments by 20%.", "urgency": "medium", "action": "Review investments"},
        {"category": "health", "text": "Your health insurance expires in 30 days. Renew to maintain your health score.", "urgency": "high", "action": "Renew insurance"},
        {"category": "jobs", "text": "Based on your 2 years at Infosys, consider updating certifications for career growth.", "urgency": "low", "action": "Explore certifications"},
        {"category": "finance", "text": "Your credit score (742) has improved. You may qualify for better loan rates.", "urgency": "medium", "action": "Check rates"},
        {"category": "health", "text": "No dental checkup recorded in 8 months. Schedule one for your health score.", "urgency": "low", "action": "Book appointment"},
    ]


async def chat(message: str, history: list, user_context: Optional[dict] = None) -> str:
    """
    Conversational chat with the AI advisor.
    Maintains conversation history for context.
    """
    if llm:
        try:
            messages = [{"role": "system", "content": LIFE_ADVISOR_SYSTEM_PROMPT}]

            # Add history
            for h in history[-10:]:  # Keep last 10 messages for context
                role = "assistant" if h.get("role") == "ai" else "user"
                messages.append({"role": role, "content": h.get("text", "")})

            # Add user context if available
            context_info = ""
            if user_context:
                context_info = f"\n\nUser context: {json.dumps(user_context)}"

            messages.append({"role": "user", "content": message + context_info})
            response = await llm.ainvoke(messages)
            return response.content
        except Exception as e:
            print(f"LLM chat failed: {e}")

    # Fallback response
    return (
        f"Thank you for your question about '{message}'. "
        "I'm currently operating in offline mode. Here are some general tips:\n\n"
        "1. Keep your data sources synced for an accurate trust score.\n"
        "2. Review pending consent requests regularly.\n"
        "3. Use data cards to share verified information securely.\n\n"
        "Please reconnect the AI service for personalized insights."
    )
