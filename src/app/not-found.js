import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Page Not Found</h2>
        <p className={styles.description}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.homeBtn}>
            ← Back to Notes
          </Link>
          <Link href="/create" className={styles.createBtn}>
            Create New Note
          </Link>
        </div>
      </div>
    </div>
  );
}