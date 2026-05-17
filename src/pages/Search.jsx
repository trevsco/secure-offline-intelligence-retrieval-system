import { useState } from "react";
import api from "../api";

const Search = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await api.search(query);
      if (res.error) setError(res.error);
      else setResult(res);
    } catch {
      setError("Search failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) handleSearch();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-blue-900 mb-2">Search Records</h1>
      <p className="text-gray-600 mb-8">Retrieve information from indexed documents.</p>

      <div className="bg-white border border-gray-300 rounded-md p-6">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your query... (Ctrl+Enter to search)"
          className="w-full h-36 border border-gray-300 rounded-md p-4 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <button
          className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 disabled:opacity-50"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
        >
          {loading ? "Searching..." : "Retrieve"}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
            Searching documents and generating answer...
          </div>
        )}

        {result && (
          <>
            {/* Answer */}
            <div className="mt-8 border border-gray-300 rounded-md p-5 bg-gray-50">
              <h2 className="text-lg font-semibold mb-3">Retrieved Information</h2>
              <p className="text-gray-700 leading-relaxed">{result.answer}</p>
            </div>

            {/* Sources */}
            {result.sources && result.sources.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3 text-blue-900">Sources</h2>
                <div className="space-y-3">
                  {result.sources.map((src, i) => (
                    <div key={i} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {src.filename} — Page ~{src.page}
                        </span>
                        <span className="text-sm text-blue-700">
                          Relevance: {(src.relevance_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{src.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;