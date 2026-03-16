import React from 'react'
import { Search, X } from 'lucide-react'

const EvidenceSearch = ({ value, onChange, onClear, placeholder = 'Search by Evidence ID, Case ID, or filename...' }) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        id="evidence-search-input"
        type="text"
        className="input-field pl-10 pr-10"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default EvidenceSearch
