import React from 'react'

const ICON_CONTAINER = {
  blue:   { bg: 'rgba(37,99,235,0.12)',  border: 'rgba(59,130,246,0.2)',  icon: '#60a5fa' },
  green:  { bg: 'rgba(16,185,129,0.12)', border: 'rgba(52,211,153,0.2)',  icon: '#34d399' },
  amber:  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(251,191,36,0.2)',  icon: '#fbbf24' },
  purple: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(167,139,250,0.2)', icon: '#c084fc' },
  red:    { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(248,113,113,0.2)', icon: '#f87171' },
}

const TEXT_COLOR = {
  blue:   '#93c5fd',
  green:  '#6ee7b7',
  amber:  '#fde68a',
  purple: '#ddd6fe',
  red:    '#fca5a5',
}

const StatsCard = ({ title, value, icon: Icon, subtitle, color = 'blue' }) => {
  const ic = ICON_CONTAINER[color] || ICON_CONTAINER.blue
  const tc = TEXT_COLOR[color]      || TEXT_COLOR.blue

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '0.875rem',
        padding: '1.25rem 1.5rem',
        transition: 'border-color 0.2s, transform 0.2s',
        cursor: 'default',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.02em' }}>{title}</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.25rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{value}</p>
          {subtitle && (
            <p style={{ fontSize: '0.75rem', color: tc, marginTop: '0.375rem', fontWeight: 500 }}>{subtitle}</p>
          )}
        </div>
        <div style={{
          width: '2.5rem', height: '2.5rem',
          borderRadius: '0.625rem',
          background: ic.bg,
          border: `1px solid ${ic.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {Icon && <Icon style={{ width: '1.125rem', height: '1.125rem', color: ic.icon }} />}
        </div>
      </div>
    </div>
  )
}

export default StatsCard
