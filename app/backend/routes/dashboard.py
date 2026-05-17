"""
GET /api/dashboard
  - Returns document count, system status, recent activity log
"""
import os
from datetime import datetime
from flask import Blueprint, jsonify
from utils import get_collection

dashboard_bp = Blueprint("dashboard", __name__)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")

# In-memory activity log (resets on server restart)
_activity_log = []

def log_activity(message: str):
    _activity_log.append({
        "message": message,
        "time": datetime.now().strftime("%I:%M %p"),
    })
    # Keep only last 20 entries
    if len(_activity_log) > 20:
        _activity_log.pop(0)


@dashboard_bp.route("/dashboard", methods=["GET"])
def dashboard():
    collection = get_collection()
    results = collection.get(include=["metadatas"])

    # Count unique documents
    filenames = set(
        meta.get("filename") for meta in results.get("metadatas", []) if meta.get("filename")
    )

    # Build recent activity from upload dir + chroma
    activity = list(reversed(_activity_log[-10:]))

    # Fallback: list files from uploads dir
    if not activity:
        try:
            files = sorted(
                os.listdir(UPLOAD_DIR),
                key=lambda f: os.path.getmtime(os.path.join(UPLOAD_DIR, f)),
                reverse=True,
            )
            for f in files[:5]:
                mtime = os.path.getmtime(os.path.join(UPLOAD_DIR, f))
                activity.append({
                    "message": f"Document uploaded: {f}",
                    "time": datetime.fromtimestamp(mtime).strftime("%I:%M %p"),
                })
        except Exception:
            pass

    return jsonify({
        "documents_indexed": len(filenames),
        "system_status": "Active",
        "processing_mode": "Local (Ollama + ChromaDB)",
        "recent_activity": activity,
    }), 200


@dashboard_bp.route("/activity", methods=["POST"])
def add_activity():
    """Internal endpoint to log activity events."""
    from flask import request
    data = request.get_json(silent=True) or {}
    msg = data.get("message", "")
    if msg:
        log_activity(msg)
    return jsonify({"ok": True}), 200