import { useEffect, useState } from "react";
import api from "../api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    documents_indexed: 0,
    system_status: "Loading...",
    processing_mode: "Local",
    recent_activity: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    api.getDashboard()
      .then(setStats)
      .catch(() => setError("Could not connect to backend."));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-blue-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Secure Document Retrieval Portal</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-300 rounded-md p-6">
          <p className="text-gray-500 text-sm">Documents Indexed</p>
          <h2 className="text-3xl font-semibold mt-2">{stats.documents_indexed}</h2>
        </div>

        <div className="bg-white border border-gray-300 rounded-md p-6">
          <p className="text-gray-500 text-sm">System Status</p>
          <h2 className="text-3xl font-semibold mt-2 text-green-700">{stats.system_status}</h2>
        </div>

        <div className="bg-white border border-gray-300 rounded-md p-6">
          <p className="text-gray-500 text-sm">Processing Mode</p>
          <h2 className="text-3xl font-semibold mt-2">{stats.processing_mode}</h2>
        </div>
      </div>

      <div className="bg-white border border-gray-300 rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Recent Activity</h2>

        {stats.recent_activity.length === 0 ? (
          <p className="text-gray-500">No activity yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.recent_activity.map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-md p-3 bg-gray-50 flex justify-between"
              >
                <span>{item.message}</span>
                <span className="text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;