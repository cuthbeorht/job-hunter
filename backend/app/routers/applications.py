import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.application import JobApplication
from app.models.user import User
from app.schemas.application import ApplicationIn, ApplicationOut

router = APIRouter(prefix="/applications", tags=["applications"])


async def _get_owned_application(
    app_id: uuid.UUID, user: User, db: AsyncSession
) -> JobApplication:
    result = await db.execute(select(JobApplication).where(JobApplication.id == app_id))
    application = result.scalar_one_or_none()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    if application.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your application")
    return application


@router.get("", response_model=list[ApplicationOut])
async def list_applications(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(JobApplication).where(JobApplication.user_id == user.id)
    )
    return result.scalars().all()


@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
async def create_application(
    body: ApplicationIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    application = JobApplication(**body.model_dump(), user_id=user.id)
    db.add(application)
    await db.commit()
    await db.refresh(application)
    return application


@router.get("/{app_id}", response_model=ApplicationOut)
async def get_application(
    app_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _get_owned_application(app_id, user, db)


@router.put("/{app_id}", response_model=ApplicationOut)
async def update_application(
    app_id: uuid.UUID,
    body: ApplicationIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    application = await _get_owned_application(app_id, user, db)
    for field, value in body.model_dump().items():
        setattr(application, field, value)
    await db.commit()
    await db.refresh(application)
    return application


@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_application(
    app_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    application = await _get_owned_application(app_id, user, db)
    await db.delete(application)
    await db.commit()
