import hashlib
import re
from typing import List, Tuple, Set, Dict, Any
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse


class NormalizerService:
    @staticmethod
    def generate_description_hash(description: str) -> str:
        """
        Generates a 64-character SHA-256 hash of the sanitized description.
        Strips HTML tags, symbols, and whitespace.
        """
        if not description:
            return ""
        cleaned = re.sub(r'<[^>]*>', ' ', description.lower())
        cleaned = re.sub(r'[^a-z0-9]', '', cleaned)
        return hashlib.sha256(cleaned.encode('utf-8')).hexdigest()

    @staticmethod
    def normalize_url(raw_url: str) -> str:
        """
        Removes marketing tracking query parameters (utm_*, ref, source, fbclid, etc.).
        """
        if not raw_url:
            return ""
        try:
            parsed = urlparse(raw_url)
            query_dict = parse_qs(parsed.query)
            
            tracking_params = {
                'utm_source', 'utm_medium', 'utm_campaign', 'utm_term',
                'utm_content', 'ref', 'source', 'fbclid', 'gclid', 'trk'
            }
            cleaned_query = {
                k: v for k, v in query_dict.items() if k.lower() not in tracking_params
            }
            
            new_query = urlencode(cleaned_query, doseq=True)
            cleaned = urlunparse((
                parsed.scheme,
                parsed.netloc.lower(),
                parsed.path.rstrip('/'),
                parsed.params,
                new_query,
                parsed.fragment
            ))
            return cleaned
        except Exception:
            return raw_url.strip()

    @staticmethod
    def normalize_company_name(name: str) -> str:
        if not name:
            return "Hiring Organization"
        cleaned = re.sub(r'\b(Inc\.?|LLC\.?|Ltd\.?|Pvt\.?|Limited|Corporation|Corp\.?)\b', '', name, flags=re.IGNORECASE)
        return re.sub(r'\s+', ' ', cleaned).strip()

    @staticmethod
    def normalize_work_mode(mode_str: str, location_str: str = "") -> str:
        combined = f"{mode_str or ''} {location_str or ''}".lower()
        if any(term in combined for term in ["remote", "anywhere", "work from home", "wfh"]):
            return "remote"
        if any(term in combined for term in ["hybrid", "flexible"]):
            return "hybrid"
        return "onsite"

    @classmethod
    def process_job(cls, raw_job: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalizes all fields of a job dictionary.
        """
        original_url = cls.normalize_url(raw_job.get("original_url", ""))
        application_url = cls.normalize_url(raw_job.get("application_url", "")) or original_url
        desc = raw_job.get("description", "")
        desc_hash = cls.generate_description_hash(desc)
        company = cls.normalize_company_name(raw_job.get("company_name", ""))
        work_mode = cls.normalize_work_mode(raw_job.get("work_mode", ""), raw_job.get("location", ""))
        
        # Deduplicate and clean skills
        raw_skills = raw_job.get("required_skills", []) or []
        cleaned_skills = list(dict.fromkeys([s.strip() for s in raw_skills if s and s.strip()]))

        job_copy = dict(raw_job)
        job_copy.update({
            "company_name": company,
            "original_url": original_url,
            "application_url": application_url,
            "work_mode": work_mode,
            "description_hash": desc_hash,
            "required_skills": cleaned_skills
        })
        return job_copy

    @classmethod
    def filter_duplicates(
        cls, incoming_jobs: List[Dict[str, Any]], existing_hashes: Set[str] = None
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Filters duplicate listings based on the description hash.
        """
        seen = set(existing_hashes or set())
        unique = []
        duplicates = []

        for job in incoming_jobs:
            h = job.get("description_hash")
            if h and h in seen:
                duplicates.append(job)
            else:
                if h:
                    seen.add(h)
                unique.append(job)

        return unique, duplicates
