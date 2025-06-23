// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Export API configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      SIGNUP: '/api/auth/signup',
      SIGNIN: '/api/auth/signin',
      PROFILE: '/api/auth/get-profile',
      UPDATE_PROFILE: '/api/auth/update-profile',
      RANKINGS: '/api/auth/rankings',
    },
    CODE: {
      EXECUTE: '/api/code/execute',
      SUBMIT: '/api/code/submit',
      METRICS: '/api/code/metrics',
      SUBMISSIONS: '/api/code/submissions',
    },
    QUESTIONS: '/api/questions',
    BOOKMARKS: {
      GET: '/api/bookmarks',
      TOGGLE: '/api/bookmarks/toggle',
    },
    BLOGS: '/api/blogs',
    HEALTH: '/api/health',
  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for common API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, finalOptions);
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default API_CONFIG;
