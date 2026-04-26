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
        id: ev.evidence_id.toString(),
        fileName: ev.file_name,
        caseId: ev.case_id.toString(),
        uploadDate: new Date(ev.created_at).toLocaleDateString(),
        status: 'Verified', // Backend ensures integrity via chain hashes natively
        type: ev.file_type.includes('image') ? 'image' : ev.file_type.includes('video') ? 'video' : 'document',
        uploadedBy: `User ${ev.uploaded_by}` // Replace with actual user info if joined
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
