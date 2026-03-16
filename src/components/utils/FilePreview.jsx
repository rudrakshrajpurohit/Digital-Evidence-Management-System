import React, { useState } from 'react'
import { FileText, Image, Video, Download, AlertCircle } from 'lucide-react'

const getFileCategory = (fileType = '') => {
  const type = (fileType || '').toLowerCase()
  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type === 'application/pdf') return 'pdf'
  return 'other'
}

const FilePreview = ({ src, fileType, fileName }) => {
  const [error, setError] = useState(false)
  const category = getFileCategory(fileType)

  if (error || !src) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 bg-dark-700 rounded-xl border border-dark-600">
        <AlertCircle className="w-10 h-10 text-gray-500" />
        <p className="text-gray-400 text-sm">Preview unavailable</p>
        {src && (
          <a href={src} download={fileName} className="btn-secondary text-sm flex items-center gap-2 mt-2">
            <Download className="w-4 h-4" />
            Download File
          </a>
        )}
      </div>
    )
  }

  if (category === 'image') {
    return (
      <div className="rounded-xl overflow-hidden border border-dark-600 bg-dark-700">
        <img
          src={src}
          alt={fileName || 'Evidence file'}
          onError={() => setError(true)}
          className="w-full max-h-[500px] object-contain"
        />
      </div>
    )
  }

  if (category === 'video') {
    return (
      <div className="rounded-xl overflow-hidden border border-dark-600 bg-dark-700">
        <video
          src={src}
          controls
          className="w-full max-h-[500px]"
          onError={() => setError(true)}
        />
      </div>
    )
  }

  if (category === 'pdf') {
    return (
      <div className="rounded-xl overflow-hidden border border-dark-600">
        <iframe
          src={src}
          title={fileName}
          className="w-full h-[600px]"
          onError={() => setError(true)}
        />
      </div>
    )
  }

  // Fallback: download link
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 bg-dark-700 rounded-xl border border-dark-600">
      <FileText className="w-12 h-12 text-gray-500" />
      <p className="text-gray-300 font-medium">{fileName || 'Unknown file'}</p>
      <p className="text-sm text-gray-500">Preview not supported for this file type</p>
      <a href={src} download={fileName} className="btn-primary flex items-center gap-2">
        <Download className="w-4 h-4" />
        Download File
      </a>
    </div>
  )
}

export default FilePreview
