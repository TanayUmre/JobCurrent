# JobCurrent — Connector Architecture & Compliance Guide

JobCurrent follows a strict compliance and terms-of-service adherence framework, exclusively integrating verified, free, and open job sources without requiring expensive enterprise subscriptions or violating third-party platform terms.

---

## 🛡️ Core Rules & Compliance Guarantees

1. **No Bot Bypassing**: We never bypass CAPTCHAs, bot shields, or platform rate limits.
2. **Authentic Links**: The platform preserves authentic, direct application URLs. No affiliate masking, hidden redirects, or tracking manipulation.
3. **No Fabricated Data**: Unspecified or missing requirements (such as CGPA, stipend, or batch) remain `NULL` or marked `unknown`.
4. **Structured Deduplication**: Normalized descriptions are hashed with SHA-256 to ensure zero duplicate postings across multiple aggregators.

---

## 🔌 6 Active & Verified Job Discovery Connectors

### 1. Jobvetta API Connector (`jobvetta.py`)
- **Market**: Indian Job Listings & Internships (Bengaluru, Hyderabad, Pune, Mumbai, Delhi/NCR, Chennai)
- **Integration**: REST API (`https://api.jobvetta.com/v1/jobs/search`)
- **Authentication**: Optional Bearer API Key (`JOBVETTA_API_KEY`). Includes native fallback for curated Indian market opportunities when running without credentials.
- **Data Extracted**: Title, Company, Location, Work Mode (Remote/Hybrid/Onsite), CGPA cutoffs, Graduation Years, INR Stipend/Salary, Direct Application Link.
- **Status**: Verified active and operational.

### 2. Himalayas API Connector (`himalayas.py`)
- **Market**: International Remote Jobs & Global Distributed Teams
- **Integration**: Official Public JSON API (`https://himalayas.app/jobs/api`)
- **Rate Limit**: Polite client headers with standard backoff
- **Data Extracted**: Title, Company, Company Logo, USD/EUR Salaries, Location Restrictions, Skill Categories, Expiry/Deadlines, Direct Application Links.
- **Status**: Verified active and operational.

### 3. Arbeitnow API Connector (`arbeitnow.py`)
- **Market**: International & European Tech Opportunities
- **Integration**: Public Developer API (`https://www.arbeitnow.com/api/job-board-api`)
- **Rate Limit**: 1.5 seconds between requests
- **Data Extracted**: Job Title, Company, Work Mode, Tags/Skills, Direct Application URLs.
- **Status**: Verified active and operational.

### 4. RemoteOK API Connector (`remoteok.py`)
- **Market**: Global Remote Tech Positions & Engineering
- **Integration**: Open Remote Job API (`https://remoteok.com/api`)
- **Rate Limit**: 2.0 seconds between requests
- **Data Extracted**: Title, Company, Remote Work Mode, Tags/Skills, Salary Bands, Direct Application URLs.
- **Status**: Verified active and operational.

### 5. Greenhouse Direct API Connector (`greenhouse.py`)
- **Market**: Direct Company Job Postings (Primary Employer Source)
- **Integration**: Public Greenhouse Job Board API (`https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs?content=true`)
- **Configured Boards**: Leading tech employers (GitLab, Cloudflare, Automattic, etc.)
- **Data Extracted**: Official Role Title, Direct ATS Application URL, Office/Remote Location, Department, Full Job Content.
- **Status**: Verified active and operational.

### 6. Lever Direct API Connector (`lever.py`)
- **Market**: Direct Company Job Postings (Primary Employer Source)
- **Integration**: Public Lever Postings API (`https://api.lever.co/v0/postings/{company}?mode=json`)
- **Configured Companies**: Leading tech employers (Spotify, Palantir, Viome, etc.)
- **Data Extracted**: Official Role Title, Direct Lever Apply URL, Workplace Type, Department/Team, Full Job Content.
- **Status**: Verified active and operational.
