"""create job_applications table

Revision ID: 0002
Revises: 0001
Create Date: 2026-06-14
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

applicationstatus_enum = sa.Enum(
    "APPLIED",
    "PHONE_SCREEN",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
    "WITHDRAWN",
    name="applicationstatus",
)


def upgrade() -> None:
    op.create_table(
        "job_applications",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("company", sa.String(255), nullable=False),
        sa.Column("position", sa.String(255), nullable=False),
        sa.Column("job_url", sa.String(1000), nullable=True),
        sa.Column("salary_min", sa.Integer(), nullable=True),
        sa.Column("salary_max", sa.Integer(), nullable=True),
        sa.Column("status", applicationstatus_enum, nullable=False),
        sa.Column("applied_date", sa.Date(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_job_applications_user_id"), "job_applications", ["user_id"]
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_job_applications_user_id"), table_name="job_applications")
    op.drop_table("job_applications")
    op.execute("DROP TYPE IF EXISTS applicationstatus")
