import json
import random
import time
from datetime import datetime, timezone

from kafka import KafkaProducer


BROKER = "127.0.0.1:9092"
TOPIC = "truck-telemetry"


producer = KafkaProducer(
    bootstrap_servers=[BROKER],
    value_serializer=lambda value: json.dumps(value).encode("utf-8"),
)


def generate_telemetry():
    return {
        "truck_id": f"TRUCK-{random.randint(1, 5):03d}",
        "temperature": round(random.uniform(20, 45), 2),
        "speed": round(random.uniform(20, 100), 2),
        "latitude": round(random.uniform(25.0, 28.0), 6),
        "longitude": round(random.uniform(77.0, 82.0), 6),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


print("🚚 IoT Telemetry Producer started...")
print(f"Kafka topic: {TOPIC}")


try:
    while True:
        telemetry = generate_telemetry()

        producer.send(
            TOPIC,
            value=telemetry
        )

        producer.flush()

        print("📡 Sent telemetry:")
        print(telemetry)

        time.sleep(2)

except KeyboardInterrupt:
    print("\n🛑 Telemetry Producer stopped.")

finally:
    producer.close()