import { useState, useRef } from 'react'

const STEPS = ['Idle', 'Encrypting', 'Uploading', 'Completed', 'Error']
const STEP_ICONS = ['check_circle', 'enhanced_encryption', 'cloud_upload', 'task_alt', 'error']

export default function Upload({ userData }) {
  const [file, setFile]         = useState(null)
  const [text, setText]         = useState('')
  const [step, setStep]         = useState(0)
  const [result, setResult]     = useState(null)
  const [decryptIn, setDecryptIn] = useState('')
  const [decryptKey, setDecryptKey] = useState('')
  const [decryptOut, setDecryptOut] = useState('')
  const [queue, setQueue]       = useState([])
  const fileRef = useRef()

  const handleDrop = e => {
    e.preventDefault()
    const f = e.dataTransfer?.files[0] || e.target.files[0]
    if (f) setFile(f)
  }

  const encrypt = async () => {
    if (!userData) { setResult({ error: 'Please log in first.' }); return }
    if (!file && !text) { setResult({ error: 'Select a file or enter text.' }); return }

    setStep(1); setResult(null)
    const fd = new FormData()
    if (file) fd.append('file', file)
    if (text) fd.append('text', text)

    try {
      setStep(2)
      const res  = await fetch('http://localhost:3000/hash', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setStep(3)
      setResult(data)
      setQueue(q => [{ name: file?.name || 'Text Input', status: 'COMPLETED', time: new Date().toLocaleTimeString() }, ...q])
    } catch (err) {
      setStep(4)
      setResult({ error: err.message })
    }
  }

  const decrypt = async () => {
    if (!userData) { setDecryptOut('Please log in first.'); return }
    if (!decryptIn || !decryptKey) { setDecryptOut('Provide encrypted text and key.'); return }
    setDecryptOut('Decrypting...')
    try {
      const res  = await fetch('http://localhost:3000/decrypt', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encrypted: decryptIn, secretKey: decryptKey })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setDecryptOut(data.decrypted)
    } catch (err) {
      setDecryptOut('❌ ' + err.message)
    }
  }

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white">Upload & Encrypt</h2>
          <p className="text-slate-400 mt-2">Military-grade AES-256 encryption for your sensitive assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#fb5c13] animate-pulse"></div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-tighter">Node Integrity: Secure</span>
          </div>
        </div>
      </div>

      {/* Step pipeline */}
      <div className="grid grid-cols-5 gap-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
              i === step ? 'bg-[#fb5c13]/20 border-[#fb5c13]/60 text-[#fb5c13]' :
              i < step   ? 'bg-green-500/20 border-green-500/40 text-green-400' :
                           'bg-[#1e1e2e] border-white/10 text-slate-600'
            }`}>
              <span className="material-symbols-outlined text-lg">{STEP_ICONS[i]}</span>
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-wider ${i === step ? 'text-[#fb5c13]' : 'text-slate-600'}`}>{s}</span>
            <div className={`h-0.5 w-full rounded-full ${i < step ? 'bg-[#fb5c13]' : 'bg-[#333344]'}`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main encrypt card */}
        <div className="lg:col-span-2 bg-[#1e1e2e] rounded-xl p-8 border border-white/5 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Secure Payload</h3>
            <p className="text-sm text-slate-400 mt-1">Select a file or enter text to commit to the vault.</p>
          </div>

          {/* Drop zone */}
          <div
            className={`min-h-[180px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              file ? 'border-[#fb5c13]/60 bg-[#fb5c13]/5' : 'border-[#333344] hover:border-[#fb5c13]/40 hover:bg-white/[0.02]'
            }`}
            onClick={() => fileRef.current.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            <input ref={fileRef} type="file" className="hidden" onChange={handleDrop} />
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${file ? 'bg-[#fb5c13]/20' : 'bg-[#292839]'}`}>
              <span className={`material-symbols-outlined text-2xl ${file ? 'text-[#fb5c13]' : 'text-slate-500'}`}>
                {file ? 'check_circle' : 'add_moderator'}
              </span>
            </div>
            {file ? (
              <div className="text-center">
                <p className="text-sm font-semibold text-[#fb5c13]">{file.name}</p>
                <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-300">Drag files here to encrypt</p>
                <p className="text-slate-500 text-xs mt-1">or <span className="text-[#fb5c13] font-bold">browse workstation</span></p>
                <p className="text-[10px] uppercase tracking-tighter text-slate-600 mt-3">MAX FILE SIZE: 100MB</p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/5"></div>
            <span className="text-xs text-slate-500 font-medium">OR ENTER TEXT</span>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          <textarea
            className="w-full bg-[#1a1a2a] border border-white/5 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#fb5c13]/50 resize-none min-h-[100px] transition-colors"
            placeholder="Paste or type text to encrypt..."
            value={text} onChange={e => setText(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#fb5c13] animate-pulse"></div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-tighter">Ready for encryption...</span>
            </div>
            <button onClick={encrypt}
              className="bg-[#fb5c13] text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(251,92,19,0.3)] active:scale-95 transition-all">
              <span className="material-symbols-outlined">lock_reset</span>
              ENCRYPT & UPLOAD
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed ${result.error ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
              {result.error ? result.error : (
                <>
                  <p className="font-bold text-green-300 mb-2">✅ Encrypted successfully!</p>
                  {result.encrypted && <p className="text-slate-400 break-all mb-2"><span className="text-slate-500">Encrypted:</span> {result.encrypted}</p>}
                  <p className="text-slate-400 break-all mb-2"><span className="text-slate-500">Hash:</span> {result.hash}</p>
                  {result.secretKeyFragments && (
                    <div className="mt-2 p-3 bg-[#1a1a2a] rounded-lg border border-white/5">
                      <p className="text-[#fb5c13] font-bold mb-1">🔑 Key Fragments (save these!):</p>
                      {result.secretKeyFragments.map((f, i) => <p key={i}>Part {i+1}: <span className="text-white">{f}</span></p>)}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-5">
          {/* Config */}
          <div className="bg-[#1a1a2a] rounded-xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-4 text-[#fb5c13]">
              <span className="material-symbols-outlined text-sm">settings_input_component</span>
              <h4 className="text-[10px] uppercase font-black tracking-widest">Encryption Config</h4>
            </div>
            {[['Algorithm','AES-256-CBC'],['Key Derivation','HMAC-SHA256'],['Key Fragments','3-of-3']].map(([k,v]) => (
              <div key={k} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <span className="text-xs text-slate-400">{k}</span>
                <span className="text-xs font-mono text-white font-bold bg-[#333344] px-2 py-0.5 rounded">{v}</span>
              </div>
            ))}
          </div>

          {/* Decrypt panel */}
          <div className="bg-[#1a1a2a] rounded-xl p-6 border border-white/5">
            <h4 className="text-[10px] uppercase font-black tracking-widest text-[#ccbdff] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">lock_open</span>
              Quick Decrypt
            </h4>
            <div className="space-y-3">
              <input className="w-full bg-[#1e1e2e] border border-white/5 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#ccbdff]/40 transition-colors"
                placeholder="Encrypted text..." value={decryptIn} onChange={e => setDecryptIn(e.target.value)} />
              <input type="password"
                className="w-full bg-[#1e1e2e] border border-white/5 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#ccbdff]/40 transition-colors"
                placeholder="Secret key (all 3 parts joined)..." value={decryptKey} onChange={e => setDecryptKey(e.target.value)} />
              <button onClick={decrypt}
                className="w-full bg-[#ccbdff]/20 text-[#ccbdff] border border-[#ccbdff]/20 font-bold py-2.5 rounded-lg text-xs hover:bg-[#ccbdff]/30 transition-colors">
                DECRYPT
              </button>
              {decryptOut && (
                <div className="p-3 bg-[#1e1e2e] rounded-lg border border-white/5 text-xs font-mono text-slate-300 break-all max-h-32 overflow-y-auto">
                  {decryptOut}
                </div>
              )}
            </div>
          </div>

          {/* Queue */}
          <div className="bg-[#1a1a2a] rounded-xl p-6 border border-white/5">
            <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-4 flex items-center justify-between">
              Queue Manifest
              <span className="text-[#fb5c13]">{queue.length} items</span>
            </h4>
            {queue.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="material-symbols-outlined text-slate-700 text-3xl mb-2">folder_zip</span>
                <p className="text-xs text-slate-600">No files in session buffer</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {queue.map((q, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-[#1e1e2e] rounded-lg">
                    <span className="text-xs text-slate-300 truncate max-w-[120px]">{q.name}</span>
                    <span className="text-[10px] text-green-400 font-bold">{q.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
