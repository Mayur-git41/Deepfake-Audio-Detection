from fastapi import FastAPI, UploadFile, File
from model import predict_audio
import shutil

app = FastAPI()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    filepath = file.filename or "uploaded_file"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = predict_audio(filepath)

    return {
        "filename": file.filename,
        "prediction": result["prediction"],
        "confidence": result["confidence"]
    }