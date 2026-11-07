from app.main import root
from app.api.v1.jobs import list_jobs, get_job_by_id
from app.api.v1.matching import evaluate_match
from app.api.v1.collector import get_collector_status
from app.models.schemas import MatchEvaluationRequest, JobBase, CandidateProfile


def test_root_health():
    res = root()
    assert res["product"] == "JobCurrent"
    assert res["tagline"] == "Stay Current. Stay Career-Ready."
    assert res["status"] == "healthy"


def test_list_jobs():
    jobs = list_jobs(query="React", work_mode=None, job_type=None, paid_only=False, page=1, limit=10)
    assert isinstance(jobs, list)
    assert len(jobs) > 0
    assert "React" in jobs[0]["title"]


def test_get_job_by_id():
    job = get_job_by_id("job-001")
    assert job["id"] == "job-001"
    assert "Razorpay" in job["company_name"]


def test_match_evaluation_endpoint():
    req = MatchEvaluationRequest(
        job=JobBase(
            title="Software Engineer Intern",
            company_name="Razorpay",
            description="React intern role",
            source_name="Board",
            original_url="https://example.com",
            application_url="https://example.com",
            required_skills=["React", "JavaScript"],
            minimum_cgpa=7.5
        ),
        profile=CandidateProfile(
            full_name="Aman",
            cgpa=8.0,
            skills=["React", "JavaScript"]
        )
    )
    res = evaluate_match(req)
    assert res.eligibility_status == "eligible"
    assert res.score >= 70


def test_collector_status_endpoint():
    res = get_collector_status()
    assert res["status"] == "operational"
    assert len(res["active_connectors"]) >= 2
