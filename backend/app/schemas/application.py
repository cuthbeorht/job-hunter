import uuid
from datetime import date, datetime

from pydantic import BaseModel

from app.models.application import ApplicationStatus


class ApplicationIn(BaseModel):
    company: str
    position: str
    job_url: str | None = None
    salary_min: int | None = None
    salary_max: int | None = None
    status: ApplicationStatus = ApplicationStatus.APPLIED
    applied_date: date | None = None
    notes: str | None = None


class ApplicationOut(ApplicationIn):
    model_config = {"from_attributes": True}
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
