"""
Shared utilities: ChromaDB client, text chunking, Ollama inference.
"""
import os
import chromadb
import requests

# ── ChromaDB ────────────────────────────────────────────────────────────────
CHROMA_DIR = os.path.join(os.path.dirname(__file__), "chroma_store")
_chroma_client = None

def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        _chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)
    return _chroma_client

def get_collection():
    client = get_chroma_client()
    return client.get_or_create_collection(
        name="documents",
        metadata={"hnsw:space": "cosine"},
    )

# ── Ollama / TinyLlama ───────────────────────────────────────────────────────
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "tinyllama")
OLLAMA_EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")

def ollama_generate(prompt: str, system: str = "") -> str:
    """Call Ollama /api/generate and return the full response text."""
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
    }
    if system:
        payload["system"] = system

    resp = requests.post(f"{OLLAMA_URL}/api/generate", json=payload, timeout=120)
    resp.raise_for_status()
    return resp.json().get("response", "").strip()


def ollama_embed(text: str) -> list[float]:
    """Return an embedding vector for the given text using Ollama."""
    payload = {"model": OLLAMA_EMBED_MODEL, "prompt": text}
    resp = requests.post(f"{OLLAMA_URL}/api/embeddings", json=payload, timeout=60)
    resp.raise_for_status()
    return resp.json()["embedding"]


# ── Text chunking ────────────────────────────────────────────────────────────
def chunk_text(text: str, chunk_size: int = 400, overlap: int = 60) -> list[str]:
    """Split text into overlapping word-level chunks."""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunks.append(" ".join(words[start:end]))
        start += chunk_size - overlap
    return [c for c in chunks if c.strip()]