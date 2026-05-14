from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers import inject, analyze, status, history
from services.pipeline import init_model

app = FastAPI(
    title="CkCk API",
    description="Privacy-Aware Hoax Detection — 100% Offline",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(inject.router)
app.include_router(analyze.router)
app.include_router(status.router)
app.include_router(history.router)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "detail": "Kesalahan internal server."},
    )


@app.get("/")
async def root():
    return {
        "name": "CkCk",
        "version": "1.0.0",
        "description": "Privacy-Aware Hoax Detection API",
        "status": "operational",
    }


@app.on_event("startup")
async def startup():
    print("=" * 50)
    print("  CkCk — Privacy-Aware Hoax Detection")
    print("=" * 50)
    success = init_model()
    if success:
        print("[STARTUP] CkCk backend ready")
    else:
        print("[STARTUP] PERINGATAN: Model gagal dimuat. Endpoint /analyze tidak akan berfungsi.")
    print(f"[STARTUP] Docs: http://localhost:8000/docs")
