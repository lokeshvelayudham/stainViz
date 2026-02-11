# Use an official lightweight Python image.
FROM python:3.9-slim

# Set the working directory to /app
WORKDIR /app

# Install system dependencies
# scikit-image may need build tools or system libs
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY backend/requirements.txt .

# Install dependencies
# Using --no-cache-dir to keep image size small
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code into the container
COPY backend/ ./backend/

# Copy the model directory into the container
COPY model/ ./model/


# Expose port 8000
EXPOSE 8000

# Command to run the application
# We use python -m uvicorn to ensure it runs as a module
CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
