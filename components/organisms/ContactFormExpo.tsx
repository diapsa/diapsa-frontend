/**
 * ContactFormExpo Component
 * Formulario específico para registro en exposiciones
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
import type { ContactFormExpo as ContactFormExpoType, ContactFormData } from '@/types/contact';

interface ContactFormExpoProps {
  eventName?: string;
  eventDate?: string;
  boothNumber?: string;
  onSuccess?: () => void;
  className?: string;
}

export default function ContactFormExpo({
  eventName = '',
  eventDate = '',
  boothNumber = '',
  onSuccess,
  className = '',
}: ContactFormExpoProps) {
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

  const [formData, setFormData] = useState<ContactFormExpoType>({
    name: '',
    email: '',
    phone: '',
    company: '',
    form_type: 'expo',
    custom_fields: {
      booth_number: boothNumber,
      event_name: eventName,
      event_date: eventDate,
    },
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (['booth_number', 'event_name', 'event_date'].includes(name)) {
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
        form_type: 'expo',
        custom_fields: {
          booth_number: boothNumber,
          event_name: eventName,
          event_date: eventDate,
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
          message="¡Registro exitoso! Nos vemos en el evento."
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

      {/* Event info (read-only if provided) */}
      {eventName && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm font-semibold text-primary mb-2">Evento</p>
          <p className="text-base font-medium text-gray-900">{eventName}</p>
          {eventDate && (
            <p className="text-sm text-gray-600 mt-1">{eventDate}</p>
          )}
          {boothNumber && (
            <p className="text-sm text-gray-600">Stand: {boothNumber}</p>
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
          w-full px-6 py-3 bg-primary text-white rounded-lg
          font-semibold hover:bg-primary/90 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {loading ? (
          <>
            <LoadingSpinner size="small" color="white" />
            Enviando...
          </>
        ) : (
          'Registrarme'
        )}
      </button>
    </form>
  );
}
