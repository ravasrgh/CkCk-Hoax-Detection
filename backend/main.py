from fastapi import FastAPI

app = FastAPI(
    title="CkCk Hoax Detection API",
    description="Backend for Hoax Detection system",
    version="0.1.0"
)

@app.get("/")
async def root():
    return {"message": "Welcome to CkCk Hoax Detection API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)