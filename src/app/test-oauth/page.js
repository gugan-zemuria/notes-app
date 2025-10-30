'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function TestOAuth() {
  const [response, setResponse] = useState('');
  const { signInWithGoogle, user } = useAuth();

  const testGoogleOAuth = async () => {
    try {
      setResponse('Starting Google OAuth...');
      const result = await signInWithGoogle();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse('Error: ' + error.message);
    }
  };

  const testDirectAPI = async () => {
    try {
      setResponse('Testing direct API call...');
      const response = await fetch('http://localhost:5001/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse('Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>OAuth Testing Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Current User:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {user ? JSON.stringify(user, null, 2) : 'Not logged in'}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testGoogleOAuth}
          style={{
            background: '#4285f4',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Google OAuth (via Context)
        </button>
        
        <button 
          onClick={testDirectAPI}
          style={{
            background: '#34a853',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Direct API Call
        </button>
      </div>

      <div>
        <h2>Response:</h2>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {response || 'No response yet'}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Current URL Info:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}
          {'\n'}Hash: {typeof window !== 'undefined' ? window.location.hash : 'N/A'}
          {'\n'}Search: {typeof window !== 'undefined' ? window.location.search : 'N/A'}
        </pre>
      </div>
    </div>
  );
}