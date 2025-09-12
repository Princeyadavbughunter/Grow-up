import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'error';
  onRetry?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  variant = 'default',
  onRetry
}) => {
  const isError = variant === 'error';
  const defaultIcon = isError ? <AlertCircle className="w-6 h-6 text-red-400" /> : null;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      className
    )}>
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center mb-4",
        isError ? "bg-red-50" : "bg-gray-100"
      )}>
        {icon || defaultIcon}
      </div>
      <h3 className={cn(
        "text-lg font-semibold mb-2",
        isError ? "text-red-900" : "text-gray-900"
      )}>
        {title}
      </h3>
      {description && (
        <p className={cn(
          "text-sm max-w-sm mb-4",
          isError ? "text-red-600" : "text-gray-500"
        )}>
          {description}
        </p>
      )}
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isError
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-purple-600 text-white hover:bg-purple-700"
            )}
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
        {action && (
          <div className="mt-2">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
