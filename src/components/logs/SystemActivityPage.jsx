import React, { useState, useEffect } from 'react'
import { logService } from '../../services/logService'
import LoadingSpinner from '../utils/LoadingSpinner'

const MOCK_SYSTEM_LOGS = [
  { id: 1, eventType: 'LOGIN', user: 'Det. Johnson', description: 'Successful login from 192.168.1.45', timestamp: '2024-01-20 08:55:00' },
  { id: 2, eventType: 'LOGIN', user: 'Analyst Chen', description: 'Successful login from 192.168.1.62', timestamp: '2024-01-20 09:10:30' },
  { id: 3, eventType: 'UPLOAD', user: 'Det. Smith', description: 'Uploaded EVD-002: surveillance_footage.mp4 in CASE-2024-001', timestamp: '2024-01-20 10:00:00' },
  { id: 4, eventType: 'PERMISSION', user: 'Admin User', description: 'Changed role of USR-006 from Investigator to Auditor', timestamp: '2024-01-20 11:20:00' },
  { id: 5, eventType: 'LOGOUT', user: 'Det. Johnson', description: 'Session ended', timestamp: '2024-01-20 17:00:00' },
  { id: 6, eventType: 'SYSTEM', user: 'System', description: 'Scheduled integrity check completed — 1,284 files verified', timestamp: '2024-01-20 23:00:00' },
]

const EVENT_BADGE = {
  LOGIN: 'badge-success',
  LOGOUT: 'badge-info',
  UPLOAD: 'badge-pending',
  PERMISSION: 'badge-warning',
  SYSTEM: 'bg-gray-800/40 text-gray-400 border border-gray-700/50 badge',
}

const SystemActivityPage = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try { setLogs(await logService.getSystemLogs()) }
      catch { setLogs(MOCK_SYSTEM_LOGS) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">System Activity</h1>
        <p className="page-subtitle">System-wide event log</p>
      </div>

      {loading ? <LoadingSpinner text="Loading system logs..." /> : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Event Type</th>
                <th>User</th>
                <th>Description</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td><span className={`badge ${EVENT_BADGE[log.eventType] || 'badge-info'}`}>{log.eventType}</span></td>
                  <td className="font-medium text-gray-200">{log.user}</td>
                  <td className="text-gray-400 text-xs max-w-sm">{log.description}</td>
                  <td className="text-gray-400 text-xs font-mono">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SystemActivityPage
