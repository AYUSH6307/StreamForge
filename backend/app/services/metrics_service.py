from prometheus_client import Counter

events_processed = Counter(
    "streamforge_events_processed_total",
    "Total number of events processed by StreamForge"
)