import os
from typing import Optional
from dotenv import load_dotenv

from schemas import ChatRequest, ChatResponse

#  IMPORT KLIENTŮ
from openai import OpenAI                    # OpenAI
from groq import Groq                        # Groq !!!

load_dotenv()

print("=== ENV CHECK ===")
print("GROQ_API_KEY loaded:", os.getenv("GROQ_API_KEY") is not None)
print("OPENAI_API_KEY loaded:", os.getenv("OPENAI_API_KEY") is not None)
print("=================")

# --------------------------
#  Klienti pro AI služby
# --------------------------

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

openai_client: Optional[OpenAI] = (
    OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
)

groq_client: Optional[Groq] = (
    Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
)

# Default
DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile"



# --------------------------
# 1) Text summarization
# --------------------------
async def summarize_text(text: str) -> str:

    client = groq_client or openai_client
    if client is None:
        return "AI není nakonfigurovaná (chybí API klíč)."

    model = (
        DEFAULT_GROQ_MODEL
        if client is groq_client
        else "gpt-4o-mini"
    )

    if client is groq_client:
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "Shrň následující text česky."},
                {"role": "user", "content": text},
            ],
        )
        return resp.choices[0].message.content or ""

    else:
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "Shrň následující text česky."},
                {"role": "user", "content": text},
            ],
        )
        return resp.choices[0].message.content or ""


# --------------------------
# 2) Chat endpoint (hlavní)
# --------------------------
async def generate_chat_response(chat: ChatRequest) -> ChatResponse:

    model_name = chat.model or DEFAULT_GROQ_MODEL

    # ----------------------
    # Vyber správného klienta
    # ----------------------
    def pick_client(model: str):
        if model.startswith(("llama", "mixtral", "gemma")):
            return groq_client, "groq"
        if model.startswith(("gpt", "o1", "o3")):
            return openai_client, "openai"
        return groq_client, "groq"

    client, source = pick_client(model_name)

    if client is None:
        return ChatResponse(reply=f"Model {model_name} nemá dostupný API klíč.")

    # Převést messages
    messages = [{"role": m.role, "content": m.content} for m in chat.messages]

    # ----------------------
    # GROQ CHAT
    # ----------------------
    if source == "groq":
        resp = client.chat.completions.create(
            model=model_name,
            messages=messages,
            temperature=0.7,
        )
        answer = resp.choices[0].message.content or ""
        return ChatResponse(reply=answer)

    # ----------------------
    #  OPENAI CHAT
    # ----------------------
    else:
        resp = client.chat.completions.create(
            model=model_name,
            messages=messages,
            temperature=0.7,
        )
        answer = resp.choices[0].message.content or ""
        return ChatResponse(reply=answer)