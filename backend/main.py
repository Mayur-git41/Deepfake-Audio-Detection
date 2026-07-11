from fastapi import FastAPI, UploadFile, File
from model import predict_audio
import shutil

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Deepfake Audio Detection API"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = predict_audio(file_path)

    return {
        "filename": file.filename,
        "prediction": result["prediction"],
        "confidence": result["confidence"]
    }