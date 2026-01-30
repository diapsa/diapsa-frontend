/**
 * useContactForm Hook
 * Handle contact form submission with validation and rate limiting
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { submitContact, getUTMParams } from '@/lib/api/contacts';
import type {
  ContactFormData,
  ContactResponse,
  ValidationErrors,
} from '@/types/contact';

interface UseContactFormResult {
  loading: boolean;
  success: boolean;
  errors: ValidationErrors;
  rateLimitExceeded: boolean;
  retryAfter: number | null;
  submitForm: (data: ContactFormData) => Promise<boolean>;
  resetForm: () => void;
  validateField: (field: string, value: string) => string | null;
}

export function useContactForm(): UseContactFormResult {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  // Countdown timer for rate limiting
  useEffect(() => {
    if (retryAfter && retryAfter > 0) {
      const timer = setInterval(() => {
        setRetryAfter((prev) => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            setRateLimitExceeded(false);
            return null;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [retryAfter]);

  const submitForm = useCallback(async (data: ContactFormData): Promise<boolean> => {
    setLoading(true);
    setSuccess(false);
    setErrors({});
    setRateLimitExceeded(false);

    try {
      // Add UTM parameters automatically
      const utmParams = getUTMParams();
      const formDataWithUTM = {
        ...data,
        ...utmParams,
      };

      const result = await submitContact(formDataWithUTM);

      if (result.success) {
        setSuccess(true);
        return true;
      }

      // Handle validation errors
      if (result.errors) {
        setErrors(result.errors);
        return false;
      }

      // Handle rate limiting
      if (result.rateLimited) {
        setRateLimitExceeded(true);
        setRetryAfter(result.retryAfter || 60);
        return false;
      }

      return false;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setErrors({
        general: ['Error al enviar el formulario. Por favor, intenta de nuevo.'],
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setLoading(false);
    setSuccess(false);
    setErrors({});
    setRateLimitExceeded(false);
    setRetryAfter(null);
  }, []);

  const validateField = useCallback((field: string, value: string): string | null => {
    switch (field) {
      case 'name':
        if (!value.trim()) {
          return 'El nombre es obligatorio';
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.-]+$/.test(value)) {
          return 'El nombre solo puede contener letras, espacios, guiones y puntos';
        }
        if (value.length > 255) {
          return 'El nombre no puede exceder 255 caracteres';
        }
        break;

      case 'email':
        if (!value.trim()) {
          return 'El correo electrónico es obligatorio';
        }
        // Basic RFC email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Ingresa un correo electrónico válido';
        }
        if (value.length > 255) {
          return 'El correo electrónico no puede exceder 255 caracteres';
        }
        break;

      case 'phone':
        if (value && !/^[\d\s\+\-\(\)]+$/.test(value)) {
          return 'El teléfono solo puede contener números, espacios y los caracteres +, -, (, )';
        }
        if (value.length > 50) {
          return 'El teléfono no puede exceder 50 caracteres';
        }
        break;

      case 'company':
        if (value.length > 255) {
          return 'La empresa no puede exceder 255 caracteres';
        }
        break;

      case 'country':
        if (value.length > 100) {
          return 'El país no puede exceder 100 caracteres';
        }
        break;

      default:
        // Custom fields validation
        if (value.length > 500) {
          return 'Este campo no puede exceder 500 caracteres';
        }
    }

    return null;
  }, []);

  return {
    loading,
    success,
    errors,
    rateLimitExceeded,
    retryAfter,
    submitForm,
    resetForm,
    validateField,
  };
}
