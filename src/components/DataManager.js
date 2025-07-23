import React from 'react';
import { Database, Trash2, Download } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { generateSampleJobs } from '../utils/helpers';

const DataManager = () => {
  const { jobs, actions } = useJobs();

  const handleGenerateSampleData = () => {
    if (jobs.length > 0) {
      const confirm = window.confirm(
        'This will add sample data to your existing jobs. Continue?'
      );
      if (!confirm) return;
    }

    const sampleJobs = generateSampleJobs();
    sampleJobs.forEach(job => {
      actions.addJob(job);
    });
    
    alert(`Added ${sampleJobs.length} sample job applications!`);
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Database className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Generate Sample Data</h3>
          <p className="text-sm text-blue-700 mb-3">
            Add 15 sample job applications to see how the app works with data.
          </p>
          <button
            onClick={handleGenerateSampleData}
            className="btn-primary text-sm flex flex-row items-center"
          >
            <Database className="w-4 h-4 mr-2" />
            Generate Sample Jobs
          </button>
        </div>

        {/* <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-medium text-red-900 mb-2">Clear All Data</h3>
          <p className="text-sm text-red-700 mb-3">
            Permanently delete all job applications. This cannot be undone.
          </p>
          <button
            onClick={handleClearAllData}
            className="btn-danger text-sm flex flex-row items-center"
            disabled={jobs.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Data
          </button>
        </div> */}
      </div>

      {jobs.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <strong>Current Data:</strong> {jobs.length} job application{jobs.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManager;
