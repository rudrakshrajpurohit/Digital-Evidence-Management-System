import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../../services/userService'
import RoleEditor from './RoleEditor'
import LoadingSpinner from '../utils/LoadingSpinner'
import NotificationToast from '../utils/NotificationToast'
import { UserPlus, UserX } from 'lucide-react'

const MOCK_USERS = [
  { id: 'USR-001', name: 'Admin User', email: 'admin@dems.gov', role: 'Admin', status: 'Active' },
  { id: 'USR-002', name: 'Det. Johnson', email: 'det.johnson@dems.gov', role: 'Investigator', status: 'Active' },
  { id: 'USR-003', name: 'Det. Smith', email: 'det.smith@dems.gov', role: 'Investigator', status: 'Active' },
  { id: 'USR-004', name: 'Analyst Chen', email: 'analyst.chen@dems.gov', role: 'Forensic Analyst', status: 'Active' },
  { id: 'USR-005', name: 'Auditor Smith', email: 'auditor@dems.gov', role: 'Auditor', status: 'Active' },
  { id: 'USR-006', name: 'Agent Miller', email: 'agent.miller@dems.gov', role: 'Investigator', status: 'Inactive' },
]

const STATUS_BADGE = {
  Active: 'badge-success',
  Inactive: 'badge-error',
}

const UserListPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers()
      setUsers(data)
    } catch {
      setUsers(MOCK_USERS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDeactivate = async (userId) => {
    try {
      await userService.deactivateUser(userId)
    } catch {}
    setUsers((u) => u.map((usr) => usr.id === userId ? { ...usr, status: 'Inactive' } : usr))
    setToast({ type: 'success', message: 'User deactivated.' })
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">{users.length} registered users</p>
        </div>
        <Link to="/users/add" id="add-user-btn" className="btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add User
        </Link>
      </div>

      {loading ? <LoadingSpinner text="Loading users..." /> : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} id={`user-row-${u.id}`}>
                  <td className="font-mono text-xs text-gray-400">{u.id}</td>
                  <td className="font-semibold text-white">{u.name}</td>
                  <td className="text-gray-400 text-xs">{u.email}</td>
                  <td><RoleEditor userId={u.id} currentRole={u.role} onSuccess={fetchUsers} /></td>
                  <td><span className={`badge ${STATUS_BADGE[u.status] || 'badge-info'}`}>{u.status}</span></td>
                  <td>
                    {u.status === 'Active' && (
                      <button
                        id={`deactivate-user-${u.id}`}
                        onClick={() => handleDeactivate(u.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                        title="Deactivate user"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <NotificationToast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default UserListPage
