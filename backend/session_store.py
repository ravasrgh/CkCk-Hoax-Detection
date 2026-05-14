import threading
import uuid
from datetime import datetime, timezone

_history: list[dict] = []
_lock = threading.Lock()
MAX_ENTRIES = 50


def add_to_history(input_preview: str, input_type: str, result: dict) -> None:
    entry = {
        "id": str(uuid.uuid4()),
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
        if len(_history) > MAX_ENTRIES:
            _history.pop(0)


def get_history() -> list[dict]:
    with _lock:
        return list(reversed(_history))


def clear_history() -> None:
    with _lock:
        _history.clear()
