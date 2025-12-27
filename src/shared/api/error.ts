
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public endpoint: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

export class AuthError extends ApiError {
  constructor(endpoint: string, data?: unknown) {
    super(401, 'Unauthorized', endpoint, data);
    this.name = 'AuthError';
  }
}

export class ValidationError extends ApiError {
  constructor(endpoint: string, public errors: Record<string, string[]>, data?: unknown) {
    super(422, 'Validation failed', endpoint, data);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network request failed. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
  }
}
