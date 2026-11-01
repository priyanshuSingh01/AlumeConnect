import { useEffect, useState } from 'react'
import { BriefcaseBusiness, ChevronRight, HeartHandshake, Users } from 'lucide-react'
import { api } from '../../services/api'
import { Button, PageTitle, Panel, StatCard } from '../../components/Ui'

function UpcomingEventsPanel({ events, loading, navigate }) {
  return (
    <Panel title="Upcoming events" action="View all" onAction={() => navigate('Events')}>
      {loading ? <p className="py-6 text-sm text-slate-500">Loading events...</p> : events.length ? (
        <div className="space-y-3">
          {events.slice(0, 3).map((event) => (
            <div key={event._id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <span className="text-[9px] font-bold uppercase">{new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">{event.title}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{new Date(event.date).toLocaleString()} · {event.location || event.type}</p>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>
          ))}
        </div>
      ) : <p className="py-6 text-sm text-slate-500">No upcoming events. Check back soon.</p>}
    </Panel>
  )
}

function DashboardPage({ navigate, user }) {
  const [suggestedPeople, setSuggestedPeople] = useState([])
  const [connections, setConnections] = useState({})
  const [suggestionStatus, setSuggestionStatus] = useState('Loading community members...')
  const [connectionError, setConnectionError] = useState('')
  const [connectingId, setConnectingId] = useState('')
  const [snapshot, setSnapshot] = useState({ profiles: null, mentors: null, jobs: null, events: null })
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [overviewError, setOverviewError] = useState('')

  useEffect(() => {
    let active = true
    const currentUserId = user?.id || user?._id

    Promise.allSettled([
      api.getAlumni(),
      api.getConnections(),
      api.getMentors(),
      api.getJobs(),
      api.getEvents(),
    ]).then(([peopleResult, connectionResult, mentorResult, jobsResult, eventsResult]) => {
      if (!active) return
      const failures = []
      if (peopleResult.status === 'fulfilled') {
        const { alumni = [], count } = peopleResult.value
        setSuggestedPeople(alumni.filter((person) => (
          person?.name &&
          person.name !== user?.name &&
          (person._id || person.id) !== currentUserId &&
          person.email !== user?.email
        )).slice(0, 4))
        setSuggestionStatus('')
        setSnapshot((current) => ({ ...current, profiles: count }))
      } else {
        setSuggestionStatus(peopleResult.reason.message)
        failures.push(peopleResult.reason.message)
      }

      if (connectionResult.status === 'fulfilled') {
        setConnections(Object.fromEntries(connectionResult.value.connections.map(({ recipientId, status }) => [recipientId, status])))
      } else {
        failures.push(connectionResult.reason.message)
      }

      if (mentorResult.status === 'fulfilled') setSnapshot((current) => ({ ...current, mentors: mentorResult.value.count }))
      else failures.push(mentorResult.reason.message)

      if (jobsResult.status === 'fulfilled') setSnapshot((current) => ({ ...current, jobs: jobsResult.value.count }))
      else failures.push(jobsResult.reason.message)

      if (eventsResult.status === 'fulfilled') {
        setEvents(eventsResult.value.events)
        setEventsLoading(false)
        setSnapshot((current) => ({ ...current, events: eventsResult.value.events.length }))
      } else {
        setEventsLoading(false)
        failures.push(eventsResult.reason.message)
      }
      setOverviewError(failures[0] || '')
    })

    return () => {
      active = false
    }
  }, [user?.id, user?._id, user?.email, user?.name])

  const displayName = user?.name?.trim() || 'there'
  const firstName = displayName.split(/\s+/)[0] || displayName
  const isStudent = user?.role === 'student'

  const sendConnection = async (personId) => {
    setConnectingId(personId)
    setConnectionError('')
    try {
      const result = await api.connect(personId)
      setConnections((current) => ({ ...current, [personId]: result.status }))
    } catch (error) {
      setConnectionError(error.message)
    } finally {
      setConnectingId('')
    }
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow={isStudent ? 'Student career hub' : 'Alumni network'}
        title={`${isStudent ? 'Welcome back' : 'Good morning'}, ${firstName}`}
        text={isStudent
          ? 'Find alumni mentors, discover opportunities, and grow your professional network.'
          : 'Reconnect with your community, share your experience, and meet the next generation.'}
      >
        <Button variant="secondary" onClick={() => navigate(isStudent ? 'Find Alumni' : 'Alumni Directory')}>
          {isStudent ? 'Find alumni' : 'Explore directory'}
          <ChevronRight size={15} />
        </Button>
      </PageTitle>

      {isStudent ? (
        <section className="rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 p-6 text-white shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200">Your next step starts here</p>
          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Learn from people who have been there.</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">Connect with alumni, ask for career guidance, and explore opportunities shared by your community.</p>
            </div>
            <Button className="bg-white text-indigo-700 hover:bg-indigo-50" onClick={() => navigate('Mentorship')}>
              <HeartHandshake size={16} />
              Explore mentorship
            </Button>
          </div>
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} label="Directory profiles" value={snapshot.profiles ?? '—'} change="Verified and complete profiles" />
          <StatCard icon={HeartHandshake} label="Available mentors" value={snapshot.mentors ?? '—'} change="Ready to share guidance" tone="green" />
          <StatCard icon={BriefcaseBusiness} label="Open opportunities" value={snapshot.jobs ?? '—'} change="Shared by your community" tone="orange" />
          <StatCard icon={ChevronRight} label="Upcoming events" value={snapshot.events ?? '—'} change="Gatherings and career events" tone="purple" />
        </div>
      )}

      {overviewError && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">Some dashboard information could not be loaded: {overviewError}</p>}

      {!isStudent && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Your community">
            <p className="text-sm leading-6 text-slate-600">Connect with people who share your background, discover opportunities, and help students move forward.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => navigate('Alumni Directory')}>Browse directory</Button>
              <Button variant="light" onClick={() => navigate('Mentorship')}>Explore mentorship</Button>
            </div>
          </Panel>
          <UpcomingEventsPanel events={events} loading={eventsLoading} navigate={navigate} />
        </div>
      )}

      <div className={`grid gap-4 ${isStudent ? 'lg:grid-cols-2' : ''}`}>
        {isStudent && <UpcomingEventsPanel events={events} loading={eventsLoading} navigate={navigate} />}
        <Panel title={isStudent ? 'Alumni to connect with' : 'New people in your network'} action="View all" onAction={() => navigate(isStudent ? 'Find Alumni' : 'Alumni Directory')}>
          <div className="space-y-3">
            {suggestionStatus && <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">{suggestionStatus}</p>}
            {suggestedPeople.map((person) => (
              <div key={person._id || person.name} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <div className="flex items-center gap-3">
                  {person.image
                    ? <img src={person.image} alt={person.name} className="h-11 w-11 rounded-full object-cover" />
                    : <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{person.name?.[0]}</span>}
                  <div>
                    <p className="font-semibold text-slate-900">{person.name}</p>
                    <p className="text-xs text-slate-500">{person.title || (person.role === 'student' ? 'Student' : 'Alumni member')} · {person.role}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => sendConnection(person._id || person.id)}
                  disabled={['pending', 'accepted'].includes(connections[person._id || person.id]) || connectingId === (person._id || person.id)}
                  className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {connectingId === (person._id || person.id)
                    ? 'Sending...'
                    : connections[person._id || person.id] === 'accepted'
                      ? 'Connected'
                      : connections[person._id || person.id] === 'pending'
                        ? 'Requested'
                        : 'Connect'}
                </button>
              </div>
            ))}
            {!suggestionStatus && suggestedPeople.length === 0 && (
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No other community profiles are available yet. Check back soon.</p>
            )}
            {connectionError && <p role="alert" className="text-sm text-red-600">{connectionError}</p>}
          </div>
        </Panel>

        <Panel title="Quick actions">
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => navigate('Find Alumni')} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left hover:border-blue-200 hover:bg-blue-50">
              <p className="text-sm font-semibold text-slate-900">Find alumni</p><p className="mt-1 text-xs text-slate-500">Search by company, skill, or location.</p>
            </button>
            <button type="button" onClick={() => navigate('Jobs & Internships')} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left hover:border-blue-200 hover:bg-blue-50">
              <p className="text-sm font-semibold text-slate-900">Explore opportunities</p><p className="mt-1 text-xs text-slate-500">Discover roles shared by your network.</p>
            </button>
            <button type="button" onClick={() => navigate('Events')} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left hover:border-blue-200 hover:bg-blue-50">
              <p className="text-sm font-semibold text-slate-900">Explore events</p><p className="mt-1 text-xs text-slate-500">Meet people at an upcoming gathering.</p>
            </button>
            <button type="button" onClick={() => navigate('Mentorship')} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left hover:border-blue-200 hover:bg-blue-50">
              <p className="text-sm font-semibold text-slate-900">Mentorship</p><p className="mt-1 text-xs text-slate-500">Find or offer career guidance.</p>
            </button>
          </div>
        </Panel>
      </div>
    </div>
  )
}

export default DashboardPage
