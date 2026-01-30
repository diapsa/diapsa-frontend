/**
 * Contact Form Types
 * Based on API documentation from cms.grupodiapsa.com.mx
 */

/**
 * Form types supported by the API
 */
export type ContactFormType = 'general' | 'expo' | 'webinar';

/**
 * Base contact form data
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  form_type: ContactFormType;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  custom_fields?: Record<string, string>;
  website?: string; // Honeypot field - must be empty
}

/**
 * General contact form (default)
 */
export interface ContactFormGeneral {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  form_type: 'general';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  website?: string; // Honeypot
  custom_fields?: {
    message?: string;
    preferred_contact?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Expo registration form
 */
export interface ContactFormExpo {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  form_type: 'expo';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  website?: string; // Honeypot
  custom_fields?: {
    booth_number?: string;
    event_name?: string;
    event_date?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Webinar registration form
 */
export interface ContactFormWebinar {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  form_type: 'webinar';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  website?: string; // Honeypot
  custom_fields?: {
    webinar_title?: string;
    webinar_date?: string;
    attendance_confirmed?: string;
    puesto?: string;
    industria?: string;
    industria_otro?: string;
    como_te_enteraste?: string;
    como_te_enteraste_otro?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Contact response from API
 */
export interface ContactResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  form_type: ContactFormType;
  status: string;
  custom_fields?: Record<string, string>;
  created_at: string;
}

/**
 * Validation errors response (422)
 */
export interface ValidationErrors {
  [field: string]: string[];
}

/**
 * Field validation error
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * UTM parameters for tracking
 */
export interface UTMParams {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}

/**
 * Contact form submission result
 */
export interface ContactSubmissionResult {
  success: boolean;
  data?: ContactResponse;
  errors?: ValidationErrors;
  rateLimited?: boolean;
  retryAfter?: number;
}
