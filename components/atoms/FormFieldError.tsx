/**
 * FormFieldError Component
 * Mensaje de error inline para campos de formulario
 */

interface FormFieldErrorProps {
  error: string;
  fieldId?: string;
  className?: string;
}

export default function FormFieldError({
  error,
  fieldId,
  className = '',
}: FormFieldErrorProps) {
  if (!error) return null;

  return (
    <div
      id={fieldId ? `${fieldId}-error` : undefined}
      className={`flex items-start gap-2 mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1 duration-200 ${className}`}
      role="alert"
    >
      <svg
        className="w-4 h-4 flex-shrink-0 mt-0.5"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <span>{error}</span>
    </div>
  );
}

/**
 * FormErrors Component
 * Lista de errores generales del formulario
 */
interface FormErrorsProps {
  errors: string[];
  className?: string;
}

export function FormErrors({ errors, className = '' }: FormErrorsProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>

        <div className="flex-1">
          {errors.length === 1 ? (
            <p className="text-sm font-medium text-red-800">{errors[0]}</p>
          ) : (
            <div>
              <p className="text-sm font-medium text-red-800 mb-2">
                Por favor corrige los siguientes errores:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
