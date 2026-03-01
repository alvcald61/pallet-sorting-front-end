import * as XLSX from 'xlsx';

/**
 * Column definition for export
 */
export interface ExportColumn {
  accessor: string;
  title: string;
  render?: (value: any, record: any) => any;
}

/**
 * Extracts value from nested object using dot notation
 * Example: getValue(obj, 'user.name') => obj.user.name
 */
function getValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Formats value for export (handles dates, booleans, objects)
 */
function formatValueForExport(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }

  if (typeof value === 'object') {
    // For objects, try to get a meaningful string representation
    if (value.name) return value.name;
    if (value.label) return value.label;
    return JSON.stringify(value);
  }

  return String(value);
}

/**
 * Prepares data for export by extracting column values
 */
function prepareDataForExport(data: any[], columns: ExportColumn[]): any[] {
  return data.map(record => {
    const row: any = {};

    columns.forEach(column => {
      let value = getValue(record, column.accessor);

      // Use custom render function if provided
      if (column.render) {
        value = column.render(value, record);
      }

      row[column.title] = formatValueForExport(value);
    });

    return row;
  });
}

/**
 * Exports data to CSV file
 * @param data - Array of records to export
 * @param filename - Name of the file (without extension)
 * @param columns - Column definitions (accessor and title)
 */
export function exportToCSV(data: any[], filename: string, columns: ExportColumn[]): void {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const preparedData = prepareDataForExport(data, columns);

  // Convert to CSV
  const worksheet = XLSX.utils.json_to_sheet(preparedData);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Exports data to Excel file
 * @param data - Array of records to export
 * @param filename - Name of the file (without extension)
 * @param columns - Column definitions (accessor and title)
 * @param sheetName - Name of the Excel sheet (default: 'Data')
 */
export function exportToExcel(
  data: any[],
  filename: string,
  columns: ExportColumn[],
  sheetName: string = 'Data'
): void {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const preparedData = prepareDataForExport(data, columns);

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(preparedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Apply basic styling to headers
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;

    // Make headers bold (note: basic XLSX doesn't support styling, but keeps structure)
    worksheet[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'EFEFEF' } }
    };
  }

  // Auto-size columns
  const maxWidth = 50;
  const colWidths = columns.map((col, i) => {
    let maxLength = col.title.length;
    preparedData.forEach(row => {
      const cellValue = String(row[col.title] || '');
      maxLength = Math.max(maxLength, cellValue.length);
    });
    return { wch: Math.min(maxLength + 2, maxWidth) };
  });
  worksheet['!cols'] = colWidths;

  // Write file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Helper to create export columns from DataTable columns
 * Filters out action columns and columns without accessor
 */
export function createExportColumns(columns: any[]): ExportColumn[] {
  return columns
    .filter(col =>
      col.accessor &&
      col.accessor !== 'actions' &&
      col.accessor !== 'selection' &&
      col.title !== 'Acciones'
    )
    .map(col => ({
      accessor: col.accessor,
      title: col.title || col.accessor,
      render: col.exportRender || col.render
    }));
}
