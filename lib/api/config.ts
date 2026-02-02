/**
 * API Configuration
 * Base URL and fetch wrapper for API requests
 */

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10);

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic fetch wrapper with error handling, timeout, and automatic headers
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Default headers
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse JSON response
    const data = await response.json();

    // Handle HTTP errors
    if (!response.ok) {
      // Handle validation errors (422)
      if (response.status === 422 && data.errors) {
        throw new ApiError(
          data.message || 'Error de validación',
          response.status,
          data.errors
        );
      }

      // Handle rate limiting (429)
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        throw new ApiError(
          `Rate limit excedido. Reintentar en ${retryAfter || 60} segundos.`,
          response.status
        );
      }

      // Handle not found (404)
      if (response.status === 404) {
        throw new ApiError('Recurso no encontrado', response.status);
      }

      // Generic error
      throw new ApiError(
        data.message || `Error HTTP: ${response.status}`,
        response.status
      );
    }

    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Tiempo de espera agotado. Intenta de nuevo.');
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError(
        'Error de conexión. Verifica tu conexión a internet.'
      );
    }

    // Re-throw ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // Unknown error
    throw new ApiError('Error desconocido al realizar la petición.');
  }
}

/**
 * Helper to get rate limit info from response headers
 */
export function getRateLimitInfo(response: Response): {
  limit: number | null;
  remaining: number | null;
  retryAfter: number | null;
} {
  return {
    limit: parseInt(response.headers.get('X-RateLimit-Limit') || '0') || null,
    remaining:
      parseInt(response.headers.get('X-RateLimit-Remaining') || '0') || null,
    retryAfter:
      parseInt(response.headers.get('Retry-After') || '0') || null,
  };
}
