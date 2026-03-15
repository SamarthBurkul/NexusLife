"""
AI Advisor Routes — Insights and Chat endpoints
"""

from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional
from app.services.lifeAdvisor import generate_insights, chat

router = APIRouter(prefix="/ai", tags=["advisor"])


class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []
    user_context: Optional[dict] = None


class ChatResponse(BaseModel):
    response: str


@router.get("/insights")
async def get_insights(user_id: str = Query(default="demo-user")):
    """
    Generate proactive insights for a user.
    Falls back to mock insights if LLM is unavailable.
    """
    insights = await generate_insights()
    return {"success": True, "insights": insights, "userId": user_id}


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Conversational chat with the AI Life Advisor.
    Maintains conversation history for context.
    """
    response = await chat(request.message, request.history, request.user_context)
    return ChatResponse(response=response)
