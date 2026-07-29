from kafka import KafkaProducer
import json


producer = KafkaProducer(
    bootstrap_servers=["127.0.0.1:9092"],
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
    api_version=(2, 5, 0)
)


def send_stream_event(event):
    producer.send(
        "stream-events",
        value=event
    )
    producer.flush()