from prometheus_client import Gauge

# ---------------------------------------------------------
# StreamForge Prometheus Metrics
# ---------------------------------------------------------

events_processed = Gauge(
    "streamforge_events_processed_total",
    "Total number of events processed by StreamForge",
)

active_workers = Gauge(
    "streamforge_active_workers",
    "Number of currently active StreamForge workers",
)

events_throughput = Gauge(
    "streamforge_events_throughput_per_second",
    "Current event processing throughput in events per second",
)

last_window_id = Gauge(
    "streamforge_last_window_id",
    "ID of the latest completed processing window",
)

last_window_event_count = Gauge(
    "streamforge_last_window_event_count",
    "Number of events in the latest processing window",
)