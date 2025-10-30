'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../hooks/useNotes';
import NoteForm from '../components/NoteForm';
import NotesList from '../components/NotesList';
import NotesFilter from '../components/NotesFilter';
import ErrorMessage from '../components/ErrorMessage';
import SetupMessage from '../components/SetupMessage';
import Modal from '../components/Modal';
import styles from './page.module.css';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const {
    notes,
    categories,
    labels,
    loading,
    error,
    filters,
    pagination,
    createNote,
    updateNote,
    deleteNote,
    createCategory,
    createLabel,
    publishDraft,
    applyFilters,
    changePage,
    clearError
  } = useNotes(!!user);

  const [editingNote, setEditingNote] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Redirect to welcome if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/welcome');
    }
  }, [user, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Handle form submission for both create and update
  const handleFormSubmit = async (noteData) => {
    try {
      if (editingNote) {
        await updateNote(editingNote.id, noteData);
        setEditingNote(null);
      } else {
        await createNote(noteData);
      }
    } catch (error) {
      // Error is handled by the hook
      console.error('Form submission error:', error);
    }
  };

  // Handle edit button click
  const handleEdit = (note) => {
    setEditingNote(note);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      // If we're editing the note being deleted, cancel edit
      if (editingNote && editingNote.id === id) {
        setEditingNote(null);
      }
    } catch (error) {
      // Error is handled by the hook
      console.error('Delete error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div>
            <h1>All Notes</h1>
            <p>Organize and manage your notes with categories and labels</p>
          </div>
          <div className={styles.headerActions}>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={styles.filterToggle}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'} 🔍
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Setup Message */}
        <SetupMessage />

        {/* Error Message */}
        <ErrorMessage error={error} onDismiss={clearError} />

        {/* Filters */}
        {showFilters && (
          <NotesFilter
            categories={categories}
            labels={labels}
            onFilterChange={applyFilters}
            currentFilters={filters}
          />
        )}

        {/* Edit Modal */}
        <Modal
          isOpen={!!editingNote}
          onClose={handleCancelEdit}
          title={`Edit Note: ${editingNote?.title || 'Untitled'}`}
        >
          {editingNote && (
            <NoteForm
              onSubmit={handleFormSubmit}
              editingNote={editingNote}
              onCancel={handleCancelEdit}
              categories={categories}
              labels={labels}
              onCreateCategory={createCategory}
              onCreateLabel={createLabel}
            />
          )}
        </Modal>

        {/* Notes List */}
        <NotesList
          notes={notes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPublish={publishDraft}
          loading={loading}
          pagination={pagination}
          onPageChange={changePage}
        />
      </div>
    </div>
  );
}