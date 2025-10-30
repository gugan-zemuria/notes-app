'use client';

import { useState, useEffect } from 'react';
import styles from './SetupMessage.module.css';

export default function SetupMessage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/status`);
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to check database status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || dismissed || (status && status.ready)) {
    return null;
  }

  return (
    <div className={styles.setupMessage}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.icon}>⚠️</span>
          <h3>Database Setup Required</h3>
          <button onClick={() => setDismissed(true)} className={styles.dismissBtn}>
            ×
          </button>
        </div>
        
        <div className={styles.body}>
          <p>
            Some database tables are missing. The app is running with default data, 
            but you won't be able to create or save notes until you set up the database.
          </p>
          
          <div className={styles.steps}>
            <h4>Quick Setup:</h4>
            <ol>
              <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">Supabase Dashboard</a></li>
              <li>Navigate to <strong>SQL Editor</strong></li>
              <li>Copy and paste the contents of <code>database-schema.sql</code></li>
              <li>Click <strong>Run</strong> to create the tables</li>
              <li>Run <code>npm run init-defaults</code> to add sample data</li>
            </ol>
          </div>

          {status && (
            <div className={styles.tableStatus}>
              <h4>Table Status:</h4>
              <div className={styles.tables}>
                {Object.entries(status.tables).map(([table, exists]) => (
                  <span key={table} className={`${styles.table} ${exists ? styles.exists : styles.missing}`}>
                    {exists ? '✅' : '❌'} {table}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}