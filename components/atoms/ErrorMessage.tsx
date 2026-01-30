/**
 * ErrorMessage Component
 * Mensaje de error con variantes y botón de retry opcional
 */

import { ReactNode } from 'react';

interface ErrorMessageProps {
  message: string;
  variant?: 'error' | 'warning' | 'info';
  icon?: boolean;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  children?: ReactNode;
}

export default function ErrorMessage({
  message,
  variant = 'error',
  icon = true,
  onRetry,
  retryLabel = 'Reintentar',
  className = '',
  children,
}: ErrorMessageProps) {
  const variants = {
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
      button: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  };

  const variantStyles = variants[variant];

  return (
    <div
      className={`
        rounded-lg border p-4
        ${variantStyles.container}
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {icon && <div className="flex-shrink-0">{variantStyles.icon}</div>}
        
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          {children && <div className="mt-2 text-sm">{children}</div>}
          
          {onRetry && (
            <button
              onClick={onRetry}
              className={`
                mt-3 px-4 py-2 rounded-md text-sm font-medium
                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
                ${variantStyles.button}
              `}
            >
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Empty State Component
 * Para cuando no hay resultados/datos
 */
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      
      {description && (
        <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      )}
      
      {action && (
        <button
          onClick={action.onClick}
          className="
            px-6 py-3 bg-primary text-white rounded-lg
            hover:bg-primary/90 transition-colors
            font-medium text-sm
          "
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
