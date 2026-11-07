from abc import ABC, abstractmethod
from typing import Dict, Any, List


class BaseConnector(ABC):
    def __init__(self, source_name: str, config: Dict[str, Any] = None):
        self.source_name = source_name
        self.config = config or {}

    @abstractmethod
    async def fetch_raw_jobs(self) -> List[Dict[str, Any]]:
        """Fetch raw listings from the external permitted source."""
        pass

    @abstractmethod
    def normalize(self, raw_job: Dict[str, Any]) -> Dict[str, Any]:
        """Convert a raw job record into canonical JobCurrent dictionary format."""
        pass

    def validate(self, job: Dict[str, Any]) -> bool:
        if not job:
            return False
        required_fields = ["title", "company_name", "description", "original_url", "application_url"]
        return all(job.get(f) and str(job.get(f)).strip() for f in required_fields)

    async def execute(self) -> Dict[str, Any]:
        stats = {
            "source_name": self.source_name,
            "status": "success",
            "jobs_found": 0,
            "jobs_normalized": 0,
            "jobs_failed": 0,
            "errors": [],
            "jobs": []
        }

        try:
            raw_jobs = await self.fetch_raw_jobs()
            stats["jobs_found"] = len(raw_jobs) if isinstance(raw_jobs, list) else 0

            for raw in raw_jobs:
                try:
                    norm = self.normalize(raw)
                    if norm and self.validate(norm):
                        norm["source_name"] = self.source_name
                        stats["jobs"].append(norm)
                        stats["jobs_normalized"] += 1
                    else:
                        stats["jobs_failed"] += 1
                except Exception as norm_err:
                    stats["jobs_failed"] += 1
                    stats["errors"].append(str(norm_err))

        except Exception as fetch_err:
            stats["status"] = "failed"
            stats["errors"].append(str(fetch_err))

        return stats
