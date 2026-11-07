from fastapi import APIRouter
from app.models.schemas import ExtractionRequest, ExtractionResponse
from app.services.groq_service import GroqService

router = APIRouter(prefix="/extract", tags=["AI Extraction"])


@router.post("", response_model=ExtractionResponse)
async def extract_criteria(request: ExtractionRequest):
    """
    Extracts structured academic criteria (CGPA cutoff, eligible batches,
    required skills) using Groq JSON mode with deterministic fallback.
    """
    groq = GroqService()
    return await groq.extract_job_details(request.title, request.description)
