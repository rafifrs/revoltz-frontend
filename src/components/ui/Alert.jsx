import { useState } from 'react';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

const TYPE_CONFIG = {
  success: { Icon: CheckCircle, bg: 'bg-green-50',  border: 'border-bright-green', icon: 'text-bright-green', text: 'text-green-800'  },
  error:   { Icon: XCircle,     bg: 'bg-red-50',    border: 'border-red-500',      icon: 'text-red-500',      text: 'text-red-800'    },
  warning: { Icon: AlertCircle, bg: 'bg-yellow-50', border: 'border-lime-green',   icon: 'text-lime-green',   text: 'text-yellow-800' },
  info:    { Icon: Info,        bg: 'bg-blue-50',   border: 'border-deep-blue',    icon: 'text-deep-blue',    text: 'text-blue-800'   },
};

function Alert({ type = 'info', title, message, dismissible = false, onDismiss, className = '' }) {
  const [dismissed, setDismissed] = useState(false);
  const { Icon, bg, border, icon, text } = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className={`flex gap-3 ${bg} border-l-4 ${border} rounded-lg p-4 ${className}`} role="alert">
      <Icon size={20} className={`${icon} mt-0.5 shrink-0`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {title   && <p className={`font-semibold text-sm ${text} mb-0.5`}>{title}</p>}
        {message && <p className={`text-sm ${text} leading-relaxed`}>{message}</p>}
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="shrink-0 text-[#AAAAAA] hover:text-[#222222] transition-colors"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default Alert;
