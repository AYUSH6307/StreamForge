from fastapi import FastAPI

from app.api.routes import router
from app.api.user_routes import router as user_router

from app.core.database import Base, engine
from app.models.user import User

Base.metadata.create_all(bind=engine)

app = FastAPI(title="StreamForge API")

app.include_router(router)
app.include_router(user_router)