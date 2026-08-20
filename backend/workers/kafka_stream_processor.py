from bytewax.dataflow import Dataflow
from bytewax import operators as op
from bytewax.connectors.kafka import operators as kop

import json
import time
from datetime import datetime, timedelta, timezone


from app.core.database import SessionLocal
from app.models.stream import Stream
from app.models.user import User
from app.services.stats_service import save_stream_stat
from app.services.rocksdb_service import save_window_stat as save_rocksdb_stat

from app.services.metrics_service import (
    events_processed,
    active_workers,
)

from app.services.processing_monitor import (
    mark_processor_online,
    record_event,
    record_window,
    update_throughput,
)

from bytewax.operators.windowing import (
    EventClock,
    TumblingWindower,
    count_window,
)


# =========================================================
# CONFIGURATION
# =========================================================

BROKERS = ["127.0.0.1:9092"]
TOPICS = ["truck-telemetry"]


# =========================================================
# DATAFLOW
# =========================================================

flow = Dataflow("streamforge_processor")


# =========================================================
# PROCESSOR START
# =========================================================

mark_processor_online()


# =========================================================
# THROUGHPUT STATE
# =========================================================
#
# Throughput is measured by the processor itself.
#
# Unit:
#     events / second
#
# We calculate the throughput continuously instead of
# waiting for exactly one-second boundaries.
#
# This is important when events arrive slowly.
# =========================================================

throughput_start_time = None
throughput_event_count = 0


# =========================================================
# KAFKA INPUT
# =========================================================

kinp = kop.input(
    "kafka-input",
    flow,
    brokers=BROKERS,
    topics=TOPICS,
)


op.inspect(
    "kafka-errors",
    kinp.errs,
)


# =========================================================
# SAFE JSON DECODER
# =========================================================
#
# Kafka should normally contain one JSON object per message.
#
# However, if a message contains:
#
#     {...}{...}
#
# json.loads() raises:
#
#     JSONDecodeError: Extra data
#
# We do NOT allow one bad Kafka message to crash the
# complete Bytewax processor.
#
# If multiple JSON objects are present, all valid objects
# are extracted.
# =========================================================

def decode_kafka_message(msg):

    if not msg.value:
        return []

    try:
        raw = msg.value.decode("utf-8").strip()

    except UnicodeDecodeError as error:

        print(
            f">>> JSON DECODE ERROR: invalid UTF-8: {error}",
            flush=True,
        )

        return []

    if not raw:
        return []

    decoder = json.JSONDecoder()
    events = []
    position = 0
    length = len(raw)

    while position < length:

        # Skip whitespace between JSON objects.
        while position < length and raw[position].isspace():
            position += 1

        if position >= length:
            break

        try:

            value, next_position = decoder.raw_decode(
                raw,
                position,
            )

            if isinstance(value, dict):
                events.append(value)

            else:
                print(
                    ">>> JSON DECODE WARNING: "
                    "message is not a JSON object",
                    flush=True,
                )

            position = next_position

        except json.JSONDecodeError as error:

            print(
                f">>> JSON DECODE WARNING: "
                f"skipping malformed Kafka payload: {error}",
                flush=True,
            )

            # Do not crash Bytewax.
            #
            # We skip the remaining invalid payload.
            break

    return events


decoded = op.flat_map(
    "decode-json",
    kinp.oks,
    decode_kafka_message,
)


# =========================================================
# VALIDATE EVENTS
# =========================================================

REQUIRED_FIELDS = (
    "stream_id",
    "truck_id",
    "temperature",
    "speed",
    "latitude",
    "longitude",
    "timestamp",
)


def is_valid_event(event):

    if not isinstance(event, dict):
        return False

    missing_fields = [
        field
        for field in REQUIRED_FIELDS
        if field not in event
    ]

    if missing_fields:

        print(
            f">>> INVALID EVENT: missing {missing_fields}",
            flush=True,
        )

        return False

    return True


valid = op.filter(
    "valid-events",
    decoded,
    is_valid_event,
)


op.inspect(
    "raw-events",
    valid,
)


# =========================================================
# SAFE TIMESTAMP PARSING
# =========================================================

