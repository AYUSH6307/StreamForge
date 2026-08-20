import json
from datetime import datetime, timedelta, timezone

from bytewax.dataflow import Dataflow
from bytewax import operators as op
from bytewax.connectors.kafka import operators as kop
from bytewax.operators.windowing import (
    EventClock,
    TumblingWindower,
    count_window,
)


BROKERS = ["127.0.0.1:9092"]
TOPICS = ["truck-telemetry"]


flow = Dataflow("streamforge_iot_processor")


# =========================================================
# KAFKA INPUT
# =========================================================

kinp = kop.input(
    "iot-kafka-input",
    flow,
    brokers=BROKERS,
    topics=TOPICS,
)

op.inspect(
    "iot-kafka-errors",
    kinp.errs,
)


# =========================================================
# DECODE JSON
# =========================================================

decoded = op.map(
    "decode-iot-json",
    kinp.oks,
    lambda msg: json.loads(
        msg.value.decode("utf-8")
    ) if msg.value else None,
)


# =========================================================
# VALIDATE TELEMETRY
# =========================================================

valid = op.filter(
    "valid-iot-telemetry",
    decoded,
    lambda event: (
        event is not None
        and "truck_id" in event
        and "temperature" in event
        and "speed" in event
        and "latitude" in event
        and "longitude" in event
        and "timestamp" in event
    ),
)


# =========================================================
# PARSE TIMESTAMP
# =========================================================

parsed = op.map(
    "parse-iot-timestamp",
    valid,
    lambda event: {
        **event,
        "event_time": datetime.fromisoformat(
            event["timestamp"]
        ),
        "temperature": float(event["temperature"]),
        "speed": float(event["speed"]),
    },
)


# =========================================================
# PROCESS TELEMETRY
# =========================================================

processed = op.map(
    "process-iot-telemetry",
    parsed,
    lambda event: {
        **event,
        "processed": True,
    },
)


op.inspect(
    "processed-iot-events",
    processed,
)


# =========================================================
# EVENT TIME CLOCK
# =========================================================

clock = EventClock(
    ts_getter=lambda event: event["event_time"],
    wait_for_system_duration=timedelta(seconds=0),
)


# =========================================================
# 5-MINUTE TUMBLING WINDOW
# =========================================================

windower = TumblingWindower(
    length=timedelta(minutes=5),
    align_to=datetime(
        2026,
        1,
        1,
        tzinfo=timezone.utc,
    ),
)


# =========================================================
# TRUCK-WISE EVENT COUNT
# =========================================================

windowed = count_window(
    step_id="truck-count-window",
    up=processed,
    clock=clock,
    windower=windower,
    key=lambda event: event["truck_id"],
)


# =========================================================
# FORMAT WINDOW RESULT
# =========================================================

formatted = op.map(
    "format-truck-window",
    windowed.down,
    lambda item: {
        "truck_id": item[0],
        "window_id": item[1][0],
        "total_events": item[1][1],
    },
)


# =========================================================
# OUTPUT
# =========================================================

op.inspect(
    "truck-window-count",
    formatted,
)