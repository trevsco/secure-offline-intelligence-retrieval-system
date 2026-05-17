import { useEffect, useRef, useState } from "react";
import api from "../api";

const Upload = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef();

  const fetchDocuments = () => {
    api.getDocuments()
      .then((res) => setDocuments(res.documents || []))
      .catch(() => setError("Could not fetch documents."));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.uploadDocument(file);
      if (res.error) {
        setError(res.error);
      } else {
        setMessage(`"${res.filename}" uploaded and indexed (${res.chunks_indexed} chunks).`);
        fetchDocuments();
      }
    } catch {
      setError("Upload failed. Is the backend running?");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;
    try {
      await api.deleteDocument(filename);
      fetchDocuments();
    } catch {
      setError("Delete failed.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-blue-900 mb-2">Upload Documents</h1>
      <p className="text-gray-600 mb-8">Upload confidential PDF or text documents.</p>

      <div className="bg-white border border-gray-300 rounded-md p-8">

        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-md p-12 text-center bg-gray-50 cursor-pointer transition-colors ${
            dragging ? "border-blue-500 bg-blue-50" : "border-gray-400"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <p className="text-lg">Drag & Drop Files Here</p>
          <p className="text-gray-500 mt-2">PDF, TXT, DOCX</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.docx"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files[0])}
          />
        </div>

        <button
          className="mt-6 bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 disabled:opacity-50"
          disabled={uploading}
          onClick={() => fileInputRef.current.click()}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {/* Feedback */}
        {message && (
          <div className="mt-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded-md">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Document List */}
        <div className="mt-8 space-y-3">
          {documents.length === 0 ? (
            <p className="text-gray-500">No documents indexed yet.</p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.doc_id}
                className="border border-gray-300 rounded-md p-4 flex justify-between items-center"
              >
                <span>{doc.filename}</span>
                <div className="flex items-center gap-4">
                  <span className="text-green-700">{doc.status}</span>
                  <button
                    className="text-sm text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(doc.filename)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;