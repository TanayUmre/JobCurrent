import sys
import os
import asyncio
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.groq_service import GroqService


async def main():
    print("==========================================================")
    print("JobCurrent — FastAPI Python Groq AI Structured Extractor")
    print("==========================================================\n")

    groq = GroqService()

    sample_job = {
        "title": "Graduate Software Engineer (2026 Batch)",
        "description": """
            Join our core payments engineering team in Bengaluru!
            We are hiring enthusiastic engineers from the 2026 or 2027 graduation batch.
            Prerequisites:
            - Minimum CGPA cutoff of 7.5 throughout B.Tech / B.E.
            - Eligible branches: Computer Science, IT, and Electronics.
            - Core stack: React, JavaScript, Node.js, and SQL. Docker is advantageous.
            - Work Mode: Hybrid (3 days onsite in Bengaluru).
            - Compensation: ₹12 LPA to ₹16 LPA.
        """
    }

    print(f"Analyzing Job: \"{sample_job['title']}\"...")
    res = await groq.extract_job_details(sample_job["title"], sample_job["description"])

    print("\n[Structured Criteria Extracted]:")
    print(json.dumps(res.model_dump(), indent=2))
    print("\nExtraction execution finished successfully.")


if __name__ == "__main__":
    asyncio.run(main())
