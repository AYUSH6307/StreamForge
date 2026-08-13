from datetime import datetime, timezone

from app.services.rocksdb_service import get_db


PROCESSOR_STATUS_KEY = "__processor_status__"


def mark_processor_online():
    db = get_db()

    try:
        current = db.get(PROCESSOR_STATUS_KEY) or {}

        current["status"] = "online"
        current["updated_at"] = datetime.now(
            timezone.utc
        ).isoformat()

        db[PROCESSOR_STATUS_KEY] = current
        db.flush()

    finally:
        db.close()


def record_event(event):
    db = get_db()

    try:
        current = db.get(PROCESSOR_STATUS_KEY) or {}

        current["status"] = "online"
        current["processed_events"] = (
            current.get("processed_events", 0) + 1
        )
        current["last_event"] = event.get("event")
        current["last_event_time"] = datetime.now(
            timezone.utc
        ).isoformat()

        db[PROCESSOR_STATUS_KEY] = current
        db.flush()

    finally:
        db.close()


def record_window(window_id, total_events):
    db = get_db()

    try:
        current = db.get(PROCESSOR_STATUS_KEY) or {}

        current["status"] = "online"
        current["last_window_id"] = window_id
        current["last_window_count"] = total_events

        db[PROCESSOR_STATUS_KEY] = current
        db.flush()

    finally:
        db.close()


def get_processing_status():
    db = get_db(read_only=True)

    try:
        status = db.get(PROCESSOR_STATUS_KEY)

        if not status:
            return {
                "status": "offline",
                "processed_events": 0,
                "last_event": None,
                "last_event_time": None,
                "last_window_id": None,
                "last_window_count": 0,
            }

        return {
            "status": status.get("status", "offline"),
            "processed_events": status.get(
                "processed_events", 0
            ),
            "last_event": status.get("last_event"),
            "last_event_time": status.get(
                "last_event_time"
            ),
            "last_window_id": status.get(
                "last_window_id"
            ),
            "last_window_count": status.get(
                "last_window_count", 0
            ),
        }

    finally:
        db.close()