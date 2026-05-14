const Settings = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-blue-900 mb-2">
        Settings
      </h1>

      <p className="text-gray-600 mb-8">
        Configure local processing settings.
      </p>

      <div className="space-y-5">
        <div className="bg-white border border-gray-300 rounded-md p-5 flex justify-between items-center">
          <div>
            <h2 className="font-semibold">Offline Mode</h2>
            <p className="text-sm text-gray-500">
              Prevent external network access.
            </p>
          </div>

          <span className="text-green-700 font-medium">Enabled</span>
        </div>

        <div className="bg-white border border-gray-300 rounded-md p-5 flex justify-between items-center">
          <div>
            <h2 className="font-semibold">Storage Location</h2>
            <p className="text-sm text-gray-500">
              Documents stored locally.
            </p>
          </div>

          <span className="font-medium">Local Drive</span>
        </div>

        <div className="bg-white border border-gray-300 rounded-md p-5 flex justify-between items-center">
          <div>
            <h2 className="font-semibold">Model Status</h2>
            <p className="text-sm text-gray-500">
              Local AI processing engine.
            </p>
          </div>

          <span className="text-green-700 font-medium">Ready</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;