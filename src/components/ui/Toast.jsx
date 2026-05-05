import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useToastStore } from '../../hooks/useToast';

const TYPE_CONFIG = {
  success: { Icon: CheckCircle, border: 'border-bright-green', icon: 'text-bright-green' },
  error:   { Icon: XCircle,     border: 'border-red-500',     icon: 'text-red-500'     },
  warning: { Icon: AlertCircle, border: 'border-lime-green',  icon: 'text-lime-green'  },
  info:    { Icon: Info,        border: 'border-deep-blue',   icon: 'text-deep-blue'   },
};

function Toast({ id, message, type = 'info' }) {
  const dismissToast = useToastStore((s) => s.dismissToast);
  const { Icon, border, icon } = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;

  return (
    <div
      className={`flex items-start gap-3 bg-white border-l-4 ${border} rounded-lg shadow-lg p-4 w-80 animate-slide-in`}
      role="alert"
    >
      <Icon size={20} className={`${icon} mt-0.5 shrink-0`} aria-hidden="true" />
      <p className="text-sm text-[#222222] flex-1 leading-snug">{message}</p>
      <button
        onClick={() => dismissToast(id)}
        className="shrink-0 text-[#AAAAAA] hover:text-[#222222] transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
}

export default Toast;
