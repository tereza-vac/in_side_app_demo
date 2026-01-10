from services.stats_service import StatsService


class FakeEntry:
    def __init__(self, mood, ts):
        self.mood = mood
        self.ts = ts


class FakeRepo:
    def __init__(self, entries):
        self.entries = entries

    def get_entries_between(self, start, end):
        return self.entries


def test_improving_trend():
    from datetime import datetime, timedelta

    base = datetime(2026, 1, 1)
    entries = [
        FakeEntry(3, base),
        FakeEntry(4, base + timedelta(days=1)),
        FakeEntry(5, base + timedelta(days=2)),
    ]

    service = StatsService(FakeRepo(entries))
    result = service.calculate_trend(7)

    assert result.direction == "improving"
