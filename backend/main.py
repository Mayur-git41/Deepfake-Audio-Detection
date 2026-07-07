from fastapi import FastAPI, UploadFile, File  # type: ignore[reportMissingImports]

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Deepfake Audio Detection API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "status": "received"
    }
    