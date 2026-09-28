import { useState } from 'react'
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
  ShieldCheck,
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

function AppShell({ onSignOut }) {
  const [screen, setScreen] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigate = (nextScreen) => {
    setScreen(nextScreen)
    setSidebarOpen(false)
  }

  const renderScreen = () => {
    if (screen === 'Dashboard') return <DashboardPage navigate={navigate} />
    if (screen === 'Alumni Directory' || screen === 'Find Alumni') {
      return <DirectoryPage findMode={screen === 'Find Alumni'} navigate={navigate} />
    }
    if (screen === 'Mentorship') return <MentorshipPage />
    if (screen === 'Jobs & Internships') return <JobsPage />
    if (screen === 'Events') return <EventsPage />
    if (screen === 'Messages') return <MessagesPage />
    if (screen === 'Alumni Map') return <AlumniMapPage />
    if (screen === 'My Profile') return <ProfilePage />
    if (screen === 'Notifications') return <NotificationsPage />
    if (screen === 'Admin overview' || screen === 'Verification queue' || screen === 'Analytics') {
      return <AdminDashboardPage analyticsOnly={screen === 'Analytics'} />
    }
    return <DashboardPage navigate={navigate} />
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-4 shadow-sm transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static`}
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
                  <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                    3
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

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

        <div className="mt-auto space-y-4 border-t border-slate-200 pt-4">
          <button
            onClick={() => navigate('My Profile')}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-slate-100"
          >
            <img
              src="https://i.pravatar.cc/80?img=32"
              alt="Ananya Verma"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span>
              <span className="block text-sm font-semibold text-slate-900">Ananya Verma</span>
              <span className="block text-xs text-slate-500">Alumni · 2020</span>
            </span>
          </button>

          <button
            onClick={onSignOut}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:text-red-600"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-0">
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
              <p className="text-xs text-slate-500">Tuesday, 16 June 2026</p>
              <p className="text-sm font-semibold text-slate-900">{screen}</p>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                <span>⌕</span>
                <input
                  className="w-40 border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  placeholder="Search the platform"
                />
              </div>
              <button className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-700">
                <Bell size={18} />
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
              </button>
              <button
                onClick={() => navigate('My Profile')}
                className="overflow-hidden rounded-full border border-slate-200 bg-white p-1"
              >
                <img
                  src="https://i.pravatar.cc/80?img=32"
                  alt="Ananya Verma"
                  className="h-9 w-9 rounded-full object-cover"
                />
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
