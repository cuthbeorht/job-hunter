import uuid
from datetime import datetime

from pydantic import BaseModel


class WorkExperienceIn(BaseModel):
    company: str
    title: str
    start_date: str | None = None
    end_date: str | None = None
    description: str | None = None
    order: int = 0


class WorkExperienceOut(WorkExperienceIn):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    resume_id: uuid.UUID


class EducationIn(BaseModel):
    institution: str
    degree: str | None = None
    field_of_study: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    description: str | None = None
    order: int = 0


class EducationOut(EducationIn):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    resume_id: uuid.UUID


class SkillIn(BaseModel):
    name: str
    category: str | None = None
    level: str | None = None
    order: int = 0


class SkillOut(SkillIn):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    resume_id: uuid.UUID


class ResumeIn(BaseModel):
    title: str
    full_name: str | None = None
    email: str | None = None
    phone: str | None = None
    location: str | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    website_url: str | None = None
    summary: str | None = None


class ResumeOut(ResumeIn):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    work_experiences: list[WorkExperienceOut] = []
    educations: list[EducationOut] = []
    skills: list[SkillOut] = []
