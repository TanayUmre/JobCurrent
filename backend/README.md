# JobCurrent — FastAPI Python Backend

> **Tagline**: *"Stay Current. Stay Career-Ready."*

The JobCurrent backend is built with **FastAPI** (Python 3.10+), Pydantic v2, and async HTTP clients (`httpx`), powering multi-source job collection, URL normalization, SHA-256 deduplication, deterministic academic eligibility evaluation, Groq AI extraction, and Resend email digests.

---

## 🛠️ Architecture & Components

```text
backend/
├── app/
│   ├── main.py                     # FastAPI application with CORS & metadata
│   ├── config.py                   # Pydantic BaseSettings for environment variables
│   ├── api/
│   │   ├── router.py               # Combined API v1 router
│   │   └── v1/
│   │       ├── jobs.py             # GET /api/v1/jobs, GET /api/v1/jobs/{id}
│   │       ├── matching.py         # POST /api/v1/match/evaluate
│   │       ├── collector.py        # POST /api/v1/collector/run, GET /status
│   │       ├── extraction.py       # POST /api/v1/extract
│   │       └── digest.py           # POST /api/v1/digest/send
│   ├── models/
│   │   └── schemas.py              # Pydantic schemas (Job, Profile, MatchResult, etc.)
│   ├── services/
│   │   ├── normalizer.py           # URL cleaning & SHA-256 description deduplication
│   │   ├── matching_engine.py      # Deterministic eligibility + relevance score (0-100)
│   │   ├── groq_service.py         # Groq JSON mode extraction + deterministic fallback
│   │   └── email_service.py        # Resend daily digest HTML email dispatcher
│   └── connectors/
│       ├── base.py                 # Abstract BaseConnector interface
│       ├── jobvetta.py             # Jobvetta Indian job listings connector
│       ├── himalayas.py            # Himalayas international remote jobs connector
│       ├── arbeitnow.py            # Arbeitnow international jobs connector
│       ├── remoteok.py             # RemoteOK remote jobs connector
│       ├── greenhouse.py           # Greenhouse direct company jobs connector
│       └── lever.py                # Lever direct company jobs connector
├── tests/                          # Pytest automated test suite (17 passed)
│   ├── test_api.py                 # Tests FastAPI endpoints
│   ├── test_connectors.py          # Tests 6 active source connectors
│   ├── test_matching.py            # Tests CGPA/batch cutoffs & matching score
│   └── test_normalizer.py          # Tests URL cleaning & SHA-256 hash deduplication
├── scripts/
│   └── run_collector.py            # CLI script to trigger multi-source ingestion
├── pyproject.toml                  # Project & dependency specification
├── requirements.txt                # Pinned pip requirements
└── run.py                          # Server launcher: uvicorn app.main:app
```

---

## 🚀 Running the FastAPI Server Locally

1. **Activate virtual environment**:
   ```bash
   # Windows PowerShell
   .venv\Scripts\activate
   ```
2. **Start the FastAPI application**:
   ```bash
   uv run python run.py
   # Or using uvicorn directly:
   uv run uvicorn app.main:app --reload --port 8000
   ```
3. Open your browser:
   - **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Alternative ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
   - **Health Check**: [http://localhost:8000/](http://localhost:8000/)

---

## 🧪 Running Automated Tests

```bash
uv run pytest -v
```
All 12 unit and integration tests covering normalization, eligibility checking, deduplication, and API endpoints run in under 1 second.
