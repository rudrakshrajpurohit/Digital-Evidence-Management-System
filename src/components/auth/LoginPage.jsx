import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import { authService } from '../../services/authService'
import NotificationToast from '../utils/NotificationToast'
import LogoMark from '../utils/LogoMark'

// Mock users for demo (when no backend is available)
const MOCK_USERS = {
  'admin@dems.gov': { name: 'Admin User', role: 'Admin', email: 'admin@dems.gov' },
  'det.johnson@dems.gov': { name: 'Det. Johnson', role: 'Investigator', email: 'det.johnson@dems.gov' },
  'analyst.chen@dems.gov': { name: 'Analyst Chen', role: 'Forensic Analyst', email: 'analyst.chen@dems.gov' },
  'auditor@dems.gov': { name: 'Auditor Smith', role: 'Auditor', email: 'auditor@dems.gov' },
}

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setToast({ type: 'error', message: 'Please enter your email and password.' })
      return
    }

    setLoading(true)
    try {
      const data = await authService.login(form.email, form.password)
      login(data.user, data.token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      // Fallback to mock auth for demo
      const mockUser = MOCK_USERS[form.email.toLowerCase()]
      if (mockUser && form.password === 'demo123') {
        login(mockUser, 'mock-jwt-token-' + Date.now())
        navigate('/dashboard', { replace: true })
      } else {
        setToast({
          type: 'error',
          message: 'Invalid credentials. Try demo accounts below.',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #111827 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-20%', left: '20%',
        width: '600px', height: '500px',
        background: 'radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      {/* Left Panel — Branding */}
      <div
        style={{
          display: 'none',
          flex: '0 0 50%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(12px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '3rem',
          position: 'relative',
        }}
        className="lg:flex"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary-800/20 via-transparent to-transparent" />
        <div className="relative z-10 text-center">
          {/* Big logo mark */}
          <div className="flex flex-col items-center mb-8">
            <div
              style={{
                background: 'radial-gradient(circle at 50% 40%, rgba(37,99,235,0.25) 0%, transparent 70%)',
                padding: '20px',
                borderRadius: '24px',
              }}
            >
              <LogoMark size={80} variant="color" />
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-4xl font-black tracking-tight" style={{ color: '#60a5fa' }}>D</span>
              <span className="text-4xl font-black text-white tracking-tight">EMS</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Digital Evidence<br />Management System
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Secure, tamper-proof evidence management for law enforcement and forensic investigators.
          </p>

          {/* Feature bullets */}
          <div className="mt-10 text-left space-y-3 max-w-xs">
            {['Chain of Custody Tracking', 'Role-Based Access Control', 'Complete Audit Trail', 'Forensic-Grade Integrity'].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <LogoMark size={32} variant="color" />
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold tracking-tight" style={{ color: '#60a5fa' }}>D</span>
              <span className="text-xl font-extrabold text-white tracking-tight">EMS</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-8">Sign in to your account to continue</p>

          <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="input-field"
                placeholder="you@dems.gov"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <Link to="/reset-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input-field pr-11"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: '0.75rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p className="text-xs font-semibold text-gray-400 mb-2">Demo Accounts (password: demo123)</p>
            <div className="space-y-1">
              {Object.entries(MOCK_USERS).map(([email, u]) => (
                <button
                  key={email}
                  type="button"
                  onClick={() => setForm({ email, password: 'demo123' })}
                  className="text-xs text-left w-full text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {u.role}: {email}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <NotificationToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default LoginPage
