import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from report_generator import create_report
from fastapi.responses import FileResponse
from fastapi import FastAPI, UploadFile, File
from model import predict_audio
from database import create_database # type: ignore
import sqlite3
import shutil

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_database()

@app.post("/register")
async def register(user: dict):

    conn = sqlite3.connect("predictions.db")
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO users
            (username,password)
            VALUES (?,?)
            """,
            (
                user["username"],
                user["password"]
            )
        )

        conn.commit()

        return {
            "message": "Registration successful"
        }

    except:
        return {
            "message": "Username already exists"
        }

    finally:
        conn.close()
        
@app.post("/login")
async def login(user: dict):

    conn = sqlite3.connect("predictions.db")
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE username=?
        AND password=?
        """,
        (
            user["username"],
            user["password"]
        )
    )

    result = cursor.fetchone()

    conn.close()

    if result:
        return {
            "success": True
        }

    return {
        "success": False
    }
            
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

@app.get("/report/{filename}")
def generate_report(filename: str):

    prediction = "REAL"
    confidence = 92

    pdf_file = create_report(
        filename,
        prediction,
        confidence
    )

    return FileResponse(
        pdf_file,
        media_type="application/pdf",
        filename=pdf_file
    )