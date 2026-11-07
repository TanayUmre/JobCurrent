import sys
import os
import asyncio

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.email_service import EmailService


async def main():
    print("==========================================================")
    print("JobCurrent — FastAPI Python Daily Email Digest Test")
    print("==========================================================\n")

    email_svc = EmailService()

    sample_matched_jobs = [
        {
            "title": "Software Engineer Intern (Frontend / React)",
            "company_name": "Razorpay",
            "work_mode": "hybrid",
            "job_type": "internship",
            "stipend": 45000,
            "match_score": 94,
            "eligibility_status": "Eligible",
            "application_url": "https://razorpay.com/jobs"
        },
        {
            "title": "Junior Backend Developer (Go / Node.js)",
            "company_name": "Postman",
            "work_mode": "remote",
            "job_type": "full-time",
            "salary_max": 1800000,
            "match_score": 88,
            "eligibility_status": "Eligible",
            "application_url": "https://www.postman.com/careers"
        }
    ]

    recipient = "candidate.preview@example.com"
    print(f"Generating personalized HTML digest for {recipient}...")

    res = await email_svc.send_daily_digest(
        recipient_email=recipient,
        user_name="Alex Sharma",
        matched_jobs=sample_matched_jobs,
        app_url="https://jobcurrent.app"
    )

    print("\n[Digest Dispatch Result]:")
    print(res.model_dump())
    print("\nEmail digest execution finished.")


if __name__ == "__main__":
    asyncio.run(main())