def parse_event_timestamp(event):

    try:

        timestamp = event["timestamp"]

        event_time = datetime.fromisoformat(
            timestamp
        )

        # Make sure event_time is timezone aware.
        if event_time.tzinfo is None:

            event_time = event_time.replace(
                tzinfo=timezone.utc
            )

        return [
            {
                **event,
                "event_time": event_time,
            }
        ]

    except Exception as error:

        print(
            f">>> TIMESTAMP ERROR: "
            f"invalid timestamp={event.get('timestamp')}: "
            f"{error}",
            flush=True,
        )

        return []


parsed = op.flat_map(
    "parse-timestamp",
    valid,
    parse_event_timestamp,
)


op.inspect(
    "parsed-events",
    parsed,
)


# =========================================================
# PROCESS EVENT
# =========================================================

def process_event(event):

    global throughput_start_time
    global throughput_event_count

    # -----------------------------------------------------
    # PROCESSOR STATUS
    # -----------------------------------------------------

    mark_processor_online()

    # -----------------------------------------------------
    # MARK EVENT AS PROCESSED
    # -----------------------------------------------------

    processed_event = {
        **event,
        "processed": True,
    }

    # -----------------------------------------------------
    # EVENT COUNTER
    # -----------------------------------------------------

    events_processed.inc()

    # -----------------------------------------------------
    # RECORD EVENT
    # -----------------------------------------------------

    record_event(processed_event)

    # -----------------------------------------------------
    # THROUGHPUT
    #
    # Measure only actual processing time.
    # The timer starts when the first event is processed,
    # not when the processor starts.
    # -----------------------------------------------------

    now = time.monotonic()

    if throughput_start_time is None:
        throughput_start_time = now
        throughput_event_count = 0

    throughput_event_count += 1

    elapsed = now - throughput_start_time

    if elapsed >= 1.0:
        throughput = throughput_event_count / elapsed

        update_throughput(throughput)

        print(
            f">>> THROUGHPUT: "
            f"{throughput_event_count} events / "
            f"{elapsed:.2f}s = "
            f"{throughput:.2f} events/sec",
            flush=True,
        )

        throughput_event_count = 0
        throughput_start_time = now

    else:
        # For the first event(s), calculate an instantaneous
        # throughput so the status does not stay at 0.0.
        #
        # A tiny minimum interval prevents unrealistic
        # extremely large values for events arriving at the
        # exact same instant.
        safe_elapsed = max(
            elapsed,
            0.1,
        )

        throughput = (
            throughput_event_count / safe_elapsed
        )

        update_throughput(
            throughput
        )

    return processed_event


processed = op.map(
    "process-event",
    parsed,
    process_event,
)


op.inspect(
    "processed-events",
    processed,
)


# =========================================================
# EVENT TIME CLOCK
# =========================================================

clock = EventClock(
    ts_getter=lambda event: event["event_time"],
    wait_for_system_duration=timedelta(
        seconds=0
    ),
)


# =========================================================
# 10-SECOND TUMBLING WINDOW
# =========================================================

windower = TumblingWindower(
    length=timedelta(
        seconds=10
    ),
    align_to=datetime(
        2026,
        1,
        1,
        tzinfo=timezone.utc,
    ),
)


# =========================================================
# WINDOW COUNT
# =========================================================
#
# Key:
#
#     stream_id:truck_id
#
# This keeps statistics separated by stream and truck.
# =========================================================

windowed = count_window(
    step_id="count-events",
    up=processed,
    clock=clock,
    windower=windower,
    key=lambda event: (
        f"{event['stream_id']}:{event['truck_id']}"
    ),
)


# =========================================================
# FORMAT WINDOW RESULT
# =========================================================

def format_window_result(item):

    print(
        f">>> WINDOW RAW RESULT: {item}",
        flush=True,
    )

    try:

        key = item[0]
        window_data = item[1]

        window_id = int(window_data[0])
        total_events = int(window_data[1])

        stream_id_str, truck_id = key.split(
            ":",
            1,
        )

        stream_id = int(stream_id_str)

        print(
            f">>> WINDOW PARSED: "
            f"stream_id={stream_id}, "
            f"truck_id={truck_id}, "
            f"window_id={window_id}, "
            f"total_events={total_events}",
            flush=True,
        )

        if total_events <= 0:

            print(
                f">>> WINDOW WARNING: "
                f"zero/negative event count received: "
                f"window_id={window_id}, "
                f"total_events={total_events}",
                flush=True,
            )

        return {
            "stream_id": stream_id,
            "key": truck_id,
            "window_id": window_id,
            "total_events": total_events,
        }

    except Exception as error:

        print(
            f">>> WINDOW FORMAT ERROR: "
            f"{error}; item={item}",
            flush=True,
        )

        raise


