from fastapi import FastAPI

from contextlib import asynccontextmanager
from app.services.kafka_manager import connect_kafka

from app.api.routes import router
from app.api.user_routes import router as user_router

from app.core.database import Base, engine
from app.models.user import User
from app.models.stream import Stream

from app.api.stream_routes import router as stream_router

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting StreamForge Backend...")

    # Initialize Kafka (optional)
    connect_kafka()

    yield

    print("🛑 Shutting down StreamForge Backend...")

app = FastAPI(
    title="StreamForge API",
    lifespan=lifespan
)

app.include_router(router)
app.include_router(user_router)
app.include_router(stream_router)