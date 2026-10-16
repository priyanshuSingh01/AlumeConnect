import { useEffect, useState } from 'react'
import AppShell from './components/AppShell'
import AuthPage from './pages/auth/AuthPage'
import LandingPage from './pages/landing/LandingPage'
import ProfileSetupPage from './pages/profile/ProfileSetupPage'
import { authApi } from './services/api'

function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('alumconnect_token') ? 'checking' : 'landing')
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (mode !== 'checking') return
    authApi
      .getCurrentUser()
      .then(({ user: currentUser }) => {
        setUser(currentUser)
        setMode(currentUser.profileComplete || currentUser.role === 'admin' ? 'app' : 'profileSetup')
      })
      .catch(() => {
        localStorage.removeItem('alumconnect_token')
        setMode('landing')
      })
  }, [mode])

  const handleAuthComplete = ({ token, user: authenticatedUser }) => {
    localStorage.setItem('alumconnect_token', token)
    setUser(authenticatedUser)
    setMode(authenticatedUser.profileComplete || authenticatedUser.role === 'admin' ? 'app' : 'profileSetup')
  }

  const signOut = () => {
    localStorage.removeItem('alumconnect_token')
    setUser(null)
    setMode('landing')
  }

  if (mode === 'landing') return <LandingPage onStart={() => setMode('auth')} />
  if (mode === 'auth') return <AuthPage onComplete={handleAuthComplete} onBack={() => setMode('landing')} />
  if (mode === 'checking') return <main className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">Loading your profile...</main>
  if (mode === 'profileSetup') return <ProfileSetupPage user={user} onComplete={(updatedUser) => { setUser(updatedUser); setMode('app') }} />
  return <AppShell user={user} onSignOut={signOut} />
}

export default App