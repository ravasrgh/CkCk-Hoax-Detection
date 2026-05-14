"""
Video Frame Extractor for Hoax Detection
==========================================
Extracts a single frame from the 1st second of a video for OCR scanning.
Uses OpenCV (cv2) — runs fully offline.
"""

import os
import tempfile
from typing import Optional

try:
    import cv2
    _CV2_AVAILABLE = True
except ImportError:
    _CV2_AVAILABLE = False
    print("[WARN] OpenCV (cv2) not installed. Video frame extraction disabled.")


def extract_frame_at_second(video_path: str, second: float = 1.0) -> Optional[str]:
    """
    Extract a single frame from a video at the given timestamp.

    Args:
        video_path: Path to the video file.
        second: Timestamp in seconds to capture the frame (default: 1.0).

    Returns:
        Path to the saved frame image (PNG), or None if extraction failed.
    """
    if not _CV2_AVAILABLE:
        print("[WARN] cv2 not available, cannot extract video frame.")
        return None

    if not os.path.exists(video_path):
        print(f"[WARN] Video file not found: {video_path}")
        return None

    cap = None
    try:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print(f"[WARN] Could not open video: {video_path}")
            return None

        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps if fps > 0 else 0

        # If video is shorter than requested second, use the middle frame
        if duration > 0 and second > duration:
            second = duration / 2.0

        target_frame = int(second * fps)
        cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)

        ret, frame = cap.read()
        if not ret or frame is None:
            # Fallback: try the very first frame
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = cap.read()
            if not ret or frame is None:
                print("[WARN] Could not read any frame from video.")
                return None

        # Save frame as temporary PNG
        frame_path = os.path.join(
            tempfile.gettempdir(),
            f"ckck_video_frame_{os.path.basename(video_path)}.png"
        )
        cv2.imwrite(frame_path, frame)

        frame_h, frame_w = frame.shape[:2]
        print(f"[INFO] Video frame extracted: {frame_w}x{frame_h} at t={second:.1f}s -> {frame_path}")

        return frame_path

    except Exception as e:
        print(f"[WARN] Video frame extraction failed: {e}")
        return None
    finally:
        if cap is not None:
            cap.release()


def is_available() -> bool:
    """Check if video frame extraction is available."""
    return _CV2_AVAILABLE
