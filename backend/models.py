from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field as PydField

class MoodEntry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mood: int
    note: Optional[str] = None
    ts: datetime = Field(default_factory=datetime.utcnow)

class MoodIn(BaseModel):
    mood: int = PydField(ge=1, le=10)
    note: Optional[str] = None

class MoodOut(MoodIn):
    id: int
    ts: datetime

class HealthOut(BaseModel):
    status: str

class AvgOut(BaseModel):
    value: float

class DailyStat(BaseModel):
    date: str
    avg: float

class CountOut(BaseModel):
    count: int
