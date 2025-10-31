'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useNotes } from '../../hooks/useNotes';
import CategoryLabelSelector from '../../components/CategoryLabelSelector';
import ErrorMessage from '../../components/ErrorMessage';
import styles from './create.module.css';

export default function CreateNote() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Always call useNotes with true to avoid conditional hook calls
  const {
    categories,
    labels,
    createNote,
    createCategory,
    createLabel,
    error,
    clearError
  } = useNotes(true);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [isDraft, setIsDraft] = useState(true);
  const [isPublic, setIsPublic] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const autosaveTimeoutRef = useRef(null);
  const currentNoteIdRef = useRef(null);

  // Simple encryption/decryption functions (for demo purposes)
  const encryptContent = (text, key) => {
    if (!key) return text;
    return btoa(text + '::' + key); // Simple base64 encoding with key
  };

  const decryptContent = (encryptedText, key) => {
    if (!key) return encryptedText;
    try {
      const decoded = atob(encryptedText);
      const [text, originalKey] = decoded.split('::');
      return originalKey === key ? text : 'Invalid encryption key';
    } catch {
      return 'Invalid encrypted content';
    }
  };

  // Autosave functionality
  const triggerAutosave = () => {
    if (!title.trim() && !content.trim()) return;
    
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(async () => {
      try {
        const noteData = {
          title: title || 'Untitled',
          content: isEncrypted ? null : content,
          encrypted_content: isEncrypted ? encryptContent(content, encryptionKey) : null,
          category_id: selectedCategory,
          label_ids: selectedLabels,
          is_draft: true,
          is_public: false,
          is_encrypted: isEncrypted
        };

        if (currentNoteIdRef.current) {
          // Update existing draft
          // This would need an autosave API endpoint
          console.log('Autosaving existing draft...');
        } else {
          // Create new draft
          const newNote = await createNote(noteData);
          currentNoteIdRef.current = newNote.id;
        }
        
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Autosave failed:', error);
      }
    }, 2000); // Autosave after 2 seconds of inactivity
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Track changes for autosave
  useEffect(() => {
    setHasUnsavedChanges(true);
    if (isDraft) {
      triggerAutosave();
    }
  }, [title, content, selectedCategory, selectedLabels, isEncrypted, encryptionKey, isDraft]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      console.log('=== CREATE NOTE DEBUG ===');
      console.log('User:', user);
      console.log('User ID:', user?.id);
      console.log('User Email:', user?.email);
      
      if (!user) {
        console.error('No user found - redirecting to login');
        router.push('/login');
        return;
      }

      const noteData = {
        title,
        content: isEncrypted ? null : content,
        encrypted_content: isEncrypted ? encryptContent(content, encryptionKey) : null,
        category_id: selectedCategory,
        label_ids: selectedLabels,
        is_draft: isDraft,
        is_public: isPublic,
        is_encrypted: isEncrypted
      };

      console.log('Note data to create:', noteData);
      
      const result = await createNote(noteData);
      console.log('Create note result:', result);
      
      // Clear the form
      setTitle('');
      setContent('');
      setSelectedCategory(null);
      setSelectedLabels([]);
      setIsDraft(true);
      setIsPublic(false);
      setIsEncrypted(false);
      setEncryptionKey('');
      currentNoteIdRef.current = null;
      setHasUnsavedChanges(false);
      
      // Redirect to notes list
      router.push('/');
    } catch (error) {
      console.error('Error creating note:', error);
      console.error('Error details:', error.response?.data);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return;
    }
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div>
            <h1>Create New Note</h1>
            <p>Write and organize your thoughts with categories and labels</p>
          </div>
          <div className={styles.headerActions}>
            {lastSaved && (
              <span className={styles.autosaveStatus}>
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <button onClick={handleCancel} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <ErrorMessage error={error} onDismiss={clearError} />

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.titleSection}>
            <input
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.titleInput}
              required
            />
          </div>

          <div className={styles.contentSection}>
            <textarea
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.contentTextarea}
              rows={8}
              required
            />
          </div>

          <div className={styles.optionsSection}>
            <CategoryLabelSelector
              categories={categories}
              labels={labels}
              selectedCategory={selectedCategory}
              selectedLabels={selectedLabels}
              onCategoryChange={setSelectedCategory}
              onLabelsChange={setSelectedLabels}
              onCreateLabel={createLabel}
            />

            <div className={styles.noteOptions}>
              <div className={styles.optionGroup}>
                <h3>Note Options</h3>
                
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={isDraft}
                    onChange={(e) => setIsDraft(e.target.checked)}
                  />
                  <span>Save as draft</span>
                </label>

                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    disabled={isDraft}
                  />
                  <span>Make public (shareable link)</span>
                </label>

                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={isEncrypted}
                    onChange={(e) => setIsEncrypted(e.target.checked)}
                  />
                  <span>Encrypt content</span>
                </label>

                {isEncrypted && (
                  <input
                    type="password"
                    placeholder="Encryption key..."
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                    className={styles.encryptionInput}
                    required
                    autoComplete="new-password"
                  />
                )}
              </div>
            </div>
          </div>

          <div className={styles.submitSection}>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Creating...' : isDraft ? 'Save Draft' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}