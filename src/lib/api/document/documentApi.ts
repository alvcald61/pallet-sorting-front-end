import {
  DocumentConfig,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  WarehouseDocument,
  UpdateWarehouseDocumentsRequest,
} from "@/lib/types/documentType";
import { get, post, put, apiDelete } from "../apiClient";

/**
 * Get all documents
 */
export async function getDocuments(): Promise<{ data: DocumentConfig[] }> {
  return get<{ data: DocumentConfig[] }>("/document");
}

/**
 * Get document by ID
 */
export async function getDocumentById(
  id: string
): Promise<{ data: DocumentConfig }> {
  return get<{ data: DocumentConfig }>(`/document/${id}`);
}

/**
 * Create a new document
 */
export async function createDocument(
  data: CreateDocumentRequest
): Promise<{ data: DocumentConfig }> {
  return post<{ data: DocumentConfig }>("/document", data);
}

/**
 * Update an existing document
 */
export async function updateDocument(
  id: string,
  data: UpdateDocumentRequest
): Promise<{ data: DocumentConfig }> {
  return put<{ data: DocumentConfig }>(`/document/${id}`, data);
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string): Promise<void> {
  await apiDelete<void>(`/document/${id}`);
}

/**
 * Get documents associated with a warehouse
 */
export async function getWarehouseDocuments(
  warehouseId: string
): Promise<{ data: WarehouseDocument[] }> {
  return get<{ data: WarehouseDocument[] }>(`/warehouse/${warehouseId}/documents`);
}

/**
 * Update warehouse document associations
 */
export async function updateWarehouseDocuments(
  warehouseId: string,
  data: UpdateWarehouseDocumentsRequest
): Promise<{ data: WarehouseDocument[] }> {
  return put<{ data: WarehouseDocument[] }>(`/warehouse/${warehouseId}/documents`, data);
}
