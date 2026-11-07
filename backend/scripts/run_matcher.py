import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.schemas import JobBase, CandidateProfile, CandidatePreferences
from app.services.matching_engine import MatchingEngine


def main():
    print("==========================================================")
    print("JobCurrent — FastAPI Python Candidate Matching Engine Test")
    print("==========================================================\n")

    profile = CandidateProfile(
        full_name="Aman Verma",
        college="IIIT Hyderabad",
        degree="B.Tech",
        branch="Computer Science",
        cgpa=8.2,
        graduation_year=2026,
        skills=["React", "JavaScript", "Node.js", "SQL", "Git"]
    )

    preferences = CandidatePreferences(
        interested_roles=["Software Engineer", "Frontend Developer"],
        work_modes=["remote", "hybrid"],
        job_types=["full-time", "internship"]
    )

    sample_jobs = [
        JobBase(
            title="Frontend Engineer (2026)",
            company_name="FinTech Prime",
            description="Frontend role",
            source_name="Board",
            original_url="https://example.com",
            application_url="https://example.com",
            minimum_cgpa=7.5,
            eligible_graduation_years=[2026, 2027],
            eligible_branches=["Computer Science", "Information Technology"],
            work_mode="hybrid",
            required_skills=["React", "JavaScript", "Git"]
        ),
        JobBase(
            title="Data Scientist (Ph.D / Masters)",
            company_name="BioData Labs",
            description="Bio data role",
            source_name="Board",
            original_url="https://example.com",
            application_url="https://example.com",
            minimum_cgpa=8.5,  # Aman has 8.2 -> NOT_ELIGIBLE
            eligible_graduation_years=[2024, 2025],  # Aman is 2026 -> NOT_ELIGIBLE
            eligible_branches=["Statistics", "Bioinformatics"],
            work_mode="onsite",
            required_skills=["PyTorch", "R", "Bioinformatics"]
        ),
        JobBase(
            title="Full Stack Developer",
            company_name="CloudScale Systems",
            description="Full stack role",
            source_name="Board",
            original_url="https://example.com",
            application_url="https://example.com",
            minimum_cgpa=None,
            eligible_graduation_years=[],
            eligible_branches=[],
            work_mode="remote",
            required_skills=["Node.js", "SQL", "AWS"]
        )
    ]

    for job in sample_jobs:
        print("----------------------------------------------------------")
        print(f"Role: \"{job.title}\" at {job.company_name}")
        res = MatchingEngine.calculate_match(job, profile, preferences)
        print(f"-> Match Score:        {res.score}%")
        print(f"-> Eligibility Status: {res.eligibility_status.upper()}")
        print(f"-> Matched Skills:     {res.matched_skills}")
        print(f"-> Missing Skills:     {res.missing_skills}")
        print("-> Evaluation Reasons:")
        for r in res.reasons:
            print(f"   * {r}")
        print()

    print("==========================================================")
    print("Matching Engine verification completed.")


if __name__ == "__main__":
    main()
