#!/bin/bash
cd "$(dirname "$0")"

# Create venv if not exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r backend/requirements.txt

# Run Server
echo "Starting server..."
python -m uvicorn backend.main:app --reload --port 8000
