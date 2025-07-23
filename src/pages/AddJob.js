import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Building2, User, Calendar, FileText } from 'lucide-react';
import { useJobs, JOB_STATUSES } from '../context/JobContext';
import { validateJobForm } from '../utils/helpers';

const AddJob = () => {
  const navigate = useNavigate();
  const { actions } = useJobs();
  
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'Applied',
    applicationDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateJobForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newJob = actions.addJob(formData);
      navigate(`/job/${newJob.id}`, { 
        state: { message: 'Job application added successfully!' } 
      });
    } catch (error) {
      console.error('Failed to add job:', error);
      setErrors({ submit: 'Failed to add job application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Job Application</h1>
            <p className="text-gray-600 mt-1">Fill in the details of your job application</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

          {/* Company Name */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              <Building2 className="w-4 h-4 inline mr-2" />
              Company Name *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="e.g., Google, Microsoft, Apple"
              className={`mt-1 input-field ${errors.company ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-600">{errors.company}</p>
            )}
          </div>

          {/* Job Position */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">
              <User className="w-4 h-4 inline mr-2" />
              Job Position *
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="e.g., Frontend Developer, Product Manager"
              className={`mt-1 input-field ${errors.position ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.position && (
              <p className="mt-1 text-sm text-red-600">{errors.position}</p>
            )}
          </div>

          {/* Status and Application Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Application Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
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
                <Calendar className="w-4 h-4 inline mr-2" />
                Application Date *
              </label>
              <input
                type="date"
                id="applicationDate"
                name="applicationDate"
                value={formData.applicationDate}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className={`mt-1 input-field ${errors.applicationDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.applicationDate && (
                <p className="mt-1 text-sm text-red-600">{errors.applicationDate}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4 inline mr-2" />
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes about this application..."
              className="mt-1 input-field resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              You can include details like job requirements, interview dates, or any other relevant information.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary w-full sm:w-auto"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  Add Job Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">💡 Tips for tracking your applications</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
            <span>Be specific with the job position title to help you remember the role</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
            <span>Use the notes section to track important details like salary range or key requirements</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
            <span>Update the status as your application progresses through the hiring process</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
            <span>Set the correct application date to track your application timeline</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AddJob;
