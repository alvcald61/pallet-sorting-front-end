/**
 * Enhanced hook for managing data table state:
 * - Pagination
 * - Sorting
 * - Search/filtering
 * - Row selection
 */

import { useState, useMemo, useCallback } from 'react';
import {
  SortStatus,
  processRecords,
  debounce
} from '@/lib/utils/tableHelpers';

export interface UseDataTableOptions<T = any> {
  /** Number of records per page (default: 15) */
  pageSize?: number;

  /** Initial sort configuration */
  initialSort?: SortStatus;

  /** Fields to search in when using search functionality */
  searchableFields?: string[];

  /** Enable row selection (default: false) */
  enableRowSelection?: boolean;

  /** Custom function to get unique ID from record (default: record.id) */
  getRecordId?: (record: T) => string | number;
}

export function useDataTable<T extends Record<string, any>>(
  data: T[],
  options: UseDataTableOptions<T> = {}
) {
  const {
    pageSize = 15,
    initialSort = null,
    searchableFields = [],
    enableRowSelection = false,
    getRecordId = (record) => record.id
  } = options;

  // Pagination state
  const [page, setPage] = useState(1);

  // Sorting state
  const [sortStatus, setSortStatus] = useState<SortStatus | null>(initialSort);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Selection state
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  // Debounced search handler
  const debouncedSetSearch = useMemo(
    () => debounce((query: string) => {
      setDebouncedSearchQuery(query);
      setPage(1); // Reset to first page when searching
    }, 300),
    []
  );

  // Handle search query change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    debouncedSetSearch(query);
  }, [debouncedSetSearch]);

  // Process data: filter, sort, paginate
  const processedData = useMemo(() => {
    return processRecords(data, {
      sortStatus,
      searchQuery: debouncedSearchQuery,
      searchableFields,
      page,
      pageSize
    });
  }, [data, sortStatus, debouncedSearchQuery, searchableFields, page, pageSize]);

  // Selection handlers
  const toggleRowSelection = useCallback((recordId: string | number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  }, []);

  const toggleAllRows = useCallback((selectAll: boolean) => {
    if (selectAll) {
      // Select all rows on current page
      const currentPageIds = processedData.records.map(record => getRecordId(record));
      setSelectedRows(new Set(currentPageIds));
    } else {
      // Deselect all
      setSelectedRows(new Set());
    }
  }, [processedData.records, getRecordId]);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  const isRowSelected = useCallback((recordId: string | number) => {
    return selectedRows.has(recordId);
  }, [selectedRows]);

  const isAllRowsSelected = useMemo(() => {
    if (processedData.records.length === 0) return false;
    const currentPageIds = processedData.records.map(record => getRecordId(record));
    return currentPageIds.every(id => selectedRows.has(id));
  }, [processedData.records, selectedRows, getRecordId]);

  const isSomeRowsSelected = useMemo(() => {
    if (processedData.records.length === 0) return false;
    const currentPageIds = processedData.records.map(record => getRecordId(record));
    return currentPageIds.some(id => selectedRows.has(id)) && !isAllRowsSelected;
  }, [processedData.records, selectedRows, isAllRowsSelected, getRecordId]);

  // Reset page when data changes
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((newSortStatus: SortStatus | null) => {
    setSortStatus(newSortStatus);
    setPage(1); // Reset to first page when sorting changes
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setPage(1);
  }, []);

  return {
    // Processed data
    records: processedData.records,
    totalRecords: processedData.totalRecords,
    filteredRecords: processedData.filteredRecords,
    totalPages: processedData.totalPages,

    // Pagination
    page,
    pageSize,
    setPage: handlePageChange,

    // Sorting
    sortStatus,
    setSortStatus: handleSortChange,

    // Search
    searchQuery,
    setSearchQuery: handleSearchChange,
    clearSearch,

    // Selection (only if enabled)
    ...(enableRowSelection && {
      selectedRows,
      setSelectedRows,
      toggleRowSelection,
      toggleAllRows,
      clearSelection,
      isRowSelected,
      isAllRowsSelected,
      isSomeRowsSelected,
      selectedCount: selectedRows.size
    })
  };
}

export default useDataTable;
