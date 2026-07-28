from kafka import KafkaProducer
import json

producer = None

def connect_kafka():
    global producer

    if producer is not None:
        return producer

    try:
        producer = KafkaProducer(
            bootstrap_servers="localhost:9092",
            value_serializer=lambda v: json.dumps(v).encode("utf-8")
        )
        print("✅ Kafka Producer Connected")

    except Exception as e:
        print(f"⚠️ Kafka not available: {e}")
        producer = None

    return producer


def get_producer():
    return producer