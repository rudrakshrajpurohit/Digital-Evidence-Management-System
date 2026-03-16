import React, { useState } from 'react'
import { Filter, ChevronDown, X } from 'lucide-react'

const STATUS_OPTIONS = ['All', 'Verified', 'Pending', 'Under Review', 'Rejected']
const TYPE_OPTIONS = ['All', 'image', 'video', 'document', 'audio']

const EvidenceFilter = ({ filters, onChange }) => {
  const [open, setOpen] = useState(false)

  const updateFilter = (key, value) => {
    onChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onChange({ status: 'All', type: 'All', caseId: '', dateFrom: '', dateTo: '' })
  }

  const hasActive = filters.status !== 'All' || filters.type !== 'All' || filters.caseId || filters.dateFrom

  return (
    <div className="relative">
      <button
        id="evidence-filter-toggle"
        onClick={() => setOpen((o) => !o)}
        className={`btn-secondary flex items-center gap-2 ${hasActive ? 'border-primary-600/50 text-primary-300' : ''}`}
      >
        <Filter className="w-4 h-4" />
        Filters
        {hasActive && <span className="w-2 h-2 rounded-full bg-primary-400" />}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-dark-700 border border-dark-500 rounded-xl shadow-2xl p-4 z-20 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-white">Filters</span>
            <button onClick={clearFilters} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              <X className="w-3 h-3" /> Clear
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Status</label>
              <select
                id="filter-status"
                className="select-field text-sm"
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Evidence Type</label>
              <select
                id="filter-type"
                className="select-field text-sm"
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
              >
                {TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Case ID</label>
              <input
                type="text"
                id="filter-case-id"
                className="input-field text-sm"
                placeholder="e.g. CASE-2024-001"
                value={filters.caseId}
                onChange={(e) => updateFilter('caseId', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">From</label>
                <input
                  type="date"
                  id="filter-date-from"
                  className="input-field text-sm"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter('dateFrom', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">To</label>
                <input
                  type="date"
                  id="filter-date-to"
                  className="input-field text-sm"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter('dateTo', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EvidenceFilter
