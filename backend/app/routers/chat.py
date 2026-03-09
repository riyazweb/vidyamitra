"""
Chat Router - AI career assistant using Gemini 2.5 Flash
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import json
import re
from app.core.ai_service import generate_text

router = APIRouter()


class ChatMessage(BaseModel):
    message: str
    conversation: list = []  # list of {role: 'user'|'assistant', content: str}
    context: str = ""  # optional context like resume data


@router.post("/message")
async def chat_with_ai(data: ChatMessage):
    """Chat with Gemini 2.5 Flash AI career assistant"""
    history = ""
    for msg in data.conversation[-8:]:
        role = "User" if msg.get("role") == "user" else "Assistant"
        history += f"{role}: {msg.get('content', '')}\n"

    context_block = f"\nUser context: {data.context}\n" if data.context else ""

    prompt = f"""You are VidyaMitra AI, an expert career coach and mentor powered by Gemini 2.5 Flash. You help students and professionals with:
- Resume writing and optimization
- Interview preparation and practice
- Career planning and skill development
- Job search strategies
- Learning path recommendations
- Technical concepts explanation
{context_block}
Previous conversation:
{history}
User: {data.message}

Respond as a helpful, encouraging career mentor. Be specific, practical, and concise. If asked technical questions, explain clearly. Maximum 200 words."""

    try:
        response = await generate_text(prompt)
        return JSONResponse(content={"success": True, "response": response.strip()})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/career-roadmap")
async def generate_career_roadmap(data: dict):
    """Generate a detailed career roadmap"""
    current_role = data.get("currentRole", "Student")
    target_role = data.get("targetRole", "Software Engineer")
    timeline = data.get("timeline", "1 year")
    current_skills = data.get("skills", [])

    prompt = f"""Create a detailed career roadmap from {current_role} to {target_role} in {timeline}.

Current skills: {', '.join(current_skills) if current_skills else 'Basic programming'}

Respond with ONLY valid JSON:
{{
  "title": "Your Path from {current_role} to {target_role}",
  "timeline": "{timeline}",
  "steps": [
    {{
      "month": "Month 1-2",
      "title": "Foundation Phase",
      "focus": "what to focus on",
      "actions": ["action 1", "action 2"],
      "milestone": "what to achieve by end",
      "resources": ["free resource 1", "resource 2"]
    }}
  ],
  "keySkills": ["skill to learn"],
  "projects": [
    {{"title": "project name", "description": "what to build", "skills": ["skill practiced"]}}
  ],
  "networkingTips": ["networking advice"],
  "expectedOutcome": "what success looks like",
  "salaryProgression": "expected salary growth"
}}"""

    try:
        result_text = await generate_text(prompt)
        result_text = re.sub(r"```json\s*", "", result_text)
        result_text = re.sub(r"```\s*", "", result_text).strip()
        result = json.loads(result_text)
        return JSONResponse(content={"success": True, "data": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
