/**
 * LoadingSkeleton Component
 * Skeleton screen para product cards y otros elementos
 */

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'image' | 'rectangle';
  width?: string;
  height?: string;
  className?: string;
}

export default function LoadingSkeleton({
  variant = 'rectangle',
  width = 'w-full',
  height = 'h-4',
  className = '',
}: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
        {/* Image skeleton */}
        <div className="w-full h-48 bg-gray-200 animate-pulse" />
        
        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
          
          {/* Description */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
          </div>
          
          {/* Specs */}
          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
          </div>
          
          {/* Button */}
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full mt-4" />
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`} />
    );
  }

  if (variant === 'image') {
    return (
      <div className={`${width} ${height} bg-gray-200 rounded-lg animate-pulse ${className}`} />
    );
  }

  // Default rectangle
  return (
    <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`} />
  );
}

/**
 * ProductCardSkeleton Component
 * Skeleton específico para product cards
 */
export function ProductCardSkeleton({ className = '' }: { className?: string }) {
  return <LoadingSkeleton variant="card" className={className} />;
}

/**
 * ProductGridSkeleton Component
 * Grid de skeletons para listado de productos
 */
export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
