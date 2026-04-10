from datetime import datetime

from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    """Create a new job posting (employer only).

    Args:
        title: Job position title
        description: Detailed job description
        requirements: Required skills/experience (optional)
        location: Job location (optional)
    """
    title: str = Field(
        min_length=1,
        max_length=255,
        description="Tiêu đề vị trí tuyển dụng"
    )
    description: str = Field(
        min_length=1,
        description="Mô tả chi tiết công việc"
    )
    requirements: str = Field(
        default="",
        description="Yêu cầu kỹ năng/kinh nghiệm (tùy chọn)"
    )
    location: str = Field(
        default="",
        description="Địa điểm làm việc (tùy chọn)"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "title": "Senior Python Developer",
                    "description": "Looking for experienced Python developers with 5+ years experience",
                    "requirements": "Python 3.9+, FastAPI, SQLAlchemy, Docker",
                    "location": "Hà Nội"
                }
            ]
        }
    }


class JobUpdate(BaseModel):
    """Update existing job (partial update allowed).

    All fields are optional. Only provided fields will be updated.
    """
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
        description="Tiêu đề vị trí tuyển dụng"
    )
    description: str | None = Field(
        default=None,
        min_length=1,
        description="Mô tả chi tiết công việc"
    )
    requirements: str | None = Field(
        default=None,
        description="Yêu cầu kỹ năng/kinh nghiệm"
    )
    location: str | None = Field(
        default=None,
        description="Địa điểm làm việc"
    )
    is_active: bool | None = Field(
        default=None,
        description="Trạng thái công việc: true=mở, false=đóng"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "is_active": False,
                    "title": "Lead Python Developer"
                },
                {
                    "description": "Updated requirements...",
                    "requirements": "Python 3.11+, FastAPI, async/await"
                }
            ]
        }
    }


class JobOut(BaseModel):
    """Job response schema (public read)."""
    id: int = Field(description="Job ID")
    employer_id: int = Field(description="Employer user ID")
    title: str
    description: str
    requirements: str
    location: str
    is_active: bool = Field(description="Trạng thái công việc")
    created_at: datetime

    model_config = {"from_attributes": True}
