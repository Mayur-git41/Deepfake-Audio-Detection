from fastapi import APIRouter, UploadFile, File  # type: ignore[reportMissingImports]
import os
import shutil
router = APIRouter()
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
@router.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        return {"filename": file.filename, "message": "File uploaded successfully"}
        
