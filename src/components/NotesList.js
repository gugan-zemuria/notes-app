'use client';

import NoteCard from './NoteCard';
import Pagination from './Pagination';
import styles from './NotesList.module.css';

export default function NotesList({ notes, onEdit, onDelete, onPublish, loading, pagination, onPageChange }) {
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <p>Loading notes...</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📝</div>
        <h3>No notes yet</h3>
        <p>Create your first note above to get started!</p>
      </div>
    );
  }

  return (
    <div className={styles.notesContainer}>
      <div className={styles.notesHeader}>
        <h2>Your Notes ({notes.length})</h2>
      </div>
      <div className={styles.notesGrid}>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
            onPublish={onPublish}
          />
        ))}
      </div>

      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}