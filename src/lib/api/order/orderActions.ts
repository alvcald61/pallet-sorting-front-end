"use server";

import { postFormData } from "../apiClient";

interface UploadDocumentParams {
  orderId: string;
  documentId: number;
  file: File;
}

export async function uploadOrderDocument({
  orderId,
  documentId,
  file,
}: UploadDocumentParams) {
  const formData = new FormData();
  formData.append("file", file);

  return postFormData<{ mensaje?: string }>(
    `/order/${orderId}/documents/${documentId}/upload`,
    formData,
  );
}

interface UploadSunatDocumentParams {
  orderId: string;
  file: File;
}

export async function uploadSunatDocument({
  orderId,
  file,
}: UploadSunatDocumentParams) {
  const formData = new FormData();
  formData.append("file", file);

  return postFormData<{ data?: string; message?: string }>(
    `/order/${orderId}/sunat-document`,
    formData,
  );
}
