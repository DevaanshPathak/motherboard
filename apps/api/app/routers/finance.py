"""Finance router — GOBITSNBYTES FOUNDATION Finance API."""

from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter(prefix="/api/finance", tags=["finance"])


@router.get("/health")
async def finance_health() -> dict[str, str]:
    return {"status": "ok", "service": "finance"}


@router.get("/info")
async def finance_info() -> dict:
    return {
        "name": "GOBITSNBYTES FOUNDATION Finance API",
        "version": "0.1.0",
        "description": (
            "Internal finance operations module for the bits&bytes network. "
            "Handles budgeting, expense tracking, reimbursements, and "
            "financial reporting across all city forks."
        ),
        "status": "coming_soon",
        "organization": "GOBITSNBYTES FOUNDATION",
        "contact": "finance@gobitsnbytes.org",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
