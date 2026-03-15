"""
Trust Score Routes — Calculate and explain trust scores
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.services.trustScoreEngine import calculate_score, get_mock_score

router = APIRouter(prefix="/ai", tags=["trustscore"])


class ScoreRequest(BaseModel):
    userData: Optional[Dict[str, Any]] = None


class ExplainRequest(BaseModel):
    breakdown: Dict[str, Any]


@router.post("/calculate")
async def calculate_trust_score(request: ScoreRequest):
    """
    Calculate trust score from user data.
    Returns score breakdown by category.
    """
    if request.userData and len(request.userData) > 1:
        result = calculate_score(request.userData)
    else:
        result = get_mock_score()

    return {"success": True, **result}


@router.post("/explain")
async def explain_score(request: ExplainRequest):
    """
    Generate a human-readable explanation of the trust score breakdown.
    """
    breakdown = request.breakdown
    total = breakdown.get("total", 0)

    explanation = (
        f"Your NexusLife Trust Score is {total}/100. "
        f"Here's the breakdown:\n\n"
        f"📚 Education: {breakdown.get('education_score', 0)}/25 — "
        f"Based on your degree, institution verification, and certifications.\n\n"
        f"💰 Finance: {breakdown.get('finance_score', 0)}/25 — "
        f"Reflects your credit score, income stability, and savings.\n\n"
        f"🏥 Health: {breakdown.get('health_score', 0)}/25 — "
        f"Insurance status, regular checkups, and health record completion.\n\n"
        f"💼 Employment: {breakdown.get('employment_score', 0)}/25 — "
        f"Job stability, seniority level, and employer verification.\n\n"
        f"To improve your score, focus on the lowest category and ensure all your data sources are synced."
    )

    return {"success": True, "explanation": explanation}
