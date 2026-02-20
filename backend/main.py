from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .inference import CycleGANInference
from .processors import process_image
from .database import engine, get_db, Base
from .models import History
from .schemas import HistoryResponse
import io
import os
import uuid
import aiofiles
from datetime import datetime

# Build DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="StainViz - AI Virtual Staining")

# Mount 'data' directory to serve images
DATA_DIR = "data/images"
os.makedirs(DATA_DIR, exist_ok=True)
app.mount("/data", StaticFiles(directory="data"), name="data")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instance
model_inference = None

@app.on_event("startup")
async def startup_event():
    global model_inference
    try:
        # Checkpoints directory
        checkpoints_dir = os.environ.get("MODEL_DIR", "/Users/loki/DEV/AI/stainViz/model")
        print(f"Loading models from: {checkpoints_dir}")
        model_inference = CycleGANInference(checkpoints_dir)
        print("✅ StainViz Model initialized and ready.")
    except Exception as e:
        print(f"❌ Failed to initialize model: {e}")

@app.post("/generate", response_model=HistoryResponse)
async def generate_stain(
    file: UploadFile = File(...),
    direction: str = Form("AtoB"), # "AtoB" (BF->HE) or "BtoA" (HE->BF)
    db: Session = Depends(get_db)
):
    """
    Endpoint to process an image, save it, and return metadata.
    """
    if not model_inference:
        raise HTTPException(status_code=500, detail="Model is not initialized.")
    
    unique_id = str(uuid.uuid4())
    input_filename = f"{unique_id}_bf.png"
    output_filename = f"{unique_id}_he.png"
    
    input_path = os.path.join(DATA_DIR, input_filename)
    output_path = os.path.join(DATA_DIR, output_filename)

    try:
        # Save input file
        async with aiofiles.open(input_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        
        # Process (Patch -> Inference -> Stitch)
        # Re-read content for processing or pass bytes? process_image takes bytes.
        # file.read() moves pointer? content is bytes.
        
        result_bytes = process_image(content, model_inference, direction)
        
        # Save result file
        async with aiofiles.open(output_path, 'wb') as out_file:
            await out_file.write(result_bytes)
            
        # Create DB record
        # URLs should be relative to server
        # e.g., http://localhost:8000/data/images/xyz.png
        # We store relative path or full URL? Relative path is better for portability.
        
        # We will return the object with paths that frontend can construct or we return full URL if we knew host.
        # For simplicity, let's store relative path: /data/images/...
        
        bf_url_path = f"/data/images/{input_filename}"
        he_url_path = f"/data/images/{output_filename}"
        
        db_item = History(
            bf_path=bf_url_path,
            he_path=he_url_path,
            metadata_info={"direction": direction, "original_filename": file.filename}
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        
        return db_item
        
    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", response_model=list[HistoryResponse])
def get_history(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Fetch chat history sorted by latest first."""
    return db.query(History).order_by(History.timestamp.desc()).offset(skip).limit(limit).all()

@app.get("/")
def read_root():
    return {"status": "running", "service": "StainViz API"}
