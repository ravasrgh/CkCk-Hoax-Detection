# CLAUDE CODE PROMPT — CkCk: Privacy-Aware Hoax Detection AI
# FindIT Hackathon 2026 — Track B: The Privacy Brain (NLP)

---

## CONTEXT

You are building a full-stack MVP application called **CkCk** for a 24-hour national
hackathon (FindIT 2026, Universitas Gadjah Mada). The competition is happening RIGHT NOW.
Time is critical. Every decision must prioritize working software over perfect software.

CkCk is a **privacy-aware hoax detection system** that runs 100% offline on localhost.
It analyzes Indonesian-language content (text, images, videos, audio) for disinformation
and manipulative patterns using a fine-tuned IndoBERT model + rule-based detector.

The AI model is **already built and working** in a separate repo at `../ai/`.
Your job is to build the application layer (backend API + frontend) that wraps it.

The judges evaluate on three domains:
- **AI (Live Inference Quality, Integritas, Optimasi, Pertahanan Teknis)**
- **Software Engineering (Integrasi & Alur Sistem 30%, Adaptabilitas Dinamis 30%,
  Eksekusi Teknis & UI 20%, Kejelasan Arsitektur 20%)**
- **Product (Esensi Augmenting, Pengalaman Pengguna, Storytelling, Viabilitas)**

---

## THE AI MODEL (DO NOT MODIFY)

Location: `../ai/`

```
../ai/
├── src/
│   ├── inferencer.py      ← ENTRY POINT: run_ckck_inference()
│   ├── pii_filter.py
│   ├── rule_based.py
│   ├── output_engine.py
│   ├── preprocessing.py
│   └── utils.py
├── models/
│   ├── indobert_classifier/
│   ├── indobert_classifier.onnx
│   └── tokenizer/
├── config.yaml            ← ALL TUNEABLE PARAMETERS LIVE HERE
└── requirements.txt
```

The main function signature:
```python
from src.inferencer import run_ckck_inference

hasil = run_ckck_inference(
    raw_input="path/to/file.jpg OR plain text string",
    input_type="auto",   # "text" | "image" | "video" | "audio" | "auto"
    caption_user=""      # optional additional caption from user
)

# Returns:
{
  "status": "WASPADAI",              # one of 4 labels
  "confidence_hoax": 0.82,
  "confidence_valid": 0.18,
  "penjelasan": "...",               # Indonesian explanation
  "pola_terdeteksi": ["urgensi_palsu", "klaim_tanpa_sumber"],
  "pii_disensor": True,
  "sumber_teks": ["ocr_gambar", "caption_user"],
  "metadata_media": { ... }
}
```

The 4 possible statuses:
- `TERVERIFIKASI` — confidence valid ≥ 75%
- `KONTEKS_BERBEDA` — confidence valid 50–75%
- `WASPADAI` — confidence hoax ≥ 50%, manipulative patterns detected
- `NETRAL` — low confidence, no manipulative patterns

The full inference pipeline (already implemented in AI repo):
```
Input
  → OCR Engine (pytesseract/EasyOCR) if image/video frame
  → Audio Engine (Whisper local) if video/audio
  → Merge all extracted text + user caption
  → PII Filter (regex: NIK, phone, email, bank account)
  → IndoBERT Classifier (main decision maker, ONNX)
  → Rule-Based Detector (enriches explanation only, does NOT change score)
  → Output Engine (determines 1 of 4 statuses + Indonesian explanation)
```

`config.yaml` controls all tunable parameters. Loading it fresh on every request
enables hot-reload without server restart — this is the Dynamic Injection mechanism.

---

## YOUR TASK

Build two things:

### 1. Backend — FastAPI application (`./backend/`)
### 2. Frontend — Next.js application (`./frontend/`)

Both run locally. Backend on port 8000, frontend on port 3000.

---

## TECH STACK (NON-NEGOTIABLE)

```
Backend:  Python 3.10+, FastAPI, uvicorn, python-multipart, pyyaml
Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS
AI Deps:  pytesseract, easyocr, openai-whisper, opencv-python,
          moviepy, ffmpeg-python, onnxruntime, transformers
Comms:    REST (JSON) + Server-Sent Events (SSE) for streaming
Storage:  In-memory only (no database, no Redis, no persistence)
```

Do NOT use: databases, external APIs, cloud services, Docker, Redux,
any state management library beyond React hooks, Next.js server actions
for the AI calls (use the FastAPI backend instead).

