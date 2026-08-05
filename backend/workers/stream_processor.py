from bytewax.dataflow import Dataflow
from bytewax import operators as op
from bytewax.inputs import FixedPartitionedSource, StatefulSourcePartition


class EventSourcePartition(StatefulSourcePartition):

    def __init__(self):
        self.events = [
            {
                "event": "stream_created",
                "stream_id": 1,
                "title": "Test Stream",
                "owner_id": 5
            },
            {
                "event": "stream_created",
                "stream_id": 2,
                "title": "Kafka Stream",
                "owner_id": 6
            }
        ]

    def next_batch(self):
        if self.events:
            batch = self.events
            self.events = []
            return batch

        return []


    def snapshot(self):
        return self.events


class EventSource(FixedPartitionedSource):

    def list_parts(self):
        return ["events"]


    def build_part(self, step_id, worker_index, for_part):
        return EventSourcePartition()



flow = Dataflow("stream_processor")


events = op.input(
    "events",
    flow,
    EventSource()
)


processed = op.map(
    "process_event",
    events,
    lambda event: {
        **event,
        "processed": True
    }
)


op.inspect(
    "output",
    processed
)