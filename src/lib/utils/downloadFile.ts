"use client";

/**
 * Download a file by fetching from a server action that returns a Blob,
 * then triggering a browser download.
 *
 * @param fetchBlob - An async function that returns { blob, filename? }
 * @param fallbackFilename - Fallback filename if none is provided
 */
export async function downloadFile(
  fetchBlob: () => Promise<{ blob: Blob; filename?: string }>,
  fallbackFilename?: string,
): Promise<void> {
  const { blob, filename } = await fetchBlob();

  const downloadFilename = filename || fallbackFilename || `download_${Date.now()}`;

  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = downloadFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}
