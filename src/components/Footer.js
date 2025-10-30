'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>My Notes App</h3>
            <p className={styles.description}>
              Organize your thoughts with categories, labels, and powerful features like encryption and public sharing.
            </p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionSubtitle}>Quick Links</h4>
            <nav className={styles.footerNav}>
              <Link href="/" className={styles.footerLink}>All Notes</Link>
              <Link href="/create" className={styles.footerLink}>Create Note</Link>
            </nav>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionSubtitle}>Features</h4>
            <ul className={styles.featureList}>
              <li>📝 Rich text notes</li>
              <li>🏷️ Categories & labels</li>
              <li>🔒 Encryption support</li>
              <li>🌐 Public sharing</li>
              <li>💾 Auto-save drafts</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionSubtitle}>Tech Stack</h4>
            <ul className={styles.techList}>
              <li>Next.js 16</li>
              <li>Express.js</li>
              <li>Supabase</li>
              <li>React 19</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>&copy; {currentYear} My Notes App. Built with ❤️ for productivity.</p>
          </div>
          <div className={styles.stats}>
            <span className={styles.stat}>🚀 Fast & Secure</span>
            <span className={styles.stat}>📱 Responsive</span>
            <span className={styles.stat}>🔄 Real-time</span>
          </div>
        </div>
      </div>
    </footer>
  );
}