// Date formatting utilities
export const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  } catch (error) {
    return 'Unknown';
  }
};

// Form validation utilities
export const validateJobForm = (data) => {
  const errors = {};
  
  if (!data.company?.trim()) {
    errors.company = 'Company name is required';
  }
  
  if (!data.position?.trim()) {
    errors.position = 'Job position is required';
  }
  
  if (!data.status) {
    errors.status = 'Application status is required';
  }
  
  if (!data.applicationDate) {
    errors.applicationDate = 'Application date is required';
  } else {
    const date = new Date(data.applicationDate);
    const today = new Date();
    if (date > today) {
      errors.applicationDate = 'Application date cannot be in the future';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Status utility functions
export const getStatusColor = (status) => {
  const colors = {
    'Applied': 'bg-blue-100 text-blue-800 border-blue-200',
    'Interviewing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Offer': 'bg-green-100 text-green-800 border-green-200',
    'Rejected': 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getStatusIcon = (status) => {
  const icons = {
    'Applied': '📝',
    'Interviewing': '💼',
    'Offer': '🎉',
    'Rejected': '❌'
  };
  return icons[status] || '📄';
};

// Search and filter utilities
export const searchJobs = (jobs, searchTerm) => {
  if (!searchTerm.trim()) return jobs;
  
  const term = searchTerm.toLowerCase();
  return jobs.filter(job => 
    job.company.toLowerCase().includes(term) ||
    job.position.toLowerCase().includes(term) ||
    job.status.toLowerCase().includes(term) ||
    job.notes?.toLowerCase().includes(term)
  );
};

export const filterJobsByStatus = (jobs, statuses) => {
  if (!statuses || statuses.length === 0) return jobs;
  return jobs.filter(job => statuses.includes(job.status));
};

export const sortJobs = (jobs, sortBy, sortOrder = 'desc') => {
  const sorted = [...jobs].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'company':
        aValue = a.company.toLowerCase();
        bValue = b.company.toLowerCase();
        break;
      case 'position':
        aValue = a.position.toLowerCase();
        bValue = b.position.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'applicationDate':
        aValue = new Date(a.applicationDate);
        bValue = new Date(b.applicationDate);
        break;
      case 'createdAt':
      default:
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

// Local storage utilities
export const exportToJSON = (data, filename = 'job-applications') => {
  try {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
};

// URL utilities
export const generateJobUrl = (job) => {
  // Create a search URL for the job (could be enhanced with actual job board integration)
  const query = encodeURIComponent(`${job.position} ${job.company}`);
  return `https://www.google.com/search?q=${query}+jobs`;
};

// Statistics utilities
export const calculateJobStats = (jobs) => {
  const stats = {
    total: jobs.length,
    applied: 0,
    interviewing: 0,
    offer: 0,
    rejected: 0,
    responseRate: 0,
    successRate: 0
  };
  
  jobs.forEach(job => {
    switch (job.status) {
      case 'Applied':
        stats.applied++;
        break;
      case 'Interviewing':
        stats.interviewing++;
        break;
      case 'Offer':
        stats.offer++;
        break;
      case 'Rejected':
        stats.rejected++;
        break;
      default:
        // Handle any unexpected status values
        break;
    }
  });
  
  // Calculate response rate (interviews + offers + rejections / total)
  const responses = stats.interviewing + stats.offer + stats.rejected;
  stats.responseRate = stats.total > 0 ? Math.round((responses / stats.total) * 100) : 0;
  
  // Calculate success rate (offers / total responses)
  stats.successRate = responses > 0 ? Math.round((stats.offer / responses) * 100) : 0;
  
  return stats;
};

// Debounce utility for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate sample data for demo
export const generateSampleJobs = () => {
  const companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Spotify', 'Uber', 'Airbnb', 'Twitter'];
  const positions = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Product Manager', 'UX Designer', 'Data Scientist', 'Software Engineer'];
  const statuses = ['Applied', 'Interviewing', 'Offer', 'Rejected'];
  
  return Array.from({ length: 15 }, (_, index) => ({
    id: (Date.now() + index).toString(),
    company: companies[Math.floor(Math.random() * companies.length)],
    position: positions[Math.floor(Math.random() * positions.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    applicationDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: Math.random() > 0.5 ? 'Sample notes for this application' : '',
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }));
};
