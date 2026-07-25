import random
import time
from datetime import datetime


def generate_sensor_data():
    return {
        "device_id": f"sensor-{random.randint(1, 5)}",
        "temperature": round(random.uniform(20, 40), 2),
        "humidity": round(random.uniform(30, 80), 2),
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":
    while True:
        data = generate_sensor_data()
        print(data)
        time.sleep(2)