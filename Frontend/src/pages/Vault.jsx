import { useState } from 'react'

const FILES = [
  { id: 'SEC-8892-X', name: 'core_network_topology.sec',    date: 'Oct 24, 2023', time: '14:22 UTC', status: 'COMPLETED',  statusColor: 'bg-green-500/10 text-green-400 border-green-500/20',       icon: 'description',  iconColor: 'text-[#fb5c13]' },
  { id: 'SEC-0129-A', name: 'root_auth_credentials.vault',  date: 'Oct 23, 2023', time: '09:15 UTC', status: 'ENCRYPTED',  statusColor: 'bg-[#fb5c13]/10 text-[#fb5c13] border-[#fb5c13]/20',       icon: 'shield_lock',  iconColor: 'text-[#ccbdff]' },
  { id: 'SEC-4410-Q', name: 'system_logs_q3_backup.tar.gz', date: 'Oct 23, 2023', time: '08:00 UTC', status: 'PROCESSING', statusColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',           icon: 'sync_lock',    iconColor: 'text-slate-400' },
  { id: 'SEC-ERR-404', name: 'user_data_export_01.csv',     date: 'Oct 22, 2023', time: '17:45 UTC', status: 'ERROR',      statusColor: 'bg-red-500/10 text-red-400 border-red-500/20',             icon: 'report',       iconColor: 'text-red-400' },
]

export default function Vault() {
  const [search, setSearch] = useState('')
  const filtered = FILES.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white">Encrypted Vault</h2>
          <p className="text-slate-400 mt-2">Manage your secure infrastructure keys and sensitive data assets.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] uppercase text-slate-500 tracking-tighter font-bold">Storage Usage</span>
          <div className="h-2 w-48 bg-[#333344] rounded-full overflow-hidden">
            <div className="h-full bg-[#fb5c13] w-[65%]"></div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">65% of 10 TB</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Active Keys', value: '1,284', delta: '+12% from last cycle', icon: 'key', color: 'text-[#ccbdff]' },
          { label: 'Total Volume', value: '4.2 TB', delta: 'Last sync: 2m ago', icon: 'database', color: 'text-[#fb5c13]' },
          { label: 'Threats Blocked', value: '92', delta: '2 critical intercepts', icon: 'gpp_maybe', color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#1a1a2a] p-6 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] uppercase font-bold tracking-widest ${s.color}`}>{s.label}</span>
              <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
            </div>
            <div className="text-3xl font-black text-white mb-1">{s.value}</div>
            <div className="text-xs text-slate-500">{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1e1e2e] rounded-xl border border-white/5 overflow-hidden shadow-xl">
        <div className="p-5 flex items-center justify-between bg-[#292839]/50 border-b border-white/5">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-lg text-white">Secure Assets</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-[#fb5c13]/10 text-[#fb5c13] text-[10px] font-bold border border-[#fb5c13]/20">AES-256</span>
              <span className="px-3 py-1 rounded-full bg-[#ccbdff]/10 text-[#ccbdff] text-[10px] font-bold border border-[#ccbdff]/20">ZKP-ENABLED</span>
            </div>
          </div>
          <div className="flex items-center bg-[#1a1a2a] px-4 py-2 rounded-lg border border-white/5">
            <span className="material-symbols-outlined text-slate-500 text-sm mr-2">search</span>
            <input className="bg-transparent border-none focus:outline-none text-sm text-slate-100 placeholder:text-slate-600 w-48"
              placeholder="Search archive..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1a1a2a]/30 border-b border-white/5">
                {['Name', 'Date', 'Security Status', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(f => (
                <tr key={f.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-[#333344] flex items-center justify-center ${f.iconColor}`}>
                        <span className="material-symbols-outlined text-sm">{f.icon}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100 text-sm">{f.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">ID: {f.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400">
                    {f.date} <span className="text-[10px] block opacity-50">{f.time}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${f.statusColor}`}>{f.status}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-3 py-1.5 rounded-lg bg-[#333344] text-slate-200 text-xs font-semibold hover:bg-[#383849] transition-colors">
                        Decrypt
                      </button>
                      <button className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${f.status === 'ERROR' || f.status === 'PROCESSING' ? 'bg-[#fb5c13]/20 text-[#fb5c13]/40 cursor-not-allowed' : 'bg-[#fb5c13] text-white hover:opacity-90'}`}
                        disabled={f.status === 'ERROR' || f.status === 'PROCESSING'}>
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#1a1a2a]/50 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-500">Showing {filtered.length} of {FILES.length} objects</span>
          <div className="flex gap-2">
            <button className="p-1.5 rounded-lg bg-[#333344] text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="p-1.5 rounded-lg bg-[#333344] text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
