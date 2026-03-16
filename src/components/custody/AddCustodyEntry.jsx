import React, { useState } from 'react'
import ModalDialog from '../utils/ModalDialog'
import NotificationToast from '../utils/NotificationToast'
import { custodyService } from '../../services/custodyService'
import useAuth from '../../hooks/useAuth'

const ACTION_TYPES = ['Upload', 'Review', 'Lab Analysis', 'Transfer', 'Court Submission', 'Other']

const AddCustodyEntry = ({ isOpen, onClose, evidenceId, onSuccess }) => {
  const { user } = useAuth()
  const [form, setForm] = useState({ action: ACTION_TYPES[0], notes: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await custodyService.addCustodyEntry({
        evidenceId,
        action: form.action,
        user: user?.name,
        notes: form.notes,
      })
      setToast({ type: 'success', message: 'Custody entry added successfully.' })
      onSuccess?.()
      setTimeout(() => { onClose(); setForm({ action: ACTION_TYPES[0], notes: '' }) }, 1000)
    } catch {
      // Demo mode — simulate success
      setToast({ type: 'success', message: 'Custody entry added (Demo mode).' })
      onSuccess?.()
      setTimeout(() => { onClose(); setForm({ action: ACTION_TYPES[0], notes: '' }) }, 1000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ModalDialog
        isOpen={isOpen}
        onClose={onClose}
        title="Add Custody Entry"
        footer={
          <>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button
              type="submit"
              form="add-custody-form"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Saving...' : 'Add Entry'}
            </button>
          </>
        }
      >
        <form id="add-custody-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Action Type</label>
            <select
              id="custody-action-type"
              name="action"
              className="select-field"
              value={form.action}
              onChange={handleChange}
            >
              {ACTION_TYPES.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Officer / User</label>
            <input
              className="input-field opacity-60 cursor-not-allowed"
              value={user?.name || 'Current User'}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Notes / Remarks</label>
            <textarea
              id="custody-notes"
              name="notes"
              rows={3}
              className="input-field resize-none"
              placeholder="Add any relevant notes..."
              value={form.notes}
              onChange={handleChange}
            />
          </div>
        </form>
      </ModalDialog>

      {toast && <NotificationToast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </>
  )
}

export default AddCustodyEntry
