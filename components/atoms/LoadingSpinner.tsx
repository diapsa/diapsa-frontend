/**
 * LoadingSpinner Component
 * Spinner animado con variantes de tamaño y color
 */

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export default function LoadingSpinner({
  size = 'medium',
  color = 'primary',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    primary: 'border-primary border-t-transparent',
    secondary: 'border-secondary border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div
      className={`
        animate-spin rounded-full
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${className}
      `}
      role="status"
      aria-label="Cargando"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
