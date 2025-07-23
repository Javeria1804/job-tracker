import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus, 
  Menu, 
  X, 
  Briefcase,
  Download,
  Upload,
  TrendingUp,
  Award,
  Users,
  Clock
} from 'lucide-react';
import { useJobs } from '../context/JobContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { actions, jobs } = useJobs();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      current: location.pathname === '/'
    },
    {
      name: 'Add Job',
      href: '/add',
      icon: Plus,
      current: location.pathname === '/add'
    },
  ];

  const handleExport = () => {
    actions.exportJobs();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      actions.importJobs(file)
        .then((result) => {
          alert(`Successfully imported ${result.imported} jobs${result.skipped > 0 ? ` (${result.skipped} skipped)` : ''}`);
        })
        .catch((error) => {
          alert(`Import failed: ${error.message}`);
        });
    }
    // Reset file input
    event.target.value = '';
  };

  const stats = actions.getJobStats();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:z-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold">JobTracker</h1>
                <p className="text-primary-100 text-sm">Track your career journey</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Cards */}
          <div className="p-6 bg-gradient-to-b from-primary-50 to-white">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Jobs</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.Offer || 0}</div>
                <div className="text-sm text-gray-600">Offers</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg mx-auto mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.Interviewing || 0}</div>
                <div className="text-sm text-gray-600">Interviewing</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mx-auto mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{((stats.Offer || 0) / Math.max(stats.total, 1) * 100).toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-4 space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Navigation
            </div>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
                    ${item.current
                      ? 'bg-primary-100 text-primary-700 shadow-sm border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`
                    mr-3 w-5 h-5 transition-colors
                    ${item.current ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}
                  `} />
                  {item.name}
                  {item.current && (
                    <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Import/Export Actions */}
          <div className="p-6 border-t bg-gray-50">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Data Management
            </div>
            <div className="space-y-3">
              <button
                onClick={handleExport}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                disabled={jobs.length === 0}
              >
                <Download className="mr-3 w-4 h-4 text-green-600" />
                Export Data
              </button>
              
              <label className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer shadow-sm">
                <Upload className="mr-3 w-4 h-4 text-blue-600" />
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {location.pathname === '/' && 'Dashboard'}
                  {location.pathname === '/add' && 'Add New Job'}
                  {location.pathname.startsWith('/job/') && 'Job Details'}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {location.pathname === '/' && 'Overview of your job application progress'}
                  {location.pathname === '/add' && 'Create a new job application entry'}
                  {location.pathname.startsWith('/job/') && 'Manage your job application details'}
                </p>
              </div>
            </div>

            {/* Quick stats for larger screens */}
            <div className="hidden xl:flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">{stats.Applied || 0}</span>
                  <span className="text-gray-500 ml-1">Applied</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">{stats.Interviewing || 0}</span>
                  <span className="text-gray-500 ml-1">Interviewing</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">{stats.Offer || 0}</span>
                  <span className="text-gray-500 ml-1">Offers</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">{stats.Rejected || 0}</span>
                  <span className="text-gray-500 ml-1">Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
