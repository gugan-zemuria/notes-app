'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, loading, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
    router.push('/welcome');
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoIcon}>📝</span>
            <span className={styles.logoText}>My Notes</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}
          >
            All Notes
          </Link>
          <Link 
            href="/create" 
            className={`${styles.navLink} ${pathname === '/create' ? styles.active : ''}`}
          >
            Create Note
          </Link>
        </nav>

        <div className={styles.actions}>
          <button onClick={toggleTheme} className={styles.themeToggle} title={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
            {isDark ? (
              <svg className={styles.themeIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
              </svg>
            ) : (
              <svg className={styles.themeIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
              </svg>
            )}
          </button>
          
          {user ? (
            <>
              <Link href="/create" className={styles.createBtn}>
                + New Note
              </Link>
              <div className={styles.profileDropdown} ref={profileRef}>
                <button onClick={toggleProfile} className={styles.profileButton}>
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className={styles.profileAvatar}
                    />
                  ) : (
                    <div className={styles.profileInitial}>
                      {(user.user_metadata?.full_name || user.email)[0].toUpperCase()}
                    </div>
                  )}
                  <span className={styles.profileName}>
                    {user.user_metadata?.full_name || user.email.split('@')[0]}
                  </span>
                  <svg className={`${styles.dropdownIcon} ${isProfileOpen ? styles.open : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {isProfileOpen && (
                  <div className={styles.profileMenu}>
                    <div className={styles.profileHeader}>
                      <div className={styles.profileInfo}>
                        {user.user_metadata?.avatar_url ? (
                          <img 
                            src={user.user_metadata.avatar_url} 
                            alt="Profile" 
                            className={styles.menuAvatar}
                          />
                        ) : (
                          <div className={styles.menuInitial}>
                            {(user.user_metadata?.full_name || user.email)[0].toUpperCase()}
                          </div>
                        )}
                        <div className={styles.profileDetails}>
                          <div className={styles.profileFullName}>
                            {user.user_metadata?.full_name || user.email.split('@')[0]}
                          </div>
                          <div className={styles.profileEmail}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.profileMenuItems}>
                      <Link href="/dashboard" className={styles.menuItem} onClick={() => setIsProfileOpen(false)}>
                        <svg className={styles.menuIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        Dashboard
                      </Link>
                      
                      <Link href="/create" className={styles.menuItem} onClick={() => setIsProfileOpen(false)}>
                        <svg className={styles.menuIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create Note
                      </Link>
                      
                      <div className={styles.menuDivider}></div>
                      
                      <button onClick={handleSignOut} className={styles.menuItem}>
                        <svg className={styles.menuIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginBtn}>
                Sign In
              </Link>
              <Link href="/signup" className={styles.signupBtn}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}