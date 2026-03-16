import { useState, useEffect } from 'react'
import { evidenceService } from '../services/evidenceService'

// Mock data for development (when backend is not available)
const MOCK_EVIDENCE = [
  { id: 'EVD-001', fileName: 'crime_scene_photo_01.jpg', caseId: 'CASE-2024-001', uploadDate: '2024-01-15', status: 'Verified', type: 'image', uploadedBy: 'Det. Johnson' },
  { id: 'EVD-002', fileName: 'surveillance_footage.mp4', caseId: 'CASE-2024-001', uploadDate: '2024-01-16', status: 'Pending', type: 'video', uploadedBy: 'Det. Smith' },
  { id: 'EVD-003', fileName: 'fingerprint_scan.pdf', caseId: 'CASE-2024-002', uploadDate: '2024-01-17', status: 'Verified', type: 'document', uploadedBy: 'Analyst Chen' },
  { id: 'EVD-004', fileName: 'dna_sample_report.pdf', caseId: 'CASE-2024-002', uploadDate: '2024-01-18', status: 'Under Review', type: 'document', uploadedBy: 'Analyst Chen' },
  { id: 'EVD-005', fileName: 'witness_statement.docx', caseId: 'CASE-2024-003', uploadDate: '2024-01-19', status: 'Verified', type: 'document', uploadedBy: 'Det. Johnson' },
  { id: 'EVD-006', fileName: 'ballistics_report.pdf', caseId: 'CASE-2024-003', uploadDate: '2024-01-20', status: 'Verified', type: 'document', uploadedBy: 'Agent Miller' },
]

const useEvidence = (params = {}) => {
  const [evidence, setEvidence] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvidence = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await evidenceService.getEvidence(params)
      setEvidence(data)
    } catch (err) {
      console.warn('API unavailable, using mock data:', err.message)
      setEvidence(MOCK_EVIDENCE)
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
export { MOCK_EVIDENCE }
