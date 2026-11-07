from app.models.schemas import JobBase, CandidateProfile, CandidatePreferences
from app.services.matching_engine import MatchingEngine


def test_cgpa_cutoff_evaluation():
    job = JobBase(
        title="Software Intern",
        company_name="Acme Corp",
        description="Software development role",
        source_name="Board",
        original_url="https://example.com",
        application_url="https://example.com",
        minimum_cgpa=8.0
    )
    profile_fail = CandidateProfile(cgpa=7.5)
    profile_pass = CandidateProfile(cgpa=8.5)

    res_fail = MatchingEngine.evaluate_eligibility(job, profile_fail)
    res_pass = MatchingEngine.evaluate_eligibility(job, profile_pass)

    assert res_fail.status == "not_eligible"
    assert res_fail.cgpa_satisfied == "failed"

    assert res_pass.status == "eligible"
    assert res_pass.cgpa_satisfied == "satisfied"


def test_graduation_year_evaluation():
    job = JobBase(
        title="Associate Developer",
        company_name="Acme Corp",
        description="Development role",
        source_name="Board",
        original_url="https://example.com",
        application_url="https://example.com",
        eligible_graduation_years=[2026, 2027]
    )
    profile_eligible = CandidateProfile(graduation_year=2026)
    profile_ineligible = CandidateProfile(graduation_year=2024)

    res1 = MatchingEngine.evaluate_eligibility(job, profile_eligible)
    res2 = MatchingEngine.evaluate_eligibility(job, profile_ineligible)

    assert res1.status == "eligible"
    assert res2.status == "not_eligible"


def test_missing_criteria_evaluated_as_unknown():
    job = JobBase(
        title="Engineer",
        company_name="Acme Corp",
        description="Role description",
        source_name="Board",
        original_url="https://example.com",
        application_url="https://example.com",
        minimum_cgpa=7.5,
        eligible_graduation_years=[2026]
    )
    profile_empty = CandidateProfile(cgpa=None, graduation_year=None)
    res = MatchingEngine.evaluate_eligibility(job, profile_empty)

    assert res.status == "unknown"
    assert res.cgpa_satisfied == "unknown"
    assert res.batch_satisfied == "unknown"


def test_match_score_calculation():
    job = JobBase(
        title="Frontend React Developer",
        company_name="Tech Corp",
        description="Frontend development",
        source_name="Board",
        original_url="https://example.com",
        application_url="https://example.com",
        required_skills=["React", "JavaScript", "HTML/CSS"],
        work_mode="remote"
    )
    profile = CandidateProfile(skills=["React", "JavaScript"])
    prefs = CandidatePreferences(interested_roles=["Frontend Developer"], work_modes=["remote"])

    match_res = MatchingEngine.calculate_match(job, profile, prefs)
    assert match_res.score >= 70
    assert "react" in match_res.matched_skills
