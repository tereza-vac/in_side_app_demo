from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlmodel import Session, select
from datetime import datetime, timedelta
from sqlalchemy import func
from routers.stats import router as stats_router

from database import init_db, get_session
from models import (
    MoodEntry, MoodIn, MoodOut,
    HealthOut, AvgOut, DailyStat, CountOut
)

# Import AI router
from routers.ai import router as ai_router

from dotenv import load_dotenv
load_dotenv()

# ======================================================
# ===============       App + CORS       ===============
# ======================================================

app = FastAPI(title="Inside MVP API")

origins = [
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:8082",
    "http://localhost:5173",
    "exp://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================================================
# ===============     Inicializace DB     ===============
# ======================================================

@app.on_event("startup")
def on_startup():
    init_db()


# ======================================================
# ===============        Healthcheck      ===============
# ======================================================

@app.get("/api/health", response_model=HealthOut)
def health():
    return HealthOut(status="ok")


# ======================================================
# ===============     Mood CRUD routes    ===============
# ======================================================

@app.get("/api/mood", response_model=List[MoodOut])
def list_mood(session: Session = Depends(get_session)):
    statement = select(MoodEntry).order_by(MoodEntry.ts.desc())
    return session.exec(statement).all()


@app.post("/api/mood", response_model=MoodOut)
def create_mood(payload: MoodIn, session: Session = Depends(get_session)):
    entry = MoodEntry(
        mood=payload.mood,
        note=payload.note
    )
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry


# ======================================================
# ===============         Statistiky      ===============
# ======================================================

@app.get("/api/stats/avg-week", response_model=AvgOut)
def avg_week(session: Session = Depends(get_session)):
    week_ago = datetime.utcnow() - timedelta(days=7)
    result = session.exec(
        select(func.avg(MoodEntry.mood)).where(MoodEntry.ts >= week_ago)
    ).one()
    return AvgOut(value=result or 0)


@app.get("/api/stats/avg", response_model=AvgOut)
def avg_dynamic(mode: str = "week", session: Session = Depends(get_session)):
    now = datetime.utcnow()

    if mode == "day":
        since = now - timedelta(days=1)
    elif mode == "month":
        since = now - timedelta(days=30)
    else:
        since = now - timedelta(days=7)

    value = session.exec(
        select(func.avg(MoodEntry.mood)).where(MoodEntry.ts >= since)
    ).one()

    return AvgOut(value=value or 0)


@app.get("/api/stats/daily", response_model=List[DailyStat])
def daily_stats(session: Session = Depends(get_session)):
    rows = session.exec(
        select(
            func.date(MoodEntry.ts),
            func.avg(MoodEntry.mood)
        )
        .group_by(func.date(MoodEntry.ts))
        .order_by(func.date(MoodEntry.ts))
    ).all()

    return [
        DailyStat(date=str(day), avg=avg_value)
        for day, avg_value in rows
    ]


@app.get("/api/stats/count", response_model=CountOut)
def count_entries(days: int = 7, session: Session = Depends(get_session)):
    since = datetime.utcnow() - timedelta(days=days)
    total = session.exec(
        select(func.count()).where(MoodEntry.ts >= since)
    ).one()
    return CountOut(count=total or 0)

app.include_router(stats_router)

# ======================================================
# ===============        AI ROUTER       ===============
# ======================================================

app.include_router(ai_router)

