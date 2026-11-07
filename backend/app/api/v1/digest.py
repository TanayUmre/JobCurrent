from fastapi import APIRouter
from app.models.schemas import DigestRequest, DigestResponse
from app.services.email_service import EmailService

router = APIRouter(prefix="/digest", tags=["Daily Digest"])


@router.post("/send", response_model=DigestResponse)
async def send_digest(request: DigestRequest):
    """
    Dispatches a branded daily email digest via Resend API.
    """
    service = EmailService()
    return await service.send_daily_digest(
        recipient_email=request.recipient_email,
        user_name=request.user_name,
        matched_jobs=request.jobs,
        app_url=request.app_url
    )
