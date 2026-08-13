from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.stat import StreamStatResponse
from app.services.stats_service import get_stream_stats
from app.services.rocksdb_service import get_all_window_stats
from app.services.processing_monitor import get_processing_status


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

@router.get("/state")
def get_state():
    return get_all_window_stats()

@router.get("/processing")
def processing_status():
    return get_processing_status()