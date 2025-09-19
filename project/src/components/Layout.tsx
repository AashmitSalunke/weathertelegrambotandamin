import React from 'react';
import { NavLink } from 'react-router-dom';
import { Cloud, Plus, Bell, Activity, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Cloud className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Weather Admin</h1>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <Activity className="w-4 h-4 mr-2" />
                Dashboard
              </NavLink>
              <NavLink
                to="/add-city"
                className={({ isActive }) =>
                  `inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add City
              </NavLink>
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </NavLink>
              <NavLink
                to="/historical"
                className={({ isActive }) =>
                  `inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Historical Data
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;