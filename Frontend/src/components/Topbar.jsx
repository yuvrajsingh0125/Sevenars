export default function Topbar({ userData }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(18,18,33,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', height: 56 }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b' }}>Node Status: Active</span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#1a1a2a', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ color: '#475569', fontSize: 16 }}>search</span>
            <input style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: '#cbd5e1', width: 200 }}
              placeholder="Search encrypted nodes..." />
          </div>

          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
            <span className="material-symbols-outlined">settings</span>
          </button>

          <div style={{ width: 1, height: 24, background: '#1e293b' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 6, background: 'rgba(96,4,251,0.15)', border: '1px solid rgba(204,189,255,0.15)' }}>
            <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#ccbdff' }}>
              {userData ? userData.username.slice(0, 14) : '0xA12...F9C'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
