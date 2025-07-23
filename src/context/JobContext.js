import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Job application interface
export const JOB_STATUSES = {
  APPLIED: 'Applied',
  INTERVIEWING: 'Interviewing',
  OFFER: 'Offer',
  REJECTED: 'Rejected'
};

const initialState = {
  jobs: [],
  loading: false,
  error: null
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOAD_JOBS: 'LOAD_JOBS',
  ADD_JOB: 'ADD_JOB',
  UPDATE_JOB: 'UPDATE_JOB',
  DELETE_JOB: 'DELETE_JOB'
};

// Reducer function
const jobsReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.LOAD_JOBS:
      return { ...state, jobs: action.payload, loading: false, error: null };
    
    case actionTypes.ADD_JOB:
      const newJobs = [...state.jobs, action.payload];
      localStorage.setItem('jobApplications', JSON.stringify(newJobs));
      return { ...state, jobs: newJobs, loading: false, error: null };
    
    case actionTypes.UPDATE_JOB:
      const updatedJobs = state.jobs.map(job => 
        job.id === action.payload.id ? action.payload : job
      );
      localStorage.setItem('jobApplications', JSON.stringify(updatedJobs));
      return { ...state, jobs: updatedJobs, loading: false, error: null };
    
    case actionTypes.DELETE_JOB:
      const filteredJobs = state.jobs.filter(job => job.id !== action.payload);
      localStorage.setItem('jobApplications', JSON.stringify(filteredJobs));
      return { ...state, jobs: filteredJobs, loading: false, error: null };
    
    default:
      return state;
  }
};

// Create context
const JobContext = createContext();

// Context provider component
export const JobProvider = ({ children }) => {
  const [state, dispatch] = useReducer(jobsReducer, initialState);

  // Load jobs from localStorage on mount
  useEffect(() => {
    try {
      const savedJobs = localStorage.getItem('jobApplications');
      if (savedJobs) {
        const jobs = JSON.parse(savedJobs);
        dispatch({ type: actionTypes.LOAD_JOBS, payload: jobs });
      }
    } catch (error) {
      console.error('Error loading jobs from localStorage:', error);
      dispatch({ type: actionTypes.SET_ERROR, payload: 'Failed to load saved jobs' });
    }
  }, []);

  // Action creators
  const addJob = (jobData) => {
    try {
      const newJob = {
        id: Date.now().toString(),
        ...jobData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dispatch({ type: actionTypes.ADD_JOB, payload: newJob });
      return newJob;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: 'Failed to add job' });
      throw error;
    }
  };

  const updateJob = (id, updatedData) => {
    try {
      const existingJob = state.jobs.find(job => job.id === id);
      if (!existingJob) {
        throw new Error('Job not found');
      }
      
      const updatedJob = {
        ...existingJob,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      
      dispatch({ type: actionTypes.UPDATE_JOB, payload: updatedJob });
      return updatedJob;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: 'Failed to update job' });
      throw error;
    }
  };

  const deleteJob = (id) => {
    try {
      dispatch({ type: actionTypes.DELETE_JOB, payload: id });
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: 'Failed to delete job' });
      throw error;
    }
  };

  const exportJobs = () => {
    try {
      const dataStr = JSON.stringify(state.jobs, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `job-applications-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return true;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: 'Failed to export jobs' });
      return false;
    }
  };

  const importJobs = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedJobs = JSON.parse(e.target.result);
            
            // Validate imported data
            if (!Array.isArray(importedJobs)) {
              throw new Error('Invalid file format: Expected an array of jobs');
            }
            
            // Validate each job has required fields
            const validJobs = importedJobs.filter(job => {
              return job.company && job.position && job.status && job.applicationDate;
            });
            
            if (validJobs.length === 0) {
              throw new Error('No valid jobs found in the imported file');
            }
            
            // Add IDs and timestamps to imported jobs if missing
            const processedJobs = validJobs.map(job => ({
              ...job,
              id: job.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
              createdAt: job.createdAt || new Date().toISOString(),
              updatedAt: job.updatedAt || new Date().toISOString()
            }));
            
            dispatch({ type: actionTypes.LOAD_JOBS, payload: processedJobs });
            resolve({ imported: processedJobs.length, skipped: importedJobs.length - processedJobs.length });
          } catch (parseError) {
            reject(new Error('Invalid JSON file or file format'));
          }
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      } catch (error) {
        reject(error);
      }
    });
  };

  const clearError = () => {
    dispatch({ type: actionTypes.SET_ERROR, payload: null });
  };

  const getJobById = (id) => {
    return state.jobs.find(job => job.id === id);
  };

  const getJobsByStatus = (status) => {
    return state.jobs.filter(job => job.status === status);
  };

  const getJobStats = () => {
    const total = state.jobs.length;
    const stats = Object.keys(JOB_STATUSES).reduce((acc, key) => {
      acc[JOB_STATUSES[key]] = state.jobs.filter(job => job.status === JOB_STATUSES[key]).length;
      return acc;
    }, {});
    
    return { total, ...stats };
  };

  const value = {
    ...state,
    actions: {
      addJob,
      updateJob,
      deleteJob,
      exportJobs,
      importJobs,
      clearError,
      getJobById,
      getJobsByStatus,
      getJobStats
    }
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

// Custom hook to use job context
export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export default JobContext;
