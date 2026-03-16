import React, { useState } from 'react'
import { Link2 } from 'lucide-react'
import useEvidence from '../../hooks/useEvidence'
import EvidenceSearch from './EvidenceSearch'
import EvidenceFilter from './EvidenceFilter'
import EvidenceViewer from './EvidenceViewer'
import LoadingSpinner from '../utils/LoadingSpinner'
import { FileText, Image, Video, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const TYPE_ICONS = { image: Image, video: Video, document: FileText }

const STATUS_BADGE = {
  Verified: 'badge-success',
  Pending: 'badge-pending',
  'Under Review': 'badge-warning',
  Rejected: 'badge-error',
}

const PAGE_SIZE = 8

const EvidenceListPage = () => {
  const { evidence, loading } = useEvidence()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: 'All', type: 'All', caseId: '', dateFrom: '', dateTo: '' })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

  const filtered = evidence.filter((e) => {
    const q = search.toLowerCase()
    const matchSearch = !q || e.id.toLowerCase().includes(q) || e.caseId.toLowerCase().includes(q) || e.fileName.toLowerCase().includes(q)
    const matchStatus = filters.status === 'All' || e.status === filters.status
    const matchType = filters.type === 'All' || e.type === filters.type
    const matchCase = !filters.caseId || e.caseId.toLowerCase().includes(filters.caseId.toLowerCase())
    return matchSearch && matchStatus && matchType && matchCase
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearchChange = (val) => { setSearch(val); setPage(1) }
  const handleFilterChange = (f) => { setFilters(f); setPage(1) }

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">Evidence</h1>
          <p className="page-subtitle">{filtered.length} records found</p>
        </div>
        <Link to="/evidence/upload" id="evidence-upload-btn" className="btn-primary flex items-center gap-2">
          + Upload Evidence
        </Link>
      </div>

      {/* Search and Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <EvidenceSearch value={search} onChange={handleSearchChange} onClear={() => handleSearchChange('')} />
        <EvidenceFilter filters={filters} onChange={handleFilterChange} />
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Loading evidence..." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Evidence ID</th>
                <th>File Name</th>
                <th>Case ID</th>
                <th>Upload Date</th>
                <th>Uploaded By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-12">No evidence records match your search.</td>
                </tr>
              ) : paginated.map((ev) => {
                const Icon = TYPE_ICONS[ev.type] || FileText
                return (
                  <tr key={ev.id} id={`evidence-row-${ev.id}`}>
                    <td className="font-mono text-xs text-primary-400">{ev.id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{ev.fileName}</span>
                      </div>
                    </td>
                    <td className="text-gray-300">{ev.caseId}</td>
                    <td className="text-gray-400 text-xs">{ev.uploadDate}</td>
                    <td className="text-gray-400">{ev.uploadedBy}</td>
                    <td><span className={`badge ${STATUS_BADGE[ev.status] || 'badge-info'}`}>{ev.status}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          id={`view-evidence-${ev.id}`}
                          onClick={() => setSelected(ev)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/custody/${ev.id}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-purple-900/20 transition-colors"
                          title="Chain of Custody"
                        >
                          <Link2 className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
          <span>{filtered.length} total records</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-dark-600 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-dark-600 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Viewer Modal */}
      {selected && <EvidenceViewer evidence={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default EvidenceListPage
