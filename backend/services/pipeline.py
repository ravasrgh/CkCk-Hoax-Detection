import os
import sys
import asyncio
import time
from concurrent.futures import ThreadPoolExecutor

from services.config_manager import read_config

AI_REPO_PATH = os.environ.get(
    "CKCK_AI_PATH",
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../ai"))
)

sys.path.insert(0, AI_REPO_PATH)

_detector = None
_pii_filter = None
_preprocessor = None
_ocr_engine = None
_executor = ThreadPoolExecutor(max_workers=2)
_model_loaded = False

STATUS_MAP = {
    "TERVERIFIKASI": "TERVERIFIKASI",
    "KONTEKS BERBEDA": "KONTEKS_BERBEDA",
    "BELUM TERVERIFIKASI — WASPADAI": "WASPADAI",
    "BELUM TERVERIFIKASI — NETRAL": "NETRAL",
}


def init_model() -> bool:
    global _detector, _pii_filter, _preprocessor, _ocr_engine, _model_loaded

    try:
        from src.model import HoaxDetector
        from src.pii_filter import PIIFilter
        from src.preprocessing import TextPreprocessor
        from src.ocr_engine import OCREngine
    except ImportError as e:
        print(f"[ERROR] Gagal import modul AI: {e}")
        return False

    try:
        config = read_config()
        model_cfg = config.get("model", {})
        inference_cfg = config.get("inference", {})
        training_cfg = config.get("training", {})
        paths_cfg = config.get("paths", {})
        pii_cfg = config.get("pii_filter", {})

        _detector = HoaxDetector(
            model_name=model_cfg.get("name", "indobenchmark/indobert-base-p2"),
            num_labels=model_cfg.get("num_labels", 2),
            max_length=model_cfg.get("max_length", 256),
            device=inference_cfg.get("device", "cpu"),
        )

        version = training_cfg.get("version", "v4")
        model_dir = paths_cfg.get("model_dir", "models")
        model_path = os.path.join(AI_REPO_PATH, model_dir, f"best_model_{version}")
        use_onnx = inference_cfg.get("use_onnx", True)

        loaded = False

        if use_onnx:
            onnx_file = os.path.join(model_path, "model.onnx")
            if os.path.exists(onnx_file) and os.path.getsize(onnx_file) > 1024:
                try:
                    tokenizer_dir = model_path
                    if not os.path.exists(os.path.join(tokenizer_dir, "tokenizer.json")):
                        tokenizer_dir = _find_tokenizer_dir(AI_REPO_PATH, model_dir)

                    from transformers import AutoTokenizer
                    _detector.tokenizer = AutoTokenizer.from_pretrained(tokenizer_dir, local_files_only=True)

                    import onnxruntime as ort
                    _detector.ort_session = ort.InferenceSession(onnx_file, providers=["CPUExecutionProvider"])
                    _detector.onnx_mode = True
                    loaded = True
                    print(f"[INFO] Model ONNX dimuat dari {model_path}")
                except Exception as e:
                    print(f"[WARN] ONNX load gagal: {e}, mencoba finetuned/pretrained...")

        if not loaded:
            safetensors = os.path.join(model_path, "model.safetensors")
            if os.path.exists(safetensors) and os.path.getsize(safetensors) > 1024:
                try:
                    _detector.load_finetuned(model_path)
                    loaded = True
                except Exception as e:
                    print(f"[WARN] Finetuned load gagal: {e}, mencoba pretrained...")

        if not loaded:
            print(f"[INFO] Memuat model pretrained: {model_cfg.get('name')}")
            _detector.load_pretrained()
            loaded = True

        _pii_filter = PIIFilter(
            mask_char=pii_cfg.get("mask_char", "█"),
            enabled_types=pii_cfg.get("types"),
        )
        _preprocessor = TextPreprocessor(use_stemmer=False)
        _ocr_engine = OCREngine(lang="ind")
        _model_loaded = True
        print("[INFO] CkCk pipeline siap")
        return True

    except Exception as e:
        print(f"[ERROR] Gagal memuat model: {e}")
        return False


def _find_tokenizer_dir(ai_repo: str, model_dir: str) -> str:
    models_root = os.path.join(ai_repo, model_dir)
    for name in sorted(os.listdir(models_root), reverse=True):
        candidate = os.path.join(models_root, name)
        if os.path.isdir(candidate) and os.path.exists(os.path.join(candidate, "tokenizer.json")):
            return candidate
    raise FileNotFoundError(f"Tidak ada tokenizer ditemukan di {models_root}")


def is_model_loaded() -> bool:
    return _model_loaded


def _sync_inference(raw_input: str, input_type: str, caption_user: str) -> dict:
    start = time.time()
    sources: list[str] = []
    text = ""
    ocr_meta: dict = {}

    try:
        if input_type in ("image", "video") and os.path.isfile(raw_input):
            result = _ocr_engine.extract(raw_input, caption=caption_user)
            text = result.text
            ocr_meta = {
                "ocr_source": result.source,
                "ocr_confidence": result.confidence,
                "ocr_chars": result.char_count,
            }
            sources.append("ocr_" + ("gambar" if input_type == "image" else "video"))
            if caption_user:
                sources.append("caption_user")
        elif input_type == "audio":
            text = caption_user or ""
            sources.append("caption_user")
        else:
            text = raw_input
            sources.append("teks_langsung")
            if caption_user and caption_user != raw_input:
                text = f"{raw_input} {caption_user}"
                sources.append("caption_user")

        if not text.strip():
            return {"error": "Tidak ada teks untuk dianalisis.", "status": "ERROR"}

        pii_result = _pii_filter.filter(text)
        safe_text = pii_result["filtered_text"]

        cleaned_text = _preprocessor.clean(safe_text)
        prediction = _detector.predict(cleaned_text)

        elapsed_ms = round((time.time() - start) * 1000, 2)
        raw_status = prediction.get("status", "")
        mapped_status = STATUS_MAP.get(raw_status, "NETRAL")

        probabilities = prediction.get("probabilities", {})
        patterns = prediction.get("patterns", {})

        pola_list = []
        if patterns.get("details"):
            for cat, details in patterns["details"].items():
                for d in details:
                    pola_list.append(d.get("description", cat))

        return {
            "status": mapped_status,
            "confidence_hoax": probabilities.get("HOAX", 0.0),
            "confidence_valid": probabilities.get("VALID", 0.0),
            "penjelasan": prediction.get("explanation", ""),
            "pola_terdeteksi": pola_list,
            "teks_aman": safe_text,
            "pii_disensor": pii_result.get("pii_found", False),
            "teks_yang_dianalisis": safe_text,
            "sumber_teks": sources,
            "metadata_media": {
                **ocr_meta,
                "inference_time_ms": elapsed_ms,
                "pii_count": pii_result.get("pii_count", 0),
                "pii_details": pii_result.get("details", []),
                "raw_status": raw_status,
                "patterns_detail": patterns.get("details", {}),
                "total_patterns": patterns.get("total_patterns", 0),
            },
        }

    except Exception as e:
        return {"error": str(e), "status": "ERROR"}


async def run_inference(raw_input: str, input_type: str, caption_user: str = "") -> dict:
    if not _model_loaded:
        return {"error": "Model belum dimuat.", "status": "ERROR"}

    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(_executor, _sync_inference, raw_input, input_type, caption_user)
