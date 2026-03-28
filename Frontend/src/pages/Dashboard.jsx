const STATS = [
  { label: 'Global Node Health', value: '99.9%', delta: '+0.02%', deltaColor: 'text-green-500', badge: 'Operational', badgeColor: 'bg-green-500/20 text-green-400', icon: 'lan', iconBg: 'bg-green-500/10 text-green-500' },
  { label: 'Active Encryption', value: 'AES-256-GCM', delta: null, badge: 'Active', badgeColor: 'bg-[#ccbdff]/20 text-[#ccbdff]', icon: 'security', iconBg: 'bg-[#ccbdff]/10 text-[#ccbdff]' },
  { label: 'Daily Volume', value: '4.2 TB', delta: '/ 128 Files', deltaColor: 'text-slate-500', badge: null, icon: 'database', iconBg: 'bg-[#fb5c13]/10 text-[#fb5c13]' },
  { label: 'Threats Neutralized', value: '12,043', delta: null, badge: null, icon: 'gpp_maybe', iconBg: 'bg-red-500/10 text-red-400', pulse: true },
]

const LOGS = [
  { name: 'financial_audit_2024.pdf',    enc: 'AES-256',  status: 'Secure',     statusColor: 'bg-green-500/10 text-green-500 border-green-500/20',       time: '2024-05-22 14:32', icon: 'picture_as_pdf' },
  { name: 'user_database_shard_01.sql',  enc: 'RSA-4096', status: 'Encrypting', statusColor: 'bg-[#fb5c13]/10 text-[#fb5c13] border-[#fb5c13]/20',        time: '2024-05-22 14:30', icon: 'database' },
  { name: 'legal_agreement_v2.docx',     enc: 'AES-256',  status: 'Secure',     statusColor: 'bg-green-500/10 text-green-500 border-green-500/20',       time: '2024-05-22 14:28', icon: 'description' },
  { name: 'internal_assets_bundle.zip',  enc: 'ChaCha20', status: 'Secure',     statusColor: 'bg-green-500/10 text-green-500 border-green-500/20',       time: '2024-05-22 14:15', icon: 'folder_zip' },
]

const INTEGRITY = [
  { label: 'Firewall Strength', pct: 94,  color: 'bg-[#fb5c13]' },
  { label: 'Quantum Entropy',   pct: 78,  color: 'bg-[#ccbdff]' },
  { label: 'DDoS Resilience',   pct: 99,  color: 'bg-[#a9c7ff]' },
]

export default function Dashboard({ setPage }) {
  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-[#fb5c13] pl-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white">Security Command Center</h2>
          <p className="text-slate-400 mt-2 max-w-xl">Real-time monitoring of decentralized encryption nodes. Infrastructure integrity: Optimal.</p>
        </div>
        <button onClick={() => setPage('upload')}
          className="px-6 py-3 bg-[#fb5c13] text-white font-bold rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(251,92,19,0.3)] transition-all shrink-0">
          <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>bolt</span>
          NEW ENCRYPTION
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map(s => (
          <div key={s.label} className="bg-[#1e1e2e] p-6 rounded-xl border border-white/5 hover:border-[#fb5c13]/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className={`p-2 rounded-lg material-symbols-outlined ${s.iconBg}`}>{s.icon}</span>
              {s.badge && <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${s.badgeColor}`}>{s.badge}</span>}
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <span className={`font-black text-white ${s.value.length > 8 ? 'text-lg' : 'text-3xl'}`}>{s.value}</span>
              {s.delta && <span className={`text-xs font-mono ${s.deltaColor}`}>{s.delta}</span>}
              {s.pulse && <span className="w-2 h-2 rounded-full bg-[#fb5c13] animate-ping"></span>}
            </div>
          </div>
        ))}
      </div>

      {/* Log + Integrity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#fb5c13]">history</span>
              Recent Encryption Log
            </h3>
            <button className="text-xs font-bold text-slate-500 hover:text-[#fb5c13] transition-colors uppercase tracking-widest">View Full Archive</button>
          </div>
          <div className="bg-[#1a1a2a] rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#292839]/50 border-b border-white/5">
                  {['File Name','Encryption','Status','Timestamp'].map(h => (
                    <th key={h} className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {LOGS.map(row => (
                  <tr key={row.name} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-600 group-hover:text-[#fb5c13] transition-colors text-sm">{row.icon}</span>
                        <span className="text-sm font-medium text-slate-200 truncate max-w-[160px]">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className="text-xs font-mono text-slate-400">{row.enc}</span></td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${row.statusColor}`}>{row.status}</span>
                    </td>
                    <td className="px-5 py-4"><span className="text-xs font-mono text-slate-500">{row.time}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Integrity */}
        <div className="space-y-5">
          <div className="bg-[#1e1e2e] rounded-xl border border-white/5 p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Network Integrity</h3>
            <div className="space-y-5">
              {INTEGRITY.map(({ label, pct, color }) => (
                <div key={label} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#333344] rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 rounded-lg bg-[#fb5c13]/10 border border-[#fb5c13]/20">
              <p className="text-[10px] font-bold text-[#fb5c13] uppercase tracking-[0.05em] mb-1">System Advisory</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Integrity scores within optimal threshold. Next key rotation in <span className="text-white font-mono">04h 12m</span>.
              </p>
            </div>
          </div>

          {/* Terminal log */}
          <div className="bg-[#1e1e2e] rounded-xl border border-white/5 p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#fb5c13] text-sm">terminal</span>
              Audit Log
            </h3>
            <div className="space-y-2 font-mono text-[11px] text-slate-400">
              <p><span className="text-green-500">[OK]</span> Handshake with SecureGateway-Node-01</p>
              <p><span className="text-[#fb5c13]">[INFO]</span> Loading AES-GCM engine v2.4.1</p>
              <p><span className="text-green-500">[OK]</span> 4 archives verified by Sentinel</p>
              <p><span className="text-red-400">[WARN]</span> Integrity check pending on SEC-ERR-404</p>
              <p><span className="text-slate-600">[WAIT]</span> Awaiting user instruction...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
