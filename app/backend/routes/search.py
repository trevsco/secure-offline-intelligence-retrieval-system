"""
POST /api/search
"""
from flask import Blueprint, request, jsonify
from utils import get_collection, ollama_embed, ollama_generate

search_bp = Blueprint("search", __name__)

RELEVANCE_THRESHOLD = 0.40  # Minimum relevance to consider a chunk useful


@search_bp.route("/search", methods=["POST"])
def search_documents():
    data = request.get_json(silent=True) or {}
    query = data.get("query", "").strip()
    top_k = int(data.get("top_k", 5))

    if not query:
        return jsonify({"error": "query is required."}), 400

    query_embedding = ollama_embed(query)

    collection = get_collection()
    count = collection.count()
    if count == 0:
        return jsonify({"error": "No documents indexed yet."}), 404

    actual_k = min(top_k, count)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=actual_k,
        include=["documents", "metadatas", "distances"],
    )

    docs = results.get("documents", [[]])[0]
    metas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    # Filter by relevance threshold
    relevant_docs = []
    relevant_metas = []
    relevant_scores = []

    for doc, meta, dist in zip(docs, metas, distances):
        score = 1 - dist
        if score >= RELEVANCE_THRESHOLD:
            relevant_docs.append(doc)
            relevant_metas.append(meta)
            relevant_scores.append(score)

    # If nothing passes the threshold, return not found
    if not relevant_docs:
        return jsonify({
            "query": query,
            "answer": "The information requested is not found in the indexed documents.",
            "sources": [],
        }), 200

    # Build context for RAG
    context_parts = []
    sources = []
    for doc, meta, score in zip(relevant_docs, relevant_metas, relevant_scores):
        fn = meta.get("filename", "unknown")
        chunk_idx = meta.get("chunk_index", 0)
        approx_page = (chunk_idx // 2) + 1
        context_parts.append(f"[Source: {fn}, Page ~{approx_page}]\n{doc}")
        sources.append({
            "filename": fn,
            "page": approx_page,
            "relevance_score": round(score, 3),
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