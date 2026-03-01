/**
 * Sort direction type
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort status interface
 */
export interface SortStatus {
  columnAccessor: string;
  direction: SortDirection;
}

/**
 * Gets nested value from object using dot notation
 * Example: getNestedValue({ user: { name: 'John' } }, 'user.name') => 'John'
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Compares two values for sorting
 * Handles strings, numbers, dates, booleans, and null/undefined
 */
export function compareValues(a: any, b: any, direction: SortDirection = 'asc'): number {
  // Handle null/undefined
  if (a === null || a === undefined) return direction === 'asc' ? 1 : -1;
  if (b === null || b === undefined) return direction === 'asc' ? -1 : 1;

  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    const comparison = a.getTime() - b.getTime();
    return direction === 'asc' ? comparison : -comparison;
  }

  // Handle numbers
  if (typeof a === 'number' && typeof b === 'number') {
    const comparison = a - b;
    return direction === 'asc' ? comparison : -comparison;
  }

  // Handle booleans
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    const comparison = a === b ? 0 : a ? 1 : -1;
    return direction === 'asc' ? comparison : -comparison;
  }

  // Handle strings (case-insensitive)
  const aStr = String(a).toLowerCase();
  const bStr = String(b).toLowerCase();
  const comparison = aStr.localeCompare(bStr);
  return direction === 'asc' ? comparison : -comparison;
}

/**
 * Sorts an array of records by a specific column
 * @param records - Array of records to sort
 * @param sortStatus - Current sort status (column and direction)
 * @returns Sorted array
 */
export function sortRecords<T extends Record<string, any>>(
  records: T[],
  sortStatus: SortStatus | null
): T[] {
  if (!sortStatus) {
    return records;
  }

  const { columnAccessor, direction } = sortStatus;

  return [...records].sort((a, b) => {
    const aValue = getNestedValue(a, columnAccessor);
    const bValue = getNestedValue(b, columnAccessor);
    return compareValues(aValue, bValue, direction);
  });
}

/**
 * Filters records based on search query across multiple fields
 * @param records - Array of records to filter
 * @param searchQuery - Search query string
 * @param searchableFields - Array of field names to search in (supports dot notation)
 * @returns Filtered array
 */
export function filterRecords<T extends Record<string, any>>(
  records: T[],
  searchQuery: string,
  searchableFields: string[]
): T[] {
  if (!searchQuery || !searchQuery.trim()) {
    return records;
  }

  const query = searchQuery.toLowerCase().trim();

  return records.filter(record => {
    return searchableFields.some(field => {
      const value = getNestedValue(record, field);

      if (value === null || value === undefined) {
        return false;
      }

      // Convert value to string and search
      const stringValue = String(value).toLowerCase();
      return stringValue.includes(query);
    });
  });
}

/**
 * Paginates an array of records
 * @param records - Array of records to paginate
 * @param page - Current page (1-indexed)
 * @param pageSize - Number of records per page
 * @returns Paginated array
 */
export function paginateRecords<T>(records: T[], page: number, pageSize: number): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return records.slice(startIndex, endIndex);
}

/**
 * Calculates total pages for pagination
 * @param totalRecords - Total number of records
 * @param pageSize - Number of records per page
 * @returns Total number of pages
 */
export function calculateTotalPages(totalRecords: number, pageSize: number): number {
  return Math.ceil(totalRecords / pageSize);
}

/**
 * Combines sorting, filtering, and pagination
 * @param records - Original array of records
 * @param options - Configuration object
 * @returns Object with processed records and metadata
 */
export function processRecords<T extends Record<string, any>>(
  records: T[],
  options: {
    sortStatus?: SortStatus | null;
    searchQuery?: string;
    searchableFields?: string[];
    page: number;
    pageSize: number;
  }
): {
  records: T[];
  totalRecords: number;
  totalPages: number;
  filteredRecords: number;
} {
  const {
    sortStatus = null,
    searchQuery = '',
    searchableFields = [],
    page,
    pageSize
  } = options;

  // 1. Filter
  let processedRecords = records;
  if (searchQuery && searchableFields.length > 0) {
    processedRecords = filterRecords(processedRecords, searchQuery, searchableFields);
  }
  const filteredRecords = processedRecords.length;

  // 2. Sort
  if (sortStatus) {
    processedRecords = sortRecords(processedRecords, sortStatus);
  }

  // 3. Paginate
  const totalPages = calculateTotalPages(processedRecords.length, pageSize);
  const paginatedRecords = paginateRecords(processedRecords, page, pageSize);

  return {
    records: paginatedRecords,
    totalRecords: records.length,
    totalPages,
    filteredRecords
  };
}

/**
 * Debounce function for search input
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}
