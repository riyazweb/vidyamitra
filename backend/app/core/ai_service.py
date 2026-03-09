"""
AI Service - Gemini 2.5 Flash Integration
Central AI engine for VidyaMitra
"""

import warnings

warnings.filterwarnings(
    "ignore",
    category=FutureWarning,
    module="google\.generativeai",
)

import google.generativeai as genai
from app.core.config import GEMINI_API_KEY, GEMINI_MODEL

genai.configure(api_key=GEMINI_API_KEY)

MODEL_FALLBACKS = [
    GEMINI_MODEL,
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-pro-latest",
]

def get_model():
    return genai.GenerativeModel(GEMINI_MODEL)

async def generate_text(prompt: str) -> str:
    last_error = None

    for model_name in dict.fromkeys(MODEL_FALLBACKS):
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            return response.text
        except Exception as exc:
            last_error = exc
            if "not found" not in str(exc).lower() and "not supported" not in str(exc).lower():
                raise

    raise last_error
