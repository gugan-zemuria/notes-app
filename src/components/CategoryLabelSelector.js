'use client';

import { useState } from 'react';
import styles from './CategoryLabelSelector.module.css';

export default function CategoryLabelSelector({ 
  categories, 
  labels, 
  selectedCategory, 
  selectedLabels, 
  onCategoryChange, 
  onLabelsChange,
  onCreateLabel 
}) {
  const [showLabelForm, setShowLabelForm] = useState(false);
  const [newLabel, setNewLabel] = useState({ name: '', color: '#10B981' });

  // Default categories that always show
  const defaultCategories = [
    { id: 'personal', name: 'Personal', color: '#3B82F6', icon: '👤' },
    { id: 'work', name: 'Work', color: '#EF4444', icon: '💼' },
    { id: 'ideas', name: 'Ideas', color: '#8B5CF6', icon: '💡' },
    { id: 'tasks', name: 'Tasks', color: '#F59E0B', icon: '✅' },
    { id: 'projects', name: 'Projects', color: '#10B981', icon: '🚀' },
    { id: 'learning', name: 'Learning', color: '#F97316', icon: '📚' },
    { id: 'health', name: 'Health', color: '#EC4899', icon: '🏥' },
    { id: 'finance', name: 'Finance', color: '#06B6D4', icon: '💰' }
  ];

  // Use database categories if available, otherwise use defaults
  const displayCategories = (categories && categories.length > 0) ? categories : defaultCategories;

  // Default labels that always show
  const defaultLabels = [
    { id: 'important', name: 'Important', color: '#EF4444' },
    { id: 'urgent', name: 'Urgent', color: '#F59E0B' },
    { id: 'review', name: 'Review', color: '#8B5CF6' },
    { id: 'archive', name: 'Archive', color: '#6B7280' },
    { id: 'draft', name: 'Draft', color: '#10B981' },
    { id: 'progress', name: 'In Progress', color: '#3B82F6' },
    { id: 'completed', name: 'Completed', color: '#059669' },
    { id: 'hold', name: 'On Hold', color: '#DC2626' }
  ];

  // Use database labels if available, otherwise use defaults
  const displayLabels = (labels && labels.length > 0) ? labels : defaultLabels;



  const handleLabelSubmit = async () => {
    if (!newLabel.name.trim()) return;
    
    try {
      await onCreateLabel(newLabel);
      setNewLabel({ name: '', color: '#10B981' });
      setShowLabelForm(false);
    } catch (error) {
      console.error('Error creating label:', error);
      alert('Error creating label: ' + (error.message || 'Unknown error'));
    }
  };

  const handleLabelToggle = (labelId) => {
    console.log('Toggling label:', labelId, 'Current selected:', selectedLabels);
    const newSelectedLabels = selectedLabels.includes(labelId)
      ? selectedLabels.filter(id => id !== labelId)
      : [...selectedLabels, labelId];
    console.log('New selected labels:', newSelectedLabels);
    onLabelsChange(newSelectedLabels);
  };

  const commonIcons = ['📁', '💼', '👤', '💡', '✅', '📝', '🎯', '⭐', '🔥', '📊'];
  const commonColors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'];

  return (
    <div className={styles.container}>
      {/* Category Selection */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <label className={styles.label}>Category</label>
        </div>
        
        <select 
          value={selectedCategory || ''} 
          onChange={(e) => onCategoryChange(e.target.value || null)}
          className={styles.select}
        >
          <option value="">No Category</option>
          {displayCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Labels Selection */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <label className={styles.label}>Labels</label>
        </div>
        
        <div className={styles.labelsContainer}>
          {displayLabels.map(label => (
            <button
              key={label.id}
              type="button"
              onClick={() => handleLabelToggle(label.id)}
              className={`${styles.labelChip} ${selectedLabels.includes(label.id) ? styles.selected : ''}`}
              style={{ 
                backgroundColor: selectedLabels.includes(label.id) ? label.color : 'transparent',
                borderColor: label.color,
                color: selectedLabels.includes(label.id) ? 'white' : label.color
              }}
            >
              {label.name}
            </button>
          ))}
        </div>

        {showLabelForm && (
          <div className={styles.form}>
            <input
              type="text"
              placeholder="Label name"
              value={newLabel.name}
              onChange={(e) => setNewLabel(prev => ({ ...prev, name: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleLabelSubmit()}
              className={styles.input}
              required
            />
            <div className={styles.colorPicker}>
              <label>Color:</label>
              <div className={styles.colorOptions}>
                {commonColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`${styles.colorOption} ${newLabel.color === color ? styles.selected : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewLabel(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
            <div className={styles.formButtons}>
              <button type="button" onClick={handleLabelSubmit} className={styles.submitButton}>Add Label</button>
              <button type="button" onClick={() => setShowLabelForm(false)} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        )}

        <button 
          type="button" 
          onClick={() => setShowLabelForm(!showLabelForm)}
          className={styles.createLabelButton}
        >
          {showLabelForm ? 'Cancel' : 'Create Label'}
        </button>
      </div>
    </div>
  );
}