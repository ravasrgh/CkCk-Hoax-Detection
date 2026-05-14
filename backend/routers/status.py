import threading

from fastapi import APIRouter

from services.pipeline import is_model_loaded

router = APIRouter(tags=["status"])

_total_requests = 0
_total_ms = 0.0
_lock = threading.Lock()


def increment_stats(ms: float) -> None:
    global _total_requests, _total_ms
    with _lock:
        _total_requests += 1
        _total_ms += ms


@router.get("/status")
async def get_status():
    with _lock:
        total = _total_requests
        avg = round(_total_ms / total, 2) if total > 0 else 0.0

    return {
        "model_loaded": is_model_loaded(),
        "model_size_mb": 247,
        "device": "CPU",
        "backend_url": "localhost:8000",
        "total_analisis_sesi": total,
        "avg_inference_ms": avg,
        "offline": True,
    }
