import React, { useState } from 'react'
import { CheckCircle, AlertTriangle, Copy, Check, X } from 'lucide-react'

const VerificationModal = ({ isOpen, onClose, result }) => {
  const [copiedHash, setCopiedHash] = useState(null)

  if (!isOpen || !result) return null

  const isVerified = result.status === 'Verified' || result.status === 'VALID'
  const badgeColor = isVerified ? 'text-emerald-400' : 'text-red-500'
  const glowShadow = isVerified ? 'shadow-[0_0_25px_rgba(52,211,153,0.15)]' : 'shadow-[0_0_25px_rgba(239,68,68,0.15)]'
  const borderVar = isVerified ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopiedHash(type)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className={`relative z-10 w-full max-w-lg bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden animate-scale-in ${glowShadow}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-600 bg-dark-800/80">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="text-lg">🔍</span> File Integrity Verification
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Main Status */}
          <div className={`flex flex-col items-center justify-center p-6 border rounded-xl ${borderVar}`}>
            {isVerified ? (
              <CheckCircle className={`w-12 h-12 mb-3 ${badgeColor}`} />
            ) : (
              <AlertTriangle className={`w-12 h-12 mb-3 ${badgeColor}`} />
            )}
            <h2 className={`text-xl font-bold tracking-wide ${badgeColor}`}>
              {isVerified ? 'VERIFIED' : 'TAMPERED'}
            </h2>
            <p className="text-sm text-gray-300 mt-2 text-center max-w-sm">
              {isVerified 
                ? "The file is authentic and has not been modified."
                : "WARNING: File integrity compromised. This evidence may have been altered."}
            </p>
          </div>

          {/* Hash Comparison Box */}
          <div className="bg-dark-900 border border-dark-600 rounded-xl p-4 font-mono text-xs overflow-hidden">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-gray-400 font-sans font-medium text-xs">Stored Hash:</span>
                <button onClick={() => copyToClipboard(result.stored_hash, 'stored')} className="flex items-center gap-1 text-primary-400 hover:text-primary-300 transition-colors">
                  {copiedHash === 'stored' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedHash === 'stored' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="text-gray-300 break-all bg-dark-800 p-2.5 rounded border border-dark-700">
                {result.stored_hash || 'N/A'}
              </div>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-600" /></div>
              <div className="relative flex justify-center"><span className="bg-dark-900 px-2 text-dark-500 font-sans text-[10px] uppercase">Comparison</span></div>
            </div>

            <div className="mt-2">
              <div className="flex items-center justify-between mb-1.5">
                 <span className="text-gray-400 font-sans font-medium text-xs">Computed Hash:</span>
                 <button onClick={() => copyToClipboard(result.computed_hash, 'computed')} className="flex items-center gap-1 text-primary-400 hover:text-primary-300 transition-colors">
                  {copiedHash === 'computed' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedHash === 'computed' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className={`break-all p-2.5 rounded border ${isVerified ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20' : 'text-red-400 bg-red-500/5 border-red-500/20'}`}>
                {result.computed_hash || 'Calculation Failed'}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-dark-600 bg-dark-800/50">
          <span className="text-xs text-gray-500 font-mono">
            Last Verified: {new Date().toLocaleString()}
          </span>
          <button onClick={onClose} className="btn-secondary px-6">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerificationModal
