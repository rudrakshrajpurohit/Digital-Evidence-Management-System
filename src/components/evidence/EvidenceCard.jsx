import React from 'react'
import { FileText, Image, Video, Calendar, Hash, Briefcase, Shield } from 'lucide-react'

const TYPE_ICONS = {
  image: Image,
  video: Video,
  document: FileText,
  audio: FileText,
}

const STATUS_BADGE = {
  Verified: 'badge-success',
  Pending: 'badge-pending',
  'Under Review': 'badge-warning',
  Rejected: 'badge-error',
}

const EvidenceCard = ({ evidence, onClick }) => {
  const Icon = TYPE_ICONS[evidence.type] || FileText

  return (
    <div
      id={`evidence-card-${evidence.id}`}
      className="card hover:border-primary-600/40 hover:bg-dark-700/60 transition-all duration-200 cursor-pointer"
      onClick={() => onClick && onClick(evidence)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary-900/30 border border-primary-800/30 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-400" />
        </div>
        <span className={`badge ${STATUS_BADGE[evidence.status] || 'badge-info'}`}>
          {evidence.status}
        </span>
      </div>

      <h4 className="text-sm font-semibold text-white mb-1 truncate">{evidence.fileName}</h4>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Hash className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{evidence.id}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Briefcase className="w-3 h-3 flex-shrink-0" />
          <span>{evidence.caseId}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span>{evidence.uploadDate}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-dark-600 flex items-center gap-1.5 text-xs text-gray-500">
        <Shield className="w-3 h-3 text-emerald-500" />
        <span className="text-emerald-500 font-medium">Integrity OK</span>
      </div>
    </div>
  )
}

export default EvidenceCard
