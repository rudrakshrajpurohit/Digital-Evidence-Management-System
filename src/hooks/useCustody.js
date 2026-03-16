import { useState, useEffect } from 'react'
import { custodyService } from '../services/custodyService'

const MOCK_CUSTODY = {
  'EVD-001': [
    { id: 1, action: 'Upload', user: 'Det. Johnson', timestamp: '2024-01-15 09:12:00', remarks: 'Initial evidence upload from crime scene' },
    { id: 2, action: 'Review', user: 'Sgt. Williams', timestamp: '2024-01-15 14:30:00', remarks: 'Evidence reviewed and tagged' },
    { id: 3, action: 'Lab Analysis', user: 'Analyst Chen', timestamp: '2024-01-16 10:00:00', remarks: 'Sent to forensic lab for analysis' },
    { id: 4, action: 'Transfer', user: 'Agent Miller', timestamp: '2024-01-17 11:45:00', remarks: 'Transferred to evidence storage facility' },
    { id: 5, action: 'Court Submission', user: 'DA Office', timestamp: '2024-01-20 09:00:00', remarks: 'Submitted to court as Exhibit A' },
  ],
}

const useCustody = (evidenceId) => {
  const [custody, setCustody] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCustody = async () => {
    if (!evidenceId) return
    try {
      setLoading(true)
      setError(null)
      const data = await custodyService.getCustody(evidenceId)
      setCustody(data)
    } catch (err) {
      console.warn('API unavailable, using mock custody data:', err.message)
      setCustody(MOCK_CUSTODY[evidenceId] || MOCK_CUSTODY['EVD-001'])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustody()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evidenceId])

  return { custody, loading, error, refetch: fetchCustody }
}

export default useCustody
