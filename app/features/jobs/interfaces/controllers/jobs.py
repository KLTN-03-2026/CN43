from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.infrastructure.database import get_db
from app.common.infrastructure.deps import AnyAuthUser, EmployerUser
from app.common.errors import ErrorCode, get_error_detail
from app.common.domain.entities.job import Job
from app.features.jobs.interfaces.schemas.job import JobCreate, JobOut, JobUpdate

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.get("", response_model=list[JobOut])
async def list_jobs(
    db: Annotated[AsyncSession, Depends(get_db)],
    active_only: bool = Query(True),
) -> list[Job]:
    q = select(Job)
    if active_only:
        q = q.where(Job.is_active.is_(True))
    q = q.order_by(Job.created_at.desc())
    r = await db.execute(q)
    return list(r.scalars().all())


@router.get("/mine/list", response_model=list[JobOut])
async def my_jobs(
    employer: EmployerUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[Job]:
    r = await db.execute(
        select(Job).where(Job.employer_id == employer.id).order_by(Job.created_at.desc())
    )
    return list(r.scalars().all())


@router.get("/{job_id}", response_model=JobOut)
async def get_job(job_id: int, db: Annotated[AsyncSession, Depends(get_db)]) -> Job:
    r = await db.execute(select(Job).where(Job.id == job_id))
    job = r.scalar_one_or_none()
    if not job:
        raise HTTPException(
            status_code=404,
            detail=get_error_detail(ErrorCode.JOB_NOT_FOUND)
        )
    return job


@router.post("", response_model=JobOut)
async def create_job(
    body: JobCreate,
    employer: EmployerUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Job:
    job = Job(
        employer_id=employer.id,
        title=body.title,
        description=body.description,
        requirements=body.requirements,
        location=body.location,
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job


@router.patch("/{job_id}", response_model=JobOut)
async def update_job(
    job_id: int,
    body: JobUpdate,
    employer: EmployerUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Job:
    r = await db.execute(select(Job).where(Job.id == job_id, Job.employer_id == employer.id))
    job = r.scalar_one_or_none()
    if not job:
        raise HTTPException(
            status_code=404,
            detail=get_error_detail(ErrorCode.JOB_NOT_OWNED)
        )
    data = body.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(job, k, v)
    await db.commit()
    await db.refresh(job)
    return job


@router.delete("/{job_id}", status_code=204)
async def delete_job(
    job_id: int,
    employer: EmployerUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    r = await db.execute(select(Job).where(Job.id == job_id, Job.employer_id == employer.id))
    job = r.scalar_one_or_none()
    if not job:
        raise HTTPException(
            status_code=404,
            detail=get_error_detail(ErrorCode.JOB_NOT_OWNED)
        )
    db.delete(job)
    await db.commit()
