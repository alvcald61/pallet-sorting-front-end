'use client';

import { useMemo, useState } from 'react';
import { DataTable, DataTableColumn, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import { Checkbox, Box } from '@mantine/core';
import { useDataTable, UseDataTableOptions } from '@/lib/hooks/useDataTable';
import { TableToolbar, BulkAction } from './TableToolbar';
import { EmptyState } from './EmptyState';
import { TableSkeleton } from './TableSkeleton';
import {
  exportToCSV,
  exportToExcel,
  createExportColumns
} from '@/lib/utils/exportTable';

export interface EnhancedDataTableProps<T> extends Omit<DataTableProps<T>, 'records' | 'page' | 'onPageChange' | 'totalRecords' | 'sortStatus' | 'onSortStatusChange' | 'columns' | 'groups' | 'emptyState'> {
  /** Data records to display */
  records: T[];

  /** Column definitions */
  columns: DataTableColumn<T>[];

  /** Loading state */
  loading?: boolean;

  /** Enable sorting (default: true) */
  sortable?: boolean;

  /** Enable search (default: true) */
  searchable?: boolean;

  /** Fields to search in */
  searchableFields?: string[];

  /** Search placeholder text */
  searchPlaceholder?: string;

  /** Enable row selection (default: false) */
  selectable?: boolean;

  /** Function to get unique ID from record */
  getRecordId?: (record: T) => string | number;

  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: Set<string | number>) => void;

  /** Bulk actions to display when rows are selected */
  bulkActions?: BulkAction[];

  /** Enable export (default: true) */
  exportable?: boolean;

  /** Export filename (default: 'export') */
  exportFileName?: string;

  /** Empty state configuration */
  emptyState?: {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    action?: {
      label: string;
      onClick: () => void;
    };
  };

  /** Additional toolbar actions */
  toolbarActions?: React.ReactNode;

  /** Page size (default: 15) */
  pageSize?: number;

  /** Initial sort configuration */
  initialSort?: UseDataTableOptions['initialSort'];

  /** Server-side mode (default: false - client-side) */
  serverSide?: boolean;

  /** Current page (for server-side mode) */
  page?: number;

  /** Total records (for server-side mode) */
  totalRecords?: number;

  /** Page change handler (for server-side mode) */
  onPageChange?: (page: number) => void;

  /** Sort status (for server-side mode) */
  sortStatus?: DataTableSortStatus<T>;

  /** Sort change handler (for server-side mode) */
  onSortStatusChange?: (sortStatus: DataTableSortStatus<T>) => void;
}

