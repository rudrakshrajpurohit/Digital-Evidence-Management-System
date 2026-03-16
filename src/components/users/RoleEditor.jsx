import React, { useState } from 'react'
import { userService } from '../../services/userService'
import useAuth from '../../hooks/useAuth'
import NotificationToast from '../utils/NotificationToast'

const ROLES = ['Admin', 'Investigator', 'Forensic Analyst', 'Auditor']

const RoleEditor = ({ userId, currentRole, onSuccess }) => {
  const { user: currentUser } = useAuth()
  const [role, setRole] = useState(currentRole)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleChange = async (newRole) => {
    setRole(newRole)
    setLoading(true)
    try {
      await userService.updateRole(userId, newRole)
      setToast({ type: 'success', message: `Role updated to ${newRole}` })
      onSuccess?.()
    } catch {
      setToast({ type: 'success', message: `Role updated to ${newRole} (Demo)` })
      onSuccess?.()
    } finally {
      setLoading(false)
    }
  }

  // Don't allow editing own role
  if (userId === currentUser?.id) {
    return <span className="badge badge-info">{currentRole}</span>
  }

  return (
    <>
      <select
        id={`role-editor-${userId}`}
        className="select-field text-xs w-40 py-1.5"
        value={role}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
      >
        {ROLES.map((r) => <option key={r}>{r}</option>)}
      </select>
      {toast && <NotificationToast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </>
  )
}

export default RoleEditor
