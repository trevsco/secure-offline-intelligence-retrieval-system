"""
POST /api/upload
  - Accepts PDF, TXT, DOCX
  - Extracts text
  - Chunks + embeds via Ollama
  - Stores vectors in ChromaDB
  - Saves file to ./uploads/

GET /api/documents
  - Lists all indexed documents
"""
import os
import uuid
import fitz          # PyMuPDF
import docx          # python-docx
from flask import Blueprint, request, jsonify
from utils import get_collection, ollama_embed, chunk_text

upload_bp = Blueprint("upload", __name__)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {"pdf", "txt", "docx"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_text(filepath: str, filename: str) -> str:
    ext = filename.rsplit(".", 1)[1].lower()
    if ext == "pdf":
        doc = fitz.open(filepath)
        return "\n".join(page.get_text() for page in doc)
    elif ext == "txt":
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    elif ext == "docx":
        doc = docx.Document(filepath)
        return "\n".join(p.text for p in doc.paragraphs)
    return ""


@upload_bp.route("/upload", methods=["POST"])
def upload_document():
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file type. Use PDF, TXT, or DOCX."}), 400

    # Save file
    safe_name = file.filename.replace(" ", "_")
    filepath = os.path.join(UPLOAD_DIR, safe_name)
    file.save(filepath)

    # Extract text
    text = extract_text(filepath, safe_name)
    if not text.strip():
        return jsonify({"error": "Could not extract text from document."}), 422

    # Chunk + embed + store
    collection = get_collection()
    chunks = chunk_text(text)

    doc_id = str(uuid.uuid4())
    ids, embeddings, documents, metadatas = [], [], [], []

    for i, chunk in enumerate(chunks):
        embedding = ollama_embed(chunk)
        chunk_id = f"{doc_id}_chunk_{i}"
        ids.append(chunk_id)
        embeddings.append(embedding)
        documents.append(chunk)
        metadatas.append({
            "filename": safe_name,
            "doc_id": doc_id,
            "chunk_index": i,
            "total_chunks": len(chunks),
        })

    collection.add(ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas)

    return jsonify({
        "message": "Document uploaded and indexed successfully.",
        "filename": safe_name,
        "doc_id": doc_id,
        "chunks_indexed": len(chunks),
        "status": "Indexed",
    }), 200


@upload_bp.route("/documents", methods=["GET"])
def list_documents():
    """Return unique documents stored in ChromaDB."""
    collection = get_collection()
    results = collection.get(include=["metadatas"])

    seen = {}
    for meta in results.get("metadatas", []):
        fn = meta.get("filename")
        if fn and fn not in seen:
            seen[fn] = {
                "filename": fn,
                "doc_id": meta.get("doc_id"),
                "total_chunks": meta.get("total_chunks"),
                "status": "Indexed",
            }

    return jsonify({"documents": list(seen.values())}), 200


@upload_bp.route("/documents/<filename>", methods=["DELETE"])
def delete_document(filename: str):
    """Delete all chunks for a given filename from ChromaDB."""
    collection = get_collection()
    results = collection.get(include=["metadatas"])

    ids_to_delete = [
        rid
        for rid, meta in zip(results["ids"], results["metadatas"])
        if meta.get("filename") == filename
    ]

    if not ids_to_delete:
        return jsonify({"error": "Document not found."}), 404

    collection.delete(ids=ids_to_delete)

    # Also remove from disk
    filepath = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(filepath):
        os.remove(filepath)

    return jsonify({"message": f"{filename} deleted.", "deleted_chunks": len(ids_to_delete)}), 200