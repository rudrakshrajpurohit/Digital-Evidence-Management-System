import React, { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, LogOut, User } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import LogoMark from '../utils/LogoMark'

const roleBadgeColors = {
  Admin: 'bg-red-900/40 text-red-400 border-red-800/50',
  Investigator: 'bg-blue-900/40 text-blue-400 border-blue-800/50',
  'Forensic Analyst': 'bg-purple-900/40 text-purple-400 border-purple-800/50',
  Auditor: 'bg-amber-900/40 text-amber-400 border-amber-800/50',
}

const Navbar = () => {
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifications] = useState(3)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '64px',
        background: 'rgba(2,6,23,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        zIndex: 50,
        display: 'flex', alignItems: 'center',
        padding: '0 1.5rem',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3" style={{ minWidth: '224px' }}>
        <LogoMark size={36} variant="color" />
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-extrabold tracking-tight" style={{ color: '#60a5fa' }}>D</span>
            <span className="text-base font-extrabold text-white tracking-tight">EMS</span>
          </div>
          <p className="text-[10px] text-gray-500 leading-none" style={{ marginTop: '1px' }}>Digital Evidence Management</p>
        </div>
      </div>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-all">
          <Bell className="w-5 h-5" />
          {notifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="user-menu-button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-dark-600 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-white leading-none">{user?.name || 'User'}</p>
              <p className={`text-xs px-1.5 py-0.5 rounded border mt-0.5 inline-block ${roleBadgeColors[user?.role] || 'bg-gray-800 text-gray-400'}`}>
                {user?.role || 'Unknown'}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-dark-700 border border-dark-500 rounded-xl shadow-2xl py-2 animate-fade-in">
              <div className="px-4 py-3 border-b border-dark-600">
                <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400">{user?.email || ''}</p>
              </div>
              <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-600 transition-colors">
                <User className="w-4 h-4" />
                Profile Settings
              </button>
              <div className="border-t border-dark-600 mt-1 pt-1">
                <button
                  id="logout-button"
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
