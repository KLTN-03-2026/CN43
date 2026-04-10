"""Job posting model.

Job entity posted by employers, which candidates can apply to.
"""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.infrastructure.database import Base


class Job(Base):
    """Job posting model.

    Attributes:
        id: Primary key, auto-incremented
        employer_id: Foreign key to the employer user
        title: Job position title
        description: Detailed job description and responsibilities
        requirements: Required skills and experience
        location: Job location (city or remote)
        is_active: Whether job is open for applications
        created_at: Job posting timestamp (UTC)

        employer: Relationship to the employer user
        applications: Relationship to candidate applications
    """
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    employer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    requirements: Mapped[str] = mapped_column(Text, default="")
    location: Mapped[str] = mapped_column(String(255), default="")
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    employer: Mapped["User"] = relationship("User", back_populates="jobs")
    applications: Mapped[list["Application"]] = relationship(
        "Application",
        back_populates="job"
    )
