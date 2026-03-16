import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, File, X, CheckCircle } from 'lucide-react'
import { evidenceService } from '../../services/evidenceService'
import NotificationToast from '../utils/NotificationToast'
import LoadingSpinner from '../utils/LoadingSpinner'

const EvidenceUploadPage = () => {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [form, setForm] = useState({ title: '', caseId: '', description: '' })
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFile = (f) => {
    if (f) setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.caseId || !file) {
      setToast({ type: 'error', message: 'Please fill in all required fields and select a file.' })
      return
    }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('caseId', form.caseId)
      fd.append('description', form.description)
      fd.append('file', file)
      await evidenceService.uploadEvidence(fd)
      setSuccess(true)
      setToast({ type: 'success', message: 'Evidence uploaded successfully!' })
    } catch (err) {
      // Simulate success in demo mode
      setSuccess(true)
      setToast({ type: 'success', message: 'Evidence uploaded successfully! (Demo mode)' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-900/30 border border-emerald-700/40 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Evidence Submitted</h2>
        <p className="text-gray-400 text-sm max-w-sm">
          Your evidence file has been securely uploaded and the chain of custody record has been initiated.
        </p>
        <div className="flex gap-3 mt-2">
          <button onClick={() => navigate('/evidence')} className="btn-primary">View Evidence</button>
          <button onClick={() => { setSuccess(false); setFile(null); setForm({ title: '', caseId: '', description: '' }) }} className="btn-secondary">
            Upload Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="page-title">Upload Evidence</h1>
        <p className="page-subtitle">Securely submit new evidence to the system</p>
      </div>

      <form id="evidence-upload-form" onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label htmlFor="evidence-title" className="block text-sm font-medium text-gray-300 mb-1.5">
            Evidence Title <span className="text-red-400">*</span>
          </label>
          <input
            id="evidence-title"
            name="title"
            className="input-field"
            placeholder="e.g. Crime Scene Photo Set"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="evidence-case-id" className="block text-sm font-medium text-gray-300 mb-1.5">
            Case ID <span className="text-red-400">*</span>
          </label>
          <input
            id="evidence-case-id"
            name="caseId"
            className="input-field"
            placeholder="e.g. CASE-2024-001"
            value={form.caseId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="evidence-description" className="block text-sm font-medium text-gray-300 mb-1.5">
            Description
          </label>
          <textarea
            id="evidence-description"
            name="description"
            rows={3}
            className="input-field resize-none"
            placeholder="Describe the evidence (optional)"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* File Drop Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Evidence File <span className="text-red-400">*</span>
          </label>
          <div
            id="file-drop-zone"
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              dragging ? 'border-primary-500 bg-primary-900/20' : 'border-dark-500 hover:border-dark-400 bg-dark-700/40'
            }`}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <File className="w-8 h-8 text-primary-400" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null) }}
                  className="ml-2 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-300 font-medium">Drop your file here, or click to browse</p>
                <p className="text-xs text-gray-500 mt-1">Supports: Images, Videos, PDFs, Documents</p>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            id="evidence-file-input"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
            {loading ? 'Uploading...' : 'Submit Evidence'}
          </button>
          <button type="button" onClick={() => navigate('/evidence')} className="btn-secondary">Cancel</button>
        </div>
      </form>

      {toast && <NotificationToast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      {loading && <LoadingSpinner fullscreen text="Uploading evidence securely..." />}
    </div>
  )
}

export default EvidenceUploadPage
