import { useState, useEffect } from 'react'
import { custodyService } from '../services/custodyService'

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
      
      const mappedLogs = data.map(log => ({
        id: log.log_id,
        action: log.action,
        user: `User ID: ${log.user_id}`,
        timestamp: new Date(log.timestamp).toLocaleString(),
        remarks: `Hash signature: ${log.current_hash.substring(0, 16)}...` // display partial hash as remark
      }))
      
      setCustody(mappedLogs)
    } catch (err) {
      console.error('API Error:', err.message)
      setError('Failed to fetch chain of custody logs. Data may be tampered.')
      setCustody([])
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
