'use client';

import { useState, useEffect, useCallback } from 'react';
import { notesApi } from '../services/notesApi';

export const useNotes = (isAuthenticated = false) => {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    limit: 12,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch all notes with filters and pagination
  const fetchNotes = useCallback(async (filterParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await notesApi.getAllNotes(filterParams, page, 12);
      
      // Handle both old format (array) and new format (object with data and pagination)
      if (Array.isArray(response)) {
        setNotes(response);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalCount: response.length,
          limit: 12,
          hasNextPage: false,
          hasPrevPage: false
        });
      } else {
        setNotes(response.data || []);
        setPagination(response.pagination || {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          limit: 12,
          hasNextPage: false,
          hasPrevPage: false
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const fetchedCategories = await notesApi.getAllCategories();
      setCategories(fetchedCategories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback to default categories if API fails
      setCategories([
        { id: 1, name: 'Personal', color: '#3B82F6', icon: '👤' },
        { id: 2, name: 'Work', color: '#EF4444', icon: '💼' },
        { id: 3, name: 'Ideas', color: '#8B5CF6', icon: '💡' },
        { id: 4, name: 'Tasks', color: '#F59E0B', icon: '✅' },
        { id: 5, name: 'Projects', color: '#10B981', icon: '🚀' },
        { id: 6, name: 'Learning', color: '#F97316', icon: '📚' },
        { id: 7, name: 'Health', color: '#EC4899', icon: '🏥' },
        { id: 8, name: 'Finance', color: '#06B6D4', icon: '💰' }
      ]);
    }
  }, []);

  // Fetch labels
  const fetchLabels = useCallback(async () => {
    try {
      const fetchedLabels = await notesApi.getAllLabels();
      setLabels(fetchedLabels || []);
    } catch (err) {
      console.error('Error fetching labels:', err);
      // Fallback to default labels if API fails
      setLabels([
        { id: 1, name: 'Important', color: '#EF4444' },
        { id: 2, name: 'Urgent', color: '#F59E0B' },
        { id: 3, name: 'Review', color: '#8B5CF6' },
        { id: 4, name: 'Archive', color: '#6B7280' },
        { id: 5, name: 'Draft', color: '#10B981' },
        { id: 6, name: 'In Progress', color: '#3B82F6' },
        { id: 7, name: 'Completed', color: '#059669' },
        { id: 8, name: 'On Hold', color: '#DC2626' }
      ]);
    }
  }, []);

  // Create a new note
  const createNote = useCallback(async (noteData) => {
    try {
      setError(null);
      const newNote = await notesApi.createNote(noteData);
      setNotes(prevNotes => [newNote, ...prevNotes]);
      return newNote;
    } catch (err) {
      setError(err.message);
      console.error('Error creating note:', err);
      throw err;
    }
  }, []);

  // Update an existing note
  const updateNote = useCallback(async (id, noteData) => {
    try {
      setError(null);
      const updatedNote = await notesApi.updateNote(id, noteData);
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === id ? updatedNote : note
        )
      );
      return updatedNote;
    } catch (err) {
      setError(err.message);
      console.error('Error updating note:', err);
      throw err;
    }
  }, []);

  // Delete a note
  const deleteNote = useCallback(async (id) => {
    try {
      setError(null);
      await notesApi.deleteNote(id);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting note:', err);
      throw err;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh notes
  const refreshNotes = useCallback(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Create category
  const createCategory = useCallback(async (categoryData) => {
    try {
      setError(null);
      const newCategory = await notesApi.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err.message);
      console.error('Error creating category:', err);
      throw err;
    }
  }, []);

  // Create label
  const createLabel = useCallback(async (labelData) => {
    try {
      setError(null);
      const newLabel = await notesApi.createLabel(labelData);
      setLabels(prev => [...prev, newLabel]);
      return newLabel;
    } catch (err) {
      setError(err.message);
      console.error('Error creating label:', err);
      throw err;
    }
  }, []);

  // Apply filters
  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    fetchNotes(newFilters, 1); // Reset to page 1 when filtering
  }, [fetchNotes]);

  // Change page
  const changePage = useCallback((page) => {
    fetchNotes(filters, page);
  }, [fetchNotes, filters]);

  // Publish draft
  const publishDraft = useCallback(async (id) => {
    try {
      setError(null);
      await notesApi.publishDraft(id);
      // Refresh notes to show updated status
      fetchNotes(filters, pagination.currentPage);
    } catch (err) {
      setError(err.message);
      console.error('Error publishing draft:', err);
      throw err;
    }
  }, [fetchNotes, filters, pagination.currentPage]);

  // Load data on mount only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
      fetchCategories();
      fetchLabels();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, fetchNotes, fetchCategories, fetchLabels]);

  return {
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
    refreshNotes: () => fetchNotes(filters, pagination.currentPage),
    clearError
  };
};