// API Connection Test Script
import { buildApiUrl, API_CONFIG } from './src/config/api.js';

const testApiConnection = async () => {
  console.log('🔍 Testing API Connection...');
  console.log('📍 API Base URL:', API_CONFIG.BASE_URL);
  
  try {
    // Test health endpoint
    const healthUrl = buildApiUrl(API_CONFIG.ENDPOINTS.HEALTH);
    console.log('🏥 Testing health endpoint:', healthUrl);
    
    const response = await fetch(healthUrl);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Health check passed!');
      console.log('📊 Response:', data);
    } else {
      console.log('❌ Health check failed!');
      console.log('📊 Response:', data);
    }
  } catch (error) {
    console.log('❌ Connection failed!');
    console.log('🚨 Error:', error.message);
  }
};

// Run the test
testApiConnection();
