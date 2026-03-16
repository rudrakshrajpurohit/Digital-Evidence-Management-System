import React from 'react'

const CustodyLogTable = ({ custodyLog = [] }) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Action</th>
            <th>Officer / User</th>
            <th>Timestamp</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {custodyLog.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-10">No custody records found</td>
            </tr>
          ) : custodyLog.map((entry, i) => (
            <tr key={entry.id || i}>
              <td className="text-gray-500 text-xs w-8">{i + 1}</td>
              <td>
                <span className="badge badge-info">{entry.action}</span>
              </td>
              <td className="text-gray-300 font-medium">{entry.user}</td>
              <td className="text-gray-400 text-xs font-mono">{entry.timestamp}</td>
              <td className="text-gray-400 text-xs max-w-xs">{entry.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustodyLogTable
