from pydantic import BaseModel


class StreamCreate(BaseModel):
    title: str
    description: str


class StreamResponse(BaseModel):
    id: int
    title: str
    description: str
    owner_id: int

    class Config:
        from_attributes = True

class StreamUpdate(BaseModel):
    title: str | None = None
    description: str | None = None