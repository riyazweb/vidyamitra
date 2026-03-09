"""
Interview Router - AI-powered mock interview using Gemini 2.5 Flash
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import json
import re
from app.core.ai_service import generate_text

router = APIRouter()


class InterviewRequest(BaseModel):
    role: str = "Software Engineer"
    level: str = "Mid-level"
    focus: str = "General"
    count: int = 10


class AnswerEvaluation(BaseModel):
    question: str
    answer: str
    role: str = "Software Engineer"


class MockInterviewSession(BaseModel):
    role: str
    level: str
    conversation: list  # list of {role: 'user'|'ai', content: str}


@router.post("/questions")
async def generate_interview_questions(request: InterviewRequest):
    """Generate tailored interview questions using Gemini 2.5 Flash"""
    count = min(request.count, 20)

    prompt = f"""Generate {count} interview questions for a {request.level} {request.role} position, focusing on {request.focus}.

Respond with ONLY valid JSON:
{{
  "role": "{request.role}",
  "level": "{request.level}",
  "questions": [
    {{
      "id": 1,
      "category": "Technical",
      "question": "question text",
      "type": "Behavioral/Technical/System Design",
      "difficulty": "Easy/Medium/Hard",
      "hint": "what the interviewer is looking for",
      "sample_answer": "a strong sample answer",
      "key_points": ["point 1", "point 2", "point 3"]
    }}
  ]
}}

Include a mix of:
- Technical questions specific to {request.role}
- Behavioral questions (STAR method)
- Problem-solving scenarios
- System design (if senior level)"""

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


@router.post("/evaluate-answer")
async def evaluate_answer(data: AnswerEvaluation):
    """Evaluate an interview answer using Gemini 2.5 Flash"""
    prompt = f"""You are an HR interviewer evaluating a candidate for a {data.role} position.

Question: {data.question}

Candidate's answer: {data.answer}

Evaluate and respond with ONLY valid JSON:
{{
  "score": 75,
  "grade": "Good",
  "feedback": "specific feedback on this answer",
  "strengths": ["what was good"],
  "improvements": ["what could be better"],
  "sample_better_answer": "how to answer this question better",
  "key_missing_points": ["important points not mentioned"]
}}

score is 0-100. Be constructive and encouraging."""

    try:
        result_text = await generate_text(prompt)
        result_text = re.sub(r"```json\s*", "", result_text)
        result_text = re.sub(r"```\s*", "", result_text).strip()
        result = json.loads(result_text)
        return JSONResponse(content={"success": True, "data": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat")
async def mock_interview_chat(session: MockInterviewSession):
    """Conduct a live mock interview using Gemini 2.5 Flash"""
    history_text = ""
    for msg in session.conversation[-10:]:  # last 10 messages for context
        role = "Interviewer" if msg.get("role") == "ai" else "Candidate"
        history_text += f"{role}: {msg.get('content', '')}\n"

    prompt = f"""You are a professional interviewer conducting a mock interview for a {session.level} {session.role} position.

Conversation so far:
{history_text}

Continue the interview naturally. Ask follow-up questions, probe deeper on answers, and be encouraging but also challenging. Keep responses concise (2-4 sentences). If the conversation is just starting, introduce yourself and ask the first question."""

    try:
        response = await generate_text(prompt)
        return JSONResponse(content={"success": True, "response": response.strip()})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/roles")
async def get_interview_roles():
    """Get available interview roles"""
    roles = [
        "Software Engineer", "Frontend Developer", "Backend Developer",
        "Full Stack Developer", "Data Scientist", "ML Engineer",
        "DevOps Engineer", "Cloud Architect", "Product Manager",
        "UI/UX Designer", "Data Analyst", "Security Engineer",
        "Mobile Developer (iOS/Android)", "Site Reliability Engineer"
    ]
    return JSONResponse(content={"success": True, "roles": roles})
