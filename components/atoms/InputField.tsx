/**
 * InputField Component
 * Input reutilizable con label, error y validación
 */

'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface BaseInputProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  containerClassName?: string;
}

type InputFieldProps = BaseInputProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>;

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      name,
      error,
      required = false,
      helperText,
      containerClassName = '',
      className = '',
      type = 'text',
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className={containerClassName}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          required={required}
          className={`
            w-full px-4 py-2 border rounded-lg
            text-gray-900 placeholder-gray-400
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary/50
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${hasError ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300'}
            ${className}
          `}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          {...props}
        />

        {helperText && !error && (
          <p id={`${name}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}

        {error && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;

/**
 * TextareaField Component
 * Textarea reutilizable con label, error y validación
 */
type TextareaFieldProps = BaseInputProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>;

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    {
      label,
      name,
      error,
      required = false,
      helperText,
      containerClassName = '',
      className = '',
      rows = 4,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className={containerClassName}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <textarea
          ref={ref}
          id={name}
          name={name}
          rows={rows}
          required={required}
          className={`
            w-full px-4 py-2 border rounded-lg
            text-gray-900 placeholder-gray-400
            transition-colors resize-y
            focus:outline-none focus:ring-2 focus:ring-primary/50
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${hasError ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300'}
            ${className}
          `}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          {...props}
        />

        {helperText && !error && (
          <p id={`${name}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}

        {error && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextareaField.displayName = 'TextareaField';

/**
 * SelectField Component
 * Select dropdown reutilizable
 */
interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends BaseInputProps {
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      name,
      error,
      required = false,
      helperText,
      options,
      placeholder = 'Selecciona una opción',
      containerClassName = '',
      className = '',
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className={containerClassName}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <select
          ref={ref}
          id={name}
          name={name}
          required={required}
          className={`
            w-full px-4 py-2 border rounded-lg
            text-gray-900
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary/50
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${hasError ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300'}
            ${className}
          `}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {helperText && !error && (
          <p id={`${name}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}

        {error && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';
