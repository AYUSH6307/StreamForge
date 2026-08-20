from sqlalchemy import Column, Integer, String, DateTime, JSON, Float
from datetime import datetime, timezone

from app.core.database import Base


class ProcessingStatus(Base):
    __tablename__ = "processing_status"

    id = Column(Integer, primary_key=True, index=True)

    status = Column(
        String,
        nullable=False,
        default="offline"
    )

    processed_events = Column(
        Integer,
        nullable=False,
        default=0
    )

    throughput = Column(
        Float,
        nullable=False,
        default=0.0
    )

    last_event = Column(
        JSON,
        nullable=True
    )

    last_event_time = Column(
        DateTime,
        nullable=True
    )

    last_window_id = Column(
        String,
        nullable=True
    )

    last_window_count = Column(
        Integer,
        nullable=False,
        default=0
    )

    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )