import { Group, TextInput, Button, Badge, ActionIcon, Tooltip } from '@mantine/core';
import {
  IconSearch,
  IconFileTypeCsv,
  IconFileTypeXls,
  IconX
} from '@tabler/icons-react';

export interface BulkAction {
  label: string;
  icon: React.ReactNode;
  color?: string;
  onClick: (selectedIds: Set<string | number>) => void | Promise<void>;
}

interface TableToolbarProps {
  /** Search functionality */
  searchable?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  /** Export functionality */
  exportable?: boolean;
  onExportCSV?: () => void;
  onExportExcel?: () => void;

  /** Bulk actions */
  selectedCount?: number;
  bulkActions?: BulkAction[];

  /** Additional actions (right side) */
  actions?: React.ReactNode;
}

export function TableToolbar({
  searchable = true,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  exportable = true,
  onExportCSV,
  onExportExcel,
  selectedCount = 0,
  bulkActions = [],
  actions
}: TableToolbarProps) {
  const hasSelection = selectedCount > 0;

  return (
    <Group justify="space-between" mb="md">
      {/* Left side: Search */}
      {searchable && onSearchChange && (
        <TextInput
          placeholder={searchPlaceholder}
          leftSection={<IconSearch size={16} />}
          rightSection={
            searchQuery ? (
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={() => onSearchChange('')}
              >
                <IconX size={14} />
              </ActionIcon>
            ) : null
          }
          value={searchQuery}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          style={{ minWidth: 300 }}
        />
      )}

      {/* Spacer if no search */}
      {(!searchable || !onSearchChange) && <div />}

      {/* Right side: Selection info, Bulk actions, Export, Custom actions */}
      <Group gap="xs">
        {/* Selection badge and bulk actions */}
        {hasSelection && (
          <>
            <Badge size="lg" variant="light" color="blue">
              {selectedCount} seleccionado{selectedCount !== 1 ? 's' : ''}
            </Badge>

            {bulkActions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant="light"
                color={action.color || 'gray'}
                leftSection={action.icon}
                onClick={() => action.onClick(new Set())}
              >
                {action.label}
              </Button>
            ))}
          </>
        )}

        {/* Export buttons */}
        {exportable && (
          <Button.Group>
            <Tooltip label="Exportar a CSV">
              <Button
                size="sm"
                variant="default"
                leftSection={<IconFileTypeCsv size={16} />}
                onClick={onExportCSV}
              >
                CSV
              </Button>
            </Tooltip>

            <Tooltip label="Exportar a Excel">
              <Button
                size="sm"
                variant="default"
                leftSection={<IconFileTypeXls size={16} />}
                onClick={onExportExcel}
              >
                Excel
              </Button>
            </Tooltip>
          </Button.Group>
        )}

        {/* Custom actions */}
        {actions}
      </Group>
    </Group>
  );
}
