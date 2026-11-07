import re
import datetime
from typing import Dict, Any, List
import httpx
from app.connectors.base import BaseConnector


class ArbeitnowConnector(BaseConnector):
    def __init__(self, config: Dict[str, Any] = None):
        cfg = {"endpoint": "https://www.arbeitnow.com/api/job-board-api"}
        if config:
            cfg.update(config)
        super().__init__("Arbeitnow API", cfg)

    async def fetch_raw_jobs(self) -> List[Dict[str, Any]]:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(
                self.config["endpoint"],
                headers={
                    "Accept": "application/json",
                    "User-Agent": "JobCurrent-Career-Engine/1.0 (+https://jobcurrent.app)"
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                return data.get("data", [])
            raise RuntimeError(f"Arbeitnow returned status {resp.status_code}")

    def normalize(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        if not raw or not raw.get("slug"):
            return None

        work_mode = "remote" if raw.get("remote") else "onsite"
        raw_types = [t.lower() for t in raw.get("job_types", [])]

        job_type = "full-time"
        if any("intern" in t or "trainee" in t for t in raw_types):
            job_type = "internship"
        elif any("part-time" in t or "part time" in t for t in raw_types):
            job_type = "part-time"

        raw_desc = raw.get("description", "")
        clean_desc = re.sub(r'<[^>]*>', ' ', raw_desc)
        clean_desc = re.sub(r'\s+', ' ', clean_desc).strip()

        created_epoch = raw.get("created_at")
        posted_at = (
            datetime.datetime.fromtimestamp(created_epoch, tz=datetime.timezone.utc).isoformat()
            if created_epoch
            else datetime.datetime.now(datetime.timezone.utc).isoformat()
        )

        return {
            "title": (raw.get("title") or "Software Opportunity").strip(),
            "company_name": (raw.get("company_name") or "Verified Employer").strip(),
            "company_logo": None,
            "description": clean_desc or "Full details available on official career page.",
            "source_job_id": raw.get("slug"),
            "original_url": raw.get("url"),
            "application_url": raw.get("url"),
            "location": (raw.get("location") or ("Remote" if raw.get("remote") else "Europe")).strip(),
            "work_mode": work_mode,
            "job_type": job_type,
            "salary_min": None,
            "salary_max": None,
            "stipend": None,
            "currency": "EUR",
            "paid_status": "paid",
            "required_skills": raw.get("tags", [])[:8],
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
