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
