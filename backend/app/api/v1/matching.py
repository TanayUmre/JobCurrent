from fastapi import APIRouter
from app.models.schemas import MatchEvaluationRequest, MatchEvaluationResponse
from app.services.matching_engine import MatchingEngine

router = APIRouter(prefix="/match", tags=["Matching"])


@router.post("/evaluate", response_model=MatchEvaluationResponse)
def evaluate_match(request: MatchEvaluationRequest):
    """
    Evaluates candidate eligibility and computes a match score (0-100)
    against a job's academic criteria and technical requirements.
    """
    return MatchingEngine.calculate_match(
        job=request.job,
        profile=request.profile,
        preferences=request.preferences
    )
