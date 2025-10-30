'use client';

import styles from './ErrorMessage.module.css';

export default function ErrorMessage({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorMessage}>
        <span className={styles.errorIcon}>⚠️</span>
        <span className={styles.errorText}>{error}</span>
        {onDismiss && (
          <button onClick={onDismiss} className={styles.dismissBtn}>
            ×
          </button>
        )}
      </div>
    </div>
  );
}