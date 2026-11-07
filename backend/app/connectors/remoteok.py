import re
import datetime
from typing import Dict, Any, List
import httpx
from app.connectors.base import BaseConnector


class RemoteOkConnector(BaseConnector):
    def __init__(self, config: Dict[str, Any] = None):
        cfg = {"endpoint": "https://remoteok.com/api"}
        if config:
            cfg.update(config)
        super().__init__("RemoteOK API", cfg)

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
                if isinstance(data, list):
                    # Skip the first disclaimer element if present
                    return [item for item in data if isinstance(item, dict) and item.get("id") and item.get("position")]
                return []
            raise RuntimeError(f"RemoteOK returned status {resp.status_code}")

    def normalize(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        if not raw or not raw.get("id") or not raw.get("position"):
            return None

        pos = raw.get("position", "").strip()
        job_type = "full-time"
        if "intern" in pos.lower() or any("intern" in t.lower() for t in raw.get("tags", [])):
            job_type = "internship"

        raw_desc = raw.get("description", "")
        clean_desc = re.sub(r'<[^>]*>', ' ', raw_desc)
        clean_desc = re.sub(r'\s+', ' ', clean_desc).strip()

        date_str = raw.get("date")
        posted_at = (
            date_str if date_str 
            else datetime.datetime.now(datetime.timezone.utc).isoformat()
        )

        job_id = str(raw.get("id"))
        orig_url = raw.get("url") or f"https://remoteok.com/remote-jobs/{job_id}"
        app_url = raw.get("apply_url") or orig_url

        sal_min = None
        sal_max = None
        if raw.get("salary_min"):
            try:
                sal_min = float(raw["salary_min"])
            except (ValueError, TypeError):
                pass
        if raw.get("salary_max"):
            try:
                sal_max = float(raw["salary_max"])
            except (ValueError, TypeError):
                pass

        return {
            "title": pos,
            "company_name": (raw.get("company") or "Remote Tech Co").strip(),
            "company_logo": raw.get("company_logo"),
            "description": clean_desc or "Full details available on official career page.",
            "source_job_id": job_id,
            "original_url": orig_url,
            "application_url": app_url,
            "location": (raw.get("location") or "Worldwide (Remote)").strip(),
            "work_mode": "remote",
            "job_type": job_type,
            "salary_min": sal_min,
            "salary_max": sal_max,
            "stipend": None,
            "currency": "USD",
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
