from datetime import datetime
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field


# ==========================================
# Job Schemas
# ==========================================
class JobBase(BaseModel):
    title: str
    company_name: str
    company_logo: Optional[str] = None
    description: str
    source_name: str
    source_job_id: Optional[str] = None
    original_url: str
    application_url: str
    location: Optional[str] = "Remote"
    work_mode: Literal["remote", "hybrid", "onsite"] = "onsite"
    job_type: Literal["internship", "full-time", "part-time"] = "full-time"
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    stipend: Optional[float] = None
    currency: str = "INR"
    paid_status: Literal["paid", "unpaid"] = "paid"
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    minimum_cgpa: Optional[float] = None
    eligible_branches: List[str] = Field(default_factory=list)
    eligible_graduation_years: List[int] = Field(default_factory=list)
    experience_required: Optional[str] = None
    duration: Optional[str] = None
    application_deadline: Optional[datetime] = None
    status: Literal["active", "expired", "closed"] = "active"
    is_demo: bool = False


class JobCreate(JobBase):
    description_hash: Optional[str] = None


class Job(JobBase):
    id: str
    posted_at: datetime
    description_hash: Optional[str] = None
    extraction_status: str = "pending"
    created_at: Optional[datetime] = None


# ==========================================
# Candidate & Qualification Schemas
# ==========================================
class CandidateProfile(BaseModel):
    full_name: Optional[str] = "Candidate"
    college: Optional[str] = None
    degree: Optional[str] = "B.Tech"
    branch: Optional[str] = None
    current_year: Optional[int] = 4
    cgpa: Optional[float] = None
    graduation_year: Optional[int] = None
    skills: List[str] = Field(default_factory=list)


class CandidatePreferences(BaseModel):
    interested_roles: List[str] = Field(default_factory=list)
    preferred_domains: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    preferred_locations: List[str] = Field(default_factory=list)
    work_modes: List[str] = Field(default_factory=lambda: ["remote", "hybrid", "onsite"])
    job_types: List[str] = Field(default_factory=lambda: ["internship", "full-time"])
    minimum_salary: Optional[float] = 0
    minimum_stipend: Optional[float] = 0
    paid_only: bool = False
    include_unknown_eligibility: bool = True


# ==========================================
# Matching Schemas
# ==========================================
class MatchEvaluationRequest(BaseModel):
    job: JobBase
    profile: Optional[CandidateProfile] = None
    preferences: Optional[CandidatePreferences] = None


class EligibilityBreakdown(BaseModel):
    status: Literal["eligible", "not_eligible", "unknown"]
    cgpa_satisfied: Literal["satisfied", "failed", "unknown"]
    batch_satisfied: Literal["satisfied", "failed", "unknown"]
    branch_satisfied: Literal["satisfied", "failed", "unknown"]
    reasons: List[str] = Field(default_factory=list)


class MatchEvaluationResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    eligibility_status: Literal["eligible", "not_eligible", "unknown"]
    matched_skills: List[str]
    missing_skills: List[str]
    breakdown: Dict[str, str]
    reasons: List[str]


# ==========================================
# Collector Schemas
# ==========================================
class CollectorRunResponse(BaseModel):
    success: bool
    sources_executed: int
    jobs_found: int
    jobs_normalized: int
    duplicates_removed: int
    sample_jobs: List[Dict[str, Any]] = Field(default_factory=list)


# ==========================================
# AI Extraction Schemas
# ==========================================
class ExtractionRequest(BaseModel):
    title: str
    description: str


class ExtractionResponse(BaseModel):
    required_skills: List[str]
    minimum_cgpa: Optional[float]
    eligible_graduation_years: List[int]
    eligible_branches: List[str]
    work_mode: str
    concise_summary: Optional[str] = None
    extraction_method: str


# ==========================================
# In-App Notification Schemas
# ==========================================
class InAppNotification(BaseModel):
    id: str
    user_id: Optional[str] = None
    title: str
    message: str
    type: Literal["match", "deadline", "application", "system"] = "match"
    job_id: Optional[str] = None
    data: Optional[Dict[str, Any]] = Field(default_factory=dict)
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


class NotificationListResponse(BaseModel):
    notifications: List[InAppNotification]
    unread_count: int


# ==========================================
# Email Digest Schemas
# ==========================================
class DigestRequest(BaseModel):
    recipient_email: str
    user_name: str
    jobs: List[Dict[str, Any]]
    app_url: str = "https://jobcurrent.app"


class DigestResponse(BaseModel):
    success: bool
    recipient: str
    jobs_count: int
    message_id: Optional[str] = None
    mocked: bool = False
    error: Optional[str] = None
