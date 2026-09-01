import React from 'react';
import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  description?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Đang tải dữ liệu...',
  description = 'Hệ thống đang đồng bộ dữ liệu học tập chuẩn GDPT 2018',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] p-8 text-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
      <div>
        <h4 className="text-sm font-bold text-white">{message}</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">{description}</p>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
        <Icon className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-bold text-white">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">{description}</p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all min-h-[44px] flex items-center gap-2"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Không thể tải nội dung',
  message,
  onRetry,
}) => {
  return (
    <div className="bg-rose-950/20 border border-rose-900/40 rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto my-6">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-rose-300">{title}</h4>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all min-h-[44px]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Thử lại
        </button>
      )}
    </div>
  );
};
