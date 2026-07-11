from fastapi import FastAPI, UploadFile, File
from model import predict_audio
from database import create_database # type: ignore
import sqlite3
import shutil

app = FastAPI()

create_database()

@app.get("/")
def home():
    return {"message": "Deepfake Audio Detection API"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    filepath = file.filename

    with open(filepath, "wb") as buffer: # type: ignore
        shutil.copyfileobj(file.file, buffer)

    result = predict_audio(filepath)

    conn = sqlite3.connect("predictions.db")

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO predictions
        (filename,prediction,confidence)
        VALUES (?,?,?)
        """,
        (
            file.filename,
            result["prediction"],
            result["confidence"]
        )
    )

    conn.commit()
    conn.close()

    return {
        "filename": file.filename,
        "prediction": result["prediction"],
        "confidence": result["confidence"]
    }

@app.get("/history")
def history():

    conn = sqlite3.connect("predictions.db")

    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM predictions
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    return rows