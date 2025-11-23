/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Client with automatic token injection
 * Handles all HTTP requests to the backend with authentication
 */
import { AuthError } from "@supabase/supabase-js";
import { getAuthToken } from "./cookies";
import { ValidationError, ApiError, NetworkError } from "./error";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "/api/";

export interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}
/**
 * Enhanced fetch with automatic token injection
 */

export async function apiClient(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<Response> {
  const { requiresAuth = true, headers = {}, ...restOptions } = options;

  // Build headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // Add authorization token if required
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  // Build full URL
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;
  // Make request
  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
  });
  return response;
}

async function handleResponse<T>(
  response: Response,
  endpoint: string
): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText || "Request failed",
    }));
    switch (response.status) {
      case 401:
        throw new AuthError(endpoint, errorData);
      case 422:
        throw new ValidationError(endpoint, errorData.errors || {}, errorData);
      case 403:
        throw new ApiError(
          403,
          errorData.message || "Forbidden",
          endpoint,
          errorData
        );
      case 404:
        throw new ApiError(
          404,
          errorData.message || "Not Found",
          endpoint,
          errorData
        );
      case 500:
        throw new ApiError(
          500,
          errorData.message || "Server Error",
          endpoint,
          errorData
        );
      default:
        throw new ApiError(
          response.status,
          errorData.message || `Request failed with status ${response.status}`,
          endpoint,
          errorData
        );
    }
  }

  // Parse and return successful response
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}
/**
 * Typed API methods
 */
export const api = {
  get: async <T = any>(
    endpoint: string,
    options?: ApiRequestOptions
  ): Promise<T> => {
    try {
      const response = await apiClient(endpoint, { ...options, method: "GET" });
      return handleResponse<T>(response, endpoint);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new NetworkError(
          "Network request failed. Please check your connection."
        );
      }
      throw error;
    }
  },
  post: async <T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<T> => {
    try {
      const response = await apiClient(endpoint, {
        ...options,
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      });
      return handleResponse<T>(response, endpoint);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new NetworkError(
          "Network request failed. Please check your connection."
        );
      }
      throw error;
    }
  },
  put: async <T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<T> => {
    try {
      const response = await apiClient(endpoint, {
        ...options,
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      });
      return handleResponse<T>(response, endpoint);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new NetworkError(
          "Network request failed. Please check your connection."
        );
      }
      throw error;
    }
  },
  patch: async <T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<T> => {
    try {
      const response = await apiClient(endpoint, {
        ...options,
        method: "PATCH",
        body: data ? JSON.stringify(data) : undefined,
      });
      return handleResponse<T>(response, endpoint);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new NetworkError(
          "Network request failed. Please check your connection."
        );
      }
      throw error;
    }
  },
  delete: async <T = any>(
    endpoint: string,
    options?: ApiRequestOptions
  ): Promise<T> => {
    try {
      const response = await apiClient(endpoint, {
        ...options,
        method: "DELETE",
      });
      return handleResponse<T>(response, endpoint);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new NetworkError(
          "Network request failed. Please check your connection."
        );
      }
      throw error;
    }
  },
};
