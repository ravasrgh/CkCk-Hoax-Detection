<div align="center">

# CkCk — Hoax Detection System

**Deteksi hoaks berbasis AI yang privat, offline, dan eksplanatif untuk konten Bahasa Indonesia**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![IndoBERT](https://img.shields.io/badge/IndoBERT-base--p2-orange)](https://huggingface.co/indobenchmark/indobert-base-p2)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## Tentang Proyek

**CkCk** adalah sistem deteksi hoaks berbasis AI yang dirancang khusus untuk konten Bahasa Indonesia. Dibangun dengan filosofi *privacy-first*, seluruh proses inferensi berjalan sepenuhnya offline di perangkat pengguna — tidak ada data yang dikirim ke server eksternal.

Sistem menggabungkan model deep learning **IndoBERT** yang telah di-fine-tune dengan lapisan **rule-based detector** untuk menghasilkan prediksi yang tidak hanya akurat, tetapi juga dapat dijelaskan kepada pengguna (*explainability*).

> Dibuat untuk Hackathon — mengatasi maraknya misinformasi di Indonesia dengan pendekatan yang bertanggung jawab dan menjaga privasi pengguna.

---

## Fitur Utama

| Fitur | Keterangan |
|---|---|
| **100% Offline** | Inferensi berjalan lokal, tidak ada koneksi ke API eksternal |
| **Multi-modal** | Mendukung input teks, gambar (via OCR), dan video |
| **Explainability** | Menampilkan pola linguistik yang terdeteksi sebagai alasan prediksi |
| **PII Protection** | Otomatis menyensor data sensitif (NIK, telepon, email, rekening, NPWP, paspor) |
| **Streaming Pipeline** | Progress deteksi ditampilkan secara real-time via Server-Sent Events (SSE) |
| **4-Status Output** | Hasil yang bernuansa, bukan sekadar biner benar/salah |
| **Riwayat Analisis** | Menyimpan sesi analisis untuk referensi pengguna |

### Status Output

| Status | Arti |
|---|---|
| `TERVERIFIKASI` | Konten telah terverifikasi valid |
| `KONTEKS_BERBEDA` | Konten memerlukan klarifikasi konteks |
| `WASPADAI` | Kemungkinan hoaks — terdeteksi pola manipulasi |
| `NETRAL` | Tidak cukup bukti untuk verifikasi |

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js 15)                   │
│  Landing  │  Analyzer  │  Riwayat  │  Status  │  Tentang    │
└──────────────────────────┬──────────────────────────────────┘
                           │ SSE Stream
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                        │
│  POST /analyze/stream  │  GET /status  │  GET /history       │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │     AI Pipeline         │
              │                         │
              │  1. PII Filter          │  ← Sensor data sensitif
              │  2. Preprocessing       │  ← Normalisasi teks
              │  3. OCR Engine          │  ← Ekstraksi teks dari gambar
              │  4. IndoBERT (ONNX)     │  ← Klasifikasi neural
              │  5. Rule-Based Detector │  ← Deteksi pola linguistik
              │  6. Output Aggregation  │  ← Hasil akhir + explainability
              └─────────────────────────┘
```

### Pipeline Inference Detail

```
Input (teks/gambar/video)
        │
        ▼
[PII Filter] ──────────── Sensor NIK, telepon, email, rekening
        │
        ▼
[Preprocessing] ────────── Lowercase, hapus URL/HTML, normalisasi
        │
        ▼
[OCR Engine] ───────────── Ekstraksi teks dari gambar (Tesseract)
        │
        ▼
[IndoBERT ONNX] ─────────── Klasifikasi 4 kelas (47 MB, CPU)
        │
        ▼
[Rule-Based Detector] ────── Deteksi urgensi palsu, fear-mongering
        │
        ▼