---

## ARCHITECTURE

```
frontend/ (Next.js :3000)
    │
    │  REST + SSE
    ▼
backend/ (FastAPI :8000)
    ├── routers/
    │   ├── analyze.py      POST /analyze/stream  (SSE)
    │   ├── inject.py       POST /inject, GET /inject/current
    │   ├── status.py       GET /status
    │   └── history.py      GET /history, DELETE /history
    │
    ├── services/
    │   ├── pipeline.py         wraps run_ckck_inference
    │   ├── config_manager.py   hot-reload config.yaml
    │   └── media_handler.py    file upload, temp storage, cleanup
    │
    ├── session_store.py    in-memory list, max 50 entries, thread-safe
    └── main.py             FastAPI app, CORS, router registration

../ai/                      DO NOT MODIFY
    └── src/inferencer.py   ← imported by backend/services/pipeline.py
```

---

## EXECUTION LAYERS

**Build in this exact order. Complete and verify each layer before moving to the next.
Do not skip ahead. Do not build the frontend before the backend works.**

---

### LAYER 0 — Project Scaffold (do this first, ~10 minutes)

Create the directory structure:
```
ckck-app/
├── backend/
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── analyze.py
│   │   ├── inject.py
│   │   ├── status.py
│   │   └── history.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── pipeline.py
│   │   ├── config_manager.py
│   │   └── media_handler.py
│   ├── __init__.py
│   ├── session_store.py
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx              → redirect to /analyzer
    │   ├── analyzer/page.tsx     ← MAIN PAGE
    │   ├── riwayat/page.tsx
    │   ├── tentang/page.tsx
    │   ├── playground/page.tsx
    │   ├── status/page.tsx
    │   └── debug/page.tsx
    ├── components/
    │   ├── layout/
    │   │   ├── SideNavBar.tsx
    │   │   └── MobileBottomNav.tsx
    │   ├── analyzer/
    │   │   ├── MediaUploader.tsx
    │   │   ├── PipelineProgress.tsx
    │   │   └── ResultCard.tsx
    │   └── ui/
    │       ├── StatusBadge.tsx
    │       └── OfflineBadge.tsx
    ├── lib/
    │   ├── api.ts
    │   └── types.ts
    ├── next.config.ts
    ├── tailwind.config.ts
    └── tsconfig.json
```

---

### LAYER 1 — Backend Core (build this before any frontend)

#### `backend/services/config_manager.py`

CONSTRAINTS:
- Use `threading.Lock()` for thread safety
- Read config fresh on EVERY call to `read_config()` — never cache in memory
- `write_config()` must do a deep merge, not a full overwrite
- Must handle missing keys gracefully

```python
# Interface expected:
def read_config() -> dict: ...
def write_config(updates: dict) -> dict: ...  # returns merged config
```

#### `backend/services/media_handler.py`

CONSTRAINTS:
- Save uploaded files to `/tmp/ckck_uploads/` with UUID filename
- Always delete temp files after inference completes (use try/finally)
- Validate file extension before saving: only allow
  [jpg, jpeg, png, webp, mp4, webm, mov, avi, mp3, wav, ogg, m4a]
- Reject files larger than 50MB
- Return the temp file path and detected media type

```python
# Interface expected:
def save_upload(file: UploadFile) -> tuple[str, str]: ...  # (path, media_type)
def cleanup(path: str) -> None: ...
```

#### `backend/services/pipeline.py`

