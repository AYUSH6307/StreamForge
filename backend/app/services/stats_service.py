from sqlalchemy.orm import Session

from app.models.stat import StreamStat


def save_stream_stat(
    db: Session,
    owner_id: int,
    window_id: int,
    total_events: int
):
    stat = StreamStat(
        owner_id=owner_id,
        window_id=window_id,
        total_events=total_events
    )

    db.add(stat)
    db.commit()
    db.refresh(stat)

    return stat


def get_stream_stats(db: Session):
    return (
        db.query(StreamStat)
        .order_by(StreamStat.created_at.desc())
        .all()
    )
