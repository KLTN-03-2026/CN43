"""Security utilities for authentication and password management.

Provides:
- JWT token creation and validation (HS256)
- Password hashing and verification (bcrypt/pbkdf2)
- Token payload handling
"""

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.common.infrastructure.config import settings
from app.common.domain.entities.user import UserRole

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256", "bcrypt"],
    default="pbkdf2_sha256",
    deprecated="auto"
)


def hash_password(password: str) -> str:
    """Hash a plain password for secure storage.

    Args:
        password: Plain text password

    Returns:
        str: Hashed password (can be stored in database)
    """
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plain password against its hash.

    Args:
        plain: Plain text password to check
        hashed: Hashed password from database

    Returns:
        bool: True if password matches, False otherwise
    """
    return pwd_context.verify(plain, hashed)


def create_access_token(subject: str, user_id: int, role: UserRole) -> str:
    """Create a JWT access token.

    JWT Payload includes:
    - sub: subject (email)
    - uid: user ID
    - role: user role (employer/candidate)
    - exp: expiration time

    Args:
        subject: Subject (email address)
        user_id: User ID for quick lookup
        role: User role (employer or candidate)

    Returns:
        str: Encoded JWT token
    """
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = {
        "sub": subject,
        "uid": user_id,
        "role": role.value,
        "exp": expire,
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> dict:
    """Decode and validate a JWT token.

    Args:
        token: JWT token to decode

    Returns:
        dict: Token payload if valid

    Raises:
        JWTError: If token is invalid or expired
    """
    return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])


def safe_decode_token(token: str) -> dict | None:
    """Safely decode a JWT token, returning None on error.

    Args:
        token: JWT token to decode

    Returns:
        dict: Token payload if valid, None if invalid or expired
    """
    try:
        return decode_token(token)
    except JWTError:
        return None
