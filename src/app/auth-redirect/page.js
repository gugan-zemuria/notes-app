'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthRedirect() {
    const { user, loading, refreshUser } = useAuth();
    const router = useRouter();
    const [attempts, setAttempts] = useState(0);
    const maxAttempts = 5;

    useEffect(() => {
        const handleRedirect = async () => {
            console.log('Auth redirect - checking user state...', { user: !!user, loading, attempts });

            if (user) {
                console.log('User found, redirecting to dashboard');
                router.push('/dashboard');
                return;
            }

            if (!loading && attempts < maxAttempts) {
                console.log(`Attempting to refresh user context (attempt ${attempts + 1}/${maxAttempts})`);
                setAttempts(prev => prev + 1);

                try {
                    const success = await refreshUser();
                    if (success) {
                        console.log('User context refreshed successfully');
                        // Don't redirect here, let the next useEffect cycle handle it
                    } else {
                        console.log('User refresh failed, will retry...');
                    }
                } catch (error) {
                    console.error('Error refreshing user:', error);
                }
            } else if (!loading && attempts >= maxAttempts) {
                console.log('Max attempts reached, redirecting to login');
                router.push('/login?error=auth_timeout');
            }
        };

        // Initial delay to let any pending auth operations complete
        const timer = setTimeout(handleRedirect, 500);
        return () => clearTimeout(timer);
    }, [user, loading, attempts, router, refreshUser]);

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
                <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Completing Sign In...</h2>
                <p style={{ color: '#6b7280' }}>Please wait while we finish setting up your session.</p>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '10px' }}>
                    Attempt {attempts + 1} of {maxAttempts}
                </p>
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