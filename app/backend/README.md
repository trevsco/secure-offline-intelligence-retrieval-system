# Secure Retrieval System — Backend

Flask + ChromaDB + Ollama (TinyLlama) backend for the Secure Document Retrieval frontend.

---

## Prerequisites

- Python 3.10+
- [Ollama](https://ollama.com) installed and running locally

---

## 1. Install Ollama Models

```bash
# The LLM for analysis & search answers
ollama pull tinyllama

# The embedding model for vector search
ollama pull nomic-embed-text
```

Verify Ollama is running:
```bash
ollama serve
```

---

## 2. Set Up Python Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## 3. Run the Server

```bash
python app.py
```

Server starts at **http://localhost:5000**

---

## 4. Connect Your React Frontend

Create a `.env` file in your React project root:
REACT_APP_API_URL=http://localhost:5000/api

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/upload` | POST | Upload a file (multipart/form-data) |
| `/api/documents` | GET | List indexed documents |
| `/api/documents/<filename>` | DELETE | Delete a document |
| `/api/analyze` | POST | Analyze a document |
| `/api/search` | POST | RAG search query |
| `/api/dashboard` | GET | System stats |

---

## Project Structure
backend/
├── app.py
├── utils.py
├── requirements.txt
├── uploads/            # auto-created
├── chroma_store/       # auto-created
└── routes/
├── init.py     # empty file
├── upload.py
├── analysis.py
├── search.py
└── dashboard.py

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `tinyllama` | LLM for generation |
| `OLLAMA_EMBED_MODEL` | `nomic-embed-text` | Embedding model |