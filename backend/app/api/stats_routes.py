from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.stat import StreamStatResponse
from app.services.stats_service import get_stream_stats


router = APIRouter(
    prefix="/stats",
    tags=["Statistics"]
)


@router.get(
    "/",
    response_model=list[StreamStatResponse]
)
def get_stats(
    db: Session = Depends(get_db)
):
    return get_stream_stats(db)
