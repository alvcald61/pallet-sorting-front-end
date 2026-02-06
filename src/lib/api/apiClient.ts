"use server";
/**
 * Centralized HTTP Client for API requests
 * 
 * Automatically adds /api prefix to all routes
 * Automatically includes Authorization Bearer header in all requests
 */

import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_HOST || 'http://localhost:5000';


/**
 * Get authentication token from cookies (server-side)
 */
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  return token || null;
}

/**
 * Builds the full URL with /api prefix
 */
function buildURL(endpoint: string): string {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Always prepend /api
  return `${BASE_URL}/api/${cleanEndpoint}`;
}

/**
 * Gets default headers including Authorization Bearer
 */
async function getHeaders(customHeaders?: HeadersInit): Promise<HeadersInit> {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  // Add Authorization Bearer header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Extract error message from response
 */
async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      return errorData.message || errorData.error || null;
    }
    return await response.text();
  } catch {
    return '';
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Core request function
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with /api prefix and query params if provided
  let url = buildURL(endpoint);
  if (params) {
    const searchParams = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );
    url += `?${searchParams.toString()}`;
  }

  // Get headers with Authorization
  const headers = await getHeaders(fetchOptions.headers);

  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle expired/invalid token - delete cookie and throw specific error
    if (response.status === 401) {
      const cookieStore = await cookies();
      cookieStore.delete("session");
      throw new Error("SESSION_EXPIRED");
    }

    // Handle non-OK responses
    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response);
      throw new Error(
        errorMessage || `Request failed: ${response.statusText}`,
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    // Parse JSON response
    return await response.json();
  } catch (error) {
    // Re-throw ApiError as-is
    if (error) {
      throw error;
    }

    // Handle network errors
    if (error ) {
      throw new Error('Network error: Unable to connect to server');
    }

    // Handle other errors
    throw error;
  }
}

/**
 * HTTP GET request
 */
export async function get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * HTTP POST request
 */
export async function post<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestOptions
): Promise<T> {
  return request<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * HTTP PUT request
 */
export async function put<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestOptions
): Promise<T> {
  return request<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * HTTP PATCH request
 */
export async function patch<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestOptions
): Promise<T> {
  return request<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * HTTP DELETE request
 */
export async function apiDelete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * Download file from endpoint
 * @param endpoint - API endpoint to download from
 * @param filename - Optional filename for the download
 * @param options - Optional request options
 */
export async function downloadFile(
  endpoint: string,
  filename?: string,
  options?: RequestOptions
): Promise<void> {
  const { params, ...fetchOptions } = options || {};

  // Build URL with /api prefix and query params if provided
  let url = buildURL(endpoint);
  if (params) {
    const searchParams = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );
    url += `?${searchParams.toString()}`;
  }

  // Get headers with Authorization
  const headers = await getHeaders(fetchOptions.headers);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response);
      throw new Error(
        errorMessage || `Download failed: ${response.statusText}`,
      );
    }

    // Get the blob
    const blob = await response.blob();

    // Extract filename from Content-Disposition header if not provided
    let downloadFilename = filename;
    if (!downloadFilename) {
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=([^;\n]*)/);
        if (match && match[1]) {
          downloadFilename = match[1].trim().replace(/['"]/g, '');
        }
      }
    }

    // If still no filename, use a default
    if (!downloadFilename) {
      downloadFilename = `download_${Date.now()}`;
    }

    // Create blob URL and trigger download
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`File download error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load image as byte array from endpoint
 * @param endpoint - API endpoint to load image from
 * @param options - Optional request options
 * @returns Object containing the ArrayBuffer (byte array) and the blob
 */
export async function loadImageAsBytes(
  endpoint: string,
  options?: RequestOptions
): Promise<{ buffer: ArrayBuffer; blob: Blob }> {
  const { params, ...fetchOptions } = options || {};

  // Build URL with /api prefix and query params if provided
  let url = buildURL(endpoint);
  if (params) {
    const searchParams = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );
    url += `?${searchParams.toString()}`;
  }

  // Get headers with Authorization
  const headers = await getHeaders(fetchOptions.headers);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response);
      throw new Error(
        errorMessage || `Image load failed: ${response.statusText}`,
      );
    }

    // Get the blob
    const blob = await response.blob();

    // Convert blob to ArrayBuffer
    const buffer = await blob.arrayBuffer();

    return { buffer, blob };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Image load error: ${error.message}`);
    }
    throw error;
  }
}
