import threading
import uuid
from datetime import datetime, timezone

_history: list[dict] = []
_full_results: dict[str, dict] = {}
_lock = threading.Lock()
MAX_ENTRIES = 50
HISTORY_LIMIT = 30


def add_to_history(input_preview: str, input_type: str, result: dict) -> None:
    entry_id = str(uuid.uuid4())
    entry = {
        "id": entry_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "input_preview": input_preview[:80],
        "input_type": input_type,
        "status": result.get("status", "NETRAL"),
        "confidence_hoax": result.get("confidence_hoax", 0.0),
        "penjelasan": result.get("penjelasan", ""),
        "pola_terdeteksi": result.get("pola_terdeteksi", []),
    }
    with _lock:
        _history.append(entry)
        _full_results[entry_id] = result
        if len(_history) > MAX_ENTRIES:
            evicted = _history.pop(0)
            _full_results.pop(evicted["id"], None)


def get_history(limit: int = HISTORY_LIMIT) -> list[dict]:
    with _lock:
        return list(reversed(_history))[:limit]


def get_history_entry(entry_id: str) -> dict | None:
    with _lock:
        return _full_results.get(entry_id)


def clear_history() -> None:
    with _lock:
        _history.clear()
        _full_results.clear()
