"""Dependency injection utilities for FastAPI.

Provides:
- OAuth2 authentication scheme
- Role-based user dependencies (employer, candidate)
- Token validation and user retrieval
"""

from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.infrastructure.database import get_db
from app.common.errors import ErrorCode, get_error_detail
from app.common.domain.entities.user import User, UserRole
from app.common.infrastructure.security import safe_decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Get current authenticated user from JWT token.

    Args:
        token: JWT token from Authorization header
        db: Database session

    Returns:
        User: Authenticated user object

    Raises:
        HTTPException 401: Invalid or expired token
        HTTPException 401: User not found
    """
    payload = safe_decode_token(token)
    if not payload or "uid" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=get_error_detail(ErrorCode.AUTH_INVALID_TOKEN)
        )
    uid = payload["uid"]
    result = await db.execute(select(User).where(User.id == uid))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=get_error_detail(ErrorCode.AUTH_USER_NOT_FOUND)
        )
    return user


def require_role(*roles: UserRole):
    """Create a dependency that requires specific role(s).

    Args:
        *roles: One or more UserRole values required

    Returns:
        Async function that validates user has required role
    """
    async def checker(user: Annotated[User, Depends(get_current_user)]) -> User:
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=get_error_detail(ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS)
            )
        return user

    return checker


# Type aliases for role-based dependencies
# Usage: async def endpoint(employer: EmployerUser, db: AsyncSession)
EmployerUser = Annotated[User, Depends(require_role(UserRole.employer))]
CandidateUser = Annotated[User, Depends(require_role(UserRole.candidate))]
AnyAuthUser = Annotated[User, Depends(get_current_user)]
