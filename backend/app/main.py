from fastapi import FastAPI,Response
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST

from app.services.kafka_manager import connect_kafka

from app.api.routes import router
from app.api.user_routes import router as user_router
from app.api.stream_routes import router as stream_router
from app.api.stats_routes import router as stats_router

from app.core.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.stream import Stream
from app.models.stat import StreamStat
from app.models.processing_status import ProcessingStatus

from app.services.metrics_service import (
    events_processed,
    active_workers,
    events_throughput,
    last_window_id,
    last_window_event_count,
)
from app.services.processing_monitor import (
    get_processing_status,
)


from app.api.health_routes import router as health_router


Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting StreamForge Backend...")

    # Initialize Kafka
    connect_kafka()

    yield

    print("🛑 Shutting down StreamForge Backend...")


app = FastAPI(
    title="StreamForge API",
    lifespan=lifespan
)


# Prometheus HTTP metrics instrumentation
Instrumentator().instrument(app).expose(
    app,
    endpoint="/http-metrics"
)

# =========================================================
# METRICS
# =========================================================

@app.get("/metrics")
def metrics():
    """
    Expose StreamForge application metrics.

    Throughput is calculated exclusively by the Bytewax
    processor and stored in ProcessingStatus. This endpoint
    only synchronizes Prometheus gauges with that stored state.
    """

    processing = get_processing_status()

    # -----------------------------------------------------
    # TOTAL PROCESSED EVENTS
    # -----------------------------------------------------

    events_processed.set(
        float(processing.get("processed_events", 0) or 0)
    )

    # -----------------------------------------------------
    # WORKER STATUS
    # -----------------------------------------------------

    worker_status = processing.get("status")

    last_event_time = processing.get("last_event_time")

    worker_active = False

    if worker_status == "online" and last_event_time:

        try:
            last_update = datetime.fromisoformat(
                last_event_time
            )

            if last_update.tzinfo is None:
                last_update = last_update.replace(
                    tzinfo=timezone.utc
                )

            age = (
                datetime.now(timezone.utc) - last_update
            ).total_seconds()

            # Worker is considered active if an event
            # was processed within the last 15 seconds.
            worker_active = age <= 15

        except (ValueError, TypeError):
            worker_active = False

    active_workers.set(
        1 if worker_active else 0
    )

    # -----------------------------------------------------
    # THROUGHPUT
    # -----------------------------------------------------
    #
    # IMPORTANT:
    # Do NOT calculate throughput here.
    #
    # Bytewax processor is the single source of truth.
    #

    throughput = float(
        processing.get("throughput", 0.0) or 0.0
    )

    events_throughput.set(throughput)

        # -----------------------------------------------------
    # LAST PROCESSING WINDOW
    # -----------------------------------------------------

    window_id = processing.get("last_window_id")

    if window_id is not None:
        try:
            last_window_id.set(
                float(window_id)
            )
        except (ValueError, TypeError):
            last_window_id.set(0)

    last_window_event_count.set(
        float(
            processing.get(
                "last_window_count",
                0
            ) or 0
        )
    )

    # -----------------------------------------------------
    # RETURN PROMETHEUS METRICS
    # -----------------------------------------------------

    return Response(
        content=generate_latest(),
        media_type=CONTENT_TYPE_LATEST,
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)
app.include_router(user_router)
app.include_router(stream_router)
app.include_router(stats_router)
app.include_router(health_router)