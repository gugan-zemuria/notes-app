'use client';

import { useState } from 'react';
import CategoryLabelSelector from './CategoryLabelSelector';
import styles from './NoteForm.module.css';

export default function NoteForm({ 
  onSubmit, 
  editingNote, 
  onCancel, 
  categories, 
  labels, 
  onCreateCategory, 
  onCreateLabel 
}) {
  const [title, setTitle] = useState(editingNote?.title || '');
  const [content, setContent] = useState(editingNote?.content || '');
  const [selectedCategory, setSelectedCategory] = useState(editingNote?.category?.id || null);
  const [selectedLabels, setSelectedLabels] = useState(editingNote?.labels?.map(l => l.id) || []);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      await onSubmit({ 
        title, 
        content, 
        category_id: selectedCategory,
        label_ids: selectedLabels
      });
      if (!editingNote) {
        setTitle('');
        setContent('');
        setSelectedCategory(null);
        setSelectedLabels([]);
      }
    } catch (error) {
      console.error('Error submitting note:', error);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setSelectedCategory(null);
    setSelectedLabels([]);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.input}
        required
      />
      <textarea
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={styles.textarea}
        rows={4}
        required
      />
      
      <CategoryLabelSelector
        categories={categories}
        labels={labels}
        selectedCategory={selectedCategory}
        selectedLabels={selectedLabels}
        onCategoryChange={setSelectedCategory}
        onLabelsChange={setSelectedLabels}
        onCreateCategory={onCreateCategory}
        onCreateLabel={onCreateLabel}
      />
      
      <div className={styles.buttonGroup}>
        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Saving...' : editingNote ? 'Update Note' : 'Add Note'}
        </button>
        {editingNote && (
          <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}