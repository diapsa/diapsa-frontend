/**
 * SuccessMessage Component
 * Mensaje de éxito con auto-dismiss opcional
 */

'use client';

import { useEffect, useState } from 'react';

interface SuccessMessageProps {
  message: string;
  icon?: boolean;
  autoDismiss?: boolean;
  dismissDelay?: number;
  onDismiss?: () => void;
  className?: string;
}

export default function SuccessMessage({
  message,
  icon = true,
  autoDismiss = false,
  dismissDelay = 5000,
  onDismiss,
  className = '',
}: SuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, dismissDelay);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissDelay, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        bg-green-50 border border-green-200 rounded-lg p-4
        text-green-800 animate-in fade-in slide-in-from-top-2 duration-300
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>

        {onDismiss && !autoDismiss && (
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className="flex-shrink-0 text-green-500 hover:text-green-700 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
