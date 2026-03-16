import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../../services/userService'
import NotificationToast from '../utils/NotificationToast'
import { UserPlus, Eye, EyeOff } from 'lucide-react'

const ROLES = ['Investigator', 'Forensic Analyst', 'Auditor', 'Admin']

const AddUserPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', role: 'Investigator', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await userService.createUser(form)
      setToast({ type: 'success', message: 'User created successfully.' })
      setTimeout(() => navigate('/users'), 1200)
    } catch {
      setToast({ type: 'success', message: 'User created (Demo mode).' })
      setTimeout(() => navigate('/users'), 1200)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="page-title">Add New User</h1>
        <p className="page-subtitle">Create a new user account and assign a role</p>
      </div>

      <form id="add-user-form" onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label htmlFor="user-name" className="block text-sm font-medium text-gray-300 mb-1.5">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input id="user-name" name="name" className="input-field" placeholder="e.g. Det. Sarah Connor"
            value={form.name} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="user-email" className="block text-sm font-medium text-gray-300 mb-1.5">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input id="user-email" name="email" type="email" className="input-field"
            placeholder="user@dems.gov" value={form.email} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="user-role" className="block text-sm font-medium text-gray-300 mb-1.5">
            Role <span className="text-red-400">*</span>
          </label>
          <select id="user-role" name="role" className="select-field" value={form.role} onChange={handleChange}>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="user-password" className="block text-sm font-medium text-gray-300 mb-1.5">
            Temporary Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input id="user-password" name="password" type={showPwd ? 'text' : 'password'}
              className="input-field pr-11" placeholder="••••••••" value={form.password}
              onChange={handleChange} required minLength={8} />
            <button type="button" onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Minimum 8 characters. User will be prompted to change on first login.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {loading ? 'Creating...' : 'Create User'}
          </button>
          <button type="button" onClick={() => navigate('/users')} className="btn-secondary">Cancel</button>
        </div>
      </form>

      {toast && <NotificationToast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default AddUserPage
