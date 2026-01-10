from datetime import datetime, date
from pydantic import BaseModel, Field


class MoodIn(BaseModel):
    mood: int = Field(ge=1, le=10)
    note: str | None = None


class MoodOut(MoodIn):
    id: int
    ts: datetime
class ChatMessage(BaseModel):
    role: str  # "user" / "assistant" / "system"
    content: str


class ChatMessage(BaseModel):
    role: str  # "user" / "assistant" / "system"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    model: str | None = None


class ChatResponse(BaseModel):
    reply: str

class TrendOut(BaseModel):
    window_days: int
    points: int
    avg: float
    slope: float
    direction: str
    from_date: date | None
    to_date: date | None
