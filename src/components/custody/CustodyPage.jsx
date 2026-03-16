import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import useCustody from '../../hooks/useCustody'
import CustodyTimeline from './CustodyTimeline'
import CustodyLogTable from './CustodyLogTable'
import AddCustodyEntry from './AddCustodyEntry'
import LoadingSpinner from '../utils/LoadingSpinner'

const CustodyPage = () => {
  const { id: evidenceId } = useParams()
  const { custody, loading, refetch } = useCustody(evidenceId)
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">Chain of Custody</h1>
          <p className="page-subtitle">Evidence ID: <span className="text-primary-400 font-mono">{evidenceId}</span></p>
        </div>
        <button
          id="add-custody-entry-btn"
          onClick={() => setShowAdd(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Entry
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading custody records..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="lg:col-span-1">
            <CustodyTimeline custodyLog={custody} />
          </div>

          {/* Log Table */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Custody Log</h3>
              <p className="text-sm text-gray-400">{custody.length} custody record{custody.length !== 1 ? 's' : ''}</p>
            </div>
            <CustodyLogTable custodyLog={custody} />
          </div>
        </div>
      )}

      <AddCustodyEntry
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        evidenceId={evidenceId}
        onSuccess={refetch}
      />
    </div>
  )
}

export default CustodyPage
