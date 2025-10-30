'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../services/authApi';
import { debugTokens } from '../../utils/tokenDebug';

export default function DebugAuth() {
  const { user, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState(null);
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    const info = debugTokens();
    setDebugInfo(info);
  }, []);

  const testGetCurrentUser = async () => {
    console.log('Testing getCurrentUser...');
    const result = await auth.getCurrentUser();
    setTestResults(prev => ({ ...prev, getCurrentUser: result }));
  };

  const testServerHealth = async () => {
    try {
      const response = await fetch('https://notes-app-server-26sz.onrender.com/api/debug/cookies', {
        credentials: 'include'
      });
      const data = await response.json();
      setTestResults(prev => ({ ...prev, serverHealth: { status: response.status, data } }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, serverHealth: { error: error.message } }));
    }
  };

  const clearAllTokens = () => {
    // Clear cookies
    document.cookie = 'sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'sb-refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Clear localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.includes('token')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.includes('token')) {
        sessionStorage.removeItem(key);
      }
    });
    
    window.location.reload();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔍 Authentication Debug Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Current Auth State</h3>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
        <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Token Debug Info</h3>
        {debugInfo && (
          <div>
            <p><strong>Access Token Cookie:</strong> {debugInfo.cookies['sb-access-token'] ? 'Present' : 'Missing'}</p>
            <p><strong>Refresh Token Cookie:</strong> {debugInfo.cookies['sb-refresh-token'] ? 'Present' : 'Missing'}</p>
            <p><strong>URL Hash Tokens:</strong> {debugInfo.hashTokens.access_token ? 'Present' : 'None'}</p>
            <details>
              <summary>Full Debug Info</summary>
              <pre style={{ background: '#f5f5f5', padding: '10px', fontSize: '12px' }}>
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Test Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={testGetCurrentUser} style={{ padding: '8px 12px' }}>
            Test getCurrentUser
          </button>
          <button onClick={testServerHealth} style={{ padding: '8px 12px' }}>
            Test Server Health
          </button>
          <button onClick={() => setDebugInfo(debugTokens())} style={{ padding: '8px 12px' }}>
            Refresh Debug Info
          </button>
          <button onClick={clearAllTokens} style={{ padding: '8px 12px', background: '#dc3545', color: 'white' }}>
            Clear All Tokens
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Test Results</h3>
        {Object.keys(testResults).length > 0 ? (
          <pre style={{ background: '#f5f5f5', padding: '10px', fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(testResults, null, 2)}
          </pre>
        ) : (
          <p>No tests run yet</p>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/login">Login Page</a></li>
          <li><a href="/signup">Signup Page</a></li>
          <li><a href="/test-oauth">OAuth Test Page</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
        </ul>
      </div>
    </div>
  );
}