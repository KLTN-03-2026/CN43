"""Database configuration and initialization.

Provides:
- SQLAlchemy async engine and session factory
- Database initialization with auto-migration
- Legacy column migration for backward compatibility
"""

from collections.abc import AsyncGenerator

from sqlalchemy import inspect
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.common.infrastructure.config import settings


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""
    pass


engine = create_async_engine(
    settings.database_url,
    echo=False,
)
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Get database session for dependency injection.

    Usage:
        db: Annotated[AsyncSession, Depends(get_db)]

    Yields:
        AsyncSession: Database session
    """
    async with AsyncSessionLocal() as session:
        yield session


async def init_db() -> None:
    """Initialize database on application startup.

    Creates all tables from models and performs migrations.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.run_sync(_ensure_user_auth_columns)


def _ensure_user_auth_columns(conn) -> None:
    """Ensure backward compatibility by adding missing columns if needed.

    This handles migrations for users upgrading from older versions.
    """
    inspector = inspect(conn)
    if "users" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("users")}
    if "is_verified" not in columns:
        conn.exec_driver_sql("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0 NOT NULL")
    if "otp_code" not in columns:
        conn.exec_driver_sql("ALTER TABLE users ADD COLUMN otp_code VARCHAR(6)")
    if "otp_expires_at" not in columns:
        conn.exec_driver_sql("ALTER TABLE users ADD COLUMN otp_expires_at DATETIME")
