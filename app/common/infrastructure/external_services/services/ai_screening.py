"""AI-powered CV screening using Google Gemini API.

Evaluates candidate CVs against job requirements and provides:
- Compatibility score (0-100)
- Summary of fit
- Strengths
- Gaps/missing qualifications
"""

import json
import re

from google import genai
from google.genai import types

from app.common.infrastructure.config import settings
from app.features.applications.interfaces.schemas.application import AIScreenResult

SYSTEM_PROMPT = """Bạn là chuyên gia tuyển dụng. Đánh giá mức độ phù hợp của CV ứng viên với tin tuyển dụng.
Trả về CHỈ một JSON hợp lệ với các khóa: score (số 0-100), summary (string ngắn tiếng Việt), strengths (string: điểm mạnh, có thể nhiều ý phân tách bằng dấu ;), gaps (string: khoảng trống / thiếu so với yêu cầu).
Không thêm markdown hay text ngoài JSON."""


async def screen_cv_against_job(
    job_title: str,
    job_description: str,
    job_requirements: str,
    cv_text: str,
) -> AIScreenResult:
    """Evaluate a CV against job requirements using Gemini AI.

    Args:
        job_title: Job position title
        job_description: Job description and responsibilities
        job_requirements: Required skills and experience
        cv_text: Candidate CV text (max 12000 chars used)

    Returns:
        AIScreenResult: Evaluation with score, summary, strengths, gaps

    Note:
        Returns mock results if GEMINI_API_KEY not configured (dev mode)
    """
    if not settings.gemini_api_key.strip():
        return _mock_screen(job_title, cv_text)

    client = genai.Client(api_key=settings.gemini_api_key)
    user_content = f"""## Tin tuyển dụng
Tiêu đề: {job_title}

Mô tả:
{job_description}

Yêu cầu chi tiết:
{job_requirements}

## CV ứng viên
{cv_text[:12000]}
"""
    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        temperature=0.3,
        response_mime_type="application/json",
    )
    response = await client.aio.models.generate_content(
        model=settings.gemini_model,
        contents=user_content,
        config=config,
    )
    raw = (response.text or "{}").strip()
    return _parse_ai_json(raw)


def _parse_ai_json(raw: str) -> AIScreenResult:
    """Parse AI response JSON and return structured result.

    Attempts to:
    1. Parse JSON directly
    2. Extract JSON from markdown code blocks
    3. Search for JSON object in response

    Args:
        raw: Raw AI response text

    Returns:
        AIScreenResult: Parsed result or default values

    Raises:
        ValueError: If JSON cannot be extracted or parsed
    """
    raw = raw.strip()
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        m = re.search(r"\{[\s\S]*\}", raw)
        if not m:
            raise ValueError("Không parse được JSON từ AI") from None
        data = json.loads(m.group())
    score = float(data.get("score", 0))
    score = max(0.0, min(100.0, score))
    return AIScreenResult(
        score=score,
        summary=str(data.get("summary", "")),
        strengths=str(data.get("strengths", "")),
        gaps=str(data.get("gaps", "")),
    )


def _mock_screen(job_title: str, cv_text: str) -> AIScreenResult:
    """Return mock screening result for development/testing.

    Used when GEMINI_API_KEY is not configured.

    Args:
        job_title: Job position title
        cv_text: Candidate CV text

    Returns:
        AIScreenResult: Mock evaluation result
    """
    has_cv = len(cv_text.strip()) > 50
    score = 55.0 if has_cv else 25.0
    return AIScreenResult(
        score=score,
        summary=(
            f"[Chế độ mock] Đặt GEMINI_API_KEY trong .env để dùng Gemini. "
            f"Ứng viên nộp CV cho vị trí: {job_title[:80]}."
        ),
        strengths="Có nội dung CV để phân tích." if has_cv else "Chưa có đủ nội dung CV.",
        gaps="Cấu hình GEMINI_API_KEY để có đánh giá chi tiết.",
    )
