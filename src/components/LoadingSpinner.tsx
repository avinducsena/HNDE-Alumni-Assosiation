import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label,
}) => {
  const dimensions =
    size === 'sm'
      ? 'h-4 w-4 border-2'
      : size === 'lg'
      ? 'h-8 w-8 border-2'
      : 'h-5 w-5 border-2';

  return (
    <span className="inline-flex items-center gap-2.5" role="status" aria-live="polite">
      <span
        className={`${dimensions} animate-spin rounded-full border-[#D4AF37]/30 border-t-[#D4AF37]`}
      />
      {label && <span className="text-sm font-medium text-[#F7F1E5]/90">{label}</span>}
    </span>
  );
};
