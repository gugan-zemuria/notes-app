'use client';

import { useState } from 'react';
import styles from './NotesFilter.module.css';

export default function NotesFilter({ 
  categories, 
  labels, 
  onFilterChange, 
  currentFilters 
}) {
  const [search, setSearch] = useState(currentFilters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.category || '');
  const [selectedLabels, setSelectedLabels] = useState(
    currentFilters.labels ? currentFilters.labels.split(',').map(Number) : []
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    applyFilters({ search: value });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    applyFilters({ category: categoryId });
  };

  const handleLabelToggle = (labelId) => {
    const newSelectedLabels = selectedLabels.includes(labelId)
      ? selectedLabels.filter(id => id !== labelId)
      : [...selectedLabels, labelId];
    
    setSelectedLabels(newSelectedLabels);
    applyFilters({ labels: newSelectedLabels.join(',') });
  };

  const applyFilters = (newFilter) => {
    const filters = {
      search,
      category: selectedCategory,
      labels: selectedLabels.join(','),
      ...newFilter
    };

    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    onFilterChange(filters);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedLabels([]);
    onFilterChange({});
  };

  const hasActiveFilters = search || selectedCategory || selectedLabels.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filter Notes</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className={styles.clearButton}>
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className={styles.section}>
        <label className={styles.label}>Search</label>
        <input
          type="text"
          placeholder="Search in title and content..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Category Filter */}
      <div className={styles.section}>
        <label className={styles.label}>Category</label>
        <div className={styles.categoryGrid}>
          <button
            onClick={() => handleCategoryChange('')}
            className={`${styles.categoryButton} ${!selectedCategory ? styles.selected : ''}`}
          >
            <span className={styles.categoryIcon}>📋</span>
            <span>All</span>
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id.toString())}
              className={`${styles.categoryButton} ${selectedCategory === category.id.toString() ? styles.selected : ''}`}
              style={{ 
                backgroundColor: selectedCategory === category.id.toString() ? category.color : 'transparent',
                borderColor: category.color,
                color: selectedCategory === category.id.toString() ? 'white' : category.color
              }}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Labels Filter */}
      <div className={styles.section}>
        <label className={styles.label}>Labels</label>
        <div className={styles.labelsGrid}>
          {labels.map(label => (
            <button
              key={label.id}
              onClick={() => handleLabelToggle(label.id)}
              className={`${styles.labelButton} ${selectedLabels.includes(label.id) ? styles.selected : ''}`}
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
      </div>

      {/* Status Filters */}
      <div className={styles.section}>
        <label className={styles.label}>Status</label>
        <div className={styles.statusGrid}>
          <button
            onClick={() => applyFilters({ drafts: undefined })}
            className={`${styles.statusButton} ${!currentFilters.drafts ? styles.selected : ''}`}
          >
            All Notes
          </button>
          <button
            onClick={() => applyFilters({ drafts: 'true' })}
            className={`${styles.statusButton} ${currentFilters.drafts === 'true' ? styles.selected : ''}`}
          >
            📝 Drafts Only
          </button>
          <button
            onClick={() => applyFilters({ drafts: 'false' })}
            className={`${styles.statusButton} ${currentFilters.drafts === 'false' ? styles.selected : ''}`}
          >
            ✅ Published Only
          </button>
        </div>
      </div>

      {/* Visibility Filters */}
      <div className={styles.section}>
        <label className={styles.label}>Visibility</label>
        <div className={styles.statusGrid}>
          <button
            onClick={() => applyFilters({ visibility: undefined })}
            className={`${styles.statusButton} ${!currentFilters.visibility ? styles.selected : ''}`}
          >
            All Notes
          </button>
          <button
            onClick={() => applyFilters({ visibility: 'private' })}
            className={`${styles.statusButton} ${currentFilters.visibility === 'private' ? styles.selected : ''}`}
          >
            🔒 Private Only
          </button>
          <button
            onClick={() => applyFilters({ visibility: 'public' })}
            className={`${styles.statusButton} ${currentFilters.visibility === 'public' ? styles.selected : ''}`}
          >
            🌐 Public Only
          </button>
        </div>
      </div>
    </div>
  );
}