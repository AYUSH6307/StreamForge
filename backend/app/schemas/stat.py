from datetime import datetime

from pydantic import BaseModel


class StreamStatResponse(BaseModel):
    id: int
    owner_id: int
    window_id: int
    total_events: int
    created_at: datetime

    class Config:
        from_attributes = True
