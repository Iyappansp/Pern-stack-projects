// Simple script to test backend connection
import axios from 'axios';

const testBackend = async () => {
  console.log('🔍 Testing backend connection...\n');
  
  const baseURL = 'http://localhost:3000/api';
  console.log(`Testing: ${baseURL}/health`);
  
  try {
    const response = await axios.get(`${baseURL}/health`, {
      timeout: 5000
    });
    console.log('✅ Backend is running!');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure the backend server is running:');
      console.error('   Run: npm run dev (from project root)');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n💡 Backend is not responding. Check if it\'s running on port 3000');
    }
    
    return false;
  }
};

testBackend();

