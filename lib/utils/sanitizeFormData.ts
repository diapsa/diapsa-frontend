/**
 * Utility para sanitizar datos de formularios de contacto
 * Convierte custom_fields con valores undefined a Record<string, string>
 */

import type {
  ContacFormGasDetection,
  ContactFormData,
  ContactFormExpo,
  ContactFormGeneral,
  ContactFormWebinar
} from '@/types/contact';

type AnyContactForm = ContactFormExpo | ContactFormGeneral | ContactFormWebinar | ContacFormGasDetection;

/**
 * Sanitiza los datos del formulario para que sean compatibles con ContactFormData
 * Remueve valores undefined de custom_fields y los convierte a strings vacíos
 */
export function sanitizeContactFormData(formData: AnyContactForm): ContactFormData {
  const customFieldsSanitized = formData.custom_fields
    ? (Object.fromEntries(
      Object.entries(formData.custom_fields)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, value || ''])
    ) as Record<string, string>)
    : undefined;

  return {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    company: formData.company,
    country: formData.country,
    form_type: formData.form_type,
    utm_source: formData.utm_source,
    utm_medium: formData.utm_medium,
    utm_campaign: formData.utm_campaign,
    website: formData.website,
    custom_fields: customFieldsSanitized,
  };
}
