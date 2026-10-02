import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types/alumni';

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-[calc(100vw-2.5rem)] pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3.5 rounded-xl p-4 shadow-2xl backdrop-blur-md border transition-all duration-200 ${
              isSuccess
                ? 'bg-[#161414]/95 border-[#D4AF37]/50 text-[#F7F1E5]'
                : isError
                ? 'bg-[#22090C]/95 border-[#B11226] text-[#F7F1E5]'
                : 'bg-[#181818]/95 border-white/15 text-[#F7F1E5]'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess ? (
                <CheckCircle2 className="h-5 w-5 text-[#D4AF37]" />
              ) : isError ? (
                <AlertCircle className="h-5 w-5 text-[#ef4444]" />
              ) : (
                <Info className="h-5 w-5 text-[#D4AF37]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#F7F1E5]">{toast.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[#F7F1E5]/80">
                {toast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 rounded-lg p-1 text-[#F7F1E5]/60 hover:text-[#F7F1E5] hover:bg-white/10 transition-colors"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
