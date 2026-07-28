from app.services.kafka_manager import get_producer


def send_stream_event(event_type: str, data: dict):
    producer = get_producer()

    if producer is None:
        print(f"⚠️ Kafka unavailable. Event skipped: {event_type}")
        return

    producer.send(
        "stream-events",
        {
            "event_type": event_type,
            "data": data
        }
    )

    producer.flush()