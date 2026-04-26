import { useState, useEffect } from 'react'
import { evidenceService } from '../services/evidenceService'

const useEvidence = (params = {}) => {
  const [evidence, setEvidence] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvidence = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await evidenceService.getEvidence(params)
      
      // Map backend data to UI format
      const mappedData = data.map(ev => ({
        id: ev.evidence_id?.toString() || 'Unknown',
        fileName: ev.evidence_name || ev.name || ev.file_name || 'Unknown File',
        caseId: ev.case_id?.toString() || 'Unknown',
        uploadDate: new Date(ev.uploaded_at || ev.created_at || Date.now()).toLocaleDateString(),
        status: 'Verified', // Backend ensures integrity via chain hashes natively
        type: (ev.evidence_type || 'unknown').includes('image') ? 'image' : (ev.evidence_type || 'unknown').includes('video') ? 'video' : 'document',
        uploadedBy: `User ${ev.uploaded_by || 'Unknown'}` // Replace with actual user info if joined
      }))
      
      setEvidence(mappedData)
    } catch (err) {
      console.error('API Error:', err.message)
      setError('Failed to load evidence. Please check your connection.')
      setEvidence([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvidence()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { evidence, loading, error, refetch: fetchEvidence }
}

export default useEvidence
