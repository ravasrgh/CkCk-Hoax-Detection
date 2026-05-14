from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

from services.config_manager import read_config, write_config

router = APIRouter(prefix="/inject", tags=["injection"])


class InjectionPayload(BaseModel):
    updates: dict


@router.post("")
async def inject_config(payload: InjectionPayload):
    try:
        timestamp = datetime.now(timezone.utc).isoformat()
        print(f"[INJECT] {timestamp} — {payload.updates}")
        merged = write_config(payload.updates)
        return {
            "status": "injected",
            "timestamp": timestamp,
            "active_config": merged,
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/current")
async def get_current_config():
    try:
        return read_config()
    except Exception as e:
        return {"status": "error", "message": str(e)}
