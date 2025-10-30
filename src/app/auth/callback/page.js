'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { auth } from '../../../services/authApi';

function AuthCallbackContent() {
  const [status, setStatus] = useState('processing');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Check URL parameters (query params)
      const error = searchParams.get('error');
      const code = searchParams.get('code');
      
      // Also check URL hash fragments (for Supabase OAuth)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashError = hashParams.get('error');
      const hashCode = hashParams.get('code');
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      
      console.log('Callback params:', { error, code, hashError, hashCode, accessToken });
      
      if (error || hashError) {
        setStatus('error');
        setTimeout(() => {
          router.push('/login?error=' + encodeURIComponent(error || hashError));
        }, 2000);
        return;
      }

      // If we have tokens directly from hash (Supabase implicit flow)
      if (accessToken) {
        try {
          // Set tokens and get user info
          document.cookie = `sb-access-token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
          if (refreshToken) {
            document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=604800; SameSite=Lax`;
          }
          
          setStatus('success');
          await refreshUser(); // Refresh user context
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } catch (error) {
          console.error('Token handling error:', error);
          setStatus('error');
          setTimeout(() => {
            router.push('/login?error=token_error');
          }, 2000);
        }
        return;
      }

      // If we have a code (authorization code flow)
      if (code || hashCode) {
        const authCode = code || hashCode;
        const { data, error: callbackError } = await auth.handleCallback(authCode);
        
        if (callbackError) {
          setStatus('error');
          setTimeout(() => {
            router.push('/login?error=' + encodeURIComponent(callbackError));
          }, 2000);
        } else {
          setStatus('success');
          await refreshUser(); // Refresh user context
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        }
      } else {
        console.log('No code or tokens found in callback');
        setStatus('error');
        setTimeout(() => {
          router.push('/login?error=no_code');
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {status === 'processing' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f4f6',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
            </div>
            <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Processing...</h2>
            <p style={{ color: '#6b7280' }}>Please wait while we sign you in.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ color: '#16a34a', marginBottom: '10px' }}>Success!</h2>
            <p style={{ color: '#6b7280' }}>You have been signed in successfully. Redirecting...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
            <h2 style={{ color: '#dc2626', marginBottom: '10px' }}>Error</h2>
            <p style={{ color: '#6b7280' }}>There was an error signing you in. Redirecting to login...</p>
          </>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
          </div>
          <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Loading...</h2>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}