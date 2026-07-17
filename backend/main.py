from fastapi import FastAPI

app = FastAPI(
    title="StreamForge",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to StreamForge API"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }