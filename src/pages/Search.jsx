const Search = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-blue-900 mb-2">
        Search Records
      </h1>

      <p className="text-gray-600 mb-8">
        Retrieve information from indexed documents.
      </p>

      <div className="bg-white border border-gray-300 rounded-md p-6">
        <textarea
          placeholder="Enter your query..."
          className="w-full h-36 border border-gray-300 rounded-md p-4 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <button className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800">
          Retrieve
        </button>

        <div className="mt-8 border border-gray-300 rounded-md p-5 bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">
            Retrieved Information
          </h2>

          <p className="text-gray-700 leading-relaxed">
            The uploaded radar communication report states that the
            monitoring system operates within the X-band frequency range
            and supports encrypted communication protocols.
          </p>

          <p className="mt-4 text-sm text-gray-500">
            Source: radar_report.pdf | Page 4
          </p>
        </div>
      </div>
    </div>
  );
};

export default Search;