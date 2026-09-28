import { useState } from 'react'
import AppShell from './components/AppShell'
import AuthPage from './pages/auth/AuthPage'
import LandingPage from './pages/landing/LandingPage'

function App() {
	const [mode, setMode] = useState(localStorage.getItem('alumconnect_token') ? 'app' : 'landing')
	if (mode === 'landing') return <LandingPage onStart={() => setMode('auth')} />
	if (mode === 'auth') return <AuthPage onComplete={({ token }) => { localStorage.setItem('alumconnect_token', token); setMode('app') }} onBack={() => setMode('landing')} />
	return <AppShell onSignOut={() => { localStorage.removeItem('alumconnect_token'); setMode('landing') }} />
}

export default App