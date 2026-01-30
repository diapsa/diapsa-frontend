/**
 * ContactFormGeneral Component
 * Formulario de contacto general con validación completa
 */

'use client';

import { useState, useRef, FormEvent } from 'react';
import { useContactForm } from '@/lib/hooks/useContactForm';
import { sanitizeContactFormData } from '@/lib/utils/sanitizeFormData';
import InputField, { TextareaField, SelectField } from '@/components/atoms/InputField';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import SuccessMessage from '@/components/atoms/SuccessMessage';
import RateLimitNotice, { RateLimitBanner } from '@/components/molecules/RateLimitNotice';
import { FormErrors } from '@/components/atoms/FormFieldError';
import type { ContactFormGeneral as ContactFormGeneralType, ContactFormData } from '@/types/contact';

interface ContactFormGeneralProps {
  onSuccess?: () => void;
  className?: string;
}

const countries = [
  { value: 'México', label: 'México' },
  { value: 'Estados Unidos', label: 'Estados Unidos' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Chile', label: 'Chile' },
  { value: 'Perú', label: 'Perú' },
  { value: 'España', label: 'España' },
  { value: 'Otro', label: 'Otro' },
];

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
    country: '',
    form_type: 'general',
    custom_fields: {
      message: '',
      preferred_contact: 'email',
    },
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
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
    setTouched((prev) => ({ ...prev, [field]: true }));

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
        country: '',
        form_type: 'general',
        custom_fields: {
          message: '',
          preferred_contact: 'email',
        },
      });
      setTouched({});
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

      {/* Company */}
      <InputField
        label="Empresa"
        name="company"
        type="text"
        value={formData.company}
        onChange={handleChange}
        disabled={loading}
      />

      {/* Country */}
      <SelectField
        label="País"
        name="country"
        options={countries}
        value={formData.country}
        onChange={handleChange}
        placeholder="Selecciona tu país"
        disabled={loading}
      />

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

      {/* Preferred contact method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Medio de contacto preferido
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="preferred_contact"
              value="email"
              checked={formData.custom_fields?.preferred_contact === 'email'}
              onChange={handleChange}
              disabled={loading}
              className="w-4 h-4 text-primary border-gray-300 focus:ring-primary cursor-pointer"
            />
            <span className="text-sm text-gray-700">Email</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="preferred_contact"
              value="phone"
              checked={formData.custom_fields?.preferred_contact === 'phone'}
              onChange={handleChange}
              disabled={loading}
              className="w-4 h-4 text-primary border-gray-300 focus:ring-primary cursor-pointer"
            />
            <span className="text-sm text-gray-700">Teléfono</span>
          </label>
        </div>
      </div>

      {/* Honeypot field - hidden */}
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

      {/* Submit button */}
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
          'Enviar mensaje'
        )}
      </button>

      {/* Privacy notice */}
      <p className="text-xs text-gray-500 text-center">
        Al enviar este formulario, aceptas nuestra{' '}
        <a href="/privacidad" className="text-primary hover:underline">
          política de privacidad
        </a>
      </p>
    </form>
  );
}
