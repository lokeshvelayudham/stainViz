# StainViz

StainViz is a web application for generating Virtual H&E stains from Brightfield images using CycleGAN.

## Project Structure
- **backend/**: FastAPI Python application (Inference, Patching, Stitching).
- **frontend/**: Next.js Web Interface (Upload, View, History).
- **model/**: Contains the pre-trained CycleGAN weights (`Latest_Net_G_A.pth`).

## Prerequisites
- Python 3.9+
- Node.js 18+
- PyTorch (installed via requirements)

## Setup & Run

### 1. Backend (API)
The backend handles the AI model and image processing.

```bash
cd backend
# Install dependencies
pip install -r requirements.txt

# Run Server (Helper Script)
./start_backend.sh
```
*The API will run at `http://localhost:8000`*

### 2. Frontend (UI)
The frontend provides the user interface.

```bash
cd frontend
# Install dependencies (if not done)
npm install

# Run Dev Server
npm run dev
```
*The UI will be available at `http://localhost:3000`*

## Features
- **Upload**: Drag & drop Brightfield images.
- **Inference**: Efficient patching and CycleGAN inference.
- **Stitching**: Smooth blending to recombine patches.
- **History**: Sidebar tracks your generation history.
ennnn