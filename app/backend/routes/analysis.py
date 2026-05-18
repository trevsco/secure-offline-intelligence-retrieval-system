from flask import Blueprint, request, jsonify
from utils import get_collection, ollama_generate
import re

analysis_bp = Blueprint("analysis", __name__)


@analysis_bp.route("/analyze", methods=["POST"])
def analyze_document():
    data = request.get_json(silent=True) or {}
    filename = data.get("filename", "").strip()

    if not filename:
        return jsonify({"error": "filename is required."}), 400

    collection = get_collection()
    results = collection.get(include=["documents", "metadatas"])

    chunks = [
        doc
        for doc, meta in zip(results.get("documents", []), results.get("metadatas", []))
        if meta.get("filename") == filename
    ]

    if not chunks:
        return jsonify({"error": f"No indexed content found for '{filename}'."}), 404

    full_text = "\n\n".join(chunks)
    words = full_text.split()
    if len(words) > 1500:
        full_text = " ".join(words[:1500])

    # Summary
    summary = ollama_generate(
        prompt=f"Summarize the following document in 2-3 sentences. Only use information from the document. Do not add anything extra.\n\nDocument:\n{full_text}\n\nSummary:",
    )

    # Key Topics
    topics_raw = ollama_generate(
        prompt=f"List exactly 4 key topics from this document as very short phrases (2-4 words each). Output only the 4 topics, one per line, no numbering, no extra text.\n\nDocument:\n{full_text}\n\nTopics:",
    )
    key_topics = [
        line.strip().lstrip("-•*123456789. ")
        for line in topics_raw.strip().splitlines()
        if line.strip() and len(line.strip()) < 40
    ][:4]

    # Observation
    observation = ollama_generate(
        prompt=f"Based only on the document below, state one important observation. Do not add opinions or outside knowledge. Only use what is written.\n\nDocument:\n{full_text}\n\nObservation:",
    )

    return jsonify({
        "filename": filename,
        "summary": summary.strip(),
        "key_topics": key_topics,
        "observation": observation.strip(),
    }), 200