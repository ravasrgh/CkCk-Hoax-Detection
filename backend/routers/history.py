from fastapi import APIRouter, HTTPException

from session_store import get_history, get_history_entry, clear_history

router = APIRouter(tags=["history"])


@router.get("/history")
async def list_history():
    try:
        return get_history()
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/history/{entry_id}")
async def get_entry(entry_id: str):
    entry = get_history_entry(entry_id)
    if entry is None:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


@router.delete("/history")
async def delete_history():
    try:
        clear_history()
        return {"cleared": True}
    except Exception as e:
        return {"status": "error", "message": str(e)}
