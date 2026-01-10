from datetime import datetime
from typing import List
from sqlmodel import Session, select
from models import MoodEntry


class MoodRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_entries_between(self, start: datetime, end: datetime) -> List[MoodEntry]:
        stmt = (
            select(MoodEntry)
            .where(MoodEntry.ts >= start, MoodEntry.ts <= end)
            .order_by(MoodEntry.ts.asc())
        )
        return self.session.exec(stmt).all()
