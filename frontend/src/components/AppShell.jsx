import { useEffect, useState } from 'react'
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardCheck,
  Compass,
  Globe2,
  HeartHandshake,
  LayoutDashboard,
  LineChart,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import Brand from './Brand'
import DashboardPage from '../pages/dashboard/DashboardPage'
import DirectoryPage from '../pages/directory/DirectoryPage'
import MentorshipPage from '../pages/mentorship/MentorshipPage'
import JobsPage from '../pages/jobs/JobsPage'
import EventsPage from '../pages/events/EventsPage'
import MessagesPage from '../pages/messages/MessagesPage'
import AlumniMapPage from '../pages/map/AlumniMapPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import ProfilePage from '../pages/profile/ProfilePage'
import NotificationsPage from '../pages/notifications/NotificationsPage'
import { api, authApi } from '../services/api'

const navItems = [
  ['Dashboard', LayoutDashboard],
  ['Alumni Directory', Users],
  ['Find Alumni', Compass],
  ['Mentorship', HeartHandshake],
  ['Jobs & Internships', BriefcaseBusiness],
  ['Events', CalendarDays],
  ['Messages', MessageCircle],
  ['Alumni Map', Globe2],
  ['Notifications', Bell],
  ['My Profile', UserRound],
]

const adminItems = [
  ['Admin overview', ShieldCheck],
  ['Verification queue', ClipboardCheck],
  ['Analytics', LineChart],
]

