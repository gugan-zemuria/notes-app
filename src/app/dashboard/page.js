'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if this is right after OAuth success
    const oauthSuccess = localStorage.getItem('oauth-success');
    
    if (oauthSuccess) {
      console.log('Dashboard: OAuth success detected, giving time for user context to load...');
      localStorage.removeItem('oauth-success');
      
      // Give extra time for user context to load after OAuth
      setTimeout(() => {
        if (!user) {
          console.log('Dashboard: User context still not loaded after OAuth, but staying on dashboard');
          // Don't redirect - user is authenticated via OAuth
        }
      }, 5000);
      return;
    }
    
    // Normal auth check - only redirect if not loading and no user
    if (!loading && !user) {
      console.log('Dashboard: No user found, redirecting to login');
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1>Welcome back{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!</h1>
          <p className={styles.userInfo}>
            <span className={styles.email}>{user.email}</span>
            {user.user_metadata?.avatar_url && (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className={styles.avatar}
              />
            )}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button 
            onClick={handleSignOut}
            className={styles.logoutButton}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <h2>Your Notes</h2>
          <p>Start creating and organizing your notes.</p>
          <button 
            onClick={() => router.push('/create')}
            className={styles.primaryButton}
          >
            Create New Note
          </button>
        </div>

        <div className={styles.card}>
          <h2>Browse Notes</h2>
          <p>View and manage all your existing notes.</p>
          <button 
            onClick={() => router.push('/')}
            className={styles.secondaryButton}
          >
            View All Notes
          </button>
        </div>
      </div>

      <div className={styles.authSection}>
        <div className={styles.authCard}>
          <h3>Account Management</h3>
          <div className={styles.authButtons}>
            <button 
              onClick={() => router.push('/login')}
              className={styles.loginButton}
            >
              Switch Account
            </button>
            <button 
              onClick={handleSignOut}
              className={styles.signOutButton}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}