from typing import Dict, Any, List
from app.models.schemas import (
    JobBase, 
    CandidateProfile, 
    CandidatePreferences, 
    EligibilityBreakdown, 
    MatchEvaluationResponse
)


class MatchingEngine:
    @staticmethod
    def evaluate_eligibility(job: JobBase, profile: CandidateProfile = None) -> EligibilityBreakdown:
        if not profile:
            return EligibilityBreakdown(
                status="unknown",
                cgpa_satisfied="unknown",
                batch_satisfied="unknown",
                branch_satisfied="unknown",
                reasons=["Academic profile not provided"]
            )

        is_eligible = True
        has_unknown = False
        reasons = []

        cgpa_status = "satisfied"
        batch_status = "satisfied"
        branch_status = "satisfied"

        # 1. CGPA Cutoff
        if job.minimum_cgpa is not None:
            if profile.cgpa is None:
                has_unknown = True
                cgpa_status = "unknown"
                reasons.append(f"Job requires min {job.minimum_cgpa} CGPA (User CGPA not specified)")
            elif float(profile.cgpa) >= float(job.minimum_cgpa):
                cgpa_status = "satisfied"
                reasons.append(f"CGPA requirement met ({profile.cgpa} >= {job.minimum_cgpa})")
            else:
                is_eligible = False
                cgpa_status = "failed"
                reasons.append(f"CGPA cutoff not met ({profile.cgpa} < {job.minimum_cgpa})")

        # 2. Graduation Year
        if job.eligible_graduation_years:
            if not profile.graduation_year:
                has_unknown = True
                batch_status = "unknown"
                reasons.append(f"Eligible batches: {job.eligible_graduation_years} (User batch unknown)")
            elif profile.graduation_year in job.eligible_graduation_years:
                batch_status = "satisfied"
                reasons.append(f"Graduation batch {profile.graduation_year} is eligible")
            else:
                is_eligible = False
                batch_status = "failed"
                reasons.append(f"Batch {profile.graduation_year} is not in eligible batches: {job.eligible_graduation_years}")

        # 3. Branch / Department
        if job.eligible_branches:
            if not profile.branch:
                has_unknown = True
                branch_status = "unknown"
                reasons.append("Specific degree branch required")
            else:
                user_branch_lower = profile.branch.lower()
                matches = any(
                    b.lower() == "all" or b.lower() in user_branch_lower or user_branch_lower in b.lower()
                    for b in job.eligible_branches
                )
                if matches:
                    branch_status = "satisfied"
                    reasons.append(f"Branch {profile.branch} matches eligible criteria")
                else:
                    is_eligible = False
                    branch_status = "failed"
                    reasons.append(f"Eligible branches: {', '.join(job.eligible_branches)}")

        final_status = "eligible"
        if not is_eligible:
            final_status = "not_eligible"
        elif has_unknown:
            final_status = "unknown"

        return EligibilityBreakdown(
            status=final_status,
            cgpa_satisfied=cgpa_status,
            batch_satisfied=batch_status,
            branch_satisfied=branch_status,
            reasons=reasons
        )

    @classmethod
    def calculate_match(
        cls, 
        job: JobBase, 
        profile: CandidateProfile = None, 
        preferences: CandidatePreferences = None
    ) -> MatchEvaluationResponse:
        eligibility = cls.evaluate_eligibility(job, profile)

        user_skills_set = set(
            s.lower().strip() for s in (
                (profile.skills if profile else []) + 
                (preferences.skills if preferences else [])
            ) if s
        )
        job_skills = [s.lower().strip() for s in job.required_skills if s]

        # 1. Skills overlap (up to 45 pts)
        matched_skills = []
        missing_skills = []

        if job_skills:
            for req in job_skills:
                if any(req in u or u in req for u in user_skills_set):
                    matched_skills.append(req)
                else:
                    missing_skills.append(req)
            skill_score = round((len(matched_skills) / len(job_skills)) * 45)
        else:
            skill_score = 30  # Default baseline when job lacks specific tags

        # 2. Role Title match (up to 25 pts)
        role_score = 10
        interested = [r.lower().strip() for r in (preferences.interested_roles if preferences else []) if r]
        if interested and job.title:
            title_lower = job.title.lower()
            if any(role in title_lower for role in interested):
                role_score = 25

        # 3. Work mode compatibility (up to 15 pts)
        mode_score = 5
        preferred_modes = [m.lower() for m in (preferences.work_modes if preferences else [])]
        if preferred_modes and job.work_mode:
            if job.work_mode.lower() in preferred_modes:
                mode_score = 15

        # 4. Eligibility bonus (up to 15 pts)
        elig_score = 5
        if eligibility.status == "eligible":
            elig_score = 15
        elif eligibility.status == "unknown":
            elig_score = 8
        else:
            elig_score = 0

        raw_score = skill_score + role_score + mode_score + elig_score
        final_score = max(10, min(99, raw_score))

        return MatchEvaluationResponse(
            score=final_score,
            eligibility_status=eligibility.status,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            breakdown={
                "skills": f"{skill_score}/45",
                "role_match": f"{role_score}/25",
                "work_mode": f"{mode_score}/15",
                "eligibility": f"{elig_score}/15"
            },
            reasons=eligibility.reasons
        )
