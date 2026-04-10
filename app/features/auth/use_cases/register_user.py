"""Auth use cases."""

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.errors import ErrorCode, get_error_detail
from app.common.domain.entities.user import User, UserRole
from app.common.infrastructure.external_services.services.mailer import generate_otp, send_otp_email
from app.common.infrastructure.security import hash_password


class RegisterUserUseCase:
    """Use case for user registration."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def execute(
        self,
        email: str,
        password: str,
        full_name: str,
        role: UserRole,
    ) -> tuple[User, str]:
        """Register a new user.

        Returns:
            Tuple of (user, otp_code)
        """
        # Check if user exists
        r = await self.db.execute(select(User).where(User.email == email))
        user = r.scalar_one_or_none()

        if user and user.is_verified:
            raise ValueError(get_error_detail(ErrorCode.VALIDATION_DUPLICATE_EMAIL))

        otp_code, otp_expires_at = generate_otp()

        if user:
            user.hashed_password = hash_password(password)
            user.full_name = full_name
            user.role = role
            user.is_verified = False
            user.otp_code = otp_code
            user.otp_expires_at = otp_expires_at
        else:
            user = User(
                email=email,
                hashed_password=hash_password(password),
                full_name=full_name,
                role=role,
                otp_code=otp_code,
                otp_expires_at=otp_expires_at,
            )
            self.db.add(user)

        await self.db.commit()
        await self.db.refresh(user)

        # Send OTP email
        await send_otp_email(email, otp_code)

        return user, otp_code