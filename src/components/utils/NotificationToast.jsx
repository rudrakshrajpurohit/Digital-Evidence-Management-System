import React, { useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const VARIANTS = {
  success: {
    icon: CheckCircle,
    classes: 'border-emerald-700/50 bg-emerald-900/30 text-emerald-300',
    iconClass: 'text-emerald-400',
  },
  error: {
    icon: XCircle,
    classes: 'border-red-700/50 bg-red-900/30 text-red-300',
    iconClass: 'text-red-400',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'border-amber-700/50 bg-amber-900/30 text-amber-300',
    iconClass: 'text-amber-400',
  },
  info: {
    icon: Info,
    classes: 'border-blue-700/50 bg-blue-900/30 text-blue-300',
    iconClass: 'text-blue-400',
  },
}

const NotificationToast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  const variant = VARIANTS[type] || VARIANTS.info
  const Icon = variant.icon

  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div
      role="alert"
      className={`fixed top-20 right-5 z-50 flex items-start gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-sm animate-slide-in ${variant.classes}`}
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${variant.iconClass}`} />
      <p className="text-sm font-medium">{message}</p>
      {onClose && (
        <button onClick={onClose} className="ml-auto pl-2 opacity-60 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default NotificationToast
