import json
import random
import time
from datetime import datetime, timezone

from confluent_kafka import Producer


# =========================================================
# KAFKA CONFIGURATION
# =========================================================

KAFKA_BROKER = "127.0.0.1:9092"
KAFKA_TOPIC = "truck-telemetry"

# Existing StreamForge stream for testing
STREAM_ID = 9


# =========================================================
# KAFKA PRODUCER
# =========================================================

producer = Producer({
    "bootstrap.servers": KAFKA_BROKER,
})


# =========================================================
# DELIVERY CALLBACK
# =========================================================

def delivery_report(err, msg):

    if err is not None:
        print(
            f"Kafka delivery failed: {err}",
            flush=True
        )
        return

    print(
        f"Telemetry delivered to "
        f"{msg.topic()} "
        f"[partition {msg.partition()}]",
        flush=True
    )


# =========================================================
# GENERATE IOT TELEMETRY
# =========================================================

def generate_telemetry():

    return {
        "stream_id": STREAM_ID,

        "truck_id": (
            f"TRUCK-{random.randint(1, 5):03d}"
        ),

        "temperature": round(
            random.uniform(20, 45),
            2
        ),

        "speed": round(
            random.uniform(20, 100),
            2
        ),

        "latitude": round(
            random.uniform(25.0, 28.0),
            6
        ),

        "longitude": round(
            random.uniform(77.0, 82.0),
            6
        ),

        "timestamp": (
            datetime.now(timezone.utc).isoformat()
        ),
    }


# =========================================================
# START PRODUCER
# =========================================================

print(
    "IoT Telemetry Producer started...",
    flush=True
)

print(
    f"Kafka broker: {KAFKA_BROKER}",
    flush=True
)

print(
    f"Kafka topic: {KAFKA_TOPIC}",
    flush=True
)

print(
    f"Stream ID: {STREAM_ID}",
    flush=True
)


# =========================================================
# PRODUCER LOOP
# =========================================================

try:

    while True:

        telemetry = generate_telemetry()

        producer.produce(
            topic=KAFKA_TOPIC,
            value=json.dumps(
                telemetry
            ).encode("utf-8"),
            callback=delivery_report,
        )

        # Allow delivery callbacks to execute
        producer.poll(0)

        print(
            "Sent telemetry:",
            telemetry,
            flush=True
        )

        time.sleep(2)


except KeyboardInterrupt:

    print(
        "\nIoT Telemetry Producer stopped.",
        flush=True
    )


finally:

    producer.flush()

    print(
        "Kafka producer closed.",
        flush=True
    )