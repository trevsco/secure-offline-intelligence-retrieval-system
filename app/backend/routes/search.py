"""
POST /api/search
  Body: { "query": "...", "top_k": 5 }
  - Embeds query via Ollama
  - Runs cosine similarity search in ChromaDB
  - Feeds top-k chunks + query to TinyLlama
  - Returns answer + source references
"""
from flask import Blueprint, request, jsonify
from utils import get_collection, ollama_embed, ollama_generate

search_bp = Blueprint("search", __name__)


@search_bp.route("/search", methods=["POST"])
def search_documents():
    data = request.get_json(silent=True) or {}
    query = data.get("query", "").strip()
    top_k = int(data.get("top_k", 5))

    if not query:
        return jsonify({"error": "query is required."}), 400

    # Embed the query
    query_embedding = ollama_embed(query)

    # Retrieve top-k similar chunks from ChromaDB
    collection = get_collection()

    count = collection.count()
    if count == 0:
        return jsonify({"error": "No documents indexed yet. Please upload a document first."}), 404

    actual_k = min(top_k, count)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=actual_k,
        include=["documents", "metadatas", "distances"],
    )

    docs = results.get("documents", [[]])[0]
    metas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    if not docs:
        return jsonify({
            "answer": "No relevant content found for your query.",
            "sources": [],
        }), 200

    # Build context for RAG prompt
    context_parts = []
    sources = []
    for doc, meta, dist in zip(docs, metas, distances):
        fn = meta.get("filename", "unknown")
        chunk_idx = meta.get("chunk_index", 0)
        # Approximate page number (every ~2 chunks ≈ 1 page)
        approx_page = (chunk_idx // 2) + 1
        context_parts.append(f"[Source: {fn}, Page ~{approx_page}]\n{doc}")
        sources.append({
            "filename": fn,
            "page": approx_page,
            "relevance_score": round(1 - dist, 3),
            "excerpt": doc[:200] + ("..." if len(doc) > 200 else ""),
        })

    context = "\n\n---\n\n".join(context_parts)

    system_prompt = (
        "You are a document retrieval assistant. "
        "Answer the user's question using ONLY the provided document excerpts. "
        "Be concise and factual. If the answer is not in the excerpts, say so."
    )

    user_prompt = (
        f"Question: {query}\n\n"
        f"Document Excerpts:\n{context}\n\n"
        f"Answer:"
    )

    answer = ollama_generate(prompt=user_prompt, system=system_prompt)

    return jsonify({
        "query": query,
        "answer": answer,
        "sources": sources,
    }), 200