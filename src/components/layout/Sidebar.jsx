import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderOpen,
  Upload,
  Link2,
  ScrollText,
  Users,
  ChevronRight,
} from 'lucide-react'
import useAuth from '../../hooks/useAuth'

const ALL_NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
    roles: null, // all roles
  },
  {
    label: 'Evidence',
    to: '/evidence',
    icon: FolderOpen,
    roles: null,
  },
  {
    label: 'Upload Evidence',
    to: '/evidence/upload',
    icon: Upload,
    roles: ['Admin', 'Investigator'],
  },
  {
    label: 'Chain of Custody',
    to: '/custody/EVD-001',
    icon: Link2,
    roles: null,
  },
  {
    label: 'Audit Logs',
    to: '/logs',
    icon: ScrollText,
    roles: ['Admin', 'Auditor'],
  },
  {
    label: 'User Management',
    to: '/users',
    icon: Users,
    roles: ['Admin'],
  },
]

const Sidebar = () => {
  const { user } = useAuth()

  const visibleItems = ALL_NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  )

  return (
    <aside
      style={{
        position: 'fixed', top: '64px', left: 0, bottom: 0,
        width: '224px',
        background: 'rgba(2,6,23,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        zIndex: 40,
        display: 'flex', flexDirection: 'column',
        paddingTop: '1.5rem', paddingBottom: '1.5rem',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '0 0.75rem', marginBottom: '0.5rem' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#334155', padding: '0 0.5rem' }}>
          Navigation
        </p>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            id={`nav-${item.label.replace(/\s+/g, '-').toLowerCase()}`}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">{item.label}</span>
            <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User info at bottom */}
      <div style={{ marginTop: 'auto', padding: '0 0.75rem' }}>
        <div style={{
          padding: '0.75rem',
          borderRadius: '0.625rem',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <p style={{ fontSize: '0.7rem', color: '#475569', marginBottom: '0.25rem' }}>Logged in as</p>
          <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
          <span style={{ fontSize: '0.75rem', color: '#93c5fd' }}>{user?.role}</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
