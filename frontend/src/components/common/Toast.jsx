import React from 'react';
import { useToast } from '../../hooks/useToast';

export const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            rounded-lg px-6 py-3 text-white shadow-lg
            transition-all duration-300
            animate-in fade-in slide-in-from-bottom-4
            ${toast.isError ? 'bg-red-600/90 border border-red-500' : 'bg-[#1a1a1a]/90 border border-gray-700'}
          `}
        >
          {toast.message}
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
