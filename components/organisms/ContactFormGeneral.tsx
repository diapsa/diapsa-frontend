/**
 * ContactFormGeneral Component
 * Formulario de contacto general con validación completa
 */

'use client';

import { useState, useRef, FormEvent } from 'react';
import { useContactForm } from '@/lib/hooks/useContactForm';
import { sanitizeContactFormData } from '@/lib/utils/sanitizeFormData';
import InputField, { TextareaField } from '@/components/atoms/InputField';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import SuccessMessage from '@/components/atoms/SuccessMessage';
import RateLimitNotice, { RateLimitBanner } from '@/components/molecules/RateLimitNotice';
import { FormErrors } from '@/components/atoms/FormFieldError';
import type { ContactFormGeneral as ContactFormGeneralType } from '@/types/contact';

// País por defecto: se dejó de preguntar en el formulario (2026-08-24).
const PAIS_POR_DEFECTO = 'México';

interface ContactFormGeneralProps {
  onSuccess?: () => void;
  className?: string;
}

export default function ContactFormGeneral({
  onSuccess,
  className = '',
}: ContactFormGeneralProps) {
  const {
    submitForm,
    loading,
    success,
    errors: apiErrors,
    rateLimitExceeded,
    retryAfter,
    resetForm,
    validateField,
  } = useContactForm();

  const [formData, setFormData] = useState<ContactFormGeneralType>({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: PAIS_POR_DEFECTO,
    form_type: 'general',
    custom_fields: {
      message: '',
      preferred_contact: 'email',
    },
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'message' || name === 'preferred_contact') {
      setFormData((prev) => ({
        ...prev,
        custom_fields: {
          ...prev.custom_fields,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle blur - validate field
  const handleBlur = (field: string, value: string) => {

    const error = validateField(field, value);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  // Handle submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const newErrors: Record<string, string> = {};

    const nameError = validateField('name', formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateField('email', formData.email);
    if (emailError) newErrors.email = emailError;

    if (formData.phone) {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    // Submit
    // Sanitizar datos antes de enviar
    const sanitizedData = sanitizeContactFormData(formData);
    const result = await submitForm(sanitizedData);

    if (result) {
      // Success - reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        country: PAIS_POR_DEFECTO,
        form_type: 'general',
        custom_fields: {
          message: '',
          preferred_contact: 'email',
        },
      });
      setFieldErrors({});
      formRef.current?.reset();
      onSuccess?.();
    }
  };

  // Get error message for field
  const getFieldError = (field: string): string | undefined => {
    if (fieldErrors[field]) return fieldErrors[field];
    if (apiErrors[field]) return apiErrors[field][0];
    return undefined;
  };

  // Show success message
  if (success) {
    return (
      <div className={className}>
        <SuccessMessage
          message="¡Gracias por contactarnos! Hemos recibido tu mensaje y te responderemos pronto."
          icon
          onDismiss={resetForm}
        />
      </div>
    );
  }

  // Show rate limit notice
  if (rateLimitExceeded && retryAfter) {
    return (
      <div className={className}>
        <RateLimitNotice
          retryAfter={retryAfter}
          onRetryReady={resetForm}
        />
      </div>
    );
  }

  // General errors from API
  const generalErrors = apiErrors.general || [];

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      noValidate
    >
      {/* General errors */}
      {generalErrors.length > 0 && (
        <FormErrors errors={generalErrors} />
      )}

      {/* Rate limit banner */}
      {retryAfter && retryAfter > 0 && (
        <RateLimitBanner attemptsRemaining={0} maxAttempts={5} />
      )}

      {/* Datos personales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <InputField
          label="Nombre completo"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          onBlur={(e) => handleBlur('name', e.target.value)}
          error={getFieldError('name')}
          required
          disabled={loading}
        />

        {/* Email */}
        <InputField
          label="Correo electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={(e) => handleBlur('email', e.target.value)}
          error={getFieldError('email')}
          required
          disabled={loading}
        />
      </div>

      {/* Empresa y teléfono. El selector de país se retiró (2026-08-24): casi
          todo el tráfico es de México y cada campo extra cuesta conversión. Se
          sigue enviando "México" por defecto para no cambiar el backend. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Company */}
        <InputField
          label="Empresa"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          disabled={loading}
        />

        {/* Phone */}
        <InputField
          label="Teléfono"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          onBlur={(e) => handleBlur('phone', e.target.value)}
          error={getFieldError('phone')}
          helperText="Formato: +52 55 1234 5678"
          disabled={loading}
        />
      </div>

      {/* Message */}
      <TextareaField
        label="Mensaje"
        name="message"
        value={formData.custom_fields?.message || ''}
        onChange={handleChange}
        rows={5}
        helperText="Cuéntanos cómo podemos ayudarte"
        disabled={loading}
      />

      {/* "Medio de contacto preferido" se retiró (2026-08-24): no cambiaba nada
          operativamente, porque se responde por donde el prospecto dejó dato.
          Se sigue enviando "email" por defecto. */}

      {/* Honeypot field - hidden */}
      <input
        type="text"
        name="website"
        value=""
        onChange={() => { }}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full px-6 py-3 bg-primary text-white rounded-xs
          font-bold hover:bg-secondary hover:text-primary transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2 shadow-md
        "
      >
        {loading ? (
          <>
            <LoadingSpinner size="small" color="white" />
            Enviando...
          </>
        ) : (
          <>
            Enviar mensaje
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>

      {/* Privacy notice */}
      <p className="text-xs text-tertiary text-center">
        Al enviar este formulario, aceptas nuestra{' '}
        <a href="/privacidad" className="text-secondary hover:underline font-semibold">
          política de privacidad
        </a>
      </p>
    </form>
  );
}
