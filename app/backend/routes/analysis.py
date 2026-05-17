"""
POST /api/analyze
  Body: { "filename": "radar_report.pdf" }
  - Retrieves all stored chunks for the document
  - Sends to TinyLlama via Ollama for:
      1. Summary
      2. Key topics
      3. Important observation / flag
  - Returns structured JSON
"""
from flask import Blueprint, request, jsonify
from utils import get_collection, ollama_generate
import json, re

analysis_bp = Blueprint("analysis", __name__)


def safe_parse_json(text: str):
    """Try to parse JSON from model output; fall back to raw text."""
    # Strip markdown fences if present
    cleaned = re.sub(r"```(?:json)?", "", text).strip().rstrip("`").strip()
    try:
        return json.loads(cleaned)
    except Exception:
        return None


@analysis_bp.route("/analyze", methods=["POST"])
def analyze_document():
    data = request.get_json(silent=True) or {}
    filename = data.get("filename", "").strip()

    if not filename:
        return jsonify({"error": "filename is required."}), 400

    # Retrieve all chunks for this document
    collection = get_collection()
    results = collection.get(include=["documents", "metadatas"])

    chunks = [
        doc
        for doc, meta in zip(results.get("documents", []), results.get("metadatas", []))
        if meta.get("filename") == filename
    ]

    if not chunks:
        return jsonify({"error": f"No indexed content found for '{filename}'."}), 404

    # Combine chunks (truncate to avoid TinyLlama context limit)
    full_text = "\n\n".join(chunks)
    # TinyLlama context is ~2k tokens — keep roughly 1500 words
    words = full_text.split()
    if len(words) > 1500:
        full_text = " ".join(words[:1500]) + "\n\n[... document truncated for analysis ...]"

    system_prompt = (
        "You are a document analysis assistant. "
        "Read the document excerpt and respond ONLY with a valid JSON object — "
        "no explanation, no markdown, no preamble. "
        'Use this exact structure: {"summary": "...", "key_topics": ["...", "..."], "observation": "..."}'
    )

    user_prompt = (
        f"Analyze the following document and return a JSON with:\n"
        f"- summary: a 2-3 sentence summary\n"
        f"- key_topics: list of 4-6 key topics (short phrases)\n"
        f"- observation: one important or sensitive observation\n\n"
        f"Document:\n{full_text}"
    )

    raw_response = ollama_generate(prompt=user_prompt, system=system_prompt)
    parsed = safe_parse_json(raw_response)

    if parsed:
        return jsonify({
            "filename": filename,
            "summary": parsed.get("summary", ""),
            "key_topics": parsed.get("key_topics", []),
            "observation": parsed.get("observation", ""),
        }), 200
    else:
        # Fallback: return raw model output as summary
        return jsonify({
            "filename": filename,
            "summary": raw_response,
            "key_topics": [],
            "observation": "Could not parse structured output from model.",
        }), 200