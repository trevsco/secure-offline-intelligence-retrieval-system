/**
 * api.js — drop this into your React src/ folder.
 * Import and use in Dashboard, Upload, Analysis, Search pages.
 *
 * Usage:
 *   import api from "../api";
 *   const stats = await api.getDashboard();
 */

const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = {
  // ── Dashboard ──────────────────────────────────────────────────────────────
  async getDashboard() {
    const res = await fetch(`${BASE}/dashboard`);
    return res.json();
    // Returns: { documents_indexed, system_status, processing_mode, recent_activity }
  },

  // ── Upload ─────────────────────────────────────────────────────────────────
  async uploadDocument(file) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${BASE}/upload`, { method: "POST", body: form });
    return res.json();
    // Returns: { message, filename, doc_id, chunks_indexed, status }
  },

  async getDocuments() {
    const res = await fetch(`${BASE}/documents`);
    return res.json();
    // Returns: { documents: [{ filename, doc_id, total_chunks, status }] }
  },

  async deleteDocument(filename) {
    const res = await fetch(`${BASE}/documents/${encodeURIComponent(filename)}`, {
      method: "DELETE",
    });
    return res.json();
    // Returns: { message, deleted_chunks }
  },

  // ── Analysis ───────────────────────────────────────────────────────────────
  async analyzeDocument(filename) {
    const res = await fetch(`${BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });
    return res.json();
    // Returns: { filename, summary, key_topics: [], observation }
  },

  // ── Search ─────────────────────────────────────────────────────────────────
  async search(query, top_k = 5) {
    const res = await fetch(`${BASE}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, top_k }),
    });
    return res.json();
    // Returns: { query, answer, sources: [{ filename, page, relevance_score, excerpt }] }
  },
};

export default api;