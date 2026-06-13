import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import get_current_user
from app.models.resume import Education, Resume, Skill, WorkExperience
from app.models.user import User
from app.schemas.resume import (
    EducationIn,
    EducationOut,
    ResumeIn,
    ResumeOut,
    SkillIn,
    SkillOut,
    WorkExperienceIn,
    WorkExperienceOut,
)

router = APIRouter(prefix="/resumes", tags=["resumes"])


async def _get_owned_resume(resume_id: uuid.UUID, user: User, db: AsyncSession) -> Resume:
    result = await db.execute(
        select(Resume)
        .options(
            selectinload(Resume.work_experiences),
            selectinload(Resume.educations),
            selectinload(Resume.skills),
        )
        .where(Resume.id == resume_id)
    )
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    if resume.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your resume")
    return resume


@router.get("", response_model=list[ResumeOut])
async def list_resumes(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Resume)
        .options(
            selectinload(Resume.work_experiences),
            selectinload(Resume.educations),
            selectinload(Resume.skills),
        )
        .where(Resume.user_id == user.id)
    )
    return result.scalars().all()


@router.post("", response_model=ResumeOut, status_code=status.HTTP_201_CREATED)
async def create_resume(
    body: ResumeIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    resume = Resume(**body.model_dump(), user_id=user.id)
    db.add(resume)
    await db.commit()
    await db.refresh(resume, ["work_experiences", "educations", "skills"])
    return resume


@router.get("/{resume_id}", response_model=ResumeOut)
async def get_resume(
    resume_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _get_owned_resume(resume_id, user, db)


@router.put("/{resume_id}", response_model=ResumeOut)
async def update_resume(
    resume_id: uuid.UUID,
    body: ResumeIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    resume = await _get_owned_resume(resume_id, user, db)
    for field, value in body.model_dump().items():
        setattr(resume, field, value)
    await db.commit()
    await db.refresh(resume, ["work_experiences", "educations", "skills"])
    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    resume = await _get_owned_resume(resume_id, user, db)
    await db.delete(resume)
    await db.commit()


# --- Work Experience ---

@router.post("/{resume_id}/work-experience", response_model=WorkExperienceOut, status_code=status.HTTP_201_CREATED)
async def add_work_experience(
    resume_id: uuid.UUID,
    body: WorkExperienceIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_owned_resume(resume_id, user, db)
    entry = WorkExperience(**body.model_dump(), resume_id=resume_id)
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.put("/{resume_id}/work-experience/{entry_id}", response_model=WorkExperienceOut)
async def update_work_experience(
    resume_id: uuid.UUID,
    entry_id: uuid.UUID,
    body: WorkExperienceIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_owned_resume(resume_id, user, db)
    result = await db.execute(
        select(WorkExperience).where(WorkExperience.id == entry_id, WorkExperience.resume_id == resume_id)
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    for field, value in body.model_dump().items():
        setattr(entry, field, value)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{resume_id}/work-experience/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_work_experience(
    resume_id: uuid.UUID,
    entry_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_owned_resume(resume_id, user, db)
    result = await db.execute(
        select(WorkExperience).where(WorkExperience.id == entry_id, WorkExperience.resume_id == resume_id)
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    await db.delete(entry)
    await db.commit()


# --- Education ---

@router.post("/{resume_id}/education", response_model=EducationOut, status_code=status.HTTP_201_CREATED)
async def add_education(
    resume_id: uuid.UUID,
    body: EducationIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_owned_resume(resume_id, user, db)
    entry = Education(**body.model_dump(), resume_id=resume_id)
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.put("/{resume_id}/education/{entry_id}", response_model=EducationOut)
async def update_education(
    resume_id: uuid.UUID,
    entry_id: uuid.UUID,
    body: EducationIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_owned_resume(resume_id, user, db)
    result = await db.execute(
        select(Education).where(Education.id == entry_id, Education.resume_id == resume_id)
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    for field, value in body.model_dump().items():
        setattr(entry, field, value)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{resume_id}/education/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_education(
    resume_id: uuid.UUID,
    entry_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_owned_resume(resume_id, user, db)
    result = await db.execute(
        select(Education).where(Education.id == entry_id, Education.resume_id == resume_id)
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    await db.delete(entry)
    await db.commit()


# --- Skills ---

@router.post("/{resume_id}/skills", response_model=SkillOut, status_code=status.HTTP_201_CREATED)
async def add_skill(
    resume_id: uuid.UUID,
    body: SkillIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_owned_resume(resume_id, user, db)
    entry = Skill(**body.model_dump(), resume_id=resume_id)
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.put("/{resume_id}/skills/{entry_id}", response_model=SkillOut)
async def update_skill(
    resume_id: uuid.UUID,
    entry_id: uuid.UUID,
    body: SkillIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_owned_resume(resume_id, user, db)
    result = await db.execute(
        select(Skill).where(Skill.id == entry_id, Skill.resume_id == resume_id)
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    for field, value in body.model_dump().items():
        setattr(entry, field, value)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{resume_id}/skills/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(
    resume_id: uuid.UUID,
    entry_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_owned_resume(resume_id, user, db)
    result = await db.execute(
        select(Skill).where(Skill.id == entry_id, Skill.resume_id == resume_id)
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    await db.delete(entry)
    await db.commit()
