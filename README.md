# Document Similarity Analyzer

A full-stack, Object-Oriented web application designed to extract text from documents (handwritten and printed) and compute their semantic and lexical similarity using multiple state-of-the-art metrics. The system features a modern React (Vite) frontend and a highly concurrent FastAPI backend, complete with real-time SSE streaming for live logs and progress.

---

## 🎯 Project Overview

The Document Similarity Analyzer allows researchers, developers, and educators to evaluate how well different Optical Character Recognition (OCR) systems and Vision Large Language Models (LLMs) perform when extracting text from images or PDFs. 

It provides two primary modes of operation:
1. **The Microscope:** Deep-dive into a single pair of documents (Handwritten vs. Printed) to instantly extract text and view a granular breakdown of similarity scores.
2. **The Arena:** A batch-benchmarking engine that races multiple extraction models against a ground-truth dataset, emitting live telemetry and computing aggregate leaderboard scores.

---

## ✨ Key Features & Capabilities

- **Multi-Modal Text Extraction:**
  - **Cloud Vision APIs:** Leverages Google Gemini 2.5 Flash (`google.genai`) and Groq's Llama-4-Vision for lightning-fast, highly accurate cloud extraction.
  - **Traditional OCR:** Uses `pytesseract` for printed documents and `EasyOCR` as a fallback for handwritten text.
  - **Local Model Machine Learning:** Integrates Microsoft `TrOCR` (Vision Encoder-Decoder) for fully offline, private extraction.
- **Batch Benchmarking (The Arena):** Run multiple extraction strategies sequentially across entire directories of test data, generating side-by-side performance metrics.
- **Laboratory History:** Automatically persists all benchmark and microscope results into a local SQLite database (`data/results.db`) for future historical review.
- **Real-Time Streaming:** The backend uses Server-Sent Events (SSE) to pipe live logs (e.g., *"[SUCCESS] Extracted 56 words in 2.47s"*) directly to the frontend console.

### How Similarity Metrics are Evaluated
The system uses a mathematical aggregation of three distinct algorithms to compute a final normalized score (0.0 to 1.0) between the extracted text and the ground truth.

1. **Edit Distance (Levenshtein):** Computes the minimum number of single-character edits required to change one string into the other. This measures raw transcription exactness.
2. **TF-IDF (Term Frequency-Inverse Document Frequency):** Converts texts into vector spaces based on word frequencies and computes Cosine Similarity. This measures keyword overlap while ignoring grammar.
3. **Semantic Embeddings:** Uses Hugging Face `sentence-transformers` (`all-MiniLM-L6-v2`) to generate dense neural vectors and compute cosine similarity. This captures semantic meaning (e.g., "The cat rested" vs. "A feline slept" scores highly despite no keyword overlap).

*Note: The `SimilarityAggregator` class securely bounds all outputs between 0 and 1 and computes a weighted mean (currently 1:1:1 by default) for the Final Similarity Score.*

---

## 🔄 End-to-End Workflow

1. **Upload:** User provides document files (PDF, JPG, PNG) via the React frontend.
2. **Dispatch:** Frontend makes a `multipart/form-data` POST request to the FastAPI backend.
3. **Parse & Strategy Selection:** `FileHandler` converts byte streams into PIL Images. The `StrategyFactory` dynamically instantiates the correct extraction logic (e.g., `APIStrategy`).
4. **Extraction:** The chosen strategy communicates with external APIs or local models to yield a raw text string.
5. **Preprocessing:** Raw strings are sanitized (removing excessive whitespace and artifacts) by the `TextPreprocessor`.
6. **Evaluation:** The sanitized strings are passed to the `SimilarityAggregator` which polls the three mathematical models.
7. **Response & Storage:** The final scores are streamed back to the client UI and asynchronously persisted to the SQLite database via `ResultsStore`.

---

## ⚙️ Setup & Installation Instructions

This project requires a decoupled installation of both the backend (Python) and the frontend (Node.js).

### 1. Prerequisites & Environment Configuration

You must have **Python 3.9+** and **Node.js (v18+)** installed.

**Tesseract OCR Installation:**
Tesseract must be installed at the operating system level for the traditional OCR strategy to function.
- **Windows:** Download the installer from [UB-Mannheim](https://github.com/UB-Mannheim/tesseract/wiki). 
  - *CRITICAL:* You must add the installation path (usually `C:\Program Files\Tesseract-OCR`) to your System `PATH` environment variable.
- **macOS:** `brew install tesseract`
- **Linux (Ubuntu):** `sudo apt-get install tesseract-ocr`

### 2. Backend Setup (FastAPI)

1. **Navigate to the root directory:**
   ```bash
   cd OOPs-Lab-project
   ```
2. **Create and activate a virtual environment:**
   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. **Install Python dependencies:**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
   *(Note: The first time `sentence-transformers` runs, it will download an ~80MB model to your local Hugging Face cache).*

### 3. Frontend Setup (React/Vite)

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install Node modules:**
   ```bash
   npm install
   ```

---

## 🚀 Running the Application

To run the full stack, you need two terminal windows open simultaneously.

**Terminal 1: Start the Backend Server**
```bash
# From the repository root (ensure .venv is active)
uvicorn api:app --host 0.0.0.0 --port 8000
```
*(The backend will run on `http://localhost:8000`)*

**Terminal 2: Start the Frontend UI**
```bash
# From the /frontend directory
npm run dev
```
*(The frontend will run on `http://localhost:5173`. Open this URL in your browser).*

---

## 🔌 API Usage Overview

The FastAPI backend is fully self-documenting. When the backend is running, navigate to `http://localhost:8000/docs` to view the Swagger UI.

**Core Endpoints:**
- `POST /api/analyze`: Synchronously analyzes two uploaded documents and returns static JSON scores.
- `POST /api/analyze/stream`: Uses Server-Sent Events (SSE) to stream live execution logs and progress before yielding the final analysis payload.
- `POST /api/arena/stream`: Accepts a batch dataset path and streams benchmarking results across multiple configured extraction strategies.
- `GET /api/history`: Retrieves paginated history of past runs from the SQLite `Laboratory` database.
