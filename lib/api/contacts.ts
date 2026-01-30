/**
 * Contacts API
 * Functions to submit contact forms to cms.grupodiapsa.com.mx
 */

import { apiFetch, ApiError } from './config';
import type { ApiResponse } from '@/types/api';
import type {
  ContactFormData,
  ContactResponse,
  ContactSubmissionResult,
} from '@/types/contact';

/**
 * Submit contact form
 * Handles rate limiting and validation errors
 */
export async function submitContact(
  formData: ContactFormData
): Promise<ContactSubmissionResult> {
  try {
    // Ensure honeypot field is empty
    const dataToSend = {
      ...formData,
      website: '', // Always set honeypot to empty
    };

    const response = await apiFetch<ApiResponse<ContactResponse>>(
      '/contacts',
      {
        method: 'POST',
        body: JSON.stringify(dataToSend),
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle validation errors (422)
      if (error.status === 422) {
        return {
          success: false,
          errors: error.errors,
        };
      }

      // Handle rate limiting (429)
      if (error.status === 429) {
        // Extract retry time from error message
        const retryMatch = error.message.match(/(\d+)\s+segundos/);
        const retryAfter = retryMatch ? parseInt(retryMatch[1]) : 60;

        return {
          success: false,
          rateLimited: true,
          retryAfter,
        };
      }
    }

    // Re-throw other errors
    throw error;
  }
}

/**
 * Helper to get UTM parameters from URL
 */
export function getUTMParams(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
} {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
  };
}
