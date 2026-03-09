"""
Quiz Router - AI-powered quiz generation using Gemini 2.5 Flash
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import json
import re
from app.core.ai_service import generate_text

router = APIRouter()


class QuizRequest(BaseModel):
    topic: str = "Python Programming"
    difficulty: str = "Mixed"
    count: int = 10


class QuizSubmission(BaseModel):
    topic: str
    questions: list
    answers: list


@router.post("/generate")
async def generate_quiz(request: QuizRequest):
    """Generate AI quiz questions using Gemini 2.5 Flash"""
    count = min(request.count, 20)

    prompt = f"""Generate {count} multiple choice quiz questions about "{request.topic}" at {request.difficulty} difficulty level.

Respond with ONLY valid JSON (no markdown):
{{
  "topic": "{request.topic}",
  "difficulty": "{request.difficulty}",
  "questions": [
    {{
      "id": 1,
      "question": "question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "why this answer is correct",
      "difficulty": "Beginner"
    }}
  ]
}}

Rules:
- correct is the 0-based index of the correct option
- Make questions educational and progressively harder
- Include varied question types (conceptual, code-based, practical)
- Each explanation should be informative and teach something"""

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


@router.get("/topics")
async def get_quiz_topics():
    """Get available quiz topics"""
    topics = [
        "Python Programming", "JavaScript", "Data Structures", "Algorithms",
        "Machine Learning", "Web Development", "Databases & SQL",
        "System Design", "React.js", "Node.js", "DevOps & Docker",
        "AI & Deep Learning", "Cloud Computing", "Cybersecurity",
        "TypeScript", "Java", "C++", "Computer Networks"
    ]
    return JSONResponse(content={"success": True, "topics": topics})


@router.post("/evaluate")
async def evaluate_quiz(submission: QuizSubmission):
    """Evaluate quiz answers and provide AI feedback"""
    correct_count = 0
    results = []

    for i, (q, answer) in enumerate(zip(submission.questions, submission.answers)):
        is_correct = q.get("correct") == answer
        if is_correct:
            correct_count += 1
        results.append({
            "question": q.get("question"),
            "your_answer": q.get("options", [])[answer] if answer is not None and answer < len(q.get("options", [])) else "Not answered",
            "correct_answer": q.get("options", [])[q.get("correct", 0)],
            "is_correct": is_correct,
            "explanation": q.get("explanation", "")
        })

    score_pct = round((correct_count / len(submission.questions)) * 100) if submission.questions else 0

    # AI feedback prompt
    prompt = f"""A student scored {score_pct}% ({correct_count}/{len(submission.questions)}) on a {submission.topic} quiz.

Give personalized feedback in JSON:
{{
  "grade": "A/B/C/D/F",
  "message": "encouraging personalized message",
  "strengths": ["what they know well"],
  "areasToImprove": ["specific topics to study"],
  "nextSteps": ["action items to improve"],
  "studyResources": ["specific topics or concepts to review"]
}}"""

    try:
        feedback_text = await generate_text(prompt)
        feedback_text = re.sub(r"```json\s*", "", feedback_text)
        feedback_text = re.sub(r"```\s*", "", feedback_text).strip()
        feedback = json.loads(feedback_text)
    except Exception:
        feedback = {
            "grade": "B" if score_pct >= 70 else "C",
            "message": f"You scored {score_pct}%. Keep practicing!",
            "strengths": [],
            "areasToImprove": [submission.topic],
            "nextSteps": ["Review the incorrect answers", "Practice more questions"],
            "studyResources": [submission.topic]
        }

    return JSONResponse(content={
        "success": True,
        "data": {
            "score": score_pct,
            "correct": correct_count,
            "total": len(submission.questions),
            "results": results,
            "feedback": feedback
        }
    })
