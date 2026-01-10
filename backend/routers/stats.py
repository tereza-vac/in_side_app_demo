from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from repositories.mood_repository import MoodRepository
from services.stats_service import StatsService
from schemas import TrendOut

router = APIRouter(prefix="/api/stats", tags=["stats"])


def get_stats_service(session: Session = Depends(get_session)):
    return StatsService(MoodRepository(session))


@router.get("/trend", response_model=TrendOut)
def mood_trend(window: int = 7, service: StatsService = Depends(get_stats_service)):
    result = service.calculate_trend(window)

    return TrendOut(
        window_days=window,
        points=result.points,
        avg=result.avg,
        slope=result.slope,
        direction=result.direction,
        from_date=result.start,
        to_date=result.end,
    )
