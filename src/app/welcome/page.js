'use client';

import Link from 'next/link';
import styles from './welcome.module.css';

export default function WelcomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to Notes App</h1>
          <p>Organize your thoughts, ideas, and tasks with our powerful note-taking application.</p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.icon}>📝</span>
              <h3>Rich Text Editor</h3>
              <p>Create beautiful notes with formatting, categories, and labels.</p>
            </div>
            
            <div className={styles.feature}>
              <span className={styles.icon}>🔒</span>
              <h3>Secure & Private</h3>
              <p>Your notes are encrypted and secure with Google OAuth authentication.</p>
            </div>
            
            <div className={styles.feature}>
              <span className={styles.icon}>🏷️</span>
              <h3>Organize Everything</h3>
              <p>Use categories and labels to keep your notes perfectly organized.</p>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/signup" className={styles.primaryButton}>
              Get Started
            </Link>
            <Link href="/login" className={styles.secondaryButton}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}