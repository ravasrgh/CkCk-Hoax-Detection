import os
import uuid

from fastapi import UploadFile

UPLOAD_DIR = "/tmp/ckck_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

ALLOWED_EXTENSIONS = {
    "jpg", "jpeg", "png", "webp",
    "mp4", "webm", "mov", "avi",
    "mp3", "wav", "ogg", "m4a",
}

EXTENSION_TO_TYPE = {
    "jpg": "image", "jpeg": "image", "png": "image", "webp": "image",
    "mp4": "video", "webm": "video", "mov": "video", "avi": "video",
    "mp3": "audio", "wav": "audio", "ogg": "audio", "m4a": "audio",
}


async def save_upload(file: UploadFile) -> tuple[str, str]:
    filename = file.filename or "upload"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(
            f"Format file '{ext}' tidak didukung. "
            f"Format yang diterima: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )

    unique_name = f"{uuid.uuid4()}.{ext}"
    path = os.path.join(UPLOAD_DIR, unique_name)

    size = 0
    with open(path, "wb") as f:
        while chunk := await file.read(8192):
            size += len(chunk)
            if size > MAX_FILE_SIZE:
                os.unlink(path)
                raise ValueError("Ukuran file melebihi batas 50MB.")
            f.write(chunk)

    media_type = EXTENSION_TO_TYPE.get(ext, "unknown")
    return path, media_type


def cleanup(path: str) -> None:
    try:
        if path and os.path.exists(path):
            os.unlink(path)
    except OSError:
        pass
