# Use an official lightweight Python image.
FROM python:3.9-slim

# Install system dependencies
# scikit-image may need build tools or system libs
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set up a new user named "user" with user ID 1000
RUN useradd -m -u 1000 user

# Switch to the "user" user
USER user

# Set home to the user's home directory
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Set the working directory to the user's home directory
WORKDIR $HOME/app

# Copy requirements file and install dependencies
COPY --chown=user backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code into the container
COPY --chown=user backend/ ./backend/

# Copy the model directory into the container
COPY --chown=user model/ ./model/


# Expose port 7860 (Hugging Face default)
EXPOSE 7860

# Command to run the application
# We use python -m uvicorn to ensure it runs as a module
CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