[Hasil + Confidence + Pola Linguistik]
```

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **Communication**: Server-Sent Events (SSE) untuk streaming real-time

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Concurrency**: `asyncio` + `ThreadPoolExecutor`

### AI / ML
- **Model**: IndoBERT-base-p2 (`indobenchmark/indobert-base-p2`) — fine-tuned 5 epoch
- **Runtime**: ONNX Runtime (CPU) — model 47 MB
- **Library**: Hugging Face Transformers 4.36+, PyTorch 2.0+, scikit-learn 1.3+
- **NLP**: Sastrawi (Indonesian stemmer), Regex
- **OCR**: Tesseract via pytesseract, Pillow

### Data Training
- TurnBackHoax.id
- Antaranews
- Detik.com
- Kompas.com

---

## Struktur Proyek

```
CkCk-Hoax-Detection/
├── ai/
│   ├── src/
│   │   ├── model.py          # HoaxDetector — wrapper IndoBERT
│   │   ├── pii_filter.py     # Filter & sensor PII
│   │   ├── rule_detector.py  # Deteksi pola linguistik
│   │   ├── preprocessing.py  # Normalisasi teks
│   │   ├── ocr_engine.py     # Ekstraksi teks dari gambar
│   │   ├── dataset.py        # Loading & splitting data training
│   │   ├── trainer.py        # Training loop
│   │   └── export_onnx.py    # Export model ke ONNX
│   ├── models/
│   │   └── best_model_v4/    # Model ONNX siap pakai (47 MB)
│   ├── config.yaml           # Konfigurasi AI
│   └── requirements.txt
│
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── session_store.py      # Manajemen riwayat sesi
│   ├── routers/
│   │   ├── analyze.py        # POST /analyze/stream
│   │   ├── status.py         # GET /status
│   │   ├── history.py        # GET/DELETE /history
│   │   └── inject.py         # POST /inject (debug)
│   ├── services/
│   │   ├── pipeline.py       # Orkestrasi pipeline AI
│   │   ├── config_manager.py # Pembaca konfigurasi YAML
│   │   ├── media_handler.py  # Penanganan upload file
│   │   └── video_handler.py  # Pemrosesan video
│   ├── config.yaml           # Konfigurasi backend
│   └── requirements.txt
│
└── frontend/
    ├── app/
    │   ├── page.tsx          # Halaman utama (landing)
    │   ├── analyzer/         # Halaman analisis
    │   ├── riwayat/          # Halaman riwayat
    │   ├── status/           # Dashboard status sistem
    │   └── tentang/          # Halaman tentang
    ├── components/
    │   ├── analyzer/         # Komponen analisis (upload, pipeline, hasil)
    │   ├── layout/           # Navigasi & layout
    │   └── ui/               # Komponen UI primitif
    └── lib/
        ├── api.ts            # API client (SSE, REST)
        └── types.ts          # TypeScript interfaces
```

---

## Instalasi & Menjalankan

### Prasyarat

- Python 3.10+
- Node.js 18+
- Tesseract OCR ([Windows](https://github.com/UB-Mannheim/tesseract/wiki) / Linux: `apt install tesseract-ocr`)

### 1. Clone Repository

```bash
git clone https://github.com/Lloyd565/CkCk-Hoax-Detection.git
cd CkCk-Hoax-Detection
```

### 2. Setup Backend & AI

```bash
# Buat virtual environment
python -m venv venv

# Aktifkan (Windows)
venv\Scripts\activate

# Aktifkan (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r ai/requirements.txt
pip install -r backend/requirements.txt
```

### 3. Jalankan Backend

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Backend tersedia di: `http://localhost:8000`
Dokumentasi API: `http://localhost:8000/docs`

### 4. Setup & Jalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplikasi tersedia di: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Keterangan |
|---|---|---|
| `POST` | `/analyze/stream` | Analisis konten, response SSE real-time |
| `GET` | `/status` | Status sistem & statistik inferensi |
| `GET` | `/history` | Daftar riwayat analisis sesi ini |
| `GET` | `/history/{id}` | Detail analisis berdasarkan ID |
| `DELETE` | `/history` | Hapus semua riwayat sesi |

### Contoh Request — Analisis Teks

```bash
curl -X POST http://localhost:8000/analyze/stream \
  -F "caption=SEGERA SEBARKAN! Pemerintah akan memblokir semua media sosial besok!" \
  --no-buffer
```

### Contoh Response (SSE)

```
data: {"stage": "pii_filter", "status": "done", "total_ms": 12}
data: {"stage": "indobert", "status": "done", "total_ms": 340}
data: {"stage": "rule_based", "status": "done", "total_ms": 5}
data: {"stage": "output", "result": {"label": "WASPADAI", "confidence": 0.91, "explanation": "Terdeteksi pola urgensi palsu dan fear-mongering", "patterns": ["urgency_fake", "fear_mongering"]}, "total_ms": 360}
data: {"stage": "complete"}
```

---

## Konfigurasi

Konfigurasi utama tersimpan di `ai/config.yaml` dan `backend/config.yaml`:

```yaml
model:
  name: indobenchmark/indobert-base-p2
  max_length: 256
  num_labels: 4
  device: cpu
  use_onnx: true

pii_filter:
  enabled: true
  mask_char: "█"
  types: [nik, phone, email, bank_account, npwp, passport]

inference:
  confidence_threshold: 0.5
```

---

## Tentang Model

Model IndoBERT di-fine-tune dari checkpoint `indobenchmark/indobert-base-p2` dengan data berlabel dari sumber berita Indonesia dan TurnBackHoax.id.

- **Format**: ONNX (CPU-optimized)
- **Ukuran**: ~47 MB
- **Input**: Teks Bahasa Indonesia (max 256 token)
- **Output**: 4 kelas label + confidence score
- **Perangkat**: CPU (tidak membutuhkan GPU)

Model tersimpan di `ai/models/best_model_v4/` dan siap digunakan tanpa perlu training ulang.

---

## Kontribusi

Proyek ini dibuat dalam konteks hackathon. Pull request dan issue tetap terbuka untuk pengembangan lanjutan.

1. Fork repository ini
2. Buat branch fitur: `git checkout -b feat/nama-fitur`
3. Commit perubahan: `git commit -m 'feat: tambah fitur X'`
4. Push ke branch: `git push origin feat/nama-fitur`
5. Buka Pull Request ke branch `main`

---

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

<div align="center">

Dibuat dengan semangat melawan misinformasi di Indonesia

</div>
