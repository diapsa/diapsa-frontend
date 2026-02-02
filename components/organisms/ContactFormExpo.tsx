/**
 * ContactFormExpo Component
 * Formulario específico para registro en exposiciones
 */

'use client';

import { useState, useRef, FormEvent, ChangeEvent } from 'react';
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
  onSuccess?: () => void;
  className?: string;
}

export default function ContactFormExpo({
  eventName = '',
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
    country: '',
    form_type: 'expo',
    custom_fields: {
      event_name: eventName,
      city: '',
      industry: '',
      position: '',
      comments: '',
      subject: '',
      privacy_accepted: false,
    },
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Manejar checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        custom_fields: {
          ...prev.custom_fields,
          [name]: checked,
        },
      }));
    }
    // Campos en custom_fields
    else if (['event_name', 'event_date', 'city', 'industry', 'position', 'comments', 'subject', 'privacy_accepted'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        custom_fields: {
          ...prev.custom_fields,
          [name]: value,
        },
      }));
    }
    // Campos principales
    else {
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

    // Validaciones campos principales
    const nameError = validateField('name', formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateField('email', formData.email);
    if (emailError) newErrors.email = emailError;

    if (formData.phone) {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    // Validaciones campos custom requeridos
    if (!formData.company?.trim()) {
      newErrors.company = 'El nombre de la empresa es requerido';
    }

    if (!formData.country?.trim()) {
      newErrors.country = 'El país/región es requerido';
    }

    if (!formData.custom_fields?.city?.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (!formData.custom_fields?.industry?.trim()) {
      newErrors.industry = 'El giro de la empresa es requerido';
    }

    if (!formData.custom_fields?.position?.trim()) {
      newErrors.position = 'El puesto es requerido';
    }

    if (!formData.custom_fields?.subject?.trim()) {
      newErrors.subject = 'Debes seleccionar un asunto';
    }

    if (formData.custom_fields?.privacy_accepted !== true) {
      newErrors.privacy_accepted = 'Debes aceptar el aviso de privacidad';
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
        country: '',
        form_type: 'expo',
        custom_fields: {
          event_name: eventName,
          city: '',
          industry: '',
          position: '',
          comments: '',
          subject: '',
          privacy_accepted: false,
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
          message="¡Registro exitoso! Nos pondremos en contacto contigo lo antes posible."
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
      className={`space-y-5 ${className}`}
      noValidate
    >
      {generalErrors.length > 0 && <FormErrors errors={generalErrors} />}

      {/* Información Personal */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">Información Personal</h4>
        
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
          placeholder="Ej: Juan Pérez García"
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
          placeholder="tucorreo@empresa.com"
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
          placeholder="+52 123 456 7890"
        />
      </div>

      {/* Información Empresarial */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">Información Empresarial</h4>
        
        <InputField
          label="Nombre de la empresa"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          error={getFieldError('company')}
          required
          disabled={loading}
          placeholder="Ej: Industrias ABC S.A. de C.V."
        />

        <InputField
          label="Giro de la empresa"
          name="industry"
          type="text"
          value={formData.custom_fields?.industry || ''}
          onChange={handleChange}
          error={getFieldError('industry')}
          required
          disabled={loading}
          placeholder="Ej: Manufacturera, Automotriz, Alimentos, etc."
        />

        <InputField
          label="Puesto"
          name="position"
          type="text"
          value={formData.custom_fields?.position || ''}
          onChange={handleChange}
          error={getFieldError('position')}
          required
          disabled={loading}
          placeholder="Ej: Gerente de Mantenimiento, Ingeniero, Director, etc."
        />
      </div>

      {/* Ubicación */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">Ubicación</h4>
        
        <InputField
          label="País/Región"
          name="country"
          type="text"
          value={formData.country}
          onChange={handleChange}
          error={getFieldError('country')}
          required
          disabled={loading}
          placeholder="Ej: México"
        />

        <InputField
          label="Ciudad"
          name="city"
          type="text"
          value={formData.custom_fields?.city || ''}
          onChange={handleChange}
          error={getFieldError('city')}
          required
          disabled={loading}
          placeholder="Ej: Monterrey, Ciudad de México, Guadalajara, etc."
        />
      </div>

      {/* Asunto e Intereses */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">Información de Contacto</h4>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Asunto <span className="text-red-500">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.custom_fields?.subject || ''}
            onChange={handleChange}
            disabled={loading}
            className={
              `w-full px-4 py-2.5 border rounded-lg text-gray-900 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                getFieldError('subject') ? 'border-red-500' : 'border-gray-300'
              } ${!formData.custom_fields?.subject ? 'text-gray-400' : ''}`
            }
          >
            <option value="" disabled hidden>Selecciona un asunto</option>
            <option value="informacion_cursos">Información sobre cursos</option>
            <option value="informacion_servicios">Información sobre servicios</option>
            <option value="cotizacion">Solicitar cotización</option>
            <option value="otro">Otro</option>
          </select>
          {getFieldError('subject') && (
            <p className="mt-1 text-sm text-red-500">{getFieldError('subject')}</p>
          )}
        </div>

        {/* Comentarios */}
        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
            Comentarios adicionales
          </label>
          <textarea
            id="comments"
            name="comments"
            rows={4}
            value={formData.custom_fields?.comments || ''}
            onChange={handleChange}
            disabled={loading}
            placeholder="Comparte cualquier información adicional que consideres relevante..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
        </div>
      </div>

      {/* Aviso de Privacidad */}
      <div className="pt-4 border-t border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="privacy_accepted"
            checked={formData.custom_fields?.privacy_accepted === true}
            onChange={handleChange}
            disabled={loading}
            className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
          />
          <span className="text-sm text-gray-700 flex-1">
            Acepto el{' '}
            <a
              href="/aviso-privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline font-medium"
            >
              aviso de privacidad
            </a>
            {' '}y autorizo el tratamiento de mis datos personales <span className="text-red-500">*</span>
          </span>
        </label>
        {getFieldError('privacy_accepted') && (
          <p className="mt-2 text-sm text-red-500">{getFieldError('privacy_accepted')}</p>
        )}
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
          w-full px-6 py-3 bg-primary text-white rounded-lg
          font-semibold hover:bg-primary/90 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
          mt-6
        "
      >
        {loading ? (
          <>
            <LoadingSpinner size="small" color="white" />
            Enviando...
          </>
        ) : (
          'Enviar mis Datos'
        )}
      </button>
    </form>
  );
}
