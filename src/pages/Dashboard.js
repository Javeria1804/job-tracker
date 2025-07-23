import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  Building2,
  Eye,
  Edit3,
  Trash2,
  TrendingUp,
  Users,
  Clock,
  Award,
  ChevronDown,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import DataManager from '../components/DataManager';
import { 
  formatDate, 
  formatRelativeTime, 
  searchJobs, 
  filterJobsByStatus, 
  sortJobs,
  getStatusColor,
  calculateJobStats,
  debounce
} from '../utils/helpers';

const Dashboard = () => {
  const { jobs, actions, loading, error } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Memoized filtered and sorted jobs
  const filteredJobs = useMemo(() => {
    let filtered = searchJobs(jobs, searchTerm);
    filtered = filterJobsByStatus(filtered, statusFilter);
    return sortJobs(filtered, sortBy, sortOrder);
  }, [jobs, searchTerm, statusFilter, sortBy, sortOrder]);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((term) => setSearchTerm(term), 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        actions.deleteJob(jobId);
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
    }
  };

  const handleClearAllData = () => {
      const confirm = window.confirm(
        'This will permanently delete ALL job applications. This action cannot be undone. Are you sure?'
      );
      
      if (confirm) {
        const doubleConfirm = window.confirm(
          'Are you absolutely sure? This will delete all your data permanently.'
        );
        
        if (doubleConfirm) {
          // Clear all jobs by setting empty array
          localStorage.removeItem('jobApplications');
          window.location.reload(); // Reload to reset state
        }
      }
    };

  const stats = calculateJobStats(jobs);
  
  const statuses = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 text-red-400">⚠️</div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={actions.clearError}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</p>
              <div className="flex items-center text-sm text-gray-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                All time
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.interviewing}</p>
              <div className="flex items-center text-sm text-yellow-600">
                <Clock className="w-3 h-3 mr-1" />
                Active interviews
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Offers Received</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.offer}</p>
              <div className="flex items-center text-sm text-green-600">
                <Award className="w-3 h-3 mr-1" />
                Success stories
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Response Rate</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.responseRate}%</p>
              <div className="flex items-center text-sm text-purple-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                Overall performance
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by company, position, or location..."
                onChange={handleSearchChange}
                className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                showFilters 
                  ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                  : 'text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <button
                        onClick={handleClearAllData}
                        className="btn-danger text-sm flex flex-row items-center"
                        disabled={jobs.length === 0}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All Data
                      </button>
            <Link
              to="/add"
              className="flex items-center px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Job
            </Link>

          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-4">Filter by Status</label>
                <div className="space-y-3">
                  {statuses.map(status => (
                    <label key={status} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={statusFilter.includes(status)}
                        onChange={() => handleStatusFilterChange(status)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                      />
                      <span className={`ml-3 text-sm px-3 py-1.5 rounded-full font-medium transition-all ${getStatusColor(status)} group-hover:scale-105`}>
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-4">Sort by</label>
                <div className="space-y-2">
                  {[
                    { key: 'createdAt', label: 'Date Added' },
                    { key: 'applicationDate', label: 'Application Date' },
                    { key: 'company', label: 'Company' },
                    { key: 'position', label: 'Position' }
                  ].map(option => (
                    <button
                      key={option.key}
                      onClick={() => handleSort(option.key)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        sortBy === option.key
                          ? 'bg-primary-100 text-primary-700 border border-primary-200'
                          : 'text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.key && (
                        sortOrder === 'asc' 
                          ? <SortAsc className="w-4 h-4 text-primary-600" />
                          : <SortDesc className="w-4 h-4 text-primary-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {jobs.length === 0 ? 'No job applications yet' : 'No jobs match your filters'}
              </h3>
              <p className="text-gray-600 mb-6">
                {jobs.length === 0 
                  ? 'Start tracking your job applications by adding your first job.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {jobs.length === 0 && (
                <Link to="/add" className="btn-primary">
                  Add Your First Job
                </Link>
              )}
            </div>
          </div>
          
          {jobs.length === 0 && (
            <div className="space-y-6">
              <DataManager />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Position
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="relative px-6 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{job.company}</div>
                          <div className="text-sm text-gray-500">{job.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`status-badge ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(job.applicationDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatRelativeTime(job.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/job/${job.id}`}
                          className="text-primary-600 hover:text-primary-900 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/job/${job.id}/edit`}
                          className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
