"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_HOST || "http://localhost:5000";

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
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    throw new Error("SESSION_EXPIRED");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${BASE_URL}/api/order/${orderId}/documents/${documentId}/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  if (response.status === 401) {
    cookieStore.delete("session");
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok) {
    throw new Error("Failed to upload document");
  }

  return response.json();
}
