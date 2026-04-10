"""Job application model.

Application entity representing a candidate's application to a job posting.
"""

from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.infrastructure.database import Base


class Application(Base):
    """Job application model.

    Stores candidate applications to jobs with CV and AI screening results.

    Attributes:
        id: Primary key, auto-incremented
        job_id: Foreign key to the job
        candidate_id: Foreign key to the candidate user
        cv_text: CV content as text (from upload or manual input)
        cv_file_path: Path to uploaded PDF file (if provided)
        ai_score: AI evaluation score (0-100)
        ai_summary: AI evaluation summary
        ai_strengths: AI identified strengths
        ai_gaps: AI identified gaps/missing qualifications
        ai_screened_at: Timestamp when AI screening was performed
        created_at: Application submission timestamp (UTC)

        job: Relationship to the job posted
        candidate: Relationship to the candidate user
    """
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    job_id: Mapped[int] = mapped_column(
        ForeignKey("jobs.id", ondelete="CASCADE")
    )
    candidate_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    cv_text: Mapped[str] = mapped_column(Text, default="")
    cv_file_path: Mapped[str | None] = mapped_column(Text, nullable=True)
    ai_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    ai_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    ai_strengths: Mapped[str | None] = mapped_column(Text, nullable=True)
    ai_gaps: Mapped[str | None] = mapped_column(Text, nullable=True)
    ai_screened_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    job: Mapped["Job"] = relationship("Job", back_populates="applications")
    candidate: Mapped["User"] = relationship("User", back_populates="applications")
