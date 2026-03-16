import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const PageLayout = ({ children }) => {
  return (
    <div
      className="relative min-h-screen"
      style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #111827 100%)' }}
    >
      {/* Noise texture layer */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          backgroundImage: NOISE_SVG,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.035,
          pointerEvents: 'none',
        }}
      />

      {/* Ambient radial light — top center */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', top: '-10%', left: '40%',
          width: '700px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0, pointerEvents: 'none',
        }}
      />

      {/* Ambient accent — bottom right */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', bottom: '-5%', right: '10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0, pointerEvents: 'none',
        }}
      />

      {/* App shell */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Navbar />
        <Sidebar />
        <main
          style={{ marginLeft: '224px', paddingTop: '64px' }}
          className="min-h-screen"
        >
          <div className="px-8 py-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default PageLayout
