from rocksdict import Rdict, AccessType
from pathlib import Path


DB_PATH = (
    Path(__file__).resolve().parents[3]
    / "data"
    / "rocksdb"
)

DB_PATH.parent.mkdir(
    parents=True,
    exist_ok=True
)


def get_db(read_only=False):
    if read_only:
        return Rdict(
            str(DB_PATH),
            access_type=AccessType.read_only()
        )

    return Rdict(str(DB_PATH))


def save_window_stat(
    owner_id: int,
    window_id: str,
    total_events: int
):
    db = get_db()

    try:
        key = f"window:{owner_id}:{window_id}"

        db[key] = {
            "owner_id": owner_id,
            "window_id": str(window_id),
            "total_events": total_events,
        }

        db.flush()

    finally:
        db.close()


def get_window_stat(
    owner_id: int,
    window_id: str
):
    db = get_db(read_only=True)

    try:
        key = f"window:{owner_id}:{window_id}"
        return db.get(key)

    finally:
        db.close()


def get_all_window_stats():
    db = get_db(read_only=True)

    try:
        stats = []

        for key, value in db.items():
            if str(key).startswith("window:"):
                stats.append(value)

        return stats

    finally:
        db.close()