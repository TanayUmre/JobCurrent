from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.router import api_router

app = FastAPI(
    title="JobCurrent API",
    description="AI-Assisted Job & Internship Discovery Platform — Stay Current. Stay Career-Ready.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://jobcurrent.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Health"])
def root():
    return {
        "product": "JobCurrent",
        "tagline": "Stay Current. Stay Career-Ready.",
        "status": "healthy",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_v1": settings.API_V1_PREFIX
    }
