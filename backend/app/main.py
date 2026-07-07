from fastapi import FastAPI  # type: ignore[import]

app = FastAPI(
    title="Deepfake Audio Detection API",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to Deepfake Audio Detection API"
    }

@app.get("/health")
def health():
    return {
        "status": "Server is running"
    }