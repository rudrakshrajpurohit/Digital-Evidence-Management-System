import React from 'react'

/**
 * LogoMark — Custom SVG shield badge logo for DEMS.
 * size: pixel size of the square SVG (default 36)
 * variant: 'color' | 'mono' — color uses brand blue, mono uses white tones
 */
const LogoMark = ({ size = 36, variant = 'color', className = '' }) => {
  const accent = variant === 'color' ? '#60a5fa' : '#ffffff'
  const mid    = variant === 'color' ? '#2563eb' : '#a0aec0'
  const base   = variant === 'color' ? '#1e3a8a' : '#4a5568'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="DEMS Logo"
    >
      {/* Outer shield */}
      <path
        d="M24 3L6 10v13c0 10.5 7.6 20.3 18 22.8C34.4 43.3 42 33.5 42 23V10L24 3z"
        fill={base}
        stroke={mid}
        strokeWidth="1.5"
      />
      {/* Inner shield highlight */}
      <path
        d="M24 8L11 14v10c0 7.8 5.7 15.1 13 17C31.3 39.1 37 31.8 37 24V14L24 8z"
        fill={mid}
        opacity="0.5"
      />
      {/* Eye / scan icon in center */}
      <ellipse cx="24" cy="24" rx="7" ry="4.5" stroke={accent} strokeWidth="2" fill="none" />
      <circle cx="24" cy="24" r="2.5" fill={accent} />
      {/* Top scan line */}
      <line x1="24" y1="15" x2="24" y2="18" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      {/* Bottom scan line */}
      <line x1="24" y1="30" x2="24" y2="33" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      {/* Left tick */}
      <line x1="13" y1="24" x2="16" y2="24" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      {/* Right tick */}
      <line x1="32" y1="24" x2="35" y2="24" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default LogoMark
