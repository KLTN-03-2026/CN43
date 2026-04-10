from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.common.domain.entities.user import UserRole


class UserCreate(BaseModel):
    """User registration schema.

    Args:
        email: Valid email address (unique)
        password: Min 8 characters for security
        full_name: User's full name (1-255 chars)
        role: Account type - "employer" or "candidate"
    """
    email: EmailStr
    password: str = Field(min_length=8, description="Mật khẩu ít nhất 8 ký tự")
    full_name: str = Field(min_length=1, max_length=255, description="Họ và tên (1-255 ký tự)")
    role: UserRole = Field(default=UserRole.candidate, description="Vai trò: employer hoặc candidate")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "email": "employer@example.com",
                    "password": "secure_password_123",
                    "full_name": "Vũ Văn Công Ty",
                    "role": "employer"
                },
                {
                    "email": "candidate@example.com",
                    "password": "secure_password_456",
                    "full_name": "Nguyễn Văn Ứng Viên",
                    "role": "candidate"
                }
            ]
        }
    }


class UserOut(BaseModel):
    """User response schema (public data only)."""
    id: int
    email: str
    full_name: str
    role: UserRole
    is_verified: bool
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class Token(BaseModel):
    """JWT token response after login."""
    access_token: str = Field(description="JWT token to use in Authorization header")
    token_type: str = Field(default="bearer", description="Token type")


class RegisterResponse(BaseModel):
    """Response after registration - includes debug OTP in dev mode."""
    message: str
    email: EmailStr
    debug_otp: str | None = Field(
        default=None,
        description="DEBUG ONLY: Returned if SMTP_DEBUG=true in .env"
    )


class VerifyOtpRequest(BaseModel):
    """OTP verification request."""
    email: EmailStr
    otp: str = Field(
        min_length=6,
        max_length=6,
        pattern="^\\d{6}$",
        description="6-digit OTP code"
    )


class ResendOtpRequest(BaseModel):
    """Resend OTP request."""
    email: EmailStr


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
