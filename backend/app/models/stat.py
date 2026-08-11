from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone

from app.core.database import Base


class StreamStat(Base):
    __tablename__ = "stream_stats"

    id = Column(Integer, primary_key=True, index=True)

    owner_id = Column(Integer, nullable=False, index=True)

    window_id = Column(Integer, nullable=False)

    total_events = Column(Integer, nullable=False, default=0)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )
