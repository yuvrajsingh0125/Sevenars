const NAV = [
  { id: 'dashboard', icon: 'dashboard',    label: 'Dashboard' },
  { id: 'vault',     icon: 'lock_open',    label: 'Vault' },
  { id: 'upload',    icon: 'cloud_upload', label: 'Upload' },
]

export default function Sidebar({ page, setPage, userData, logout }) {
  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0,
      width: 256, height: '100vh',
      background: '#1a1a2a',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column',
      padding: '32px 16px',
      zIndex: 50,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, background: '#fb5c13', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 20, fontVariationSettings: "'FILL' 1" }}>lock</span>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fb5c13', letterSpacing: '-0.03em' }}>CipherVault</div>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#475569', fontWeight: 700 }}>Security Node</div>
          </div>
        </div>
        <div style={{ padding: '10px 12px', borderRadius: 10, background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569', marginBottom: 4 }}>Sentinel Terminal</div>
          <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#fb5c13', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {userData ? `Session: ${userData.username}` : 'Active Session: 0xA12...F9C'}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(({ id, icon, label }) => {
          const active = page === id
          return (
            <button key={id} onClick={() => setPage(id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: active ? '0 10px 10px 0' : 10,
              border: 'none', cursor: 'pointer', textAlign: 'left',
              background: active ? '#1e1e2e' : 'transparent',
              color: active ? '#fb5c13' : '#94a3b8',
              borderLeft: active ? '3px solid #fb5c13' : '3px solid transparent',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#292839'; e.currentTarget.style.color = '#f1f5f9' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' } }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {userData ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: '#1e1e2e' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(251,92,19,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: '#fb5c13', fontSize: 16 }}>person</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userData.username}</div>
                <div style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace' }}>Authenticated</div>
              </div>
            </div>
            <button onClick={logout} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 10, border: 'none',
              background: 'transparent', color: '#94a3b8', cursor: 'pointer',
              fontSize: 13, fontWeight: 500, fontFamily: 'inherit', textAlign: 'left',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => setPage('login')} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', borderRadius: 10, border: 'none',
            background: 'transparent', color: '#94a3b8', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, fontFamily: 'inherit', textAlign: 'left',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#292839'; e.currentTarget.style.color = '#f1f5f9' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>account_circle</span>
            Login
          </button>
        )}
      </div>
    </aside>
  )
}
