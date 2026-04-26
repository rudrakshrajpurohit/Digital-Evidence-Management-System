import React from 'react'
import { X, Download } from 'lucide-react'
import FilePreview from '../utils/FilePreview'
import { evidenceService } from '../../services/evidenceService'

const EvidenceViewer = ({ evidence, onClose }) => {
  if (!evidence) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-600">
          <div>
            <h3 className="text-base font-semibold text-white">{evidence.fileName}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{evidence.id} · {evidence.caseId}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                try {
                  const res = await evidenceService.verifyEvidence(evidence.id)
                  alert(`Verification Status: ${res.status}\n\nStored Hash: ${res.stored_hash}\nComputed Hash: ${res.computed_hash}`)
                } catch (err) {
                  alert(`Verification failed: ${err.message}`)
                }
              }}
              className="btn-primary flex items-center gap-1.5 text-sm"
            >
              Verify Integrity
            </button>
            <button className="btn-secondary flex items-center gap-1.5 text-sm" onClick={() => window.open(`http://127.0.0.1:8000/evidence/${evidence.id}/download`, '_blank')}>
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="p-6">
          <FilePreview
            src={evidence.src || null}
            fileType={evidence.mimeType || `${evidence.type}/generic`}
            fileName={evidence.fileName}
          />
        </div>

        {/* Metadata footer */}
        <div className="px-6 py-4 border-t border-dark-600 flex flex-wrap gap-6 text-xs text-gray-400">
          <span>Uploaded by: <span className="text-gray-200">{evidence.uploadedBy}</span></span>
          <span>Date: <span className="text-gray-200">{evidence.uploadDate}</span></span>
          <span>Status: <span className="text-emerald-400">{evidence.status}</span></span>
        </div>
      </div>
    </div>
  )
}

export default EvidenceViewer
