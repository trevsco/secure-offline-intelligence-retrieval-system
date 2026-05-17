import { useEffect, useState } from "react";
import api from "../api";

const Analysis = () => {
  const [documents, setDocuments] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getDocuments()
      .then((res) => {
        const docs = res.documents || [];
        setDocuments(docs);
        if (docs.length > 0) setSelected(docs[0].filename);
      })
      .catch(() => setError("Could not fetch documents."));
  }, []);

  const handleAnalyze = async () => {
    if (!selected) return;
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await api.analyzeDocument(selected);
      if (res.error) setError(res.error);
      else setResult(res);
    } catch {
      setError("Analysis failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-blue-900 mb-2">Document Analysis</h1>
      <p className="text-gray-600 mb-8">Analyze uploaded documents and generate summarized insights.</p>

      <div className="bg-white border border-gray-300 rounded-md p-6">

        {/* Document Selector */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Selected Document</p>
          {documents.length === 0 ? (
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50 text-gray-500">
              No documents indexed. Upload a document first.
            </div>
          ) : (
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {documents.map((doc) => (
                <option key={doc.doc_id} value={doc.filename}>
                  {doc.filename}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Analyze Button */}
        <button
          className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 disabled:opacity-50 mb-8"
          onClick={handleAnalyze}
          disabled={loading || !selected}
        >
          {loading ? "Analyzing..." : "Analyze Document"}
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
            TinyLlama is analyzing the document, this may take a minute...
          </div>
        )}

        {result && (
          <>
            {/* Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Generated Summary</h2>
              <div className="border border-gray-300 rounded-md p-5 bg-gray-50 leading-relaxed text-gray-700">
                {result.summary || "No summary generated."}
              </div>
            </div>

            {/* Key Topics */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Key Topics Identified</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {result.key_topics && result.key_topics.length > 0 ? (
                  result.key_topics.map((topic, i) => (
                    <div key={i} className="border border-gray-300 rounded-md p-3 bg-gray-50 text-center">
                      {topic}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-4">No topics identified.</p>
                )}
              </div>
            </div>

            {/* Observation */}
            <div>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Important Observation</h2>
              <div className="border border-yellow-300 bg-yellow-50 rounded-md p-5 text-yellow-900">
                {result.observation || "No observation noted."}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analysis;