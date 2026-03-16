import React from 'react'
import { Upload, Eye, Link2, AlertTriangle } from 'lucide-react'

const EVENT_ICONS = {
  upload: { icon: Upload, color: 'text-emerald-400', bg: 'bg-emerald-900/30' },
  access: { icon: Eye, color: 'text-blue-400', bg: 'bg-blue-900/30' },
  custody: { icon: Link2, color: 'text-purple-400', bg: 'bg-purple-900/30' },
  alert: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-900/30' },
}

const MOCK_ACTIVITIES = [
  { id: 1, type: 'upload', user: 'Det. Johnson', description: 'Uploaded EVD-006: ballistics_report.pdf', time: '2 min ago' },
  { id: 2, type: 'access', user: 'Analyst Chen', description: 'Accessed EVD-003: fingerprint_scan.pdf', time: '15 min ago' },
  { id: 3, type: 'custody', user: 'Agent Miller', description: 'Updated custody for EVD-001 — Court Submission', time: '1 hr ago' },
  { id: 4, type: 'upload', user: 'Det. Smith', description: 'Uploaded EVD-002: surveillance_footage.mp4', time: '2 hr ago' },
  { id: 5, type: 'alert', user: 'System', description: 'EVD-004: DNA sample report integrity check pending', time: '3 hr ago' },
  { id: 6, type: 'access', user: 'Auditor Smith', description: 'Reviewed Access Logs for CASE-2024-001', time: '5 hr ago' },
]

const RecentActivity = () => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <span className="badge badge-info">Live Feed</span>
      </div>

      <div className="space-y-4">
        {MOCK_ACTIVITIES.map((event) => {
          const { icon: Icon, color, bg } = EVENT_ICONS[event.type] || EVENT_ICONS.access
          return (
            <div key={event.id} className="flex items-start gap-3 pb-4 last:pb-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div
                className="flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 leading-snug">{event.description}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  <span className="text-gray-400 font-medium">{event.user}</span> · {event.time}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentActivity
