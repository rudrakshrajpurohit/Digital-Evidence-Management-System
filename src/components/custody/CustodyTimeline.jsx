import React from 'react'
import { Upload, Eye, FlaskConical, ArrowRight, Gavel, CheckCircle } from 'lucide-react'

const STEPS = [
  { key: 'Upload', icon: Upload, label: 'Upload', description: 'Evidence initially uploaded' },
  { key: 'Review', icon: Eye, label: 'Review', description: 'Evidence reviewed & tagged' },
  { key: 'Lab Analysis', icon: FlaskConical, label: 'Lab Analysis', description: 'Forensic lab examination' },
  { key: 'Transfer', icon: ArrowRight, label: 'Transfer', description: 'Transferred to storage' },
  { key: 'Court Submission', icon: Gavel, label: 'Court Submission', description: 'Submitted as court exhibit' },
]

const CustodyTimeline = ({ custodyLog = [] }) => {
  const completedActions = new Set(custodyLog.map((e) => e.action))

  return (
    <div className="card">
      <h3 className="text-base font-semibold text-white mb-6">Evidence Lifecycle</h3>
      <div className="space-y-1">
        {STEPS.map((step, i) => {
          const isComplete = completedActions.has(step.key)
          // The active step is the first one that is NOT complete
          const isActive = !isComplete && (i === 0 || completedActions.has(STEPS[i-1].key))
          const isLast = i === STEPS.length - 1
          const Icon = step.icon
          const matchingLog = custodyLog.find((e) => e.action === step.key)

          return (
            <div key={step.key} className="relative">
              {/* Connector line */}
              {!isLast && (
                <div className={`absolute left-5 top-10 bottom-0 w-0.5 ${isComplete ? 'bg-primary-600/50' : 'bg-dark-500'}`} />
              )}

              <div className="flex items-start gap-4 pb-4">
                {/* Step circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 z-10 transition-colors ${
                  isComplete
                    ? 'bg-primary-600/20 border-primary-600 text-primary-400'
                    : isActive
                    ? 'bg-dark-700 border-primary-400 text-white shadow-[0_0_10px_rgba(96,165,250,0.3)]'
                    : 'bg-dark-700 border-dark-500 text-gray-600'
                }`}>
                  {isComplete
                    ? <CheckCircle className="w-5 h-5" />
                    : <Icon className="w-4 h-4" />}
                </div>

                <div className="pt-1.5 flex-1">
                  <p className={`text-sm font-semibold transition-colors ${isComplete ? 'text-emerald-400' : isActive ? 'text-white' : 'text-gray-500'}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                  {matchingLog && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {matchingLog.user} · {matchingLog.timestamp}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CustodyTimeline
