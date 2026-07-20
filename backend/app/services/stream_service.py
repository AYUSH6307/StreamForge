from sqlalchemy.orm import Session

from app.models.stream import Stream
from app.schemas.stream import StreamCreate


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

    return db_stream


def get_all_streams(db: Session):
    return db.query(Stream).all()

def get_my_streams(db: Session, owner_id: int):
    return db.query(Stream).filter(
        Stream.owner_id == owner_id
    ).all()