import React, { useEffect, useState } from 'react';
import { authUtils } from '../utils/auth';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const AuthDebugger = () => {
  const [authInfo, setAuthInfo] = useState({});

  useEffect(() => {
    const checkAuth = () => {
      const token = authUtils.getToken();
      const isAuth = authUtils.isAuthenticated();
      const headers = authUtils.getAuthHeaders();
      
      setAuthInfo({
        token: token ? `${token.substring(0, 20)}...` : 'No token',
        isAuthenticated: isAuth,
        headers: headers,
        axiosDefaults: axios.defaults.headers.common['Authorization'] || 'Not set'
      });
    };

    checkAuth();
  }, []);

  const testAPI = async () => {
    try {
      console.log('Testing API call with current auth...');
      const response = await axios.get(`${API_BASE_URL}/profile/view`, {
        headers: authUtils.getAuthHeaders(),
        withCredentials: true
      });
      console.log('API Test Success:', response.data);
      alert('API test successful!');
    } catch (error) {
      console.error('API Test Failed:', error);
      alert(`API test failed: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>Auth Debug Info</h4>
      <div><strong>Token:</strong> {authInfo.token}</div>
      <div><strong>Is Authenticated:</strong> {String(authInfo.isAuthenticated)}</div>
      <div><strong>Auth Headers:</strong> {JSON.stringify(authInfo.headers)}</div>
      <div><strong>Axios Default Auth:</strong> {authInfo.axiosDefaults}</div>
      <button onClick={testAPI} style={{ marginTop: '10px', padding: '5px' }}>
        Test API Call
      </button>
    </div>
  );
};

export default AuthDebugger;
