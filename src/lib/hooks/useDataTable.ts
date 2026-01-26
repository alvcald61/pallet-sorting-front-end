/**
 * Hook for managing data table pagination state
 */

import { useState, useMemo } from 'react';

interface UseDataTableOptions {
  pageSize?: number;
}

export function useDataTable<T>(
  data: T[],
  options: UseDataTableOptions = {}
) {
  const { pageSize = 15 } = options;
  const [page, setPage] = useState(1);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, page, pageSize]);

  return {
    page,
    setPage,
    pageSize,
    paginatedData,
    totalRecords: data.length,
  };
}

export default useDataTable;
