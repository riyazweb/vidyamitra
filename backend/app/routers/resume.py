"""
Resume Router - AI-powered resume analysis using Gemini 2.5 Flash
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import PyPDF2
import io
import json
import re
import fitz
from app.core.ai_service import generate_text

router = APIRouter()


def extract_text_from_file(content: bytes, filename: str) -> str:
    if filename.lower().endswith(".pdf"):
        extracted_chunks = []

        try:
            document = fitz.open(stream=content, filetype="pdf")
            for page in document:
                extracted_chunks.append(page.get_text("text") or "")
            document.close()
        except Exception:
            pass

        if not "".join(extracted_chunks).strip():
            try:
                reader = PyPDF2.PdfReader(io.BytesIO(content))
                for page in reader.pages:
                    extracted_chunks.append(page.extract_text() or "")
            except Exception:
                raise HTTPException(status_code=400, detail="Could not read PDF file")

        extracted_text = "\n".join(chunk.strip() for chunk in extracted_chunks if chunk and chunk.strip())
        return extracted_text
    elif filename.lower().endswith((".doc", ".docx")):
        return content.decode("utf-8", errors="ignore")
    else:
        return content.decode("utf-8", errors="ignore")


@router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    """Analyze resume using Gemini 2.5 Flash AI"""
    if file.size and file.size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")

    content = await file.read()
    resume_text = extract_text_from_file(content, file.filename)

    if len(resume_text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Could not extract enough readable text from this resume. Try a text-based PDF instead of a scanned image PDF."
        )

    prompt = f"""You are an expert resume analyzer. Analyze the following resume and respond with ONLY valid JSON (no markdown, no code blocks).

Resume:
{resume_text[:4000]}

Return this exact JSON structure:
{{
  "fullName": "extracted name",
  "email": "extracted email or null",
  "phone": "extracted phone or null",
  "location": "extracted location or null",
  "summary": "2-3 sentence professional summary of this candidate",
  "score": 85,
  "skills": [
    {{"name": "Python", "level": "Advanced", "proficiency": 85}}
  ],
  "experience": [
    {{"role": "job title", "company": "company name", "duration": "2 years", "description": "key responsibilities"}}
  ],
  "education": [
    {{"degree": "degree name", "institution": "school name", "year": "graduation year"}}
  ],
  "gaps": [
    {{"skill": "skill name", "priority": "High", "reason": "why this skill matters"}}
  ],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "atsScore": 78,
  "recommendations": "Overall recommendation paragraph"
}}

Rules:
- score should be 0-100 based on resume quality
- atsScore should be 0-100 for ATS compatibility
- Include 5-15 skills found
- Include top 5 skill gaps for the job market
- Be accurate and professional"""

    try:
        result_text = await generate_text(prompt)
        # Clean up any markdown code blocks if present
        result_text = re.sub(r"```json\s*", "", result_text)
        result_text = re.sub(r"```\s*", "", result_text)
        result_text = result_text.strip()
        result = json.loads(result_text)
        return JSONResponse(content={"success": True, "data": result})
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid response, please try again")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")


@router.post("/improve")
async def improve_resume_section(data: dict):
    """Get AI suggestions to improve a specific resume section"""
    section = data.get("section", "")
    content = data.get("content", "")
    job_title = data.get("jobTitle", "Software Engineer")

    prompt = f"""You are an expert resume writer. Improve the following resume {section} for a {job_title} position.

Original content:
{content}

Provide an improved version that is:
1. More impactful and results-oriented
2. Uses strong action verbs
3. Includes quantifiable achievements where possible
4. ATS-optimized with relevant keywords

Respond with JSON only:
{{
  "improved": "the improved content here",
  "tips": ["tip 1", "tip 2", "tip 3"],
  "keywords": ["keyword1", "keyword2", "keyword3"]
}}"""

    try:
        result_text = await generate_text(prompt)
        result_text = re.sub(r"```json\s*", "", result_text)
        result_text = re.sub(r"```\s*", "", result_text).strip()
        result = json.loads(result_text)
        return JSONResponse(content={"success": True, "data": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
