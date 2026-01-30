/**
 * RateLimitNotice Component
 * Aviso de rate limiting con countdown timer
 */

'use client';

import { useEffect, useState } from 'react';

interface RateLimitNoticeProps {
  retryAfter: number; // seconds
  onRetryReady?: () => void;
  className?: string;
}

export default function RateLimitNotice({
  retryAfter: initialRetryAfter,
  onRetryReady,
  className = '',
}: RateLimitNoticeProps) {
  const [timeLeft, setTimeLeft] = useState(initialRetryAfter);

  useEffect(() => {
    if (timeLeft <= 0) {
      onRetryReady?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onRetryReady?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onRetryReady]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}`;

  // Progress percentage
  const progress = ((initialRetryAfter - timeLeft) / initialRetryAfter) * 100;

  return (
    <div
      className={`
        bg-yellow-50 border border-yellow-200 rounded-lg p-4
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Warning icon */}
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="flex-1">
          {/* Message */}
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">
            Demasiados intentos
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            Por seguridad, limitamos el número de envíos. Por favor, espera{' '}
            <span className="font-bold">{formattedTime}</span>{' '}
            {timeLeft === 1 ? 'segundo' : 'segundos'} antes de intentar nuevamente.
          </p>

          {/* Progress bar */}
          <div className="w-full bg-yellow-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-yellow-500 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Countdown display */}
          <div className="mt-3 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <svg
                className="w-5 h-5 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-2xl font-mono font-bold text-yellow-800 tabular-nums">
                {formattedTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * RateLimitBanner Component
 * Versión compacta para banners
 */
interface RateLimitBannerProps {
  attemptsRemaining: number;
  maxAttempts: number;
  className?: string;
}

export function RateLimitBanner({
  attemptsRemaining,
  maxAttempts,
  className = '',
}: RateLimitBannerProps) {
  if (attemptsRemaining > maxAttempts / 2) return null;

  const isWarning = attemptsRemaining <= 2;

  return (
    <div
      className={`
        rounded-lg px-4 py-2 text-sm
        ${isWarning ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}
        ${className}
      `}
    >
      <p className={isWarning ? 'text-red-700' : 'text-yellow-700'}>
        <span className="font-semibold">
          {attemptsRemaining} {attemptsRemaining === 1 ? 'intento restante' : 'intentos restantes'}
        </span>{' '}
        de {maxAttempts} por minuto
      </p>
    </div>
  );
}
