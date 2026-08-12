from prometheus_client import Gauge

events_processed = Gauge(
    "streamforge_events_processed_total",
    "Total number of events processed by StreamForge"
)