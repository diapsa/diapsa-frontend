/**
 * ContactFormWebinar Component
 * Formulario específico para registro en webinars
 */

'use client';

import { useState, useRef, FormEvent } from 'react';
import { useContactForm } from '@/lib/hooks/useContactForm';
import { sanitizeContactFormData } from '@/lib/utils/sanitizeFormData';
import InputField from '@/components/atoms/InputField';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import SuccessMessage from '@/components/atoms/SuccessMessage';
import RateLimitNotice from '@/components/molecules/RateLimitNotice';
import { FormErrors } from '@/components/atoms/FormFieldError';
import type { ContactFormWebinar as ContactFormWebinarType, ContactFormData } from '@/types/contact';

interface ContactFormWebinarProps {
  webinarTitle?: string;
  webinarDate?: string;
  onSuccess?: () => void;
  className?: string;
}

export default function ContactFormWebinar({
  webinarTitle = '',
  webinarDate = '',
  onSuccess,
  className = '',
}: ContactFormWebinarProps) {
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

  const [formData, setFormData] = useState<ContactFormWebinarType>({
    name: '',
    email: '',
    phone: '',
    company: '',
    form_type: 'webinar',
    custom_fields: {
      webinar_title: webinarTitle,
      webinar_date: webinarDate,
      attendance_confirmed: 'yes',
    },
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (['webinar_title', 'webinar_date', 'attendance_confirmed'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        custom_fields: {
          ...prev.custom_fields,
          [name]: type === 'checkbox' ? (checked ? 'yes' : 'no') : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string, value: string) => {
    const error = validateField(field, value);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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

    // Sanitizar datos antes de enviar
    const sanitizedData = sanitizeContactFormData(formData);
    const result = await submitForm(sanitizedData);

    if (result) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        form_type: 'webinar',
        custom_fields: {
          webinar_title: webinarTitle,
          webinar_date: webinarDate,
          attendance_confirmed: 'yes',
        },
      });
      setFieldErrors({});
      formRef.current?.reset();
      onSuccess?.();
    }
  };

  const getFieldError = (field: string): string | undefined => {
    if (fieldErrors[field]) return fieldErrors[field];
    if (apiErrors[field]) return apiErrors[field][0];
    return undefined;
  };

  if (success) {
    return (
      <div className={className}>
        <SuccessMessage
          message="¡Registro confirmado! Recibirás un correo con los detalles del webinar."
          icon
          onDismiss={resetForm}
        />
      </div>
    );
  }

  if (rateLimitExceeded && retryAfter) {
    return (
      <div className={className}>
        <RateLimitNotice retryAfter={retryAfter} onRetryReady={resetForm} />
      </div>
    );
  }

  const generalErrors = apiErrors.general || [];

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      noValidate
    >
      {generalErrors.length > 0 && <FormErrors errors={generalErrors} />}

      {/* Webinar info (read-only if provided) */}
      {webinarTitle && (
        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
          <p className="text-sm font-semibold text-secondary mb-2">Webinar</p>
          <p className="text-base font-medium text-gray-900">{webinarTitle}</p>
          {webinarDate && (
            <p className="text-sm text-gray-600 mt-1">
              <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {webinarDate}
            </p>
          )}
        </div>
      )}

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
        helperText="Te enviaremos el enlace de acceso al webinar"
      />

      <InputField
        label="Teléfono"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        onBlur={(e) => handleBlur('phone', e.target.value)}
        error={getFieldError('phone')}
        disabled={loading}
      />

      <InputField
        label="Empresa"
        name="company"
        type="text"
        value={formData.company}
        onChange={handleChange}
        disabled={loading}
      />

      {/* Attendance confirmation */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          name="attendance_confirmed"
          checked={formData.custom_fields?.attendance_confirmed === 'yes'}
          onChange={handleChange}
          disabled={loading}
          className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
        />
        <label htmlFor="attendance_confirmed" className="text-sm text-gray-700 cursor-pointer">
          Confirmo mi asistencia al webinar. Entiendo que recibiré un correo de confirmación
          con el enlace de acceso.
        </label>
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value=""
        onChange={() => {}}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <button
        type="submit"
        disabled={loading}
        className="
          w-full px-6 py-3 bg-secondary text-white rounded-lg
          font-semibold hover:bg-secondary/90 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {loading ? (
          <>
            <LoadingSpinner size="small" color="white" />
            Registrando...
          </>
        ) : (
          'Confirmar registro'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Al registrarte, recibirás recordatorios y el enlace de acceso al webinar por correo electrónico.
      </p>
    </form>
  );
}
