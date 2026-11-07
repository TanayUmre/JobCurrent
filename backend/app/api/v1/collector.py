from fastapi import APIRouter
from app.connectors import get_active_connectors
from app.services.normalizer import NormalizerService
from app.models.schemas import CollectorRunResponse

router = APIRouter(prefix="/collector", tags=["Collector"])


@router.post("/run", response_model=CollectorRunResponse)
async def trigger_collection():
    """
    Manually or automatically triggers job collection across active permitted APIs,
    normalizes payloads, removes tracking params, and deduplicates using SHA-256 hashes.
    """
    connectors = get_active_connectors()
    all_raw_jobs = []

    for connector in connectors:
        results = await connector.execute()
        all_raw_jobs.extend(results.get("jobs", []))

    # Normalize jobs
    normalized_jobs = [NormalizerService.process_job(j) for j in all_raw_jobs]

    # Deduplicate
    unique, duplicates = NormalizerService.filter_duplicates(normalized_jobs)

    sample = unique[:3] if unique else []

    return CollectorRunResponse(
        success=True,
        sources_executed=len(connectors),
        jobs_found=len(all_raw_jobs),
        jobs_normalized=len(normalized_jobs),
        duplicates_removed=len(duplicates),
        sample_jobs=sample
    )


@router.get("/status")
def get_collector_status():
    """
    Returns telemetry and health status of all registered source connectors.
    """
    connectors = get_active_connectors()
    return {
        "status": "operational",
        "active_connectors": [c.source_name for c in connectors],
        "cron_schedule": {
            "ingestion": "06:00 AM IST",
            "deduplication": "06:30 AM IST",
            "ai_extraction": "07:00 AM IST",
            "matching": "07:30 AM IST",
            "email_digest": "08:00 AM IST"
        }
    }
