from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)


def send_stream_event(event_type: str, data: dict):
    producer.send(
        "stream-events",
        {
            "event_type": event_type,
            "data": data
        }
    )
    producer.flush()