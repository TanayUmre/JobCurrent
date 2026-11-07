import re
import datetime
from typing import Dict, Any, List
import httpx
from app.connectors.base import BaseConnector


class HimalayasConnector(BaseConnector):
    """
    Himalayas Connector — International Remote Jobs.
    Queries the official Himalayas public API (https://himalayas.app/jobs/api).
    """
    def __init__(self, config: Dict[str, Any] = None):
        cfg = {"endpoint": "https://himalayas.app/jobs/api"}
        if config:
            cfg.update(config)
        super().__init__("Himalayas API", cfg)

    async def fetch_raw_jobs(self) -> List[Dict[str, Any]]:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(
                self.config["endpoint"],
                headers={
                    "Accept": "application/json",
                    "User-Agent": "JobCurrent-Discovery/1.0 (+https://jobcurrent.app)"
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                return data.get("jobs", [])
            raise RuntimeError(f"Himalayas returned status {resp.status_code}")

    def normalize(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        if not raw or not raw.get("title") or not raw.get("companyName"):
            return None

        # Employment type mapping
        emp_type = (raw.get("employmentType") or "Full Time").lower()
        if "intern" in emp_type:
            job_type = "internship"
        elif "part" in emp_type:
            job_type = "part-time"
        else:
            job_type = "full-time"

        # Himalayas jobs are remote by definition
        work_mode = "remote"

        # Clean HTML description
        raw_desc = raw.get("description", "") or raw.get("excerpt", "")
        clean_desc = re.sub(r'<[^>]*>', ' ', str(raw_desc))
        clean_desc = re.sub(r'\s+', ' ', clean_desc).strip()

        # Dates
        pub_epoch = raw.get("pubDate")
        posted_at = (
            datetime.datetime.fromtimestamp(pub_epoch, tz=datetime.timezone.utc).isoformat()
            if pub_epoch
            else datetime.datetime.now(datetime.timezone.utc).isoformat()
        )

        exp_epoch = raw.get("expiryDate")
        deadline = (
            datetime.datetime.fromtimestamp(exp_epoch, tz=datetime.timezone.utc).isoformat()
            if exp_epoch
            else None
        )

        # Location info
        loc_restrictions = raw.get("locationRestrictions") or []
        if loc_restrictions:
            location = f"Remote ({', '.join(loc_restrictions[:2])})"
        else:
            location = "Worldwide Remote"

        # Categories to skills
        skills = raw.get("categories") or []
        clean_skills = [re.sub(r'[-_]', ' ', s).title() for s in skills[:8]]

        app_url = raw.get("applicationLink") or raw.get("guid") or "https://himalayas.app"
        orig_url = raw.get("guid") or app_url

        return {
            "title": raw.get("title").strip(),
            "company_name": raw.get("companyName").strip(),
            "company_logo": raw.get("companyLogo"),
            "description": clean_desc or "Full details available on official Himalayas job page.",
            "source_job_id": raw.get("guid") or f"himalayas-{raw.get('pubDate')}",
            "original_url": orig_url,
            "application_url": app_url,
            "location": location,
            "work_mode": work_mode,
            "job_type": job_type,
            "salary_min": raw.get("minSalary"),
            "salary_max": raw.get("maxSalary"),
            "stipend": None,
            "currency": raw.get("currency") or "USD",
            "paid_status": "paid",
            "required_skills": clean_skills,
            "preferred_skills": [],
            "minimum_cgpa": None,
            "eligible_branches": [],
            "eligible_graduation_years": [],
            "experience_required": ", ".join(raw.get("seniority", [])) if raw.get("seniority") else None,
            "duration": None,
            "application_deadline": deadline,
            "posted_at": posted_at,
            "status": "active",
            "is_demo": False,
        }
