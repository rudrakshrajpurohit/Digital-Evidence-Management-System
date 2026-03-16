import React, { useState, useEffect } from 'react'
import { logService } from '../../services/logService'
import LoadingSpinner from '../utils/LoadingSpinner'
import { Download } from 'lucide-react'

const MOCK_ACCESS_LOGS = [
  { id: 1, user: 'Det. Johnson', evidenceId: 'EVD-001', action: 'VIEW', timestamp: '2024-01-20 09:01:22', ip: '192.168.1.45' },
  { id: 2, user: 'Analyst Chen', evidenceId: 'EVD-003', action: 'DOWNLOAD', timestamp: '2024-01-20 09:15:44', ip: '192.168.1.62' },
  { id: 3, user: 'Det. Smith', evidenceId: 'EVD-002', action: 'UPLOAD', timestamp: '2024-01-20 10:00:00', ip: '192.168.1.81' },
  { id: 4, user: 'Agent Miller', evidenceId: 'EVD-001', action: 'TRANSFER', timestamp: '2024-01-20 11:45:12', ip: '192.168.1.33' },
  { id: 5, user: 'Auditor Smith', evidenceId: 'EVD-004', action: 'VIEW', timestamp: '2024-01-20 13:30:55', ip: '192.168.1.99' },
  { id: 6, user: 'Det. Johnson', evidenceId: 'EVD-005', action: 'VIEW', timestamp: '2024-01-20 14:12:09', ip: '192.168.1.45' },
]

const ACTION_BADGE = {
  VIEW: 'badge-info',
  DOWNLOAD: 'badge-warning',
  UPLOAD: 'badge-success',
  TRANSFER: 'badge-pending',
  DELETE: 'badge-error',
}

const AccessLogPage = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await logService.getAccessLogs()
        setLogs(data)
      } catch {
        setLogs(MOCK_ACCESS_LOGS)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase()
    return !q || l.user.toLowerCase().includes(q) || l.evidenceId.toLowerCase().includes(q) || l.action.toLowerCase().includes(q)
  })

  const handleExport = () => {
    const csv = ['User,Evidence ID,Action,Timestamp,IP',
      ...filtered.map((l) => `${l.user},${l.evidenceId},${l.action},${l.timestamp},${l.ip}`)
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'access_logs.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">Access Logs</h1>
          <p className="page-subtitle">Evidence access history</p>
        </div>
        <button id="export-logs-btn" onClick={handleExport} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="mb-5">
        <input
          id="log-search-input"
          className="input-field max-w-sm"
          placeholder="Search by user, evidence ID, or action..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? <LoadingSpinner text="Loading access logs..." /> : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Evidence ID</th>
                <th>Action</th>
                <th>Timestamp</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-500 py-10">No log entries found</td></tr>
              ) : filtered.map((log) => (
                <tr key={log.id}>
                  <td className="font-medium text-gray-200">{log.user}</td>
                  <td className="font-mono text-xs text-primary-400">{log.evidenceId}</td>
                  <td><span className={`badge ${ACTION_BADGE[log.action] || 'badge-info'}`}>{log.action}</span></td>
                  <td className="text-gray-400 text-xs font-mono">{log.timestamp}</td>
                  <td className="text-gray-500 text-xs">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AccessLogPage
