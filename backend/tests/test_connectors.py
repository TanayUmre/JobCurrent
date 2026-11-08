import pytest
import asyncio
from app.connectors.jobvetta import JobvettaConnector
from app.connectors.himalayas import HimalayasConnector
from app.connectors.arbeitnow import ArbeitnowConnector
from app.connectors.remoteok import RemoteOkConnector
from app.connectors.greenhouse import GreenhouseConnector
from app.connectors.lever import LeverConnector
from app.connectors import get_active_connectors


def test_get_active_connectors_count_and_names():
    connectors = get_active_connectors()
    assert len(connectors) == 6
    names = [c.source_name for c in connectors]
    assert "Jobvetta API" in names
    assert "Himalayas API" in names
    assert "Arbeitnow API" in names
    assert "RemoteOK API" in names
    assert "Greenhouse Direct API" in names
    assert "Lever Direct API" in names


@pytest.mark.asyncio
async def test_jobvetta_connector_fallback_and_normalization():
    connector = JobvettaConnector(config={"api_key": ""})
    raw_jobs = await connector.fetch_raw_jobs()
    assert len(raw_jobs) >= 5

    sample = raw_jobs[0]
    norm = connector.normalize(sample)
    assert norm is not None
    assert norm["company_name"] == "Swiggy"
    assert norm["currency"] == "INR"
    assert "Python" in norm["required_skills"]
    assert norm["work_mode"] in ["remote", "hybrid", "onsite"]
    assert connector.validate(norm) is True


def test_himalayas_connector_normalization():
    connector = HimalayasConnector()
    sample_raw = {
        "title": "Senior Frontend Engineer",
        "companyName": "Automattic",
        "companyLogo": "https://example.com/logo.png",
        "employmentType": "Full Time",
        "minSalary": 110000,
        "maxSalary": 140000,
        "currency": "USD",
        "locationRestrictions": ["Worldwide"],
        "categories": ["React", "JavaScript"],
        "description": "<p>Build modern React interfaces at Automattic.</p>",
        "pubDate": 1794000000,
        "applicationLink": "https://himalayas.app/jobs/senior-frontend-engineer?utm_source=api",
        "guid": "https://himalayas.app/jobs/senior-frontend-engineer"
    }
    norm = connector.normalize(sample_raw)
    assert norm is not None
    assert norm["title"] == "Senior Frontend Engineer"
    assert norm["company_name"] == "Automattic"
    assert norm["work_mode"] == "remote"
    assert norm["job_type"] == "full-time"
    assert norm["salary_min"] == 110000
    assert norm["currency"] == "USD"
    assert "Build modern React interfaces" in norm["description"]
    assert connector.validate(norm) is True


def test_greenhouse_connector_normalization():
    connector = GreenhouseConnector()
    sample_raw = {
        "id": 998877,
        "title": "Software Engineer, Database Systems",
        "absolute_url": "https://job-boards.greenhouse.io/gitlab/jobs/998877",
        "location": {"name": "Remote, Global"},
        "updated_at": "2026-11-06T10:00:00Z",
        "content": "<p>Develop distributed storage engines for GitLab platform.</p>",
        "departments": [{"name": "Engineering"}, {"name": "Database"}],
        "_company_slug": "gitlab"
    }
    norm = connector.normalize(sample_raw)
    assert norm is not None
    assert norm["company_name"] == "GitLab"
    assert norm["source_job_id"] == "gh-998877"
    assert norm["work_mode"] == "remote"
    assert norm["job_type"] == "full-time"
    assert "Engineering" in norm["required_skills"]
    assert connector.validate(norm) is True


def test_lever_connector_normalization():
    connector = LeverConnector()
    sample_raw = {
        "id": "lever-sample-123",
        "text": "Data Engineering Intern",
        "hostedUrl": "https://jobs.lever.co/spotify/lever-sample-123",
        "applyUrl": "https://jobs.lever.co/spotify/lever-sample-123/apply",
        "categories": {
            "commitment": "Internship",
            "department": "Data Science & Analytics",
            "location": "New York, NY",
            "team": "Insights"
        },
        "workplaceType": "hybrid",
        "descriptionPlain": "Analyze music streaming telemetry and build high throughput pipelines.",
        "createdAt": 1792767640000,
        "_company_slug": "spotify"
    }
    norm = connector.normalize(sample_raw)
    assert norm is not None
    assert norm["company_name"] == "Spotify"
    assert norm["job_type"] == "internship"
    assert norm["work_mode"] == "hybrid"
    assert norm["application_url"] == "https://jobs.lever.co/spotify/lever-sample-123/apply"
    assert "Insights" in norm["required_skills"]
    assert connector.validate(norm) is True