formatted = op.map(
    "format-window",
    windowed.down,
    format_window_result,
)


op.inspect(
    "formatted-window",
    formatted,
)


op.inspect(
    "window-count",
    formatted,
)


# =========================================================
# SAVE WINDOW STATISTICS
# =========================================================

def save_window_stat(item):

    print(
        ">>> SAVE_STATS: function entered",
        flush=True,
    )

    stream_id = item["stream_id"]
    key = item["key"]
    window_id = item["window_id"]
    total_events = item["total_events"]

    print(
    f">>> SAVE_STATS VALUES: "
    f"stream_id={stream_id}, "
    f"key={key}, "
    f"window_id={window_id}, "
    f"total_events={total_events}",
    flush=True,
)
    # -----------------------------------------------------
    # PROCESSING MONITOR
    # -----------------------------------------------------

    print(
        ">>> SAVE_STATS: before record_window",
        flush=True,
    )

    record_window(
        window_id=window_id,
        total_events=total_events,
    )

    print(
        ">>> SAVE_STATS: after record_window",
        flush=True,
    )

    # -----------------------------------------------------
    # ROCKSDB
    # -----------------------------------------------------

    print(
        ">>> SAVE_STATS: before RocksDB",
        flush=True,
    )

    # RocksDB intentionally remains disabled here because
    # SQLite + the existing statistics flow are already
    # working.
    #
    # It can be enabled later without changing throughput.

    print(
        ">>> SAVE_STATS: after RocksDB",
        flush=True,
    )

    # -----------------------------------------------------
    # SQLITE
    # -----------------------------------------------------

    print(
        ">>> SAVE_STATS: before SQLite",
        flush=True,
    )

    db = SessionLocal()

    print(
        ">>> SAVE_STATS: Session created",
        flush=True,
    )

    try:

        # ---------------------------------------------
        # VALIDATE STREAM ID
        # ---------------------------------------------

        try:

            stream_id = int(
                stream_id
            )

        except (
            TypeError,
            ValueError,
        ):

            print(
                f">>> SAVE_STATS: "
                f"invalid stream_id={stream_id}",
                flush=True,
            )

            return item

        # ---------------------------------------------
        # FIND STREAM
        # ---------------------------------------------

        stream = (
            db.query(Stream)
            .filter(
                Stream.id == stream_id
            )
            .first()
        )

        if stream is None:

            print(
                f">>> SAVE_STATS: "
                f"stream_id={stream_id} "
                f"not found, skipping SQLite save",
                flush=True,
            )

            return item

        # ---------------------------------------------
        # OWNER
        # ---------------------------------------------

        owner_id = stream.owner_id

        print(
            f">>> SAVE_STATS: "
            f"stream_id={stream_id}, "
            f"owner_id={owner_id}",
            flush=True,
        )

        # ---------------------------------------------
        # SAVE STREAM STAT
        # ---------------------------------------------

        save_stream_stat(
            db=db,
            owner_id=owner_id,
            window_id=int(
                window_id
            ),
            total_events=total_events,
        )

        print(
            ">>> SAVE_STATS: "
            "SQLite save completed",
            flush=True,
        )

    except Exception as error:

        print(
            f">>> SAVE_STATS: "
            f"SQLite ERROR: {error}",
            flush=True,
        )

        db.rollback()

    finally:

        db.close()

        print(
            ">>> SAVE_STATS: "
            "SQLite session closed",
            flush=True,
        )

    print(
        ">>> SAVE_STATS: function completed",
        flush=True,
    )

    return item


# =========================================================
# SAVE STATS
# =========================================================

def save_stats_wrapper(item):

    print(
        ">>> SAVE_STATS: wrapper received",
        item,
        flush=True,
    )

    result = save_window_stat(
        item
    )

    print(
        ">>> SAVE_STATS: wrapper completed",
        flush=True,
    )

    return result


saved_stats = op.map(
    "save-stats",
    formatted,
    save_stats_wrapper,
)


op.inspect(
    "saved-stats",
    saved_stats,
)