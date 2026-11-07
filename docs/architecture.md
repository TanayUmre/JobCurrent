# JobCurrent — System Architecture & Data Pipeline

> **Tagline**: *"Stay Current. Stay Career-Ready."*

JobCurrent is an AI-assisted job and internship discovery platform that aggregates opportunities from permitted sources, verifies eligibility against candidates' academic credentials and career preferences, and dispatches automated daily email digests.

---

## 🏛️ High-Level System Architecture

```text
+-----------------------------------------------------------------------------------+
|                              EXTERNAL PERMITTED SOURCES                           |
|  [Jobvetta API]   [Himalayas API]   [Arbeitnow API]   [RemoteOK API]              |
|  [Greenhouse Direct API]            [Lever Direct API]                            |
+-----------------------------------------------------------------------------------+
                                        │
                                        ▼ (Scheduled pg_cron at 06:00 AM IST)
+-----------------------------------------------------------------------------------+
|                        MODULAR CONNECTOR & INGESTION LAYER                        |
|  - BaseConnector Interface                                                        |
|  - 6 Active Connectors: Jobvetta, Himalayas, Arbeitnow, RemoteOK, Greenhouse, Lever|
+-----------------------------------------------------------------------------------+
                                        │
                                        ▼ (06:30 AM IST)
+-----------------------------------------------------------------------------------+
|                       NORMALIZATION & DEDUPLICATION ENGINE                        |
|  - Strips tracking params (utm_*, ref, etc.)                                      |
|  - Normalizes company, role, location & compensation                              |
|  - SHA-256 Description Hashing to detect cross-posted duplicates                  |
+-----------------------------------------------------------------------------------+
                                        │
                                        ▼ (07:00 AM IST)
+-----------------------------------------------------------------------------------+
|                   GROQ AI STRUCTURED EXTRACTION (Edge Function)                   |
|  - Model: llama-3.3-70b-versatile (JSON mode)                                     |
|  - Extracts: Minimum CGPA, Eligible Batches, Branches, Skills                     |
|  - Cost optimization: Description Hash caching + Regex Fallback                   |
+-----------------------------------------------------------------------------------+
                                        │
                                        ▼ (07:30 AM IST)
+-----------------------------------------------------------------------------------+
|                  PERSONALIZED QUALIFICATION & MATCHING ENGINE                     |
|  - Deterministic Academic Eligibility: CGPA, Batch, Branch                        |
|  - Status: 'eligible' | 'not_eligible' | 'unknown' (never assumed eligible)       |
|  - Relevance Scoring (0-100%): Skills overlap, roles, mode, CTC                   |
+-----------------------------------------------------------------------------------+
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼ (08:00 AM IST)
+--------------------------------------+  +-----------------------------------------+
|        CENTRALIZED SUPABASE DB       |  |      RESEND DAILY EMAIL DIGEST          |
|  - PostgreSQL with RLS               |  |  - Personalized HTML template           |
|  - Profiles, Preferences, Jobs       |  |  - Top matched eligible opportunities   |
|  - Applications, Saved Jobs, Matches |  |  - Delivery logs & deduplication        |
+--------------------------------------+  +-----------------------------------------+
                    │
                    ▼
+-----------------------------------------------------------------------------------+
|                               REACT + VITE FRONTEND                               |
|  - Public Discovery & Advanced Multi-facet Filtering (No login needed)            |
|  - Personalized Dashboard, Academic Profile, Tracker, and Admin Telemetry         |
+-----------------------------------------------------------------------------------+
```

---

## ⏱️ Daily Scheduled Ingestion Workflow (Asia/Kolkata IST)

| Time (IST) | Component | Action |
|---|---|---|
| **06:00 AM** | `collect-jobs` | Ingests listings from active permitted sources |
| **06:30 AM** | `NormalizerService` | Cleans URLs, generates SHA-256 hashes & deduplicates |
| **07:00 AM** | `extract-ai` | Groq AI extracts structured CGPA, batch & skill requirements |
| **07:30 AM** | `match-engine` | Matches jobs against candidate profiles; computes score (0-100) |
| **08:00 AM** | `send-digest` | Dispatches daily email digests with verified application links |
