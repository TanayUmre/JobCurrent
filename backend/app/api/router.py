from fastapi import APIRouter
from app.api.v1.jobs import router as jobs_router
from app.api.v1.matching import router as matching_router
from app.api.v1.collector import router as collector_router
from app.api.v1.extraction import router as extraction_router
from app.api.v1.digest import router as digest_router
from app.api.v1.notifications import router as notifications_router

api_router = APIRouter()
api_router.include_router(jobs_router)
api_router.include_router(matching_router)
api_router.include_router(collector_router)
api_router.include_router(extraction_router)
api_router.include_router(digest_router)
api_router.include_router(notifications_router)
