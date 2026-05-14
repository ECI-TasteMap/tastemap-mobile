import axios from 'axios';

/**
 * Normalized API error thrown by apiClient interceptor.
 * Consumers catch ApiError instead of raw AxiosError.
 */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isNetworkError() {
    return this.statusCode === 0;
  }

  get isUnauthorized() {
    return this.statusCode === 401;
  }

  get isNotFound() {
    return this.statusCode === 404;
  }

  get isServerError() {
    return this.statusCode >= 500;
  }
}

/**
 * Converts any thrown value into an ApiError.
 * Used in the apiClient response interceptor so every
 * rejected promise delivers a consistent error shape.
 */
export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const responseData = error.response?.data as Record<string, unknown> | undefined;
    const message =
      (typeof responseData?.message === 'string' ? responseData.message : null) ??
      (typeof responseData?.error === 'string' ? responseData.error : null) ??
      error.message ??
      'Error de red desconocido';
    return new ApiError(status, message, responseData);
  }

  if (error instanceof Error) {
    return new ApiError(0, error.message);
  }

  return new ApiError(0, 'Error desconocido');
}
