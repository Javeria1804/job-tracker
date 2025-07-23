import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Calendar, 
  Building2, 
  User, 
  FileText,
  Clock,
  ExternalLink,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { useJobs, JOB_STATUSES } from '../context/JobContext';
import { formatDate, formatRelativeTime, getStatusColor, validateJobForm } from '../utils/helpers';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { actions } = useJobs();
  
  const [job, setJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(location.state?.message || '');

  useEffect(() => {
    const jobData = actions.getJobById(id);
    if (jobData) {
      setJob(jobData);
      setEditData({
        company: jobData.company,
        position: jobData.position,
        status: jobData.status,
        applicationDate: jobData.applicationDate,
        notes: jobData.notes || ''
      });
    } else {
      navigate('/', { state: { error: 'Job not found' } });
    }
  }, [id, actions, navigate]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      company: job.company,
      position: job.position,
      status: job.status,
      applicationDate: job.applicationDate,
      notes: job.notes || ''
    });
    setErrors({});
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    const validation = validateJobForm(editData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const updatedJob = actions.updateJob(id, editData);
      setJob(updatedJob);
      setIsEditing(false);
      setMessage('Job application updated successfully!');
    } catch (error) {
      console.error('Failed to update job:', error);
      setErrors({ submit: 'Failed to update job application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job application? This action cannot be undone.')) {
      try {
        actions.deleteJob(id);
        navigate('/', { state: { message: 'Job application deleted successfully.' } });
      } catch (error) {
        console.error('Failed to delete job:', error);
        setMessage('Failed to delete job application. Please try again.');
      }
    }
  };

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Success Message */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 text-green-400">✅</div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">{message}</p>
                </div>
              </div>
              <button
                onClick={() => setMessage('')}
                className="text-green-400 hover:text-green-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.company}</h1>
              <p className="text-xl text-gray-600 mt-1">{job.position}</p>
              <div className="flex items-center mt-2">
                <span className={`status-badge ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
                <span className="ml-4 text-sm text-gray-500">
                  Applied {formatRelativeTime(job.applicationDate)}
                </span>
              </div>
            </div>
          </div>
          
          {!isEditing && (
            <div className="flex items-center space-x-3 mt-6 lg:mt-0">
              <button
                onClick={handleEdit}
                className="btn-secondary flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Information */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Job Information</h2>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{errors.submit}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={editData.company}
                      onChange={handleInputChange}
                      className={`mt-1 input-field ${errors.company ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                      Job Position *
                    </label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={editData.position}
                      onChange={handleInputChange}
                      className={`mt-1 input-field ${errors.position ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.position && (
                      <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Application Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={editData.status}
                      onChange={handleInputChange}
                      className={`mt-1 select-field ${errors.status ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    >
                      {Object.values(JOB_STATUSES).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="applicationDate" className="block text-sm font-medium text-gray-700">
                      Application Date *
                    </label>
                    <input
                      type="date"
                      id="applicationDate"
                      name="applicationDate"
                      value={editData.applicationDate}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={`mt-1 input-field ${errors.applicationDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.applicationDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.applicationDate}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={editData.notes}
                    onChange={handleInputChange}
                    className="mt-1 input-field resize-none"
                    placeholder="Add any additional notes about this application..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn-secondary"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="text-sm font-medium text-gray-900">{job.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="text-sm font-medium text-gray-900">{job.position}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Application Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(job.applicationDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="text-sm font-medium text-gray-900">{formatRelativeTime(job.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {!isEditing && (
            <div className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
                </div>
              </div>
              <div className="p-6">
                {job.notes ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{job.notes}</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notes added yet</p>
                    <button
                      onClick={handleEdit}
                      className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Add notes
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/"
                className="w-full btn-secondary text-center"
              >
                Back to Dashboard
              </Link>
              <Link
                to="/add"
                className="w-full btn-primary text-center"
              >
                Add Another Job
              </Link>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(job.position + ' ' + job.company)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-secondary text-center flex items-center justify-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Search Online
              </a>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Application Created</p>
                  <p className="text-xs text-gray-500">{formatDate(job.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Applied to {job.company}</p>
                  <p className="text-xs text-gray-500">{formatDate(job.applicationDate)}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Status: {job.status}</p>
                  <p className="text-xs text-gray-500">{formatDate(job.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Guide */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Status Guide</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="status-badge bg-blue-100 text-blue-800">Applied</span>
                <span className="text-blue-700">Application submitted</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="status-badge bg-yellow-100 text-yellow-800">Interviewing</span>
                <span className="text-blue-700">In interview process</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="status-badge bg-green-100 text-green-800">Offer</span>
                <span className="text-blue-700">Job offer received</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="status-badge bg-red-100 text-red-800">Rejected</span>
                <span className="text-blue-700">Application declined</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
