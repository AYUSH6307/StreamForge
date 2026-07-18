from fastapi import APIRouter
import random

router = APIRouter()

@router.get("/")
def home():
    return {
        "project": "StreamForge",
        "status": "Running"
    }

@router.get("/health")
def health():
    return {
        "status": "Healthy"
    }

@router.get("/sensor")
def sensor_data():
    return {
        "device_id": "ESP32-001",
        "temperature": round(random.uniform(20, 40), 2),
        "humidity": round(random.uniform(30, 90), 2),
        "smoke": random.randint(0, 100),
        "status": "Normal"
    }