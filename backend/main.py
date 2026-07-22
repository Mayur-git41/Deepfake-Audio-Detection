import os
import shutil

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from supabase_client import supabase
from model import predict_audio
from report_generator import create_report
from auth import hash_password, verify_password

app = FastAPI(title="Deepfake Audio Detection API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)

class User(BaseModel):
    username: str
    password: str


@app.get("/")
def home():
    return {
        "message": "Deepfake Audio Detection API Running"
    }

@app.post("/register")
async def register(user: User):

    try:

        existing = (
            supabase
            .table("users")
            .select("*")
            .eq("username", user.username)
            .execute()
        )

        if existing.data:
            return {
                "success": False,
                "message": "Username already exists"
            }

        supabase.table("users").insert({
            "username": user.username,
            "password": hash_password(user.password)
        }).execute()

        return {
            "success": True,
            "message": "Registration Successful"
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }

@app.post("/login")
async def login(user: User):

    try:

        response = (
            supabase
            .table("users")
            .select("*")
            .eq("username", user.username)
            .execute()
        )

        if len(response.data) == 0:

            return {
                "success": False,
                "message": "User not found"
            }

        db_user = response.data[0]

        if verify_password(user.password, db_user["password"]): # type: ignore

            return {
                "success": True,
                "username": db_user["username"] # type: ignore
            }

        return {
            "success": False,
            "message": "Invalid Password"
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    filename = file.filename or "audio.wav"

    filepath = os.path.join(
        "uploads",
        filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = predict_audio(filepath)

    try:

        supabase.table("predictions").insert({

            "filename": filename,
            "prediction": result["prediction"],
            "confidence": result["confidence"]

        }).execute()

    except Exception as e:

        print(e)

    return {

        "filename": filename,
        "prediction": result["prediction"],
        "confidence": result["confidence"]

    }

@app.get("/history")
def history():

    try:

        response = (
            supabase
            .table("predictions")
            .select("*")
            .order("id", desc=True)
            .execute()
        )

        return response.data

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }

@app.get("/report/{filename}")
def report(filename: str):

    try:

        response = (
            supabase
            .table("predictions")
            .select("*")
            .eq("filename", filename)
            .order("id", desc=True)
            .limit(1)
            .execute()
        )

        if len(response.data) == 0:

            return {
                "message": "File not found"
            }

        row = response.data[0]

        pdf = create_report(
            filename,
            row["prediction"], # type: ignore
            row["confidence"] # type: ignore
        )

        return FileResponse(
            pdf,
            media_type="application/pdf",
            filename=pdf
        )

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }