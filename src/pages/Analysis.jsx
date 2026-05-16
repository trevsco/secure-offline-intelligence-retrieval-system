const Analysis = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-blue-900 mb-2">
        Document Analysis
      </h1>

      <p className="text-gray-600 mb-8">
        Analyze uploaded documents and generate summarized insights.
      </p>

      {/* Main Analysis Container */}
      <div className="bg-white border border-gray-300 rounded-md p-6">

        {/* Selected Document */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Selected Document
          </p>

          <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
            radar_report.pdf
          </div>
        </div>

        {/* Analyze Button */}
        <button className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 mb-8">
          Analyze Document
        </button>

        {/* Summary Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Generated Summary
          </h2>

          <div className="border border-gray-300 rounded-md p-5 bg-gray-50 leading-relaxed text-gray-700">
            This report describes the radar communication architecture,
            encrypted transmission protocols, operational monitoring
            methods, and signal processing mechanisms used within
            the surveillance system. The document also highlights
            secure communication procedures and X-band frequency
            operations for reliable data transmission.
          </div>
        </div>

        {/* Key Topics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Key Topics Identified
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-gray-300 rounded-md p-3 bg-gray-50 text-center">
              X-Band Radar
            </div>

            <div className="border border-gray-300 rounded-md p-3 bg-gray-50 text-center">
              Encryption
            </div>

            <div className="border border-gray-300 rounded-md p-3 bg-gray-50 text-center">
              Signal Processing
            </div>

            <div className="border border-gray-300 rounded-md p-3 bg-gray-50 text-center">
              Monitoring System
            </div>
          </div>
        </div>

        {/* Important Observation */}
        <div>
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Important Observation
          </h2>

          <div className="border border-yellow-300 bg-yellow-50 rounded-md p-5 text-yellow-900">
            Sensitive encrypted communication protocols detected
            within the uploaded document.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;