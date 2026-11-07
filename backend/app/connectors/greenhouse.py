import re
import datetime
from typing import Dict, Any, List
import httpx
from app.connectors.base import BaseConnector


class GreenhouseConnector(BaseConnector):
    """
    Greenhouse Connector — Direct Company Job Postings.
    Ingests live opportunities directly from companies' public Greenhouse boards
    (e.g., GitLab, Cloudflare, Automattic, etc.).
    """
    def __init__(self, config: Dict[str, Any] = None):
        cfg = {
            "boards": ["gitlab", "cloudflare"],
            "limit_per_board": 25
        }
        if config:
            cfg.update(config)
        super().__init__("Greenhouse Direct API", cfg)

    async def fetch_raw_jobs(self) -> List[Dict[str, Any]]:
        all_raw = []
        boards = self.config.get("boards", ["gitlab", "cloudflare"])
        limit = self.config.get("limit_per_board", 25)

        async with httpx.AsyncClient(timeout=20.0) as client:
            for board in boards:
                try:
                    url = f"https://boards-api.greenhouse.io/v1/boards/{board}/jobs?content=true"
                    resp = await client.get(
                        url,
                        headers={
                            "Accept": "application/json",
                            "User-Agent": "JobCurrent-Discovery/1.0 (+https://jobcurrent.app)"
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        jobs = data.get("jobs", [])
                        for j in jobs[:limit]:
                            j["_company_slug"] = board
                            all_raw.append(j)
                except Exception:
                    # Proceed with remaining boards if one is unreachable
                    continue

        return all_raw

    def normalize(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        if not raw or not raw.get("title") or not raw.get("absolute_url"):
            return None

        # Clean HTML content
        raw_desc = raw.get("content", "")
        clean_desc = re.sub(r'<[^>]*>', ' ', str(raw_desc))
        clean_desc = re.sub(r'&[a-zA-Z]+;', ' ', clean_desc)
        clean_desc = re.sub(r'\s+', ' ', clean_desc).strip()

        location_name = "Remote / Direct"
        if isinstance(raw.get("location"), dict) and raw["location"].get("name"):
            location_name = raw["location"]["name"]

        # Work mode
        loc_lower = location_name.lower()
        title_lower = (raw.get("title") or "").lower()
        if "remote" in loc_lower or "remote" in title_lower:
            work_mode = "remote"
        elif "hybrid" in loc_lower:
            work_mode = "hybrid"
        else:
            work_mode = "onsite"

        # Job type
        if "intern" in title_lower or "trainee" in title_lower:
            job_type = "internship"
        elif "part-time" in title_lower or "part time" in title_lower:
            job_type = "part-time"
        else:
            job_type = "full-time"

        # Company name formatted from slug or explicit metadata
        board_slug = raw.get("_company_slug", "Direct Tech Employer")
        company_name = board_slug.title()
        if board_slug.lower() == "gitlab":
            company_name = "GitLab"
        elif board_slug.lower() == "cloudflare":
            company_name = "Cloudflare"

        # Skills from departments or keywords
        skills = []
        if isinstance(raw.get("departments"), list):
            for d in raw["departments"]:
                if isinstance(d, dict) and d.get("name"):
                    skills.append(d["name"])

        posted_at = raw.get("updated_at") or datetime.datetime.now(datetime.timezone.utc).isoformat()

        return {
            "title": raw.get("title").strip(),
            "company_name": company_name,
            "company_logo": None,
            "description": clean_desc or "Direct company listing on Greenhouse career portal.",
            "source_job_id": f"gh-{raw.get('id')}",
            "original_url": raw.get("absolute_url"),
            "application_url": raw.get("absolute_url"),
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
