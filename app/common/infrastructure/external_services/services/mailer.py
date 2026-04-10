"""Email and OTP utilities for user authentication.

Handles:
- OTP code generation (6-digit random)
- Email sending via SMTP
- OTP expiration time calculation
"""

import secrets
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from fastapi import HTTPException

from app.common.infrastructure.config import settings


def generate_otp() -> tuple[str, datetime]:
    """Generate a 6-digit OTP code with expiration time.

    OTP is valid for the duration set in settings.otp_expire_minutes.

    Returns:
        tuple: (otp_code, expires_at) where:
            - otp_code is a 6-digit string
            - expires_at is UTC datetime when OTP expires
    """
    otp = f"{secrets.randbelow(1_000_000):06d}"
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.otp_expire_minutes
    )
    return otp, expires_at


def send_otp_email(to_email: str, otp_code: str) -> None:
    """Send OTP verification email via SMTP.

    Configuration from .env:
    - SMTP_HOST: SMTP server address
    - SMTP_PORT: SMTP port (default 587)
    - SMTP_USERNAME: Login username
    - SMTP_PASSWORD: Login password
    - SMTP_FROM_EMAIL: Sender email (fallback to username)
    - SMTP_FROM_NAME: Sender display name
    - SMTP_USE_TLS: Enable TLS (default True)
    - SMTP_DEBUG: Skip email in debug mode (default True)

    Args:
        to_email: Recipient email address
        otp_code: 6-digit OTP code to send

    Raises:
        HTTPException 500: If SMTP not configured and not in debug mode
    """
    if not settings.smtp_host or not settings.smtp_username or not settings.smtp_password:
        if settings.smtp_debug:
            return  # Skip email in debug mode
        raise HTTPException(
            status_code=500,
            detail="Chưa cấu hình SMTP để gửi OTP"
        )

    from_email = settings.smtp_from_email or settings.smtp_username

    message = EmailMessage()
    message["Subject"] = "Mã xác minh OTP - HOT CV"
    message["From"] = f"{settings.smtp_from_name} <{from_email}>"
    message["To"] = to_email
    message.set_content(
        "\n".join(
            [
                "Chào bạn,",
                "",
                f"Mã OTP xác minh tài khoản HOT CV của bạn là: {otp_code}",
                f"Mã có hiệu lực trong {settings.otp_expire_minutes} phút.",
                "",
                "Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.",
            ]
        )
    )

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
        if settings.smtp_use_tls:
            server.starttls()
        server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(message)