export function EnhancedDataTable<T extends Record<string, any>>({
  records,
  columns,
  loading = false,
  sortable = true,
  searchable = true,
  searchableFields = [],
  searchPlaceholder = 'Buscar...',
  selectable = false,
  getRecordId = (record) => record.id,
  onSelectionChange,
  bulkActions = [],
  exportable = true,
  exportFileName = 'export',
  emptyState,
  toolbarActions,
  pageSize = 15,
  initialSort,
  serverSide = false,
  page: serverPage,
  totalRecords: serverTotalRecords,
  onPageChange: serverOnPageChange,
  sortStatus: serverSortStatus,
  onSortStatusChange: serverOnSortStatusChange,
  ...dataTableProps
}: EnhancedDataTableProps<T>) {
  // Client-side state (only used if not in server mode)
  const clientTable = useDataTable(records, {
    pageSize,
    initialSort,
    searchableFields,
    enableRowSelection: selectable && !serverSide, // Selection only in client mode
    getRecordId
  });

  // Server-side selection state
  const [serverSelectedRows, setServerSelectedRows] = useState<Set<string | number>>(new Set());

  // Determine which mode we're in
  const table = serverSide ? {
    records: records,
    page: serverPage || 1,
    setPage: serverOnPageChange || (() => {}),
    sortStatus: serverSortStatus || null,
    setSortStatus: serverOnSortStatusChange || (() => {}),
    searchQuery: '',
    setSearchQuery: () => {},
    totalRecords: serverTotalRecords || 0,
    filteredRecords: serverTotalRecords || 0,
    selectedRows: serverSelectedRows,
    setSelectedRows: setServerSelectedRows,
    selectedCount: serverSelectedRows.size,
    // Server mode selection handlers
    toggleRowSelection: (id: string | number) => {
      setServerSelectedRows(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    },
    toggleAllRows: (selectAll: boolean) => {
      if (selectAll) {
        const allIds = records.map(r => getRecordId(r));
        setServerSelectedRows(new Set(allIds));
      } else {
        setServerSelectedRows(new Set());
      }
    },
    clearSelection: () => setServerSelectedRows(new Set()),
    isRowSelected: (id: string | number) => serverSelectedRows.has(id),
    isAllRowsSelected: records.length > 0 && records.every(r => serverSelectedRows.has(getRecordId(r))),
    isSomeRowsSelected: records.some(r => serverSelectedRows.has(getRecordId(r))) && !records.every(r => serverSelectedRows.has(getRecordId(r))),
  } : clientTable;

  // Notify parent of selection changes
  useMemo(() => {
    if (selectable && onSelectionChange && table.selectedRows) {
      onSelectionChange(table.selectedRows);
    }
  }, [selectable, table.selectedRows, onSelectionChange]);

  // Handle export to CSV (export current page or filtered data)
  const handleExportCSV = () => {
    const exportColumns = createExportColumns(columns);
    const dataToExport = serverSide ? records : table.records;
    exportToCSV(dataToExport, exportFileName, exportColumns);
  };

  // Handle export to Excel (export current page or filtered data)
  const handleExportExcel = () => {
    const exportColumns = createExportColumns(columns);
    const dataToExport = serverSide ? records : table.records;
    exportToExcel(dataToExport, exportFileName, exportColumns);
  };

  // Handle bulk actions with current selection
  const wrappedBulkActions = useMemo(() => {
    if (!selectable || !table.selectedRows) return [];

    return bulkActions.map(action => ({
      ...action,
      onClick: async () => {
        await action.onClick(table.selectedRows!);
        table.clearSelection?.();
      }
    }));
  }, [bulkActions, selectable, table]);

  // Add selection column if enabled
  const enhancedColumns = useMemo(() => {
    if (!selectable || !table.isRowSelected || !table.toggleRowSelection) {
      return columns;
    }

    const selectionColumn: DataTableColumn<T> = {
      accessor: 'selection' as any,
      title: (
        <Checkbox
          checked={table.isAllRowsSelected}
          indeterminate={table.isSomeRowsSelected}
          onChange={(e) => table.toggleAllRows!(e.currentTarget.checked)}
        />
      ),
      width: 40,
      render: (record) => (
        <Checkbox
          checked={table.isRowSelected!(getRecordId(record))}
          onChange={() => table.toggleRowSelection?.(getRecordId(record))}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      sortable: false
    };

    return [selectionColumn, ...columns];
  }, [selectable, columns, table, getRecordId]);

  // Mark sortable columns
  const sortableColumns = useMemo(() => {
    if (!sortable) return enhancedColumns;

    return enhancedColumns.map(col => ({
      ...col,
      sortable: col.accessor !== 'actions' && col.accessor !== 'selection' && col.sortable !== false
    }));
  }, [sortable, enhancedColumns]);

  // Show loading skeleton
  if (loading) {
    return <TableSkeleton rows={pageSize} columns={columns.length} />;
  }

  // Show empty state
  if (!loading && records.length === 0) {
    return (
      <EmptyState
        title={emptyState?.title}
        description={emptyState?.description}
        icon={emptyState?.icon}
        action={emptyState?.action}
      />
    );
  }

  return (
    <Box>
      {/* Toolbar - search only in client mode */}
      <TableToolbar
        searchable={searchable && !serverSide}
        searchQuery={table.searchQuery}
        onSearchChange={table.setSearchQuery}
        searchPlaceholder={searchPlaceholder}
        exportable={exportable}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        selectedCount={table.selectedCount}
        bulkActions={wrappedBulkActions}
        actions={toolbarActions}
      />

      {/* Data Table */}
      <DataTable
        {...(dataTableProps as any)}
        records={table.records}
        columns={sortableColumns}
        totalRecords={table.totalRecords || table.filteredRecords}
        recordsPerPage={pageSize}
        page={table.page}
        onPageChange={table.setPage}
        sortStatus={table.sortStatus as any}
        onSortStatusChange={table.setSortStatus as any}
        // Default styling
        withTableBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        minHeight={500}
      />

      {/* Show filtered count if searching (client mode only) */}
      {!serverSide && table.searchQuery && table.filteredRecords !== table.totalRecords && (
        <Box mt="xs" ta="center" c="dimmed" fz="sm">
          Mostrando {table.filteredRecords} de {table.totalRecords} registros
        </Box>
      )}
    </Box>
  );
}
