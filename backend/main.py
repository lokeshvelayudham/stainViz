from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from .inference import CycleGANInference
from .processors import process_image
import io

app = FastAPI(title="StainViz API")

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
        import os
        checkpoints_dir = os.environ.get("MODEL_DIR", "/Users/loki/DEV/AI/stainViz/model")
        print(f"Loading models from: {checkpoints_dir}")
        model_inference = CycleGANInference(checkpoints_dir)
        print("✅ StainViz Model initialized and ready.")
    except Exception as e:
        print(f"❌ Failed to initialize model: {e}")

@app.post("/generate")
async def generate_stain(
    file: UploadFile = File(...),
    direction: str = Form("AtoB") # "AtoB" (BF->HE) or "BtoA" (HE->BF)
):
    """
    Endpoint to process an image and return the Virtual stain.
    """
    if not model_inference:
        raise HTTPException(status_code=500, detail="Model is not initialized.")
    
    try:
        # Read file
        contents = await file.read()
        
        # Process (Patch -> Inference -> Stitch)
        result_bytes = process_image(contents, model_inference, direction)
        
        # Return image directly
        return Response(content=result_bytes, media_type="image/png")
        
    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "running", "service": "StainViz API"}
