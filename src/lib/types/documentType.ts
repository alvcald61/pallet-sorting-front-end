/**
 * Document entity types
 */

export interface DocumentConfig {
  documentId: number;
  documentName: string;
  storagePath: string;
  required: boolean;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateDocumentRequest {
  documentName: string;
  storagePath: string;
}

export interface UpdateDocumentRequest {
  documentName: string;
  storagePath: string;
}

/**
 * Warehouse-Document association types
 * Represents the many-to-many relationship between warehouses and documents
 */
export interface WarehouseDocument {
  warehouseId: number;
  documentId: number;
  isRequired: boolean;
  document?: DocumentConfig;
}

export interface UpdateWarehouseDocumentsRequest {
  documents: {
    documentId: number;
    isRequired: boolean;
  }[];
}