CONSTRAINTS:
- Add `../ai` to sys.path before import
- Wrap `run_ckck_inference` in a try/except — never let inference crash the server
- On exception, return a structured error dict, not an HTTP 500
- Run inference in a thread pool executor (it's blocking, FastAPI is async)
- Load config fresh before each call via `config_manager.read_config()`

```python
# Interface expected:
async def run_inference(
    raw_input: str,
    input_type: str,
    caption_user: str = ""
) -> dict: ...
```

#### `backend/session_store.py`

CONSTRAINTS:
- Use `threading.Lock()` for thread safety
- Max 50 entries. When full, drop the oldest (FIFO)
- Each entry must have: id (uuid), timestamp, input_preview (first 80 chars),
  input_type, status, confidence_hoax, penjelasan, pola_terdeteksi
- Never store the full raw input — privacy principle

```python
# Interface expected:
def add_to_history(input_preview: str, input_type: str, result: dict) -> None: ...
def get_history() -> list[dict]: ...
def clear_history() -> None: ...
```

---

### LAYER 2 — Backend Routers

#### `backend/routers/inject.py` — BUILD THIS FIRST IN LAYER 2

This is the Dynamic Injection endpoint. It must work perfectly.

CONSTRAINTS:
- `POST /inject` — accepts `{"updates": {...}}`, merges into config.yaml
- `GET /inject/current` — returns current active config
- Must return the full new config after injection so caller can verify
- No authentication needed (hackathon context)
- Log every injection with timestamp to stdout

```python
# Request body:
class InjectionPayload(BaseModel):
    updates: dict

# Response:
{
  "status": "injected",
  "timestamp": "2026-05-14T11:00:00",
  "active_config": { ...full config... }
}
```

#### `backend/routers/analyze.py`

This is the most complex router. Think carefully about the SSE implementation.

TRADEOFF TO REASON ABOUT:
Using SSE for streaming pipeline progress adds complexity but gives the judges a
real-time visual of the pipeline working — which directly scores under
"Integrasi & Alur Sistem" and "Live Inference Quality". The complexity is worth it
because the alternative (simple POST with JSON response) looks like a black box.

CONSTRAINTS:
- Accept `multipart/form-data` with optional `file` + `caption` + `input_type` fields
- Use `StreamingResponse` with `media_type="text/event-stream"`
- Add headers: `Cache-Control: no-cache`, `X-Accel-Buffering: no`
- Stream these events in order:
  1. `{"stage": "upload_received", "filename": "..."}`  — immediately after upload
  2. `{"stage": "pii_filter", "status": "running"}`     — before inference
  3. `{"stage": "indobert", "status": "running"}`
  4. `{"stage": "rule_based", "status": "running"}`
  5. `{"stage": "output", "status": "running"}`
  6. `{"stage": "complete", "result": {...}, "total_ms": 1022}` — final result
- Run actual inference between stage 2 and stage 6
- Stages 2–5 can be simulated timing (yield stage, small sleep, continue)
  since the real model runs as one blocking call
- Call `session_store.add_to_history()` after successful inference
- Always call `media_handler.cleanup()` in a finally block

#### `backend/routers/status.py`

CONSTRAINTS:
- `GET /status` returns:
```json
{
  "model_loaded": true,
  "model_size_mb": 247,
  "device": "CPU",
  "backend_url": "localhost:8000",
  "total_analisis_sesi": 12,
  "avg_inference_ms": 1022,
  "offline": true
}
```
- Track total requests and running average inference time in module-level variables
- Use `threading.Lock()` for the counters

#### `backend/routers/history.py`

CONSTRAINTS:
- `GET /history` — returns session history list
- `DELETE /history` — clears session history, returns `{"cleared": true}`

#### `backend/main.py`

CONSTRAINTS:
- CORS: allow only `http://localhost:3000`
- Register all routers with appropriate prefixes and tags
- On startup, verify that `../ai/src/inferencer.py` exists and is importable
  — print a clear error and exit if not
- Swagger UI available at `/docs` (FastAPI default — do not disable)
- Add a root `GET /` that returns basic app info (name, version, status)

---

### LAYER 3 — Frontend Foundation

Before writing any page, build these shared pieces first.

#### `frontend/lib/types.ts`

Define TypeScript interfaces for ALL API responses:

```typescript
export type InferenceStatus =
  "TERVERIFIKASI" | "KONTEKS_BERBEDA" | "WASPADAI" | "NETRAL"

export interface InferenceResult {
  status: InferenceStatus
  confidence_hoax: number
  confidence_valid: number
  penjelasan: string
  pola_terdeteksi: string[]
  pii_disensor: boolean
  sumber_teks: string[]
  metadata_media: Record<string, any>
}

export interface SessionEntry {
  id: string
  timestamp: string
  input_preview: string
  input_type: string
  status: InferenceStatus
  confidence_hoax: number
  penjelasan: string
  pola_terdeteksi: string[]
}

export interface SystemStatus {
  model_loaded: boolean
  model_size_mb: number
  device: string
  backend_url: string
  total_analisis_sesi: number
  avg_inference_ms: number
  offline: boolean
}

export type PipelineStage =
  "upload_received" | "pii_filter" | "indobert" |
  "rule_based" | "output" | "complete"

export interface SSEEvent {
  stage: PipelineStage
  status?: string
  filename?: string
  result?: InferenceResult
  total_ms?: number
}
```

#### `frontend/lib/api.ts`

CONSTRAINTS:
- All API calls go through this file. No direct fetch calls in components.
- Use `const BASE = "http://localhost:8000"`
- `streamAnalysis()` must use fetch + ReadableStream + TextDecoder
  (NOT EventSource — EventSource only supports GET, we need POST with FormData)
- Handle SSE parsing carefully: split by `\n`, filter lines starting with `data:`,
  strip the `data: ` prefix, then JSON.parse
- All functions must have proper TypeScript return types
- Export these functions:

```typescript
// SSE streaming analyze — primary feature
export function streamAnalysis(
  formData: FormData,
  onStage: (event: SSEEvent) => void,
  onComplete: (result: InferenceResult, totalMs: number) => void,
  onError: (err: string) => void
): Promise<void>

// System status
export async function getStatus(): Promise<SystemStatus>

// Session history
export async function getHistory(): Promise<SessionEntry[]>
export async function clearHistory(): Promise<void>

// Dynamic Injection (for debug page)
export async function injectConfig(
  updates: Record<string, any>
): Promise<{ status: string; active_config: Record<string, any> }>

export async function getCurrentConfig(): Promise<Record<string, any>>
```

#### `frontend/components/layout/SideNavBar.tsx`

CONSTRAINTS:
- Implement EXACTLY as designed in Figma:
  - Dark background (`#1a1a1a` or close)
  - CkCk logo/wordmark top left
  - User label "FORENSIC ANALYST" below logo
  - Nav items: Analyzer, Riwayat, Tentang, Playground, Status Sistem, Tampilan Debug
  - Each nav item has an icon + label
  - Active state: left-bordered highlight in amber/gold
  - OFFLINE indicator pill at bottom
- Fixed on desktop (w-[180px]), hidden on mobile
- Use Next.js `<Link>` for navigation
- Use `usePathname()` to determine active route

#### `frontend/components/layout/MobileBottomNav.tsx`

CONSTRAINTS:
- Visible only on mobile (hidden on md+)
- Shows: Analyzer, Riwayat, Playground, Status, Debug
- Active state: amber color
- Fixed at bottom of screen

#### `frontend/app/layout.tsx`

CONSTRAINTS:
- Dark background globally (`bg-[#1a1a1a]` or `bg-zinc-950`)
- Font: monospace for labels/codes, sans for body text
- Include SideNavBar + MobileBottomNav
- Main content area takes remaining width after sidebar

---

### LAYER 4 — Analyzer Page (PRIMARY DELIVERABLE)

This is the most important page. Judges will spend 80% of their time here.
Build it last in the frontend so you have all components ready.

CONSTRAINTS for the full Analyzer page (`app/analyzer/page.tsx`):

**State machine — page has 3 states:**
1. `idle` — showing upload form
2. `analyzing` — showing pipeline progress animation
3. `result` — showing analysis result

**State 1: Upload Form**

The upload area must support:
- Drag and drop file
- Click to browse
- Accepted: `image/*,video/*,audio/*`
- Show filename + file type badge after selection
- Show image preview if file is an image
- Textarea for caption/text input (works standalone without file)
- ANALYZE button — disabled if both file and caption are empty
- Top-right: OFFLINE badge (amber/orange dot + text)

**State 2: Pipeline Progress (during analysis)**

Show pipeline steps in sequence, animating as each stage completes:
```
[PII FILTER] → [INDOBERT] → [RULE-BASED] → [OUTPUT]
  112ms ✓        450ms ✓       20ms ✓        5ms ✓
```
- Each step starts dimmed/inactive
- Lights up (amber border + checkmark) when its SSE event arrives
- Show a subtle loading spinner or pulse on the currently-running step
- Do NOT show a fake timer — use actual timing from SSE events

**State 3: Result Display**

Show exactly the result card structure visible in the Figma:

```
┌─ WASPADAI / TERVERIFIKASI / KONTEKS_BERBEDA / NETRAL ────────┐
│  TINGKAT KEYAKINAN: 82%                                       │
├───────────────────────────────────────────────────────────────┤
│  ✓ PIPELINE SELESAI                                           │
│  [PII FILTER 112ms] → [INDOBERT 450ms] → [RULE-BASED 20ms]  │
│                     → [OUTPUT 5ms]                            │
├──────────────────┬────────────────────────────────────────────┤
│ SKOR KEPERCAYAAN │ DATA PRIBADI DILINDUNGI                    │
│ 82%              │ [NIK DIPROTEKSI] [TELEPON DIPROTEKSI]      │
│ Total: 1.022ms   │                                            │
├──────────────────┴────────────────────────────────────────────┤
│ TEKS YANG DIANALISIS                                          │
│ "URGENT: Telah ditemukan bahwa sinyal 5G..."                  │
│ [REDACTED] [REDACTED]                                         │
├───────────────────────────────────────────────────────────────┤
│ POLA LINGUISTIK                                               │
│ [Urgensi artifisial] [Klaim tanpa sumber]                     │
│ [Permintaan data pribadi] [Bahasa CAPSLOCK emosional]         │
├───────────────────────────────────────────────────────────────┤
│ MENGAPA INI MENCURIGAKAN?                                     │
│ Teks ini menunjukkan pola klasik misinformasi...              │
├───────────────────────────────────────────────────────────────┤
│ AKSI CEPAT                                                    │
│ Jangan sebarkan pesan ini. Peringatan...                      │
├───────────────────────────────────────────────────────────────┤
│ [↺ ANALISIS ULANG]          [⎘ SALIN HASIL]                  │
├───────────────────────────────────────────────────────────────┤
│ 🔒 Analisis dilakukan sepenuhnya di perangkat ini.            │
└───────────────────────────────────────────────────────────────┘
```

Color coding for status headers:
- WASPADAI: dark red background
- TERVERIFIKASI: dark blue/teal background
- KONTEKS_BERBEDA: dark amber/orange background
- NETRAL: dark gray background

**"Analisis Ulang" button** → reset to idle state, keep the same file/caption loaded

**"Salin Hasil" button** → copy formatted text summary to clipboard,
show "Tersalin!" confirmation for 2 seconds

TRADEOFF TO REASON ABOUT:
The page could be split into separate components (UploadForm, PipelineProgress,
ResultCard) or kept as one large component. Split into components because:
(1) PipelineProgress and ResultCard are reused elsewhere (Debug, Playground)
(2) Easier to test each state in isolation
(3) Cleaner code for judges to read in GitHub

---

### LAYER 5 — Supporting Pages

Build these after Analyzer is working end-to-end.
These are simpler — use real API data, no fake data.

#### Riwayat (`/riwayat`)

- Fetch from `GET /history` on mount
- Show as list of cards (as in Figma):
  - Color-coded left border by status
  - Title truncated to ~60 chars
  - Status badge + type badge ([TEKS], [VIDEO], [GAMBAR])
  - Timestamp
  - Empty state: "Belum ada analisis dalam sesi ini" with icon
- Privacy note at top: "Riwayat hanya tersedia selama sesi ini —
  tidak ada yang disimpan permanen."
- "Hapus Riwayat" button

#### Status Sistem (`/status`)

- Fetch from `GET /status` on mount, auto-refresh every 10 seconds
- Show exactly 5 stat cards as in Figma:
  - MODEL DIMUAT: YA/TIDAK
  - UKURAN MODEL: 247 MB
  - PERANGKAT: CPU
  - TOTAL ANALISIS SESI: [number]
  - RATA-RATA WAKTU INFERENSI: [ms]
- Connection status pill at bottom: "TERHUBUNG KE LOCALHOST:8000"

#### Tentang (`/tentang`)

- Static content page — no API calls needed
- Show: CkCk tagline, pipeline architecture diagram (INPUT → FILTER PII →
  INDOBERT → HASIL), classification definitions (4 statuses with icons),
  PII redaction targets list
- Content from the Figma design + proposal context

#### Playground (`/playground`)

- Show a grid of sample content cards (as in Figma)
- 4 TERVERIFIKASI examples + 4 HOAKS examples (hardcode these)
- "Coba Contoh Ini →" button on each card
- Clicking a card → navigate to /analyzer with the sample text pre-filled
  (use Next.js router + query params or localStorage)

#### Tampilan Debug (`/debug`)

CONSTRAINTS:
- Clearly marked: "VIEW INI HANYA UNTUK KEPERLUAN DEMONSTRASI" red banner
- Shows the raw JSON of the last analysis result from session
- Three panels (as in Figma):
  1. BUFFER OUTPUT MENTAH — raw JSON of full inference result
  2. RINCIAN TOKEN — table: TOKEN, TYPE, KONE (confidence score)
     Extract from metadata_media if available
  3. PEMICU ATURAN — list of triggered rule patterns with confidence scores
- "Belum ada analisis" empty state if no history yet
- This page is for judges to see the system is real and transparent

---

## DESIGN SYSTEM

Implement this exactly — judges will compare to Figma.

```
Colors:
  Background:      #1a1a1a  (very dark brown-black)
  Card background: #242020  (slightly lighter)
  Border:          #3a3a3a
  Primary accent:  #C9A84C  (amber/gold — used for active states, highlights)
  Text primary:    #E8E8E8
  Text muted:      #6B6B6B
  Text code/mono:  #A8A8A8

  Status WASPADAI:       #8B1A1A bg, #FF6B6B text
  Status TERVERIFIKASI:  #1A2E4A bg, #6BB5FF text  
  Status KONTEKS_BERBEDA:#4A3500 bg, #FFB347 text
  Status NETRAL:         #2A2A2A bg, #A8A8A8 text

Typography:
  UI labels:    font-mono, uppercase, tracking-widest, text-xs
  Body text:    font-sans, text-sm
  Big numbers:  font-mono, font-bold, text-4xl (for status %, ms counts)
  Code/JSON:    font-mono, text-xs

Spacing:
  Page padding: px-4 py-6 (mobile), px-8 py-8 (desktop)
  Card padding: p-4 (mobile), p-6 (desktop)
  Gap between cards: gap-4

Sidebar width: 180px (fixed, desktop only)
```

---

## HARD CONSTRAINTS (NEVER VIOLATE THESE)

1. **No external API calls from either backend or frontend**
   — all processing is local. No Google, OpenAI, Anthropic, anything.

2. **No database** — all state is in-memory on backend.
   Frontend uses React state only (no localStorage, no IndexedDB).

3. **File size limit: 50MB** on upload. Reject with clear error message.

4. **Always cleanup temp files** — never leave uploads in /tmp/ after inference.

5. **PII must never appear in API responses** — the PII filter runs before anything
   else; redacted text is what gets returned, not the original.

6. **Backend must not crash on bad input** — every route must have try/except.
   Return structured error JSON, never let FastAPI return a raw 500.

7. **`config.yaml` is the single source of truth** for all tunable parameters.
   Nothing related to thresholds, labels, or patterns is hardcoded anywhere
   in the backend Python code.

8. **The frontend must be fully functional without any TypeScript `any` types**
   except for `metadata_media: Record<string, any>` which is explicitly typed.

9. **All UI text in Bahasa Indonesia** — labels, placeholders, error messages,
   all of it. Code comments and variable names can be English.

10. **`/inject` endpoint must be the first thing that works end-to-end**
    before building anything else.

---

## EXPECTED OUTPUT

When you are done, the following must all be true:

```
✅ cd backend && uvicorn main:app --reload --port 8000
   → Server starts, prints "CkCk backend ready"
   → http://localhost:8000/docs shows all endpoints

✅ cd frontend && npm run dev
   → Runs on port 3000
   → / redirects to /analyzer

✅ User opens /analyzer
   → Uploads an image file + types a caption
   → Clicks ANALISIS
   → Sees pipeline progress animate in real-time
   → Sees full result card with status, confidence, explanation, patterns

✅ User opens /riwayat
   → Sees the analysis from the previous step listed

✅ User opens /status
   → Sees model loaded: YA, size: 247MB, device: CPU

✅ User opens /debug
   → Sees raw JSON of last analysis
   → Sees token breakdown and rule triggers

✅ POST http://localhost:8000/inject
   Body: {"updates": {"confidence_threshold": 0.65}}
   → Returns {"status": "injected", "active_config": {...}}
   → Next analysis uses the new threshold

✅ GET http://localhost:8000/docs
   → All 8 endpoints documented with request/response schemas
```

---

## INCREMENTAL EXECUTION INSTRUCTIONS

**Execute in this exact order. After each step, verify it works before proceeding.**

```
STEP 1  Create full directory structure (Layer 0)
        → verify: all files exist, even if empty

STEP 2  Implement config_manager.py + write a quick test:
        python -c "from services.config_manager import read_config; print(read_config())"
        → verify: prints config.yaml contents

STEP 3  Implement inject.py router + wire into main.py
        uvicorn main:app --reload
        curl -X POST localhost:8000/inject -H "Content-Type: application/json" \
          -d '{"updates": {"test_key": "test_value"}}'
        → verify: returns injected config with test_key present

STEP 4  Implement pipeline.py (wrap run_ckck_inference)
        python -c "
        import asyncio
        from services.pipeline import run_inference
        r = asyncio.run(run_inference('Sebarkan ini sebelum dihapus!', 'text'))
        print(r)
        "
        → verify: returns valid result dict with status field

STEP 5  Implement analyze.py router (SSE streaming)
        Test with curl:
        curl -N -X POST localhost:8000/analyze/stream \
          -F "caption=URGENT sebarkan ini sebelum dihapus" \
          -F "input_type=text"
        → verify: see SSE events streaming in terminal

STEP 6  Implement session_store + history + status routers
        → verify: GET /history returns [] initially,
                  POST /analyze, then GET /history returns 1 entry

STEP 7  Set up Next.js frontend with Tailwind
        → verify: npm run dev works, blank page loads on :3000

STEP 8  Implement types.ts + api.ts
        → verify: TypeScript compiles with no errors

STEP 9  Implement SideNavBar + MobileBottomNav + layout.tsx
        → verify: sidebar visible on desktop, bottom nav on mobile,
                  all 6 navigation links work

STEP 10 Implement MediaUploader component (idle state only)
        → verify: file selection works, preview shows for images,
                  form submits FormData correctly to backend

STEP 11 Implement PipelineProgress component
        → verify: stages animate correctly when fed mock SSE events

STEP 12 Implement ResultCard component
        → verify: renders correctly for all 4 status types with mock data

STEP 13 Wire up Analyzer page end-to-end (all 3 states)
        → verify: upload image → see pipeline animate → see result card

STEP 14 Implement Riwayat page
        → verify: history appears after analysis, empty state shows initially

STEP 15 Implement Status Sistem page
        → verify: real data from /status endpoint, refreshes every 10s

STEP 16 Implement Tentang page (static)
        → verify: renders with correct content

STEP 17 Implement Playground page
        → verify: clicking sample card navigates to /analyzer with text pre-filled

STEP 18 Implement Debug page
        → verify: shows last analysis JSON, rule triggers, token list

STEP 19 Full end-to-end test:
        - Text only input
        - Image input
        - Video input (if possible)
        - Dynamic injection mid-session
        - History accumulates correctly
        - Status updates correctly

STEP 20 Final check:
        - No TypeScript errors (tsc --noEmit)
        - No Python exceptions in uvicorn logs
        - All 6 pages load without console errors
        - /docs shows all endpoints
```

---

## TRADEOFFS TO REASON ABOUT EXPLICITLY

Before writing code, state your reasoning on these:

1. **SSE vs WebSocket for streaming**: Why SSE is sufficient here
   (unidirectional, simpler, no library needed, works with fetch API).

2. **In-memory session store vs file-based**: Why in-memory is correct
   (privacy constraint, hackathon context, no persistence needed).
   What the failure mode is (restart = data lost) and why it's acceptable.

3. **Simulated pipeline stage events vs true per-stage streaming**:
   The AI model runs as one blocking call — true per-stage events would require
   modifying the AI code which is forbidden. Simulated stages with correct timing
   from the actual inference run is the right tradeoff.
   Reason about whether this is honest to show to judges.

4. **Next.js App Router vs Pages Router**: Why App Router is correct here
   (modern, better TypeScript support, layout colocations, but note
   that SSE consumption must be in a client component with 'use client').

5. **Single `/analyze/stream` endpoint for all input types vs separate endpoints**:
   One endpoint is simpler for the frontend (one function in api.ts) and
   the backend auto-detects media type. Reason about what this costs in terms
   of clarity vs what it gains in simplicity.

---

## NOTES FOR THE HACKATHON CONTEXT

- You have limited time. If a feature is taking too long, implement a working
  stub and move on. A page that shows "Coming soon" is better than a page
  that crashes the app.

- The Analyzer page is worth 80% of the demo. Never sacrifice it for a
  supporting page.

- The Debug page is worth more than it looks — judges are technical and will
  love seeing the raw inference output. Build it right.

- The `/inject` endpoint and `/docs` page are what the judges will
  test first. Make sure they work perfectly.

- Error states matter. If the backend is not running and the frontend
  makes a request, show a clear "Backend tidak tersedia" message,
  not an unhandled exception or blank screen.

- The OFFLINE badge must always be visible. It reinforces the core value
  proposition of CkCk: data never leaves the device.
```