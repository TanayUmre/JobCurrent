from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import JobBase

router = APIRouter(prefix="/jobs", tags=["Jobs"])

# Seed demo jobs repository (also syncs with PostgreSQL)
SAMPLE_JOBS = [
    {
        "id": "job-001",
        "title": "Software Engineer Intern (Frontend / React)",
        "company_name": "Razorpay",
        "company_logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop&crop=faces",
        "description": "Join Razorpay core checkout engineering team building responsive web payments interfaces.",
        "source_name": "Permitted Career Board",
        "source_job_id": "RZP-INT-2026-01",
        "original_url": "https://razorpay.com/jobs",
        "application_url": "https://razorpay.com/jobs",
        "location": "Bengaluru, Karnataka",
        "work_mode": "hybrid",
        "job_type": "internship",
        "salary_min": None,
        "salary_max": None,
        "stipend": 45000,
        "currency": "INR",
        "paid_status": "paid",
        "required_skills": ["React", "JavaScript", "HTML/CSS", "Git", "REST APIs"],
        "preferred_skills": ["TypeScript", "Tailwind CSS"],
        "minimum_cgpa": 7.5,
        "eligible_branches": ["Computer Science", "Information Technology", "Electronics"],
        "eligible_graduation_years": [2026, 2027],
        "experience_required": "College Student",
        "duration": "6 Months",
        "status": "active",
        "is_demo": True,
        "posted_at": "2026-11-05T09:00:00Z"
    },
    {
        "id": "job-002",
        "title": "Junior Backend Developer (Go / Node.js)",
        "company_name": "Postman",
        "company_logo": "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=128&h=128&fit=crop&crop=faces",
        "description": "Scale Postman microservices handling high throughput collaboration workflows.",
        "source_name": "RemoteOK API",
        "source_job_id": "PST-BE-2026-88",
        "original_url": "https://remoteok.com",
        "application_url": "https://www.postman.com/careers",
        "location": "Bengaluru, Karnataka (Remote OK)",
        "work_mode": "remote",
        "job_type": "full-time",
        "salary_min": 1200000,
        "salary_max": 1800000,
        "stipend": None,
        "currency": "INR",
        "paid_status": "paid",
        "required_skills": ["Node.js", "SQL", "REST APIs", "Git", "Docker"],
        "preferred_skills": ["Go", "PostgreSQL", "Kafka"],
        "minimum_cgpa": 7.0,
        "eligible_branches": ["Computer Science", "Information Technology"],
        "eligible_graduation_years": [2025, 2026],
        "experience_required": "0-2 Years",
        "duration": "Permanent",
        "status": "active",
        "is_demo": True,
        "posted_at": "2026-11-06T11:00:00Z"
    }
]


@router.get("", response_model=List[dict])
def list_jobs(
    query: Optional[str] = Query(None, description="Search keyword for role, company, or skills"),
    work_mode: Optional[str] = Query(None, description="remote | hybrid | onsite"),
    job_type: Optional[str] = Query(None, description="internship | full-time | part-time"),
    paid_only: Optional[bool] = Query(False),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """
    Search and filter public job listings without registration.
    """
    results = SAMPLE_JOBS

    if query:
        q = query.lower()
        results = [
            j for j in results 
            if q in j["title"].lower() 
            or q in j["company_name"].lower() 
            or any(q in s.lower() for s in j.get("required_skills", []))
        ]

    if work_mode and work_mode != "all":
        results = [j for j in results if j.get("work_mode") == work_mode]

    if job_type and job_type != "all":
        results = [j for j in results if j.get("job_type") == job_type]

    if paid_only:
        results = [j for j in results if j.get("paid_status") == "paid"]

    start = (page - 1) * limit
    return results[start:start + limit]


@router.get("/{job_id}")
def get_job_by_id(job_id: str):
    """
    Retrieve full details for an individual job or internship.
    """
    for job in SAMPLE_JOBS:
        if job["id"] == job_id:
            return job
    raise HTTPException(status_code=404, detail="Opportunity not found")


@router.get("/sources/list")
async def get_sources():
    """
    List connected permitted job sources and status:
    - Jobvetta (Indian job listings)
    - Himalayas (International remote jobs)
    - Arbeitnow (International jobs)
    - RemoteOK (Remote jobs)
    - Greenhouse (Direct company jobs)
    - Lever (Direct company jobs)
    """
    return [
        {"name": "Jobvetta API", "market": "India", "status": "active", "type": "REST API"},
        {"name": "Himalayas API", "market": "International Remote", "status": "active", "type": "REST API"},
        {"name": "Arbeitnow API", "market": "International", "status": "active", "type": "REST API"},
        {"name": "RemoteOK API", "market": "Global Remote", "status": "active", "type": "REST API"},
        {"name": "Greenhouse Direct API", "market": "Direct Company Postings", "status": "active", "type": "Job Board API"},
        {"name": "Lever Direct API", "market": "Direct Company Postings", "status": "active", "type": "Postings API"}
    ]
