from fastapi import APIRouter

from session_store import get_history, clear_history

router = APIRouter(tags=["history"])


@router.get("/history")
async def list_history():
    try:
        return get_history()
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.delete("/history")
async def delete_history():
    try:
        clear_history()
        return {"cleared": True}
    except Exception as e:
        return {"status": "error", "message": str(e)}
