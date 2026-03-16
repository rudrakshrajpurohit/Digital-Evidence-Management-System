import React from 'react'
import { FolderOpen, FileCheck2, Upload, Clock, AlertTriangle, TrendingUp } from 'lucide-react'
import StatsCard from './StatsCard'
import RecentActivity from './RecentActivity'
import useAuth from '../../hooks/useAuth'

const STATS = [
  { title: 'Total Evidence Files', value: '1,284', icon: FolderOpen, color: 'blue', subtitle: '+12 this week' },
  { title: 'Active Cases', value: '47', icon: FileCheck2, color: 'green', subtitle: '8 opened this month' },
  { title: 'Recent Uploads', value: '23', icon: Upload, color: 'purple', subtitle: 'Last 7 days' },
  { title: 'Pending Verifications', value: '6', icon: Clock, color: 'amber', subtitle: 'Requires attention' },
]

const CASE_SUMMARY = [
  { caseId: 'CASE-2024-001', status: 'Active', evidenceCount: 5, lastUpdate: '2 hr ago' },
  { caseId: 'CASE-2024-002', status: 'Under Review', evidenceCount: 3, lastUpdate: '1 day ago' },
  { caseId: 'CASE-2024-003', status: 'Closed', evidenceCount: 8, lastUpdate: '3 days ago' },
]

const statusBadge = (status) => {
  if (status === 'Active') return 'badge-success'
  if (status === 'Under Review') return 'badge-warning'
  return 'badge-info'
}

const DashboardPage = () => {
  const { user } = useAuth()

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.name}. Here's the system overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {STATS.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Case Summary */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Active Cases</h3>
          </div>
          <div className="space-y-3">
            {CASE_SUMMARY.map((c) => (
              <div key={c.caseId} className="p-3 rounded-lg bg-dark-700/60 border border-dark-600 hover:bg-dark-700 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">{c.caseId}</span>
                  <span className={`badge ${statusBadge(c.status)}`}>{c.status}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{c.evidenceCount} evidence files</span>
                  <span>{c.lastUpdate}</span>
                </div>
              </div>
            ))}
          </div>

          {/* System Alert */}
          <div className="mt-5 p-3 rounded-lg bg-amber-900/20 border border-amber-800/30 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-300">System Alert</p>
              <p className="text-xs text-amber-400/70 mt-0.5">6 evidence files pending integrity verification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
