'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { notesApi } from '../../../services/notesApi';
import styles from './public.module.css';

export default function PublicNote() {
  const params = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState('');
  const [decryptedContent, setDecryptedContent] = useState('');

  useEffect(() => {
    if (params.token) {
      fetchPublicNote();
    }
  }, [params.token]);

  const fetchPublicNote = async () => {
    try {
      setLoading(true);
      const fetchedNote = await notesApi.getPublicNote(params.token);
      setNote(fetchedNote);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const decryptContent = (encryptedText, key) => {
    if (!key) return '';
    try {
      const decoded = atob(encryptedText);
      const [text, originalKey] = decoded.split('::');
      return originalKey === key ? text : 'Invalid encryption key';
    } catch {
      return 'Invalid encrypted content';
    }
  };

  const handleDecrypt = () => {
    if (note && note.is_encrypted && decryptionKey) {
      const decrypted = decryptContent(note.encrypted_content, decryptionKey);
      setDecryptedContent(decrypted);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Loading note...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>Note Not Found</h1>
          <p>{error}</p>
          <a href="/" className={styles.homeLink}>← Back to Notes</a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <a href="/" className={styles.homeLink}>← Back to Notes</a>
          <div className={styles.badges}>
            <span className={styles.publicBadge}>Public Note</span>
            {note.is_encrypted && (
              <span className={styles.encryptedBadge}>🔒 Encrypted</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <article className={styles.noteArticle}>
          {/* Category */}
          {note.category && (
            <div 
              className={styles.categoryBadge}
              style={{ backgroundColor: note.category.color }}
            >
              <span className={styles.categoryIcon}>{note.category.icon}</span>
              <span className={styles.categoryName}>{note.category.name}</span>
            </div>
          )}

          {/* Title */}
          <h1 className={styles.noteTitle}>{note.title || 'Untitled'}</h1>

          {/* Labels */}
          {note.labels && note.labels.length > 0 && (
            <div className={styles.labelsContainer}>
              {note.labels.map(label => (
                <span 
                  key={label.id}
                  className={styles.labelTag}
                  style={{ 
                    backgroundColor: label.color + '20',
                    borderColor: label.color,
                    color: label.color
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className={styles.noteContent}>
            {note.is_encrypted ? (
              <div className={styles.encryptionSection}>
                <p className={styles.encryptionNotice}>
                  🔒 This note is encrypted. Enter the decryption key to view the content.
                </p>
                <div className={styles.decryptionForm}>
                  <input
                    type="password"
                    placeholder="Enter decryption key..."
                    value={decryptionKey}
                    onChange={(e) => setDecryptionKey(e.target.value)}
                    className={styles.decryptionInput}
                    onKeyPress={(e) => e.key === 'Enter' && handleDecrypt()}
                  />
                  <button onClick={handleDecrypt} className={styles.decryptBtn}>
                    Decrypt
                  </button>
                </div>
                {decryptedContent && (
                  <div className={styles.decryptedContent}>
                    <h3>Decrypted Content:</h3>
                    <div className={styles.contentText}>
                      {decryptedContent === 'Invalid encryption key' ? (
                        <p className={styles.errorText}>{decryptedContent}</p>
                      ) : (
                        <pre>{decryptedContent}</pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.contentText}>
                <pre>{note.content || 'No content available'}</pre>
              </div>
            )}
          </div>

          {/* Metadata */}
          <footer className={styles.noteFooter}>
            <div className={styles.metadata}>
              <p>{note.date_type === 'updated' ? 'Updated' : 'Created'}: {formatDate(note.display_date || note.created_at)}</p>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}