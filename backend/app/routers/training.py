"""
Training Router - AI-powered personalized learning plans using Gemini 2.5 Flash
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import json
import re
from app.core.ai_service import generate_text

router = APIRouter()


class TrainingPlanRequest(BaseModel):
    skills: list = []
    targetRole: str = "Software Engineer"
    timeAvailable: str = "10 hours/week"
    currentLevel: str = "Beginner"
    goals: str = ""


class ModuleContentRequest(BaseModel):
    moduleName: str
    topic: str
    level: str = "Intermediate"


@router.post("/generate-plan")
async def generate_training_plan(request: TrainingPlanRequest):
    """Generate personalized AI training plan using Gemini 2.5 Flash"""
    skills_str = ", ".join(request.skills) if request.skills else "General programming"

    prompt = f"""Create a comprehensive personalized training plan for someone who wants to become a {request.targetRole}.

Current skills: {skills_str}
Available time: {request.timeAvailable}
Current level: {request.currentLevel}
Goals: {request.goals or "Get job-ready"}

Respond with ONLY valid JSON:
{{
  "planTitle": "Your Path to {request.targetRole}",
  "duration": "3 months",
  "totalHours": 120,
  "overview": "brief overview of the plan",
  "phases": [
    {{
      "phase": 1,
      "title": "Foundation",
      "duration": "3 weeks",
      "goals": ["goal 1", "goal 2"],
      "modules": [
        {{
          "id": 1,
          "title": "module name",
          "description": "what you'll learn",
          "difficulty": "Beginner",
          "duration": "4 hours",
          "lessons": 8,
          "topics": ["topic1", "topic2"],
          "projects": ["mini project idea"],
          "resources": ["resource 1", "resource 2"]
        }}
      ]
    }}
  ],
  "milestones": [
    {{"week": 2, "milestone": "achievement", "assessment": "how to measure"}}
  ],
  "careerOutcome": "expected outcome after completing this plan",
  "tips": ["study tip 1", "study tip 2"]
}}

Create 3 phases covering foundations, intermediate skills, and advanced/project work."""

    try:
        result_text = await generate_text(prompt)
        result_text = re.sub(r"```json\s*", "", result_text)
        result_text = re.sub(r"```\s*", "", result_text).strip()
        result = json.loads(result_text)
        return JSONResponse(content={"success": True, "data": result})
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/module-content")
async def get_module_content(request: ModuleContentRequest):
    """Get detailed AI-generated content for a training module"""
    prompt = f"""Create detailed learning content for a training module.

Module: {request.moduleName}
Topic: {request.topic}
Level: {request.level}

Respond with ONLY valid JSON:
{{
  "title": "{request.moduleName}",
  "introduction": "engaging introduction to this topic",
  "keyConcepts": [
    {{"concept": "name", "explanation": "clear explanation", "example": "practical example"}}
  ],
  "codeExamples": [
    {{"title": "example title", "code": "code here", "explanation": "what this does"}}
  ],
  "practiceExercises": [
    {{"title": "exercise name", "description": "what to build/do", "difficulty": "Easy"}}
  ],
  "quiz": [
    {{"question": "question", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "why"}}
  ],
  "summary": "key takeaways",
  "nextSteps": ["what to learn next"]
}}"""

    try:
        result_text = await generate_text(prompt)
        result_text = re.sub(r"```json\s*", "", result_text)
        result_text = re.sub(r"```\s*", "", result_text).strip()
        result = json.loads(result_text)
        return JSONResponse(content={"success": True, "data": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/popular-tracks")
async def get_popular_tracks():
    """Get popular learning tracks"""
    tracks = [
        {"id": 1, "name": "Full Stack Web Development", "duration": "4 months", "modules": 12, "level": "Beginner to Advanced"},
        {"id": 2, "name": "Data Science & Machine Learning", "duration": "5 months", "modules": 15, "level": "Intermediate"},
        {"id": 3, "name": "DevOps & Cloud Engineering", "duration": "3 months", "modules": 10, "level": "Intermediate"},
        {"id": 4, "name": "AI & Deep Learning", "duration": "4 months", "modules": 14, "level": "Advanced"},
        {"id": 5, "name": "Mobile App Development", "duration": "3 months", "modules": 9, "level": "Beginner"},
        {"id": 6, "name": "Cybersecurity Fundamentals", "duration": "3 months", "modules": 11, "level": "Beginner to Intermediate"},
    ]
    return JSONResponse(content={"success": True, "tracks": tracks})
