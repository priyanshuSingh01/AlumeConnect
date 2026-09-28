import { useState } from 'react'
import { X } from 'lucide-react'
import Brand from '../../components/Brand'
import { Button } from '../../components/Ui'
import { authApi } from '../../services/api'

function AuthPage({ onComplete, onBack }) {
  const [role, setRole] = useState('Alumni')
  const [isRegistering, setIsRegistering] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = { ...form, role: role.toLowerCase() }
      const result = isRegistering ? await authApi.register(payload) : await authApi.login(payload)
      onComplete(result)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Brand />
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <X size={18} />
          Back to home
        </button>
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Welcome to your community</p>
          <h1 className="mt-4 text-5xl font-bold tracking-[-0.06em] text-slate-900 md:text-6xl">
            The best career advice
            <span className="block text-blue-600">is personal.</span>
          </h1>
          <p className="mt-6 text-base leading-7 text-slate-600">
            Reconnect with the people and opportunities that make your next step feel possible.
          </p>
        </div>

        <form onSubmit={submit} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Secure access</p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.05em] text-slate-900">
              {isRegistering ? 'Create your account' : 'Sign in to AlumniConnect'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">Choose your account type to continue.</p>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
            {['Alumni', 'Student', 'Admin'].map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setRole(item)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  role === item ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {isRegistering && (
            <label className="mb-4 block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Full name</span>
              <input
                value={form.name}
                onChange={update('name')}
                placeholder="Your full name"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white"
              />
            </label>
          )}

          <label className="mb-4 block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Email address</span>
            <input
              value={form.email}
              onChange={update('email')}
              type="email"
              placeholder={role === 'Admin' ? 'admin@university.edu' : 'you@example.com'}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white"
            />
          </label>

          <label className="mb-4 block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Password</span>
            <input
              value={form.password}
              onChange={update('password')}
              type="password"
              placeholder="Enter your password"
              minLength="6"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white"
            />
          </label>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          <div className="mb-5 flex items-center justify-between text-xs text-slate-500">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600" />
              Remember me
            </label>
            <button type="button" className="font-semibold text-blue-600 hover:text-blue-700">
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="w-full" variant="primary">
            {loading ? 'Please wait...' : isRegistering ? 'Create account' : `Continue as ${role}`}
          </Button>

          <div className="my-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            <span>or continue with</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={() => setError('Google login needs OAuth credentials before it can be enabled.')}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
              G
            </span>
            Continue with Google
          </button>

          <p className="mt-5 text-center text-xs text-slate-500">
            {isRegistering ? 'Already have an account?' : 'New here?'}{' '}
            <button
              type="button"
              onClick={() => setIsRegistering((current) => !current)}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              {isRegistering ? 'Sign in' : 'Create account'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default AuthPage
