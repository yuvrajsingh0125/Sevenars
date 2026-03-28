import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Vault from './pages/Vault'
import Upload from './pages/Upload'
import Login from './pages/Login'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [userData, setUserData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('userData')) || null } catch { return null }
  })

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData))
  }, [userData])

  const logout = () => { setUserData(null); setPage('login') }

  const pageMap = {
    dashboard: <div style={{ width: '100%' }}><Dashboard setPage={setPage} /></div>,
    vault:     <div style={{ width: '100%' }}><Vault /></div>,
    upload:    <div style={{ width: '100%' }}><Upload userData={userData} /></div>,
    login:     <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}><Login setUserData={setUserData} setPage={setPage} /></div>,
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#121221' }}>
      <Sidebar page={page} setPage={setPage} userData={userData} logout={logout} />
      {/* Right column: topbar + scrollable content */}
      <div style={{ marginLeft: 256, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh' }}>
        <Topbar userData={userData} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column' }}>
          {pageMap[page] || pageMap.dashboard}
        </main>
      </div>
    </div>
  )
}
