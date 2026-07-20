from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.stream import (
    StreamCreate,
    StreamResponse,
    StreamUpdate
)

from app.services.dependencies import get_current_user
#from app.services.stream_service import create_stream, get_all_streams
from app.services.stream_service import (create_stream,get_all_streams,get_my_streams, delete_stream)


router = APIRouter(
    prefix="/streams",
    tags=["Streams"]
)


@router.post(
    "/create",
    response_model=StreamResponse
)
def create_new_stream(
    stream: StreamCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_stream(
        db,
        stream,
        current_user.id
    )

@router.get("/", response_model=list[StreamResponse])
def get_streams(
    db: Session = Depends(get_db)
):
    return get_all_streams(db)

@router.get("/my", response_model=list[StreamResponse])
def my_streams(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_my_streams(
        db,
        current_user.id
    )


@router.delete("/{stream_id}")
def remove_stream(
    stream_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = delete_stream(
        db,
        stream_id,
        current_user.id
    )

    if result is None:
        return {"message": "Stream not found"}

    if result is False:
        return {"message": "Not allowed"}

    return {"message": "Stream deleted successfully"}


@router.put("/{stream_id}",
            response_model=StreamResponse)
def edit_stream(
    stream_id: int,
    stream: StreamUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = update_stream(
        db,
        stream_id,
        current_user.id,
        stream
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Stream not found"
        )

    if result is False:
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    return result
