from fastapi import APIRouter
from sqlalchemy import text

from app.core.database import engine
from app.services import kafka_manager
from app.services.processing_monitor import get_processing_status


router = APIRouter(
    prefix="/health",
    tags=["Health"]
)


@router.get("/")
def health_check():

    result = {
        "status": "healthy",
        "api": "online",
        "database": "offline",
        "kafka": "offline",
        "processor": "offline",
    }

    # -------------------------
    # Database check
    # -------------------------
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        result["database"] = "online"

    except Exception as e:
        result["database"] = "offline"
        result["database_error"] = str(e)

    # -------------------------
    # Kafka check
    # -------------------------
    try:
        producer = kafka_manager.producer

        if producer is not None:
            producer.partitions_for("stream-events")
            result["kafka"] = "online"

        else:
            result["kafka"] = "offline"
            result["kafka_error"] = (
                "Kafka producer is not initialized"
            )

    except Exception as e:
        result["kafka"] = "offline"
        result["kafka_error"] = str(e)

    # -------------------------
    # Bytewax Processor check
    # -------------------------
    try:
        processor = get_processing_status()

        result["processor"] = processor["status"]

        result["processed_events"] = processor[
            "processed_events"
        ]

        result["last_event"] = processor[
            "last_event"
        ]

        result["last_event_time"] = processor[
            "last_event_time"
        ]

        result["last_window_id"] = processor[
            "last_window_id"
        ]

        result["last_window_count"] = processor[
            "last_window_count"
        ]

    except Exception as e:
        result["processor"] = "offline"
        result["processor_error"] = str(e)

    # -------------------------
    # Overall status
    # -------------------------
    if (
        result["database"] == "offline"
        or result["kafka"] == "offline"
        or result["processor"] == "offline"
    ):
        result["status"] = "degraded"

    return result