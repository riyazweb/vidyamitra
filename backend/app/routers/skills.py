"""
Skills Router - AI-powered skill assessment using Gemini 2.5 Flash
"""

import json
import re

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.core.ai_service import generate_text

router = APIRouter()


class SkillAssessmentRequest(BaseModel):
    skills: list
    targetRole: str = "Software Engineer"
    experienceLevel: str = "Mid-level"


class SkillGapRequest(BaseModel):
    currentSkills: list
    targetRole: str = "Software Engineer"


@router.post("/assess")
async def assess_skills(request: SkillAssessmentRequest):
    """AI-powered skill assessment and gap analysis using Gemini 2.5 Flash"""
    skills_str = ", ".join(request.skills) if request.skills else "None specified"

    prompt = f"""You are a career skills analyst. Assess the skills of a candidate and provide detailed gap analysis.

Candidate's skills: {skills_str}
Target role: {request.targetRole}
Experience level: {request.experienceLevel}

Respond with ONLY valid JSON:
{{
  "overallMatch": 75,
  "strengths": [
    {{"skill": "Python", "level": "Advanced", "relevance": "Critical for this role"}}
  ],
  "gaps": [
    {{"skill": "Kubernetes", "priority": "High", "timeToLearn": "2-3 weeks", "resources": "Kubernetes official docs, KodeKloud"}}
  ],
  "roleRequirements": [
    {{"skill": "skill name", "level": "required level", "importance": "High/Medium/Low"}}
  ],
  "marketDemand": [
    {{"skill": "skill name", "demand": "Very High", "salaryImpact": "+$15K avg"}}
  ],
  "learningPath": [
    {{"week": 1, "focus": "topic to learn", "why": "reason"}}
  ],
  "verdict": "Overall assessment paragraph",
  "recommendedRoles": ["role 1 that matches current skills", "role 2"]
}}"""

    try:
        result_text = await generate_text(prompt)
        result_text = re.sub(r"```json\s*", "", result_text)
        result_text = re.sub(r"```\s*", "", result_text).strip()
        result = json.loads(result_text)
        return JSONResponse(content={"success": True, "data": result})
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid response")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/compare-roles")
async def compare_roles(request: SkillGapRequest):
    """Compare skill gaps across multiple roles"""
    skills_str = ", ".join(request.currentSkills)

    prompt = f"""Compare how a candidate's skills match different tech career paths.

Current skills: {skills_str}

Respond with ONLY valid JSON:
{{
  "comparisons": [
    {{
      "role": "Full Stack Developer",
      "match": 76,
      "missingSkills": ["Docker", "AWS"],
      "strengths": ["React", "Node.js"],
      "timeToReady": "3-4 months",
      "avgSalary": "$130K",
      "growthPotential": "High"
    }}
  ],
  "topRecommendation": "best role for their current skills",
  "reasoning": "why this role is recommended"
}}

Include 5-6 relevant tech roles."""

    try:
        result_text = await generate_text(prompt)
        result_text = re.sub(r"```json\s*", "", result_text)
        result_text = re.sub(r"```\s*", "", result_text).strip()
        result = json.loads(result_text)
        return JSONResponse(content={"success": True, "data": result})
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
