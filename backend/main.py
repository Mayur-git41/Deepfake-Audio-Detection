from fastapi import FastAPI, UploadFile, File # type: ignore
from model import predict_audio

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Deepfake Audio Detection API"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    result = predict_audio()

    return {
        "filename": file.filename,
        "prediction": result["prediction"],
        "confidence": result["confidence"]
    }