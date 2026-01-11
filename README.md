# Inside — Mood Tracking App with AI & Analytics

Inside is a personal mood tracking application with an AI assistant and built-in analytics.  
It helps users reflect on their emotional state, understand long-term trends, and interact with a personal AI companion.

The project is built as a full-stack application with a FastAPI backend and an Expo / React Native frontend (mobile + web from a single codebase).

## Features

- Daily mood tracking (1–10 scale with optional notes)
- Statistics and history overview
- Mood trend analysis using linear regression on daily averages
- AI chat with pluggable LLM backends (Groq, OpenAI)
- Single codebase for mobile (iOS / Android) and web
- Unit-tested business logic
- Docker support for local development

## Architecture

### Backend (FastAPI)

The backend follows a clean layered architecture:

- `routers/` — API layer (HTTP, request/response handling)  
- `services/` — business logic (analytics, AI orchestration, domain rules)  
- `repositories/` — data access layer (database queries)  
- `tests/` — unit tests for services  

Core technologies:

- FastAPI  
- SQLModel + SQLite
- Pydantic  
- Uvicorn  

### Frontend

- Expo / React Native  
- Expo Router (file-based routing)  
- TypeScript  
- React Native Web for web deployment  

## Project Structure

```text
backend/
├─ routers/
├─ services/
├─ repositories/
├─ tests/
└─ main.py

frontend/
└─ inside_mvp/
   ├─ app/
   ├─ components/
   ├─ constants/
   └─ types/

```

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements-dev.txt
uvicorn main:app --reload

```

The API will be available at: http://localhost:8000

Swagger documentation: http://localhost:8000/docs

### Frontend

```bash
cd frontend/inside_mvp
npm install
npm run dev
```

### Running Tests

```bash
cd backend
python -m pytest
```

### Example API


```http
GET /api/stats/trend?window=7
```

Returns the mood trend for the last N days, including direction, slope and averages.

## Environment Variables

### Backend (backend/.env — not committed)

```env
GROQ_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

### Frontend

```env
API_URL=http://localhost:8000
```

## AI Logic

The backend automatically selects the correct provider:

- Models starting with `llama` or `mixtral` → **Groq**
- Models starting with `gpt` → **OpenAI**

The API returns responses as:

```json
{ "reply": "AI response here" }
```


## Roadmap

- Mood forecasting
- Trend confidence & explanations
- Retrieval-augmented generation (RAG) over personal mood notes
- Recommendation system
- User authentication
- Push notifications
- Data export

## Notes
.env files and local databases are intentionally excluded from the repository.
This project is a personal learning and portfolio project.

## License
MIT