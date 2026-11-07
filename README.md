# JobCurrent

> **"Stay Current. Stay Career-Ready."**

JobCurrent is an AI-assisted job and internship discovery platform that aggregates opportunities from multiple permitted sources, evaluates eligibility and match scores against users' academic profiles and career preferences, and delivers personalized daily email digests.

---

## 📁 Project Directory Structure

```text
job-current/
│
├── frontend/                           # React + Vite + Tailwind CSS Application
│   ├── public/                         # Static assets (logo.svg, favicon)
│   └── src/                            # JavaScript ES6+, JSX
│       ├── components/                 # Reusable UI component library (Design system)
│       ├── context/                    # AuthContext, ThemeContext (Light & Dark)
│       ├── pages/                      # LandingPage, BrowseJobs, JobDetails, Dashboard, Tracker
│       ├── data/                       # Verified mock seed listings
│       └── lib/                        # Formatting, Supabase client
│
├── backend/                            # FastAPI (Python 3.10+) Backend Application
│   ├── app/
│   │   ├── main.py                     # FastAPI application with CORS & OpenAPI docs
│   │   ├── config.py                   # Pydantic BaseSettings
│   │   ├── api/v1/                     # REST routes: jobs, match, collector, extract, digest
│   │   ├── models/schemas.py           # Pydantic v2 schemas
│   │   ├── services/                   # Normalization, MatchingEngine, GroqService, EmailService
│   │   └── connectors/                 # Jobvetta, Himalayas, Arbeitnow, RemoteOK, Greenhouse, Lever
│   ├── tests/                          # Automated Pytest suite (17 passed)
│   ├── scripts/                        # Ingestion runners
│   ├── pyproject.toml                  # Python dependencies
│   ├── requirements.txt                # Pinned pip requirements
│   └── run.py                          # Local server launcher
│
├── docs/                               # System architecture, database schema, deployment guides
├── .env.example                        # Root environment variable template
└── README.md                           # Project documentation
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (JavaScript ES6+, JSX), Vite, React Router DOM, Tailwind CSS, Lucide Icons |
| **Backend API** | **FastAPI (Python 3.10+)**, Uvicorn, Pydantic v2, HTTPX |
| **Database & Auth** | Supabase (PostgreSQL with Row Level Security, Supabase Auth) |
| **AI Extraction** | Groq API (`llama-3.3-70b-versatile` JSON mode + deterministic parsing fallback) |
| **Email Service** | Resend API (Personalized responsive HTML daily digests) |
| **Package Managers** | `uv` / `pip` for Python; `npm` for React |
