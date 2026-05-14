const Upload = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-blue-900 mb-2">
        Upload Documents
      </h1>

      <p className="text-gray-600 mb-8">
        Upload confidential PDF or text documents.
      </p>

      <div className="bg-white border border-gray-300 rounded-md p-8">
        <div className="border-2 border-dashed border-gray-400 rounded-md p-12 text-center bg-gray-50">
          <p className="text-lg">Drag & Drop Files Here</p>
          <p className="text-gray-500 mt-2">PDF, TXT, DOCX</p>
        </div>

        <button className="mt-6 bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800">
          Upload
        </button>

        <div className="mt-8 space-y-3">
          <div className="border border-gray-300 rounded-md p-4 flex justify-between">
            <span>radar_report.pdf</span>
            <span className="text-green-700">Indexed</span>
          </div>

          <div className="border border-gray-300 rounded-md p-4 flex justify-between">
            <span>communication_logs.pdf</span>
            <span className="text-green-700">Indexed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;