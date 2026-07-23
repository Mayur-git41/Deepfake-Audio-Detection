import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from supabase_client import supabase
from model import predict_audio
from report_generator import create_report
from auth import hash_password, verify_password

app = FastAPI(title="Deepfake Audio Detection API")

# -----------------------------------
# CORS
# -----------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------
# Temporary Folder
# -----------------------------------

os.makedirs("temp", exist_ok=True)

# -----------------------------------
# User Model
# -----------------------------------

class User(BaseModel):
    username: str
    password: str


# -----------------------------------
# Home
# -----------------------------------

@app.get("/")
def home():
    return {
        "message": "Deepfake Audio Detection API Running"
    }


# -----------------------------------
# Register
# -----------------------------------

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


# -----------------------------------
# Login
# -----------------------------------

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


# -----------------------------------
# Predict
# -----------------------------------

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    try:

        filename = file.filename or "audio.wav"

        # Read uploaded file
        file_bytes = await file.read()

        # Upload to Supabase Storage
        supabase.storage.from_("audio-files").upload(
            path=filename,
            file=file_bytes,
            file_options={
                "content-type": file.content_type or "audio/wav",
                "upsert": "true"
            }
        )

        # Get Public URL
        file_url = supabase.storage.from_("audio-files").get_public_url(filename)

        # Save temporary file for ML model
        temp_path = os.path.join("temp", filename)

        with open(temp_path, "wb") as f:
            f.write(file_bytes)

        # Predict
        result = predict_audio(temp_path)

        # Delete temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

        # Save prediction
        supabase.table("predictions").insert({

            "filename": filename,
            "prediction": result["prediction"],
            "confidence": result["confidence"],
            "file_url": file_url

        }).execute()

        return {

            "filename": filename,
            "prediction": result["prediction"],
            "confidence": result["confidence"],
            "file_url": file_url

        }

    except Exception as e:

        return {

            "success": False,
            "message": str(e)

        }


# -----------------------------------
# History
# -----------------------------------

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


# -----------------------------------
# Report
# -----------------------------------

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