from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    "stream-events",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="earliest",
    value_deserializer=lambda m: json.loads(m.decode("utf-8"))
)

print("Listening for stream events...")

for message in consumer:
    print("Received Event:")
    print(message.value)