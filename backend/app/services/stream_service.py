from sqlalchemy.orm import Session

from app.models.stream import Stream
from app.schemas.stream import StreamCreate
from app.services.kafka_service import send_stream_event


def create_stream(
    db: Session,
    stream: StreamCreate,
    owner_id: int
):
    db_stream = Stream(
        title=stream.title,
        description=stream.description,
        owner_id=owner_id
    )

    db.add(db_stream)
    db.commit()
    db.refresh(db_stream)
    send_stream_event(
    "stream_created",
    {
        "stream_id": db_stream.id,
        "title": db_stream.title,
        "owner_id": db_stream.owner_id
    }
)

    return db_stream


def get_all_streams(db: Session):
    return db.query(Stream).all()

def get_my_streams(db: Session, owner_id: int):
    return db.query(Stream).filter(
        Stream.owner_id == owner_id
    ).all()

def delete_stream(
    db: Session,
    stream_id: int,
    owner_id: int
):
    stream = db.query(Stream).filter(
        Stream.id == stream_id
    ).first()

    if not stream:
        return None

    if stream.owner_id != owner_id:
        return False

    db.delete(stream)
    db.commit()

    return True

def update_stream(
    db: Session,
    stream_id: int,
    owner_id: int,
    stream_data
):
    stream = db.query(Stream).filter(
        Stream.id == stream_id
    ).first()

    if not stream:
        return None

    if stream.owner_id != owner_id:
        return False

    if stream_data.title is not None:
        stream.title = stream_data.title

    if stream_data.description is not None:
        stream.description = stream_data.description

    db.commit()
    db.refresh(stream)

    return stream

def get_stream_by_id(
    db: Session,
    stream_id: int
):
    return db.query(Stream).filter(
        Stream.id == stream_id
    ).first()