# services/ai_service.py
import os
from openai import OpenAI
from dotenv import load_dotenv

from schemas import ChatRequest, ChatResponse

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)


# -------------------------
# 1) PŮVODNÍ FUNKCE – ZACHOVÁNO
# -------------------------
async def summarize_text(text: str) -> str:
    """
    Tvoje původní funkce pro shrnutí textu.
    """
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Shrň následující text do 1–2 vět:"},
            {"role": "user", "content": text},
        ],
    )
    return completion.choices[0].message.content


# -------------------------
# 2) NOVÁ FUNKCE – CHAT
# -------------------------
async def generate_chat_response(chat: ChatRequest) -> ChatResponse:
    """
    Hlavní chatovací endpoint (připraveno na RAG).
    """

    messages = [{"role": m.role, "content": m.content} for m in chat.messages]

    # (Sem později přidáme RAG kontext)
    # context = retrieve_context(...)
    # messages.insert(0, {"role": "system", "content": context})

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.7,
    )

    reply = completion.choices[0].message.content
    return ChatResponse(reply=reply)
