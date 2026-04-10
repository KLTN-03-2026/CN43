import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.common.infrastructure.config import settings
from app.common.infrastructure.database import get_db
from app.common.infrastructure.deps import AnyAuthUser, CandidateUser, EmployerUser
from app.common.errors import ErrorCode, get_error_detail
from app.common.domain.entities.application import Application
from app.common.domain.entities.job import Job
from app.common.domain.entities.user import UserRole
from app.features.applications.interfaces.schemas.application import ApplicationCreate, ApplicationOut, ApplicationScreenRequest, AIScreenResult
from app.common.infrastructure.external_services.services.ai_screening import screen_cv_against_job
from app.common.infrastructure.external_services.services.cv_text import extract_text_from_pdf

router = APIRouter(prefix="/api/applications", tags=["applications"])


def _ensure_upload_dir() -> Path:
    p = Path(settings.upload_dir)
    p.mkdir(parents=True, exist_ok=True)
    return p


@router.post("", response_model=ApplicationOut)
async def create_application(
    body: ApplicationCreate,
    candidate: CandidateUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Application:
    jr = await db.execute(select(Job).where(Job.id == body.job_id, Job.is_active.is_(True)))
    job = jr.scalar_one_or_none()
    if not job:
        raise HTTPException(
            status_code=404,
            detail=get_error_detail(ErrorCode.APPLICATION_JOB_NOT_FOUND)
        )
    ex = await db.execute(
        select(Application).where(
            Application.job_id == body.job_id,
            Application.candidate_id == candidate.id,
        )
    )
    if ex.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail=get_error_detail(ErrorCode.APPLICATION_ALREADY_APPLIED)
        )
    app = Application(
        job_id=body.job_id,
        candidate_id=candidate.id,
        cv_text=body.cv_text or "",
    )
    db.add(app)
    await db.commit()
    await db.refresh(app)
    return app


@router.post("/{application_id}/cv", response_model=ApplicationOut)
async def upload_cv(
    application_id: int,
    candidate: CandidateUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    file: UploadFile = File(...),
) -> Application:
    r = await db.execute(
        select(Application).where(
            Application.id == application_id,
            Application.candidate_id == candidate.id,
        )
    )
    app = r.scalar_one_or_none()
    if not app:
        raise HTTPException(
            status_code=404,
            detail=get_error_detail(ErrorCode.APPLICATION_NOT_OWNED)
        )

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail=get_error_detail(ErrorCode.FILE_MISSING_NAME)
        )
    ext = Path(file.filename).suffix.lower()
    if ext != ".pdf":
        raise HTTPException(
            status_code=400,
            detail=get_error_detail(ErrorCode.FILE_INVALID_TYPE)
        )

    content = await file.read()
    max_bytes = settings.max_upload_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=get_error_detail(
                ErrorCode.FILE_TOO_LARGE,
                max_mb=settings.max_upload_mb
            )
        )

    upload_dir = _ensure_upload_dir()
    name = f"{application_id}_{uuid.uuid4().hex}{ext}"
    path = upload_dir / name
    path.write_bytes(content)

    try:
        cv_text = extract_text_from_pdf(path)
    except Exception as e:
        os.unlink(path)
        raise HTTPException(
            status_code=400,
            detail=get_error_detail(
                ErrorCode.FILE_PARSE_ERROR,
                error=str(e)
            )
        ) from e

    app.cv_file_path = str(path)
    app.cv_text = cv_text
    await db.commit()
    await db.refresh(app)
    return app


@router.post("/screen", response_model=AIScreenResult)
async def screen_application(
    body: ApplicationScreenRequest,
    user: AnyAuthUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> AIScreenResult:
    r = await db.execute(
        select(Application)
        .options(selectinload(Application.job))
        .where(Application.id == body.application_id)
    )
    app = r.scalar_one_or_none()
    if not app:
        raise HTTPException(
            status_code=404,
            detail=get_error_detail(ErrorCode.APPLICATION_NOT_FOUND)
        )

    job = app.job
    if user.role == UserRole.candidate and app.candidate_id != user.id:
        raise HTTPException(
            status_code=403,
            detail=get_error_detail(ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS)
        )
    if user.role == UserRole.employer and job.employer_id != user.id:
        raise HTTPException(
            status_code=403,
            detail=get_error_detail(ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS)
        )

    if not app.cv_text.strip():
        raise HTTPException(
            status_code=400,
            detail=get_error_detail(ErrorCode.APPLICATION_NO_CV)
        )

    result = await screen_cv_against_job(
        job_title=job.title,
        job_description=job.description,
        job_requirements=job.requirements,
        cv_text=app.cv_text,
    )

    app.ai_score = result.score
    app.ai_summary = result.summary
    app.ai_strengths = result.strengths
    app.ai_gaps = result.gaps
    app.ai_screened_at = datetime.now(timezone.utc)
    await db.commit()
    return result


@router.get("/job/{job_id}", response_model=list[ApplicationOut])
async def list_applications_for_job(
    job_id: int,
    employer: EmployerUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[Application]:
    jr = await db.execute(select(Job).where(Job.id == job_id, Job.employer_id == employer.id))
    if not jr.scalar_one_or_none():
        raise HTTPException(
            status_code=404,
            detail=get_error_detail(ErrorCode.JOB_NOT_OWNED)
        )
    r = await db.execute(
        select(Application).where(Application.job_id == job_id).order_by(Application.created_at.desc())
    )
    return list(r.scalars().all())


@router.get("/mine", response_model=list[ApplicationOut])
async def my_applications(
    candidate: CandidateUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[Application]:
    r = await db.execute(
        select(Application)
        .where(Application.candidate_id == candidate.id)
        .order_by(Application.created_at.desc())
    )
    return list(r.scalars().all())
