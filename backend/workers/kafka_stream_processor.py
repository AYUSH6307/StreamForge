from bytewax.dataflow import Dataflow
from bytewax import operators as op
from bytewax.connectors.kafka import operators as kop
import json
from datetime import datetime
from datetime import timedelta, timezone

from bytewax.operators.windowing import (
    EventClock,
    TumblingWindower,
    count_window,
)

BROKERS = ["127.0.0.1:9092"]
TOPICS = ["stream-events"]

flow = Dataflow("streamforge_processor")

# Kafka Input
kinp = kop.input(
    "kafka-input",
    flow,
    brokers=BROKERS,
    topics=TOPICS,
)

# Error stream
op.inspect("kafka-errors", kinp.errs)

# Decode JSON
decoded = op.map(
    "decode-json",
    kinp.oks,
    lambda msg: json.loads(msg.value.decode("utf-8")) if msg.value else None,
)

# Remove invalid events
valid = op.filter(
    "valid-events",
    decoded,
    lambda e: (
        e is not None
        and "event" in e
        and "timestamp" in e
    ),
)

op.inspect(
    "raw-events",
    valid
)

parsed = op.map(
    "parse-timestamp",
    valid,
    lambda e: {
        **e,
        "event_time": datetime.fromisoformat(e["timestamp"])
    }
)




# Add processing flag
processed = op.map(
    "process-event",
    parsed,
    lambda e: {
        **e,
        "processed": True,
    },
)

def extract_timestamp(event):
    return event["event_time"]


clock = EventClock(
    ts_getter=extract_timestamp,
    wait_for_system_duration=timedelta(seconds=0),
)

windower = TumblingWindower(
    length=timedelta(seconds=5),
    align_to=datetime(
        2026,
        1,
        1,
        tzinfo=timezone.utc,
    ),
)

windowed = count_window(
    step_id="count-events",
    up=processed,
    clock=clock,
    windower=windower,
   key=lambda e: str(e["owner_id"]),
)

# Print output
op.inspect("processed-events", processed)

formatted = op.map(
    "format-window",
    windowed.down,
    lambda item: {
        "key": item[0],
        "window_id": item[1][0],
        "total_events": item[1][1],
    },
)

op.inspect(
    "window-count",
    formatted,
)