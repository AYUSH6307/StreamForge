from datetime import datetime, timezone

from app.core.database import SessionLocal
from app.models.processing_status import ProcessingStatus

from app.services.metrics_service import (
    events_throughput,
    last_window_id,
    last_window_event_count,
)

def _get_status(db):
    """
    Get the single StreamForge processing-status record.
    Create it if it does not exist.
    """

    status = (
        db.query(ProcessingStatus)
        .order_by(ProcessingStatus.id.asc())
        .first()
    )

    if status is None:
        status = ProcessingStatus(
            status="offline",
            processed_events=0,
            throughput=0.0,
            last_event=None,
            last_event_time=None,
            last_window_id=None,
            last_window_count=0,
        )

        db.add(status)
        db.commit()
        db.refresh(status)

    return status


def mark_processor_online():
    """
    Mark Bytewax processor as online.
    """

    db = SessionLocal()

    try:
        status = _get_status(db)

        status.status = "online"
        status.updated_at = datetime.now(timezone.utc)

        db.commit()

    finally:
        db.close()


def record_event(event):
    """
    Record one successfully processed event.

    Throughput is NOT calculated here.

    Throughput has one single source:
        kafka_stream_processor.py
    """

    db = SessionLocal()

    try:
        status = _get_status(db)

        now = datetime.now(timezone.utc)

        status.status = "online"
        status.processed_events = (
            status.processed_events or 0
        ) + 1

        # -------------------------------------------------
        # Store safe event information
        # -------------------------------------------------

        safe_event = dict(event)

        if "event_time" in safe_event:
            event_time = safe_event["event_time"]

            if hasattr(event_time, "isoformat"):
                safe_event["event_time"] = (
                    event_time.isoformat()
                )

        status.last_event = safe_event
        status.last_event_time = now
        status.updated_at = now

        db.commit()

    finally:
        db.close()


def update_throughput(value):
    """
    Store the current throughput.

    Throughput unit:
        events / second
    """

    throughput = max(float(value), 0.0)

    db = SessionLocal()

    try:
        status = _get_status(db)

        status.status = "online"
        status.throughput = throughput
        status.updated_at = datetime.now(timezone.utc)

        db.commit()

    finally:
        db.close()

    # Keep Prometheus synchronized with the same value.
    events_throughput.set(throughput)


def record_window(window_id, total_events):
    """
    Store the latest completed processing window.
    """

    db = SessionLocal()

    try:
        status = _get_status(db)

        status.status = "online"
        status.last_window_id = str(window_id)
        status.last_window_count = int(total_events)
        status.updated_at = datetime.now(timezone.utc)

        db.commit()

    finally:
        db.close()

        # Keep Prometheus synchronized with the latest processing window.
        last_window_id.set(float(window_id))
        last_window_event_count.set(int(total_events))


def get_processing_status():
    """
    Return the current StreamForge processing status.
    """

    db = SessionLocal()

    try:
        status = _get_status(db)

        return {
            "status": status.status,

            "processed_events": (
                status.processed_events or 0
            ),

            "throughput": (
                float(status.throughput or 0.0)
            ),

            "last_event": status.last_event,

            "last_event_time": (
                status.last_event_time.isoformat()
                if status.last_event_time
                else None
            ),

            "last_window_id": status.last_window_id,

            "last_window_count": (
                status.last_window_count or 0
            ),
        }

    finally:
        db.close()