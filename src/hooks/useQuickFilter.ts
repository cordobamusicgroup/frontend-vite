import { useRef, useState } from 'react';

/**
 * Hook for quick filtering in tables.
 * Provides input ref, filter text, and functions to apply and reset the filter.
 */
const useQuickFilter = () => {
  const searchTextRef = useRef<HTMLInputElement>(null);
  const [quickFilterText, setQuickFilterText] = useState('');

  const applyFilter = () => {
    const filterText = searchTextRef.current?.value || '';
    setQuickFilterText(filterText);
  };

  const resetFilter = () => {
    setQuickFilterText('');
    if (searchTextRef.current) searchTextRef.current.value = '';
  };

  return { searchTextRef, quickFilterText, applyFilter, resetFilter };
};

export default useQuickFilter;
