<div align="center">

# 💼 JobCurrent

### *"Stay Current. Stay Career-Ready."*

An AI-assisted job and internship discovery platform tailored for the Indian tech ecosystem. Aggregates opportunities from multiple verified sources, evaluates deterministic eligibility against academic credentials and preferences, and delivers automated daily email digests.

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-20%2F20%20Passing-brightgreen?style=for-the-badge&logo=pytest&logoColor=white)](backend/tests/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

[Explore Features](#-key-features) • [Architecture](#-system-architecture) • [Getting Started](#-getting-started) • [API & Automation](#-automation--cron-jobs) • [Deployment](#-deployment)

</div>

---

## 📌 Repository Description

> **One-Line Pitch:**  
> **JobCurrent** is an AI-powered career discovery engine designed for Indian students and tech professionals, featuring deterministic academic eligibility matching, automated multi-source ingestion, and daily personalized email digests.

### 🌟 Project Overview
Navigating early-career job hunting in India often involves sifting through hundreds of repetitive listings, ambiguous eligibility criteria, and foreign postings with irrelevant visa requirements. 

**JobCurrent** solves this with radical transparency:
1. **100% India-Focused**: Aggregates opportunities strictly located in Indian tech hubs (*Bengaluru, Hyderabad, Pune, Mumbai, Delhi/NCR, Gurgaon, Noida, Chennai, etc.*) or India-eligible remote positions with compensation displayed in INR (`₹ LPA` or `₹ /month`).
2. **Deterministic Academic Qualification Matching**: Evaluates concrete constraints—minimum CGPA cutoffs, eligible graduation years (e.g., 2025, 2026 batches), and degree branches—guaranteeing you never waste time applying to roles you do not qualify for.
3. **Automated Multi-Source Pipeline**: Continuously crawls and deduplicates jobs using SHA-256 fingerprints across Jobvetta, Greenhouse, Lever, and official career portals.
4. **Zero-Friction Applications**: Pop-up blocker immune 1-click apply links that route straight to the official employer careers portal.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🇮🇳 **India-Centric Catalog** | Filtered exclusively for Indian tech opportunities, startup hubs, and MNC engineering centers with salaries in INR (`₹`). |
| 🎯 **Academic Eligibility Engine** | Compares your profile against role cutoffs (CGPA, degree branches, graduation year) with clear `Eligible`, `Not Eligible`, or `Needs Info` badges. |
| ⚡ **Multi-Source Connectors** | Modular collectors for **Jobvetta API**, **Greenhouse Direct**, **Lever Direct**, and public company career boards with SHA-256 deduplication. |
| 🔗 **Reliable 1-Click Apply** | External links use native HTML anchor tags (`<a target="_blank">`) ensuring 100% pop-up blocker immunity across all mobile and desktop browsers. |
| 🧠 **Groq AI Extraction** | High-throughput structured parsing via Groq (`llama-3.3-70b-versatile` JSON mode) with instant deterministic regex fallback. |
| 📬 **Daily Email Digest** | Automated morning digest via **Resend API** presenting your top matched jobs with direct application links. |
| 📊 **Admin Telemetry Dashboard** | Real-time observability: active collector statuses, ingestion counts, duplicate tracking, and database telemetry. |
| 🌓 **Light / Dark Theme** | Fluid theme switching powered by Tailwind CSS and persistent user preferences. |

---

## 🏛️ System Architecture

```text
+-----------------------------------------------------------------------------------+
|                              EXTERNAL PERMITTED SOURCES                           |
|      [Jobvetta API]            [Greenhouse Direct API]         [Lever Direct API] |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼ (Scheduled Ingestion Pipeline)
+-----------------------------------------------------------------------------------+
|                        MODULAR CONNECTOR & INGESTION LAYER                        |
|  - BaseConnector abstract interface                                               |
|  - Enforces mandatory title, company, description, and application URLs           |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                       NORMALIZATION & INDIA FILTER ENGINE                         |
|  - Geographical verification: Checks Indian metro terms (BLR, HYD, PUN, NCR, etc.)|
|  - Drops foreign-restricted roles (US-only, Germany, UK, etc.)                    |
|  - Canonical URL cleanup (strips utm_* tracking parameters)                       |
|  - SHA-256 description hashing for cross-source deduplication                     |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                   GROQ AI STRUCTURED EXTRACTION (Fallback-Safe)                   |
|  - Extracts: Minimum CGPA, Eligible Batches, Degree Branches, Skills Matrix       |
|  - High-speed inference via Groq LLaMA 3.3 70B JSON mode                          |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                  DETERMINISTIC ACADEMIC & PREFERENCE MATCH ENGINE                 |
|  - Academic Rules: Strict check on CGPA cutoff, Graduation Batch, and Branch      |
|  - Match Score (0 - 100%): Technical skill overlap, work mode, and role alignment |
+-----------------------------------------------------------------------------------+
                                         │
                     ┌───────────────────┴───────────────────┐
                     ▼                                       ▼
+---------------------------------------+  +----------------------------------------+
|      SUPABASE POSTGRESQL (RLS)        |  |          RESEND EMAIL DIGEST           |
|  - Tables: jobs, profiles, matches    |  |  - Personalized responsive HTML digest |
|  - Applications tracker & saved roles |  |  - Automated morning delivery (IST)    |
+---------------------------------------+  +----------------------------------------+
                     │
                     ▼
+-----------------------------------------------------------------------------------+
|                               REACT + VITE FRONTEND                               |
|  - Public Discovery: City autocomplete (Bengaluru, Pune, NCR...), multi-filters   |
|  - Personalized Dashboard, Academic Profile Matcher, Kanban Application Tracker   |
|  - Admin Telemetry View (`/admin`) for live ingestion diagnostics                 |
+-----------------------------------------------------------------------------------+
```

---

## 📁 Project Directory Structure

```text
job-current/
│
├── frontend/                           # React 18 + Vite Frontend Application
│   ├── public/                         # Favicon, logo, and static assets
│   └── src/
│       ├── components/                 # Reusable UI component library
│       │   ├── common/                 # Button, Badge, Modal, EmptyState, Input
│       │   ├── jobs/                   # JobCard, JobFilterBar, JobSearchBar
│       │   ├── layout/                 # Navbar, Footer, MobileNav
│       │   └── notifications/          # In-app notification bell & dropdown
│       ├── context/                    # AuthContext, ThemeContext
│       ├── data/                       # Verified Indian tech opportunities catalog
│       ├── lib/                        # Supabase client, formatting utilities
│       └── pages/                      # Application route views
│           ├── admin/                  # Admin telemetry & pipeline diagnostics
│           ├── auth/                   # Login, Register, Password Reset
│           ├── dashboard/              # User Dashboard, Profile, Application Tracker
│           └── public/                 # LandingPage, BrowseJobsPage, JobDetailsPage
│
├── backend/                            # FastAPI (Python 3.10+) Backend Application
│   ├── app/
│   │   ├── main.py                     # FastAPI ASGI application & middleware
│   │   ├── config.py                   # Pydantic v2 BaseSettings
│   │   ├── api/v1/                     # REST endpoints: jobs, match, collector, etc.
│   │   ├── connectors/                 # Jobvetta, Greenhouse, Lever connectors
│   │   ├── models/                     # Schemas and database models
│   │   └── services/                   # Normalizer, MatchingEngine, Groq AI, Resend
│   ├── scripts/                        # Ingestion & catalog generator runners
│   │   ├── run_collector.py            # Multi-source job ingestion runner
│   │   ├── run_matcher.py              # Batch eligibility matching script
│   │   ├── run_digest.py               # Daily email digest dispatcher
│   │   └── generate_india_catalog.py   # Curated Indian opportunities generator
│   ├── tests/                          # 20/20 Passing Pytest test suite
│   ├── pyproject.toml                  # Project metadata & test configuration
│   └── requirements.txt                # Pinned dependencies
│
├── docs/                               # System architecture & deployment docs
├── vercel.json                         # Vercel SPA routing & rewrite rules
├── .env.example                        # Template environment configurations
└── README.md                           # Documentation
```

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- **Python**: 3.10 or higher
- **Supabase Account**: (Free tier PostgreSQL database)

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/TanayUmre/JobCurrent.git
cd JobCurrent
```

---

### 2️⃣ Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create `backend/.env`:
```env
ENVIRONMENT=development
PORT=8000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Supabase Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# AI Extraction (Groq Cloud)
GROQ_API_KEY=gsk_your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

# Email Digest (Resend)
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=JobCurrent <jobs@yourdomain.com>
```

Start the FastAPI development server:
```bash
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

### 3️⃣ Frontend Setup (React + Vite)

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

Create `frontend/.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=JobCurrent
VITE_APP_TAGLINE="Stay Current. Stay Career-Ready."
```

Start the Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Testing & Verification

The backend includes a comprehensive automated test suite verifying normalization, deduplication, India eligibility checks, academic matching rules, API endpoints, and connectors.

```bash
# Run backend test suite
pytest backend/tests -v
```
```text
============================= test session starts =============================
backend/tests/test_api.py::test_root_health PASSED                       [  5%]
backend/tests/test_api.py::test_list_jobs PASSED                         [ 10%]
backend/tests/test_api.py::test_get_job_by_id PASSED                     [ 15%]
backend/tests/test_api.py::test_match_evaluation_endpoint PASSED         [ 20%]
backend/tests/test_api.py::test_collector_status_endpoint PASSED         [ 25%]
backend/tests/test_api.py::test_in_app_notifications_endpoints PASSED    [ 30%]
backend/tests/test_api.py::test_admin_stats_endpoint PASSED              [ 35%]
backend/tests/test_connectors.py::test_get_active_connectors_count_and_names PASSED [ 40%]
backend/tests/test_connectors.py::test_jobvetta_connector_fallback_and_normalization PASSED [ 45%]
backend/tests/test_connectors.py::test_himalayas_connector_normalization PASSED [ 50%]
backend/tests/test_connectors.py::test_greenhouse_connector_normalization PASSED [ 55%]
backend/tests/test_connectors.py::test_lever_connector_normalization PASSED [ 60%]
backend/tests/test_matching.py::test_cgpa_cutoff_evaluation PASSED       [ 65%]
backend/tests/test_matching.py::test_graduation_year_evaluation PASSED   [ 70%]
backend/tests/test_matching.py::test_missing_criteria_evaluated_as_unknown PASSED [ 75%]
backend/tests/test_matching.py::test_match_score_calculation PASSED      [ 80%]
backend/tests/test_normalizer.py::test_url_normalization_strips_tracking PASSED [ 85%]
backend/tests/test_normalizer.py::test_description_hashing_consistency PASSED [ 90%]
backend/tests/test_normalizer.py::test_duplicate_filtering PASSED        [ 95%]
backend/tests/test_normalizer.py::test_is_india_eligible PASSED          [100%]
============================= 20 passed in 0.74s ==============================
```

```bash
# Build frontend production bundle
cd frontend
npm run build
```

---

## ⏰ Automation & Cron Jobs

JobCurrent runs daily background workflows to keep listings fresh and dispatch personalized updates:

```bash
# 1. Collect and ingest new opportunities from all active sources
python backend/scripts/run_collector.py

# 2. Extract structured criteria using Groq AI
python backend/scripts/run_extractor.py

# 3. Evaluate match scores against all candidate profiles
python backend/scripts/run_matcher.py

# 4. Dispatch daily email digests to subscribed users
python backend/scripts/run_digest.py
```

---

## 🚢 Deployment

### Frontend (Vercel)
The project includes a ready-to-deploy `vercel.json` configuration handling Single Page Application (SPA) client routing:
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Add the environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL`
4. Click **Deploy**.

### Backend (Render / Railway / Cloud Run)
1. Deploy `backend` as a Python web service.
2. Build command: `pip install -r requirements.txt`.
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
4. Configure environment variables matching `backend/.env`.

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ for students and software professionals across India.  
**JobCurrent** — *Stay Current. Stay Career-Ready.*

</div>
