# JobCurrent

> **"Stay Current. Stay Career-Ready."**

JobCurrent is an AI-assisted job and internship discovery platform that aggregates opportunities from multiple permitted sources, evaluates eligibility and match scores against users' academic profiles and career preferences, and delivers personalized daily email digests.

---

## 📁 Project Directory Structure

```text
job-current/
│
├── frontend/                           # React + Vite + Tailwind CSS Application
│   ├── public/                         # Static assets (logo.svg, favicon, robots.txt)
│   └── src/                            # Source code (JavaScript ES6+, JSX)
│       ├── assets/                     # Static images, SVG illustrations, brand badges
│       ├── components/                 # Reusable UI component library
│       │   ├── admin/                  # Admin dashboard widgets, metrics, source toggles
│       │   ├── common/                 # Design system primitives (Button, Badge, Modal, Input, Skeleton)
│       │   ├── dashboard/              # User dashboard cards, profile completion, recommendations
│       │   ├── jobs/                   # Job cards, multi-faceted filter bar, search, job details
│       │   ├── layout/                 # Navbar, Footer, PageContainer
│       │   └── tracker/                # Application tracking Kanban board & status updater
│       ├── context/                    # React Contexts (AuthContext, ThemeContext)
│       ├── data/                       # Mock/demo seed data, filter options, domain catalogs
│       ├── hooks/                      # Custom React hooks (useJobs, useSavedJobs, useDebounce)
│       ├── layouts/                    # App layouts (RootLayout, DashboardLayout, AdminLayout)
│       ├── lib/                        # Utility helpers (cn, formatters, Supabase client instance)
│       ├── pages/                      # Application route views
│       │   ├── admin/                  # Admin overview, source health, collection audit logs
│       │   ├── auth/                   # Login, Register, Forgot Password, Email Verification
│       │   ├── dashboard/              # Personalized Dashboard, Profile & Academics, Preferences, Tracker
│       │   └── public/                 # Landing Page, Public Job Discovery, Individual Job Details
│       ├── services/                   # Frontend API services and data fetchers
│       └── styles/                     # Global CSS & Tailwind styling setup
│
├── backend/                            # Supabase, Connectors, AI & Automation Services
│   ├── connectors/                     # Modular job source connector architecture
│   │   ├── base/                       # Base connector interface & abstract class
│   │   └── sources/                    # Concrete connectors (Arbeitnow, RemoteOK, Internshala, LinkedIn, etc.)
│   ├── scripts/                        # Manual collection triggers & seeding utilities
│   ├── services/                       # Core backend business logic
│   │   ├── ai/                         # Groq structured extraction logic & prompts
│   │   ├── email/                      # Resend HTML email templates & delivery logic
│   │   ├── matching/                   # Eligibility checking & match scoring engine
│   │   └── normalization/              # Job deduplication, URL normalization, description hashing
│   └── supabase/                       # Supabase configuration
│       ├── functions/                  # Supabase Edge Functions (Deno / TS or JS)
│       │   ├── collect-jobs/           # Scheduled multi-source job fetcher
│       │   ├── extract-ai/             # Groq AI structured data extraction worker
│       │   ├── match-engine/           # Personalized user-to-job matching worker
│       │   └── send-digest/            # Resend daily digest notification dispatcher
│       ├── migrations/                 # PostgreSQL migrations (Tables, RLS, Triggers, Indexes)
│       └── seeds/                      # Seed data fixtures and default sources
│
├── docs/                               # System architecture, database schema, deployment guides
├── .env.example                        # Root environment variable template
└── README.md                           # Project documentation
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (JavaScript ES6+, JSX), Vite, React Router DOM |
| **Styling** | Tailwind CSS (Minimalist SaaS design inspired by Linear & Notion), Lucide Icons |
| **Backend & DB** | Supabase (PostgreSQL, Row Level Security, Auth, Storage, Edge Functions, Cron) |
| **AI Extraction** | Groq API (Structured JSON extraction) |
| **Email Service** | Resend API (Responsive HTML daily digest templates) |
| **Deployment** | Vercel (Frontend) + Supabase Cloud (Backend) |
