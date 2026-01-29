"use server";
/**
 * Centralized HTTP Client for API requests
 * 
 * Automatically adds /api prefix to all routes
 * Automatically includes Authorization Bearer header in all requests
 */
import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_HOST || 'http://localhost:5000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Get authentication token from cookies (client-side)
 * Reads the "session" cookie from document.cookie
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  // Parse cookies from document.cookie
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies['session'] || null;
};



interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Builds the full URL with /api prefix
   */
  private buildURL(endpoint: string): string {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Always prepend /api
    return `${this.baseUrl}/api/${cleanEndpoint}`;
  }

  /**
   * Gets default headers including Authorization Bearer
   */
  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const token = getAuthToken();
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

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Build URL with /api prefix and query params if provided
    let url = this.buildURL(endpoint);
    if (params) {
      const searchParams = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      );
      url += `?${searchParams.toString()}`;
    }

    // Get headers with Authorization
    const headers = this.getHeaders(fetchOptions.headers);
    console.log("Headers:", headers);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new ApiError(
          errorMessage || `Request failed: ${response.statusText}`,
          response.status,
          response.statusText
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
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new ApiError('Network error: Unable to connect to server');
      }

      // Handle other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }

  private async extractErrorMessage(response: Response): Promise<string> {
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

  /**
   * HTTP GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * HTTP POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * HTTP PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * HTTP PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * HTTP DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(BASE_URL);

// Export default for convenience
export default apiClient;
