'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import styles from './forgot-password.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { data, error: resetError } = await resetPassword(email);
    
    if (resetError) {
      setError(resetError);
    } else {
      setMessage('Password reset email sent! Please check your inbox.');
    }
    
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.resetCard}>
        <div className={styles.header}>
          <h1>Reset Password</h1>
          <p>Enter your email to receive a password reset link</p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {message && (
          <div className={styles.success}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className={styles.links}>
          <Link href="/login">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}