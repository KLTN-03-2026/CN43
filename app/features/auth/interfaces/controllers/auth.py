from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.infrastructure.config import settings
from app.common.infrastructure.database import get_db
from app.common.infrastructure.deps import get_current_user
from app.common.errors import ErrorCode, get_error_detail
from app.common.domain.entities.user import User, UserRole
from app.features.auth.interfaces.schemas.user import (
    MessageResponse,
    RegisterResponse,
    ResendOtpRequest,
    Token,
    UserCreate,
    UserOut,
    UserUpdate,
    VerifyOtpRequest,
)
from app.common.infrastructure.security import create_access_token, hash_password, verify_password
from app.common.infrastructure.external_services.services.mailer import generate_otp, send_otp_email

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse)
async def register(body: UserCreate, db: Annotated[AsyncSession, Depends(get_db)]) -> RegisterResponse:
    r = await db.execute(select(User).where(User.email == body.email))
    user = r.scalar_one_or_none()
    otp_code, otp_expires_at = generate_otp()

    if user and user.is_verified:
        raise HTTPException(
            status_code=400,
            detail=get_error_detail(ErrorCode.VALIDATION_DUPLICATE_EMAIL)
        )

    if user:
        user.hashed_password = hash_password(body.password)
        user.full_name = body.full_name
        user.role = body.role
        user.is_verified = False
        user.otp_code = otp_code
        user.otp_expires_at = otp_expires_at
    else:
        user = User(
            email=body.email,
            hashed_password=hash_password(body.password),
            full_name=body.full_name,
            role=body.role,
            is_verified=False,
            otp_code=otp_code,
            otp_expires_at=otp_expires_at,
        )
        db.add(user)

    await db.commit()
    await db.refresh(user)
    
    try:
        send_otp_email(user.email, otp_code)
    except Exception as e:
        print(f"Email sending error (debug mode may be on): {e}")
    
    return RegisterResponse(
        message=f"OTP đã được gửi tới email {user.email}. Vui lòng nhập mã để xác minh tài khoản.",
        email=user.email,
        debug_otp=otp_code if settings.smtp_debug else None,
    )


@router.post("/verify-otp", response_model=MessageResponse)
async def verify_otp(
    body: VerifyOtpRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> MessageResponse:
    r = await db.execute(select(User).where(User.email == body.email))
    user = r.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=404,
            detail=get_error_detail(ErrorCode.AUTH_USER_NOT_FOUND)
        )
    if user.is_verified:
        return MessageResponse(message="Tài khoản đã được xác minh trước đó")
    if not user.otp_code or not user.otp_expires_at:
        raise HTTPException(
            status_code=400,
            detail=get_error_detail(ErrorCode.VALIDATION_NO_OTP)
        )
    if user.otp_code != body.otp:
        raise HTTPException(
            status_code=400,
            detail=get_error_detail(ErrorCode.VALIDATION_INVALID_OTP)
        )
    expires_at = user.otp_expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=400,
            detail=get_error_detail(ErrorCode.VALIDATION_EXPIRED_OTP)
        )

    user.is_verified = True
    user.otp_code = None
    user.otp_expires_at = None
    await db.commit()
    return MessageResponse(message="Xác minh email thành công. Bạn có thể đăng nhập.")


@router.post("/resend-otp", response_model=RegisterResponse)
async def resend_otp(
    body: ResendOtpRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> RegisterResponse:
    r = await db.execute(select(User).where(User.email == body.email))
    user = r.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=404,
            detail=get_error_detail(ErrorCode.AUTH_USER_NOT_FOUND)
        )
    if user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Tài khoản này đã được xác minh"
        )

    otp_code, otp_expires_at = generate_otp()
    user.otp_code = otp_code
    user.otp_expires_at = otp_expires_at
    await db.commit()

    send_otp_email(user.email, otp_code)
    return RegisterResponse(
        message=f"OTP mới đã được gửi tới email {user.email}.",
        email=user.email,
        debug_otp=otp_code if settings.smtp_debug else None,
    )


@router.get("/me", response_model=UserOut)
async def me(current: Annotated[User, Depends(get_current_user)]) -> User:
    return current


@router.patch("/me", response_model=UserOut)
async def update_me(
    body: UserUpdate,
    current: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    current.full_name = body.full_name.strip()
    await db.commit()
    await db.refresh(current)
    return current


@router.post("/login", response_model=Token)
async def login(
    form: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Token:
    r = await db.execute(select(User).where(User.email == form.username))
    user = r.scalar_one_or_none()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=get_error_detail(ErrorCode.AUTH_INVALID_CREDENTIALS)
        )
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=get_error_detail(ErrorCode.AUTH_ACCOUNT_NOT_VERIFIED)
        )
    token = create_access_token({
        "uid": user.id,
        "sub": user.email,
        "role": user.role.value,
    })
    return Token(access_token=token)
