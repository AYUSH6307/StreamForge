from fastapi import FastAPI,Response
from contextlib import asynccontextmanager

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

from app.services.metrics_service import events_processed
from app.services.stats_service import get_stream_stats


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


@app.get("/metrics")
def metrics():
    """
    StreamForge custom Prometheus metrics.
    Reads the latest processed-event count from the database.
    """

    db = SessionLocal()

    try:
        stats = get_stream_stats(db)

        total_events = sum(
            stat.total_events
            for stat in stats
        )

        events_processed.set(total_events)

        return Response(
            content=generate_latest(),
            media_type=CONTENT_TYPE_LATEST
        )
        

    finally:
        db.close()


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