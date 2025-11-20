/**
 * Custom error classes for API error handling
 * Provides type-safe error handling with detailed context
 */

/**
 * Base API Error class
 * Use for any HTTP error response (4xx, 5xx)
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public endpoint: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    // Maintains proper stack trace for where error was thrown (V8 engines only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Authentication Error (401)
 * User is not authenticated or token expired
*/
export class AuthError extends ApiError {
  constructor(endpoint: string, data?: unknown) {
    super(401, 'Unauthorized', endpoint, data);
    this.name = 'AuthError';
  }
}

/**
 * Validation Error (422)
 * Server validation failed
 */
export class ValidationError extends ApiError {
  constructor(endpoint: string, public errors: Record<string, string[]>, data?: unknown) {
    super(422, 'Validation failed', endpoint, data);
    this.name = 'ValidationError';
  }
}

/**
 * Network Error
 * Fetch failed due to network issues (no internet, DNS, CORS, etc)
 */
export class NetworkError extends Error {
  constructor(message: string = 'Network request failed. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
  }
}
