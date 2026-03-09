"""
Jobs Router - AI-powered job recommendations using Gemini 2.5 Flash
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import json
import re
from app.core.ai_service import generate_text

router = APIRouter()


class JobRecommendationRequest(BaseModel):
    skills: list = []
    experience: str = "2 years"
    location: str = "Remote"
    targetRole: str = ""
    salaryExpectation: str = ""


class JobMatchRequest(BaseModel):
    jobDescription: str
    resumeText: str


class InterviewPrepRequest(BaseModel):
    jobTitle: str
    company: str
    jobDescription: str


@router.post("/recommend")
async def recommend_jobs(request: JobRecommendationRequest):
    """Generate AI job recommendations based on profile"""
    skills_str = ", ".join(request.skills) if request.skills else "General tech skills"

    prompt = f"""Generate 8 realistic job recommendations for a candidate.

Skills: {skills_str}
Experience: {request.experience}
Preferred location: {request.location}
Target role: {request.targetRole or "Open to suggestions"}
Salary expectation: {request.salaryExpectation or "Market rate"}

Respond with ONLY valid JSON:
{{
  "jobs": [
    {{
      "id": 1,
      "title": "job title",
      "company": "realistic company name",
      "location": "city, state or Remote",
      "salary": "$X - $Y",
      "type": "Full-time",
      "level": "Mid-level",
      "description": "2-3 sentence job description",
      "skills": ["required skill 1", "required skill 2"],
      "match": 85,
      "posted": "2 days ago",
      "applicants": 156,
      "whyGoodFit": "why this candidate is a good fit",
      "applyUrl": "#"
    }}
  ],
  "insights": {{
    "topCompanies": ["company 1", "company 2"],
    "avgSalary": "$X",
    "hotSkills": ["skill in demand"],
    "marketTrend": "brief market insight"
  }}
}}

Match score should reflect how well the candidate's skills fit each role."""

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


@router.post("/match-score")
async def calculate_job_match(request: JobMatchRequest):
    """Calculate how well a resume matches a job description"""
    prompt = f"""Calculate how well this resume matches the job description.

Job Description:
{request.jobDescription[:2000]}

Resume:
{request.resumeText[:2000]}

Respond with ONLY valid JSON:
{{
  "matchScore": 78,
  "matchedSkills": ["skill 1", "skill 2"],
  "missingSkills": ["gap 1", "gap 2"],
  "strengths": ["strength for this role"],
  "weaknesses": ["area to improve for this role"],
  "recommendation": "Should apply / Consider applying / Needs more experience",
  "coverLetterTips": ["tip for writing cover letter"],
  "improvements": ["specific things to add to resume for this job"]
}}"""

    try:
        result_text = await generate_text(prompt)
        result_text = re.sub(r"```json\s*", "", result_text)
        result_text = re.sub(r"```\s*", "", result_text).strip()
        result = json.loads(result_text)
        return JSONResponse(content={"success": True, "data": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/interview-prep")
async def get_interview_prep(request: InterviewPrepRequest):
    """Get company-specific interview preparation using AI"""
    prompt = f"""Create interview preparation for applying to {request.company} for the {request.jobTitle} role.

Job Description:
{request.jobDescription[:2000]}

Respond with ONLY valid JSON:
{{
  "companyInsights": "key things to know about company culture and values",
  "likelyQuestions": [
    {{"question": "likely interview question", "type": "Technical/Behavioral", "tips": "how to answer"}}
  ],
  "technicalTopics": ["topic to prepare"],
  "interviewProcess": "typical interview process at this type of company",
  "keyTalkingPoints": ["important points to mention"],
  "questionsToAsk": ["smart question to ask the interviewer"],
  "redFlags": ["things to avoid saying/doing"],
  "preparation_checklist": ["task to do before interview"]
}}"""

    try:
        result_text = await generate_text(prompt)
        result_text = re.sub(r"```json\s*", "", result_text)
        result_text = re.sub(r"```\s*", "", result_text).strip()
        result = json.loads(result_text)
        return JSONResponse(content={"success": True, "data": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
