from collections import defaultdict
from datetime import datetime, timedelta, timezone
from repositories.mood_repository import MoodRepository


class TrendResult:
    def __init__(self, slope, direction, points, avg, start, end):
        self.slope = slope
        self.direction = direction
        self.points = points
        self.avg = avg
        self.start = start
        self.end = end


class StatsService:
    def __init__(self, repo: MoodRepository):
        self.repo = repo

    def calculate_trend(self, window_days: int) -> TrendResult:
        end = datetime.now(timezone.utc)
        start = end - timedelta(days=window_days)

        entries = self.repo.get_entries_between(start, end)

        if not entries:
            return TrendResult(
                slope=0,
                direction="insufficient_data",
                points=0,
                avg=0,
                start=None,
                end=None,
            )

        daily = defaultdict(list)
        for e in entries:
            daily[e.ts.date()].append(e.mood)

        days = sorted(daily.keys())
        values = [sum(daily[d]) / len(daily[d]) for d in days]

        if len(values) < 3:
            return TrendResult(
                slope=0,
                direction="insufficient_data",
                points=len(values),
                avg=sum(values) / len(values),
                start=days[0],
                end=days[-1],
            )

        x = list(range(len(values)))
        y = values

        n = len(x)
        xm = sum(x) / n
        ym = sum(y) / n

        num = sum((x[i] - xm) * (y[i] - ym) for i in range(n))
        den = sum((x[i] - xm) ** 2 for i in range(n))
        slope = num / den if den else 0

        threshold = 0.05

        if slope > threshold:
            direction = "improving"
        elif slope < -threshold:
            direction = "worsening"
        else:
            direction = "stable"

        return TrendResult(
            slope=slope,
            direction=direction,
            points=len(values),
            avg=sum(values) / len(values),
            start=days[0],
            end=days[-1],
        )
