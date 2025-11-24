# routers/ai.py
from fastapi import APIRouter
from schemas import ChatRequest, ChatResponse
from services.ai_service import summarize_text, generate_chat_response

router = APIRouter(prefix="/ai", tags=["ai"])


# -------------------------
# 1) PŮVODNÍ ENDPOINT – ZACHOVÁNO
# -------------------------
@router.post("/summarize")
async def summarize(req: dict):
    text = req.get("text", "")
    return {"summary": await summarize_text(text)}


# -------------------------
# 2) NOVÝ ENDPOINT – CHAT
# -------------------------
@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    return await generate_chat_response(req)
