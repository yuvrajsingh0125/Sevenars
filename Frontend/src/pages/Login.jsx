import { useState } from 'react'

export default function Login({ setUserData, setPage }) {
  const [mode, setMode]       = useState('login') // 'login' | 'signup'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [status, setStatus]   = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true); setStatus('')
    try {
      if (mode === 'login') {
        const res  = await fetch('http://localhost:3000/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        setUserData({ username: email, loggedIn: true })
        setStatus('✅ Authenticated!')
        setTimeout(() => setPage('dashboard'), 800)
      } else {
        const res  = await fetch('http://localhost:3000/signup', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, password })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        setStatus(data.message)
        setTimeout(() => setMode('login'), 2000)
      }
    } catch (err) {
      setStatus('❌ ' + (err.message || 'Failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '32px 0' }}>
      {/* Ambient glows */}
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-[#6004fb]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-[#fb5c13]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[420px] z-10">
        <div className="bg-[#1e1e2e]/80 backdrop-blur-xl border border-white/5 rounded-xl shadow-2xl overflow-hidden">
          {/* Card header */}
          <div className="bg-[#292839]/50 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1e1e2e] rounded-xl mb-4 border border-white/5">
              <span className="material-symbols-outlined text-[#fb5c13] text-4xl" style={{fontVariationSettings:"'FILL' 1"}}>shield_lock</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">CipherVault</h1>
            <p className="text-slate-400 mt-1 text-sm">Enter the Secure Perimeter</p>
          </div>

          {/* Card body */}
          <div className="px-8 py-8 space-y-5">
            {/* Tab toggle */}
            <div className="flex bg-[#1a1a2a] rounded-lg p-1">
              {['login','signup'].map(m => (
                <button key={m} onClick={() => { setMode(m); setStatus('') }}
                  className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${mode === m ? 'bg-[#fb5c13] text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                  {m === 'login' ? 'Login' : 'Sign Up'}
                </button>
              ))}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-[10px] uppercase tracking-[0.05em] text-slate-500 font-semibold block mb-2">Full Name</label>
                <input className="w-full bg-[#1a1a2a] border border-white/5 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#fb5c13]/50 transition-colors"
                  placeholder="Your name" value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase tracking-[0.05em] text-slate-500 font-semibold block mb-2">Email</label>
              <input type="email"
                className="w-full bg-[#1a1a2a] border border-white/5 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#fb5c13]/50 transition-colors"
                placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.05em] text-slate-500 font-semibold block mb-2">Password</label>
              <input type="password"
                className="w-full bg-[#1a1a2a] border border-white/5 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#fb5c13]/50 transition-colors"
                placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()} />
            </div>

            <button onClick={submit} disabled={loading}
              className="w-full bg-gradient-to-r from-[#fb5c13] to-[#ff8c42] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(251,92,19,0.4)] active:scale-[0.98] transition-all disabled:opacity-60">
              {loading
                ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                : <span className="material-symbols-outlined text-sm" style={{fontVariationSettings:"'FILL' 1"}}>shield_lock</span>
              }
              {mode === 'login' ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
            </button>

            {status && (
              <p className={`text-xs text-center font-mono ${status.startsWith('❌') ? 'text-red-400' : 'text-green-400'}`}>{status}</p>
            )}

            {/* Meta */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                <span>Status: Awaiting Handshake</span>
                <span>Node: US-EAST-01</span>
              </div>
              <div className="w-full h-1 bg-[#333344] rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-[#fb5c13]/40 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#1a1a2a]/50 px-8 py-4 flex justify-between items-center border-t border-white/5">
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">verified_user</span>
              AES-256 Encrypted
            </span>
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">security</span>
              FIPS 140-2
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
