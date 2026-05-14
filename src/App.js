import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Search from "./pages/Search";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex bg-gray-100">
        
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-300 p-6">
          <h1 className="text-xl font-semibold text-blue-900 mb-8">
            DRDO Retrieval System
          </h1>

          <nav className="space-y-2">
            <Link
              to="/"
              className="block px-4 py-3 rounded-md hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              to="/upload"
              className="block px-4 py-3 rounded-md hover:bg-gray-100"
            >
              Upload Documents
            </Link>

            <Link
              to="/search"
              className="block px-4 py-3 rounded-md hover:bg-gray-100"
            >
              Search Records
            </Link>

            <Link
              to="/settings"
              className="block px-4 py-3 rounded-md hover:bg-gray-100"
            >
              Settings
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;