function AppShell({ user, onSignOut, onUserUpdate }) {
  const [screen, setScreen] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationError, setNotificationError] = useState('')
  const [platformSearch, setPlatformSearch] = useState('')
  const [directorySearch, setDirectorySearch] = useState('')
  const [messageContactId, setMessageContactId] = useState('')
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deletingAccount, setDeletingAccount] = useState(false)

  useEffect(() => {
    let active = true
    api.getNotifications()
      .then(({ notifications }) => {
        if (active) {
          setUnreadCount(notifications.filter((notification) => !notification.read).length)
          setNotificationError('')
        }
      })
      .catch((error) => {
        if (active) setNotificationError(error.message)
      })
    return () => {
      active = false
    }
  }, [screen])

  const navigate = (nextScreen, searchTerm, contactId) => {
    if (nextScreen === 'Alumni Directory' || (nextScreen === 'Find Alumni' && typeof searchTerm !== 'string')) setDirectorySearch('')
    if (typeof searchTerm === 'string') setDirectorySearch(searchTerm)
    if (nextScreen === 'Messages') setMessageContactId(contactId || '')
    setScreen(nextScreen)
    setSidebarOpen(false)
  }

  const submitPlatformSearch = (event) => {
    event.preventDefault()
    setDirectorySearch(platformSearch.trim())
    navigate('Find Alumni')
  }

  const deleteAccount = async (event) => {
    event.preventDefault()
    setDeletingAccount(true)
    setDeleteError('')
    try {
      await authApi.deleteAccount(deletePassword)
      onSignOut()
    } catch (error) {
      setDeleteError(error.message)
      setDeletingAccount(false)
    }
  }

  const renderScreen = () => {
    if (screen === 'Dashboard') return <DashboardPage navigate={navigate} user={user} />
    if (screen === 'Alumni Directory' || screen === 'Find Alumni') {
      return <DirectoryPage key={`${screen}-${directorySearch}`} findMode={screen === 'Find Alumni'} navigate={navigate} user={user} initialQuery={directorySearch} />
    }
    if (screen === 'Mentorship') return <MentorshipPage user={user} onUserUpdate={onUserUpdate} />
    if (screen === 'Jobs & Internships') return <JobsPage user={user} />
    if (screen === 'Events') return <EventsPage user={user} />
    if (screen === 'Messages') return <MessagesPage key={messageContactId} user={user} initialContactId={messageContactId} />
    if (screen === 'Alumni Map') return <AlumniMapPage navigate={navigate} />
    if (screen === 'My Profile') return <ProfilePage user={user} onUserUpdate={onUserUpdate} />
    if (screen === 'Notifications') return <NotificationsPage />
    if (screen === 'Admin overview' || screen === 'Verification queue' || screen === 'Analytics') {
      return <AdminDashboardPage analyticsOnly={screen === 'Analytics'} verificationOnly={screen === 'Verification queue'} />
    }
    return <DashboardPage navigate={navigate} user={user} />
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto border-r border-slate-200 bg-white p-4 shadow-sm transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <Brand />
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Workspace</p>
          <nav className="mt-3 space-y-1">
            {navItems.map(([label, Icon]) => (
              <button
                key={label}
                onClick={() => navigate(label)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  screen === label ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={17} />
                <span className="flex-1 text-left">{label}</span>
                {label === 'Notifications' && (
                  unreadCount > 0 && <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {user.role === 'admin' && (
          <div className="mt-8">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Administration</p>
            <nav className="mt-3 space-y-1">
              {adminItems.map(([label, Icon]) => (
                <button
                  key={label}
                  onClick={() => navigate(label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    screen === label ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        <div className="mt-auto space-y-4 border-t border-slate-200 pt-4">
          <button
            onClick={() => navigate('My Profile')}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-slate-100"
          >
            {user.image
              ? <img src={user.image} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
              : <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{user.name?.[0]}</span>}
            <span>
              <span className="block text-sm font-semibold text-slate-900">{user.name}</span>
              <span className="block text-xs capitalize text-slate-500">{user.role}{user.batch ? ` · ${user.batch}` : ''}</span>
            </span>
          </button>

          <button
            onClick={onSignOut}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:text-red-600"
          >
            Sign out
          </button>
          <button
            onClick={() => { setDeleteAccountOpen(true); setDeleteError(''); setDeletePassword('') }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
          >
            <Trash2 size={16} />
            Delete account
          </button>
        </div>
      </aside>

      {deleteAccountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !deletingAccount) setDeleteAccountOpen(false)
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="delete-account-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-700">
              <Trash2 size={20} />
            </div>
            <h2 id="delete-account-title" className="mt-4 text-lg font-bold text-slate-900">Delete your account?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This permanently deletes your profile, messages, connection and mentorship requests, and job posts. Events you created remain available to the community without your profile attached. This action cannot be undone.
            </p>
            <form onSubmit={deleteAccount} className="mt-5 space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                Enter your password to confirm
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={deletePassword}
                  onChange={(event) => setDeletePassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </label>
              {deleteError && <p role="alert" className="text-sm text-red-700">{deleteError}</p>}
              <div className="flex justify-end gap-3">
                <button type="button" disabled={deletingAccount} onClick={() => setDeleteAccountOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                  Cancel
                </button>
                <button type="submit" disabled={deletingAccount || !deletePassword} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {deletingAccount ? 'Deleting...' : 'Permanently delete'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <button
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>

            <div className="flex-1">
              <p className="text-xs text-slate-500">{new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</p>
              <p className="text-sm font-semibold text-slate-900">{screen}</p>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <form onSubmit={submitPlatformSearch} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                <Search size={16} aria-hidden="true" />
                <input
                  value={platformSearch}
                  onChange={(event) => setPlatformSearch(event.target.value)}
                  className="w-40 border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  placeholder="Search people"
                  aria-label="Search people"
                />
              </form>
              <button onClick={() => navigate('Notifications')} title={notificationError || 'Open notifications'} aria-label="Open notifications" className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-700">
                <Bell size={18} />
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </button>
              <button
                onClick={() => navigate('My Profile')}
                className="overflow-hidden rounded-full border border-slate-200 bg-white p-1"
              >
                {user.image
                  ? <img src={user.image} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
                  : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{user.name?.[0]}</span>}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {renderScreen()}
        </main>
      </div>
    </div>
  )
}

export default AppShell
