const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-blue-900 mb-2">
        Dashboard
      </h1>

      <p className="text-gray-600 mb-8">
        Secure Offline Intelligence Retrieval System
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-300 rounded-md p-6">
          <p className="text-gray-500 text-sm">Documents Indexed</p>
          <h2 className="text-3xl font-semibold mt-2">12</h2>
        </div>

        <div className="bg-white border border-gray-300 rounded-md p-6">
          <p className="text-gray-500 text-sm">System Status</p>
          <h2 className="text-3xl font-semibold mt-2 text-green-700">
            Active
          </h2>
        </div>

        <div className="bg-white border border-gray-300 rounded-md p-6">
          <p className="text-gray-500 text-sm">Processing Mode</p>
          <h2 className="text-3xl font-semibold mt-2">Offline</h2>
        </div>
      </div>

      <div className="bg-white border border-gray-300 rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">
          Recent Activity
        </h2>

        <div className="space-y-3">
          <div className="border border-gray-200 rounded-md p-3 bg-gray-50 flex justify-between">
            <span>Document uploaded successfully</span>
            <span className="text-gray-500">10:42 AM</span>
          </div>

          <div className="border border-gray-200 rounded-md p-3 bg-gray-50 flex justify-between">
            <span>Offline processing enabled</span>
            <span className="text-gray-500">10:38 AM</span>
          </div>

          <div className="border border-gray-200 rounded-md p-3 bg-gray-50 flex justify-between">
            <span>Query processed locally</span>
            <span className="text-gray-500">10:31 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;