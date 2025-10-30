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

  // Default categories to show when no categories are loaded
  const defaultCategories = [
    { id: 'personal', name: 'Personal', color: '#3B82F6', icon: '👤' },      // Blue
    { id: 'work', name: 'Work', color: '#EF4444', icon: '💼' },              // Red
    { id: 'ideas', name: 'Ideas', color: '#8B5CF6', icon: '💡' },            // Purple
    { id: 'tasks', name: 'Tasks', color: '#F59E0B', icon: '✅' },            // Orange
    { id: 'projects', name: 'Projects', color: '#10B981', icon: '🚀' },      // Green
    { id: 'learning', name: 'Learning', color: '#F97316', icon: '📚' },      // Orange
    { id: 'health', name: 'Health', color: '#EC4899', icon: '🏥' },          // Pink
    { id: 'finance', name: 'Finance', color: '#06B6D4', icon: '💰' }         // Cyan
  ];

  // Always use default categories for now (can be changed later to use database categories)
  const displayCategories = defaultCategories;



  const handleLabelSubmit = async () => {
    if (!newLabel.name.trim()) return;
    
    try {
      await onCreateLabel(newLabel);
      setNewLabel({ name: '', color: '#10B981' });
      setShowLabelForm(false);
    } catch (error) {
      console.error('Error creating label:', error);
      alert('Labels table not found. Please run the database schema first.');
    }
  };

  const handleLabelToggle = (labelId) => {
    const newSelectedLabels = selectedLabels.includes(labelId)
      ? selectedLabels.filter(id => id !== labelId)
      : [...selectedLabels, labelId];
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
          {labels.map(label => (
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