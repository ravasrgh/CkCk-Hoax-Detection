import json
import time
import asyncio
from typing import Optional

from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import StreamingResponse

from services import pipeline, media_handler
from session_store import add_to_history
from routers.status import increment_stats

router = APIRouter(prefix="/analyze", tags=["analyze"])


def _sse_event(data: dict) -> str:
    return f"data: {json.dumps(data, ensure_ascii=False)}\n\n"


@router.post("/stream")
async def analyze_stream(
    file: Optional[UploadFile] = File(None),
    caption: str = Form(""),
    input_type: str = Form("auto"),
):
    async def generate():
        file_path: Optional[str] = None
        try:
            raw_input = caption
            detected_type = "text"

            if file and file.filename:
                file_path, detected_type = await media_handler.save_upload(file)
                raw_input = file_path
                yield _sse_event({"stage": "upload_received", "filename": file.filename})
            else:
                yield _sse_event({"stage": "upload_received", "filename": "teks_langsung"})

            if not raw_input and not caption:
                yield _sse_event({"stage": "error", "message": "Tidak ada input. Unggah file atau masukkan teks."})
                return

            if input_type != "auto":
                detected_type = input_type

            await asyncio.sleep(0.15)
            yield _sse_event({"stage": "pii_filter", "status": "running"})

            start = time.time()

            await asyncio.sleep(0.2)
            yield _sse_event({"stage": "indobert", "status": "running"})

            result = await pipeline.run_inference(raw_input, detected_type, caption)

            elapsed_ms = round((time.time() - start) * 1000, 2)

            await asyncio.sleep(0.1)
            yield _sse_event({"stage": "rule_based", "status": "running"})

            await asyncio.sleep(0.1)
            yield _sse_event({"stage": "output", "status": "running"})

            if "error" in result and result.get("status") == "ERROR":
                yield _sse_event({"stage": "error", "message": result["error"]})
                return

            increment_stats(elapsed_ms)

            preview = caption[:80] if caption else (file.filename if file else "")[:80]
            add_to_history(preview, detected_type, result)

            yield _sse_event({
                "stage": "complete",
                "result": result,
                "total_ms": elapsed_ms,
            })

        except ValueError as e:
            yield _sse_event({"stage": "error", "message": str(e)})
        except Exception as e:
            yield _sse_event({"stage": "error", "message": f"Kesalahan internal: {str(e)}"})
        finally:
            if file_path:
                media_handler.cleanup(file_path)

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
