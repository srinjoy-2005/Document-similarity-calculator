# Use a lightweight Python image
FROM python:3.10-slim

# Install system dependencies: Tesseract for OCR, and libGL for OpenCV/EasyOCR
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy your requirements first (this optimizes Docker's caching)
COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# CRITICAL STEP: Pre-download the Hugging Face model into the image cache
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Copy the rest of your backend code into the container
COPY . .

# Ensure the database directory exists
RUN mkdir -p data

# Set your offline flag so the pre-downloaded model is used
ENV HF_HUB_OFFLINE=1

# Expose the backend port
EXPOSE 8000

# Start the FastAPI server
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]