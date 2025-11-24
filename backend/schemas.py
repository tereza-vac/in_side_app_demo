from datetime import datetime
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


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


class ChatResponse(BaseModel):
    reply: str
