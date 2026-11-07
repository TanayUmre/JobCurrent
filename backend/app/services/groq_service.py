import re
import json
import httpx
from typing import Dict, Any, Optional
from app.config import settings
from app.models.schemas import ExtractionResponse


class GroqService:
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.GROQ_API_KEY
        self.model = model or settings.GROQ_MODEL
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"

    @staticmethod
    def extract_deterministically(description: str) -> Dict[str, Any]:
        """
        Deterministic regex fallback when Groq API key is not configured or offline.
        """
        if not description:
            return {
                "required_skills": [],
                "minimum_cgpa": None,
                "eligible_graduation_years": [],
                "eligible_branches": [],
                "work_mode": "onsite"
            }

        text = description.lower()
        extracted: Dict[str, Any] = {
            "required_skills": [],
            "minimum_cgpa": None,
            "eligible_graduation_years": [],
            "eligible_branches": [],
            "work_mode": "onsite"
        }

        # CGPA extraction
        cgpa_match = re.search(r'(?:minimum|min|at least|cut-off|cutoff)?\s*([6-9]\.[0-9]+|[6-9])\s*(?:cgpa|gpa)', text)
        if cgpa_match:
            try:
                val = float(cgpa_match.group(1))
                if 5.0 <= val <= 10.0:
                    extracted["minimum_cgpa"] = val
            except ValueError:
                pass

        # Graduation Batches (e.g. 2025, 2026, 2027)
        batch_matches = re.findall(r'\b(202[4-9])\s*(?:batch|graduates?|passouts?)?\b', text)
        if batch_matches:
            extracted["eligible_graduation_years"] = sorted(list(set(int(y) for y in batch_matches)))

        # Common Tech Skills
        known_skills = [
            'React', 'JavaScript', 'Python', 'Java', 'Node.js', 'SQL',
            'Docker', 'AWS', 'Go', 'C++', 'Git', 'Kubernetes', 'TypeScript'
        ]
        for skill in known_skills:
            escaped = re.escape(skill)
            if re.search(rf'(?:\b|(?<=\s)){escaped}(?:\b|(?=\s))', description, re.IGNORECASE):
                extracted["required_skills"].append(skill)

        # Common Branches
        if any(term in text for term in ['computer science', 'cse', 'information technology']):
            extracted["eligible_branches"].extend(['Computer Science', 'Information Technology'])
        if any(term in text for term in ['electronics', 'ece']):
            extracted["eligible_branches"].append('Electronics')

        # Work Mode
        if any(term in text for term in ['remote', 'work from home']):
            extracted["work_mode"] = "remote"
        elif 'hybrid' in text:
            extracted["work_mode"] = "hybrid"

        return extracted

    async def extract_job_details(self, title: str, description: str) -> ExtractionResponse:
        """
        Extracts structured criteria using Groq JSON mode with fallback.
        """
        if (
            not self.api_key 
            or "placeholder" in self.api_key 
            or "your" in self.api_key.lower()
            or self.api_key.startswith("gsk_your")
        ):
            fallback = self.extract_deterministically(description)
            return ExtractionResponse(
                required_skills=fallback["required_skills"],
                minimum_cgpa=fallback["minimum_cgpa"],
                eligible_graduation_years=fallback["eligible_graduation_years"],
                eligible_branches=fallback["eligible_branches"],
                work_mode=fallback["work_mode"],
                concise_summary=f"Role: {title}",
                extraction_method="deterministic_fallback"
            )

        system_prompt = (
            "You are an expert AI parser for JobCurrent. "
            "Extract structured academic criteria and requirements from this job posting into strict JSON. "
            "Only extract explicit facts. Do not fabricate. If unstated, use null or empty array.\n\n"
            "Return JSON matching:\n"
            "{\n"
            '  "required_skills": string[],\n'
            '  "minimum_cgpa": number | null,\n'
            '  "eligible_graduation_years": number[],\n'
            '  "eligible_branches": string[],\n'
            '  "work_mode": "remote" | "hybrid" | "onsite",\n'
            '  "concise_summary": string\n'
            "}"
        )

        user_prompt = f"Job Title: {title}\nDescription:\n{description[:2500]}"

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(
                    self.api_url,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        "response_format": {"type": "json_object"},
                        "temperature": 0.1
                    }
                )

                if resp.status_code == 200:
                    data = resp.json()
                    content = data["choices"][0]["message"]["content"]
                    parsed = json.loads(content)
                    return ExtractionResponse(
                        required_skills=parsed.get("required_skills", []),
                        minimum_cgpa=parsed.get("minimum_cgpa"),
                        eligible_graduation_years=parsed.get("eligible_graduation_years", []),
                        eligible_branches=parsed.get("eligible_branches", []),
                        work_mode=parsed.get("work_mode", "onsite"),
                        concise_summary=parsed.get("concise_summary"),
                        extraction_method="groq_ai"
                    )
        except Exception:
            pass

        fallback = self.extract_deterministically(description)
        return ExtractionResponse(
            required_skills=fallback["required_skills"],
            minimum_cgpa=fallback["minimum_cgpa"],
            eligible_graduation_years=fallback["eligible_graduation_years"],
            eligible_branches=fallback["eligible_branches"],
            work_mode=fallback["work_mode"],
            concise_summary=f"Role: {title}",
            extraction_method="deterministic_fallback"
        )
