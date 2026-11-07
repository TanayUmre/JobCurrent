import re
import datetime
from typing import Dict, Any, List
import httpx
from app.connectors.base import BaseConnector


class LeverConnector(BaseConnector):
    """
    Lever Connector — Direct Company Job Postings.
    Ingests live opportunities directly from companies' public Lever Postings API
    (e.g., Spotify, Palantir, etc.).
    """
    def __init__(self, config: Dict[str, Any] = None):
        cfg = {
            "companies": ["spotify", "palantir"],
            "limit_per_company": 25
        }
        if config:
            cfg.update(config)
        super().__init__("Lever Direct API", cfg)

    async def fetch_raw_jobs(self) -> List[Dict[str, Any]]:
        all_raw = []
        companies = self.config.get("companies", ["spotify", "palantir"])
        limit = self.config.get("limit_per_company", 25)

        async with httpx.AsyncClient(timeout=20.0) as client:
            for company in companies:
                try:
                    url = f"https://api.lever.co/v0/postings/{company}?mode=json"
                    resp = await client.get(
                        url,
                        headers={
                            "Accept": "application/json",
                            "User-Agent": "JobCurrent-Discovery/1.0 (+https://jobcurrent.app)"
                        }
                    )
                    if resp.status_code == 200:
                        postings = resp.json()
                        for p in postings[:limit]:
                            p["_company_slug"] = company
                            all_raw.append(p)
                except Exception:
                    continue

        return all_raw

    def normalize(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        if not raw or not raw.get("text") or not raw.get("hostedUrl"):
            return None

        # Clean description
        raw_desc = raw.get("descriptionPlain") or raw.get("description") or ""
        clean_desc = re.sub(r'<[^>]*>', ' ', str(raw_desc))
        clean_desc = re.sub(r'\s+', ' ', clean_desc).strip()

        categories = raw.get("categories") or {}
        location_name = categories.get("location") or "Direct Company Location"

        # Workplace / mode
        wp_type = (raw.get("workplaceType") or "").lower()
        if "remote" in wp_type or "remote" in location_name.lower():
            work_mode = "remote"
        elif "hybrid" in wp_type or "hybrid" in location_name.lower():
            work_mode = "hybrid"
        else:
            work_mode = "onsite"

        # Job type
        title_lower = (raw.get("text") or "").lower()
        commitment = (categories.get("commitment") or "").lower()
        if "intern" in title_lower or "intern" in commitment:
            job_type = "internship"
        elif "part" in commitment:
            job_type = "part-time"
        else:
            job_type = "full-time"

        # Company name
        slug = raw.get("_company_slug", "Direct Tech Employer")
        company_name = "Spotify" if slug == "spotify" else ("Palantir" if slug == "palantir" else slug.title())

        # Skills from categories
        skills = []
        if categories.get("department"):
            skills.append(categories["department"])
        if categories.get("team"):
            skills.append(categories["team"])

        # Timestamp
        created_at_ms = raw.get("createdAt")
        if created_at_ms:
            posted_at = datetime.datetime.fromtimestamp(created_at_ms / 1000, tz=datetime.timezone.utc).isoformat()
        else:
            posted_at = datetime.datetime.now(datetime.timezone.utc).isoformat()

        app_url = raw.get("applyUrl") or raw.get("hostedUrl")

        return {
            "title": raw.get("text").strip(),
            "company_name": company_name,
            "company_logo": None,
            "description": clean_desc or "Direct company listing on Lever career portal.",
            "source_job_id": f"lever-{raw.get('id')}",
            "original_url": raw.get("hostedUrl"),
            "application_url": app_url,
            "location": location_name,
            "work_mode": work_mode,
            "job_type": job_type,
            "salary_min": None,
            "salary_max": None,
            "stipend": None,
            "currency": "USD",
            "paid_status": "paid",
            "required_skills": skills[:6],
            "preferred_skills": [],
            "minimum_cgpa": None,
            "eligible_branches": [],
            "eligible_graduation_years": [],
            "experience_required": None,
            "duration": None,
            "application_deadline": None,
            "posted_at": posted_at,
            "status": "active",
            "is_demo": False,
        }
