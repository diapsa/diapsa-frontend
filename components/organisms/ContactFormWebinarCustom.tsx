/**
 * ContactFormWebinarCustom Component
 * Formulario específico para registro en webinars con campos personalizados
 */

'use client';

import { useState, useRef, FormEvent } from 'react';
import { useContactForm } from '@/lib/hooks/useContactForm';
import InputField, { SelectField } from '@/components/atoms/InputField';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import SuccessMessage from '@/components/atoms/SuccessMessage';
import RateLimitNotice from '@/components/molecules/RateLimitNotice';
import { FormErrors } from '@/components/atoms/FormFieldError';
import type { ContactFormWebinar as ContactFormData } from '@/types/contact';

interface ContactFormWebinarCustomProps {
  webinarTitle?: string;
  webinarDate?: string;
  onSuccess?: () => void;
  className?: string;
}

const industries = [
  { value: 'automotriz', label: 'Automotriz' },
  { value: 'energia-utilities', label: 'Energía/Utilities' },
  { value: 'alimentos-bebidas', label: 'Alimentos/Bebidas' },
  { value: 'cemento', label: 'Cemento' },
  { value: 'mineria', label: 'Minería' },
  { value: 'oil-gas', label: 'Oil & Gas' },
  { value: 'otro', label: 'Otro' },
];

const howDidYouHear = [
  { value: 'sitio-web', label: 'Sitio web' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'un-amigo', label: 'Un amigo' },
  { value: 'otro', label: 'Otro' },
];

export default function ContactFormWebinarCustom({
  webinarTitle = '',
  webinarDate = '',
  onSuccess,
  className = '',
}: ContactFormWebinarCustomProps) {
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

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    form_type: 'webinar',
    custom_fields: {
      webinar_title: webinarTitle,
      webinar_date: webinarDate,
      puesto: '',
      industria: '',
      industria_otro: '',
      como_te_enteraste: '',
      como_te_enteraste_otro: '',
    },
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (['puesto', 'industria', 'industria_otro', 'como_te_enteraste', 'como_te_enteraste_otro'].includes(name)) {
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

    // Validar campos custom requeridos
    if (!formData.custom_fields?.puesto?.trim()) {
      newErrors.puesto = 'El puesto es obligatorio';
    }

    if (!formData.custom_fields?.industria) {
      newErrors.industria = 'Selecciona una industria';
    }

    if (formData.custom_fields?.industria === 'otro' && !formData.custom_fields?.industria_otro?.trim()) {
      newErrors.industria_otro = 'Especifica tu industria';
    }

    if (!formData.custom_fields?.como_te_enteraste) {
      newErrors.como_te_enteraste = 'Selecciona una opción';
    }

    if (formData.custom_fields?.como_te_enteraste === 'otro' && !formData.custom_fields?.como_te_enteraste_otro?.trim()) {
      newErrors.como_te_enteraste_otro = 'Especifica cómo te enteraste';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    // Asegurar que todos los campos custom sean strings (no undefined)
    const sanitizedData = {
      ...formData,
      custom_fields: Object.fromEntries(
        Object.entries(formData.custom_fields || {}).map(([key, value]) => [key, value || ''])
      ) as Record<string, string>,
    };

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
          puesto: '',
          industria: '',
          industria_otro: '',
          como_te_enteraste: '',
          como_te_enteraste_otro: '',
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
  const showIndustriaOtro = formData.custom_fields?.industria === 'otro';
  const showComoTeEnterasteOtro = formData.custom_fields?.como_te_enteraste === 'otro';

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      noValidate
    >
      {generalErrors.length > 0 && <FormErrors errors={generalErrors} />}

      {/* Webinar info */}
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

      {/* Nombre */}
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
        helperText="Te enviaremos el enlace de acceso al webinar"
      />

      {/* Teléfono */}
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

      {/* Empresa */}
      <InputField
        label="Empresa"
        name="company"
        type="text"
        value={formData.company}
        onChange={handleChange}
        disabled={loading}
      />

      {/* Puesto */}
      <InputField
        label="Puesto"
        name="puesto"
        type="text"
        value={formData.custom_fields?.puesto || ''}
        onChange={handleChange}
        error={getFieldError('puesto')}
        required
        disabled={loading}
      />

      {/* Industria */}
      <SelectField
        label="Industria"
        name="industria"
        options={industries}
        value={formData.custom_fields?.industria || ''}
        onChange={handleChange}
        error={getFieldError('industria')}
        required
        disabled={loading}
      />

      {/* Industria otro (condicional) */}
      {showIndustriaOtro && (
        <InputField
          label="Especifica tu industria"
          name="industria_otro"
          type="text"
          value={formData.custom_fields?.industria_otro || ''}
          onChange={handleChange}
          error={getFieldError('industria_otro')}
          required
          disabled={loading}
        />
      )}

      {/* Cómo te enteraste */}
      <SelectField
        label="¿Cómo te enteraste del evento?"
        name="como_te_enteraste"
        options={howDidYouHear}
        value={formData.custom_fields?.como_te_enteraste || ''}
        onChange={handleChange}
        error={getFieldError('como_te_enteraste')}
        required
        disabled={loading}
      />

      {/* Cómo te enteraste otro (condicional) */}
      {showComoTeEnterasteOtro && (
        <InputField
          label="Especifica cómo te enteraste"
          name="como_te_enteraste_otro"
          type="text"
          value={formData.custom_fields?.como_te_enteraste_otro || ''}
          onChange={handleChange}
          error={getFieldError('como_te_enteraste_otro')}
          required
          disabled={loading}
        />
      )}

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

      {/* Submit button */}
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
