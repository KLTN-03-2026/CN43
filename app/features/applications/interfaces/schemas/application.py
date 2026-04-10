from datetime import datetime

from pydantic import BaseModel, Field


class ApplicationCreate(BaseModel):
    """Apply to a job (candidate only).

    At least cv_text should be provided, or will upload PDF later.
    """
    job_id: int = Field(description="ID của công việc cần ứng tuyển")
    cv_text: str = Field(
        default="",
        description="Nội dung CV dạng text (có thể để trống, sẽ upload PDF sau)"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "job_id": 1,
                    "cv_text": "Kinh nghiệm 5 năm Python developer..."
                },
                {
                    "job_id": 1,
                    "cv_text": ""
                }
            ]
        }
    }


class ApplicationScreenRequest(BaseModel):
    """Request AI screening for an application.

    Application must have cv_text (from manual input or PDF upload).
    """
    application_id: int = Field(description="ID của hồ sơ ứng tuyển cần sàng lọc")


class ApplicationOut(BaseModel):
    """Application response schema."""
    id: int
    job_id: int
    candidate_id: int
    cv_text: str
    cv_file_path: str | None = Field(
        default=None,
        description="Đường dẫn file PDF đã upload (nếu có)"
    )
    ai_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
        description="Điểm đánh giá từ AI (0-100)"
    )
    ai_summary: str | None = Field(
        default=None,
        description="Tóm tắt kết quả đánh giá"
    )
    ai_strengths: str | None = Field(
        default=None,
        description="Điểm mạnh (dấu ; để phân tách)"
    )
    ai_gaps: str | None = Field(
        default=None,
        description="Khoảng trống/thiếu so với yêu cầu"
    )
    ai_screened_at: datetime | None = Field(
        default=None,
        description="Thời gian sàng lọc (nếu đã sàng)"
    )
    created_at: datetime

    model_config = {"from_attributes": True}


class AIScreenResult(BaseModel):
    """AI screening result for an application."""
    score: float = Field(
        ge=0,
        le=100,
        description="Điểm phù hợp (0-100)"
    )
    summary: str = Field(description="Tóm tắt kết quả bằng tiếng Việt")
    strengths: str = Field(description="Điểm mạnh của ứng viên")
    gaps: str = Field(description="Khoảng trống/thiếu so với yêu cầu")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "score": 85.5,
                    "summary": "Ứng viên có kinh nghiệm phù hợp với vị trí",
                    "strengths": "5 năm kinh nghiệm Python; Biết FastAPI; Docker; ...",
                    "gaps": "Chưa có kinh nghiệm AWS; Chưa làm việc với Kubernetes"
                }
            ]
        }
    }
