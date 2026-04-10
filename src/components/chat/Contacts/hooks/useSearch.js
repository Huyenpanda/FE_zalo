import { useState, useCallback, useRef } from 'react';
import api from '../../../../services/api';

const SEARCH_HISTORY_KEY = 'SEARCH_HISTORY';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const h = localStorage.getItem(SEARCH_HISTORY_KEY);
      return h ? JSON.parse(h) : [];
    } catch { return []; }
  });

  const debounceRef = useRef(null);

  const search = useCallback(async (query) => {
    setSearchQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await api.get(`/auth/users/search?q=${encodeURIComponent(query.trim())}`);
        // api.js unwrap 1 lần → res = { success, data: [...] }
        const data = res?.data || (Array.isArray(res) ? res : []);
        setSearchResults(Array.isArray(data) ? data : []);
        setShowResults(true);
      } catch (err) {
        console.error('search error:', err?.response?.data || err.message);
        setSearchResults([]);
        setShowResults(true);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  }, []);

  const saveToHistory = useCallback((user) => {
    setSearchHistory(prev => {
      const next = [user, ...prev.filter(u => u.id !== user.id)].slice(0, 10);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromHistory = useCallback((userId) => {
    setSearchHistory(prev => {
      const next = prev.filter(u => u.id !== userId);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }, []);

  return {
    searchQuery,
    searchResults,
    searchLoading,
    showResults,
    searchHistory,
    search,
    clearSearch,
    saveToHistory,
    removeFromHistory,
    clearHistory,
  };
};