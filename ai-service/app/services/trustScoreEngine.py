"""
Trust Score Engine — Calculates cross-domain trust score (0-100)
Uses weighted scoring across Education, Finance, Health, and Employment.
Structured like ML but uses simple weighted calculation for hackathon.
"""

from typing import Dict, Any


def calculate_score(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate the trust score from user data.
    Each domain contributes 0-25 points for a total of 0-100.

    Args:
        user_data: Dict with education, finance, health, employment data

    Returns:
        Dict with total score, breakdown, and factors
    """
    education = user_data.get("education", {})
    finance = user_data.get("finance", {})
    health = user_data.get("health", {})
    employment = user_data.get("employment", {})

    # ── Education Score (0-25) ──
    edu_score = 0
    degree = education.get("degree", "").lower()
    if "phd" in degree or "doctorate" in degree:
        edu_score += 10
    elif "master" in degree or "m.tech" in degree or "mba" in degree:
        edu_score += 8
    elif "b.tech" in degree or "bachelor" in degree or "b.e" in degree:
        edu_score += 6
    elif "diploma" in degree:
        edu_score += 4
    else:
        edu_score += 2

    # Institution quality (simplified)
    institution = education.get("institution", "")
    if institution:
        edu_score += 5  # Any verified institution

    # Certifications
    certs = education.get("certifications", [])
    edu_score += min(len(certs) * 3, 10)  # Max 10 points from certs

    edu_score = min(edu_score, 25)

    # ── Finance Score (0-25) ──
    fin_score = 0
    credit = finance.get("credit_score", 0)
    if credit >= 750:
        fin_score += 10
    elif credit >= 650:
        fin_score += 7
    elif credit >= 550:
        fin_score += 4
    else:
        fin_score += 2

    income = finance.get("monthly_income", 0)
    if income > 100000:
        fin_score += 8
    elif income > 50000:
        fin_score += 6
    elif income > 25000:
        fin_score += 4
    else:
        fin_score += 2

    # No defaults = bonus
    defaults = finance.get("defaults", 0)
    if defaults == 0:
        fin_score += 5

    savings = finance.get("savings", 0)
    if savings > 100000:
        fin_score += 2

    fin_score = min(fin_score, 25)

    # ── Health Score (0-25) ──
    hlt_score = 0
    if health.get("insurance_active", False):
        hlt_score += 8

    last_checkup = health.get("last_checkup")
    if last_checkup:
        hlt_score += 7  # Has recent checkup record

    if not health.get("critical_conditions", []):
        hlt_score += 5  # No critical conditions

    if health.get("records_verified", False):
        hlt_score += 5

    hlt_score = min(hlt_score, 25)

    # ── Employment Score (0-25) ──
    emp_score = 0
    years = employment.get("years_experience", 0)
    if years >= 10:
        emp_score += 10
    elif years >= 5:
        emp_score += 8
    elif years >= 2:
        emp_score += 6
    elif years >= 1:
        emp_score += 4
    else:
        emp_score += 2

    if employment.get("currently_employed", False):
        emp_score += 7

    seniority = employment.get("seniority", "").lower()
    if "senior" in seniority or "lead" in seniority or "manager" in seniority:
        emp_score += 5
    elif "mid" in seniority:
        emp_score += 3
    else:
        emp_score += 1

    if employment.get("verified", False):
        emp_score += 3

    emp_score = min(emp_score, 25)

    # ── Total Score ──
    total = edu_score + fin_score + hlt_score + emp_score

    return {
        "total": total,
        "education_score": edu_score,
        "finance_score": fin_score,
        "health_score": hlt_score,
        "employment_score": emp_score,
        "factors": {
            "education": {"degree": degree, "certifications": len(certs), "institution_verified": bool(institution)},
            "finance": {"credit_score": credit, "monthly_income": income, "no_defaults": defaults == 0},
            "health": {"insurance_active": health.get("insurance_active", False), "has_checkup": bool(last_checkup)},
            "employment": {"years": years, "currently_employed": employment.get("currently_employed", False)},
        },
    }


def get_mock_score() -> Dict[str, Any]:
    """Return a mock score for demo purposes."""
    return calculate_score({
        "education": {"degree": "B.Tech CS", "institution": "MIT Pune", "certifications": ["AWS SA"]},
        "finance": {"credit_score": 742, "monthly_income": 85000, "defaults": 0, "savings": 245000},
        "health": {"insurance_active": True, "last_checkup": "2025-01-15", "critical_conditions": [], "records_verified": True},
        "employment": {"years_experience": 4, "currently_employed": True, "seniority": "Senior", "verified": True},
    })
