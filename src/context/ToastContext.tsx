import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((title: string, message?: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: Toast = { id, title, message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(toast => {
          const bgMap = {
            success: 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100',
            error: 'bg-rose-900/90 border-rose-500/50 text-rose-100',
            warning: 'bg-amber-900/90 border-amber-500/50 text-amber-100',
            info: 'bg-slate-900/90 border-blue-500/50 text-slate-100',
          };

          const IconMap = {
            success: CheckCircle2,
            error: AlertCircle,
            warning: AlertCircle,
            info: Info,
          };

          const Icon = IconMap[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${bgMap[toast.type]}`}
            >
              <Icon className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight text-white">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs mt-1 text-slate-300 leading-relaxed break-words">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-1 -mr-1"
                aria-label="Đóng thông báo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
