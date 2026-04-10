"""User model and role enumeration.

User entity with email-based authentication, role-based access control,
and email verification via OTP.
"""

import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.infrastructure.database import Base


class UserRole(str, enum.Enum):
    """User role enumeration.

    - employer: Can create jobs and screen applications
    - candidate: Can view jobs and apply with CV
    """
    employer = "employer"
    candidate = "candidate"


class User(Base):
    """User model for authentication and authorization.

    Attributes:
        id: Primary key, auto-incremented
        email: Unique email address (indexed for login)
        hashed_password: Bcrypt/pbkdf2 hashed password
        full_name: User's full name
        role: Account type (employer or candidate)
        is_verified: Whether email verification (OTP) is complete
        otp_code: Current 6-digit OTP code
        otp_expires_at: When OTP expires
        created_at: Account creation timestamp (UTC)

        jobs: Relationship to jobs posted by employer
        applications: Relationship to applications submitted by candidate
    """
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, native_enum=False),
        default=UserRole.candidate
    )
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    otp_code: Mapped[str | None] = mapped_column(String(6), nullable=True)
    otp_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    jobs: Mapped[list["Job"]] = relationship("Job", back_populates="employer")
    applications: Mapped[list["Application"]] = relationship(
        "Application",
        back_populates="candidate"
    )
