import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, Check, Plus, UserRound, X } from 'lucide-react'
import { api } from '../../services/api'
import { Button, PageTitle } from '../../components/Ui'

const eventTabs = [
  { label: 'All events', types: [] },
  { label: 'Meetups', types: ['community'] },
  { label: 'Reunions', types: ['reunion'] },
  { label: 'Career events', types: ['career', 'webinar'] },
]

function EventsPage({ user }) {
  const [events, setEvents] = useState([])
  const [activeTab, setActiveTab] = useState('All events')
  const [status, setStatus] = useState('Loading events...')
  const [error, setError] = useState('')
  const [registeringId, setRegisteringId] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ title: '', type: 'community', date: '', location: '', description: '' })
  const isOrganizer = user?.role === 'alumni' || user?.role === 'admin'

  useEffect(() => {
    let active = true
    api
      .getEvents()
      .then((result) => {
        if (!active) return
        setEvents(result.events)
        setStatus('')
      })
      .catch((loadError) => {
        if (active) {
          setStatus('')
          setError(loadError.message)
        }
      })
    return () => {
      active = false
    }
  }, [])

  const register = async (id) => {
    setRegisteringId(id)
    setError('')
    try {
      const { event } = await api.registerEvent(id)
      setEvents((current) => current.map((item) => item._id === event._id ? event : item))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setRegisteringId('')
    }
  }

  const visibleEvents = useMemo(() => {
    const types = eventTabs.find((tab) => tab.label === activeTab)?.types || []
    return events.filter((event) => types.length === 0 || types.includes(event.type))
  }, [activeTab, events])

  const createEvent = async (event) => {
    event.preventDefault()
    setCreating(true)
    setFormError('')
    try {
      const created = await api.createEvent(form)
      const eventWithHost = { ...created, createdBy: { _id: user?.id || user?._id, name: user?.name } }
      setEvents((current) => [...current, eventWithHost].sort((a, b) => new Date(a.date) - new Date(b.date)))
      setActiveTab('All events')
      setShowCreateForm(false)
      setForm({ title: '', type: 'community', date: '', location: '', description: '' })
    } catch (createError) {
      setFormError(createError.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Stay involved"
        title="Events & gatherings"
        text="Make time for conversations that become the stories you keep."
      >
        {isOrganizer && <Button onClick={() => { setShowCreateForm(true); setFormError('') }}><Plus size={16} /> Host an event</Button>}
      </PageTitle>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {eventTabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(tab.label)}
            aria-pressed={activeTab === tab.label}
            className={`rounded-full px-3 py-2 text-xs font-semibold ${
              activeTab === tab.label
                ? 'bg-blue-50 text-blue-700'
                : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {status && <p role="status" className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">{status}</p>}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleEvents.map((event) => {
          const date = new Date(event.date)
          const month = date.toLocaleDateString('en', { month: 'short' }).toUpperCase()
          const day = date.getDate()
          const formattedDate = date.toLocaleString()
          const isRegistered = event.attendees?.some((attendee) => (attendee?._id || attendee)?.toString() === (user?.id || user?._id))

          return (
            <article key={event._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-36 bg-gradient-to-br from-blue-100 via-blue-50 to-slate-100 p-4">
                <div className="absolute right-4 top-4 rounded-lg bg-white/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                  {event.type}
                </div>
                <div className="inline-flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-white/80 text-slate-700 shadow-sm">
                  <span className="text-[9px] font-bold uppercase">{month}</span>
                  <span className="text-2xl font-bold leading-none">{day}</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>

                <div className="mt-3 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-blue-600" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserRound size={14} className="text-blue-600" />
                    <span>Hosted by {event.speaker || event.createdBy?.name || 'Alumni Relations'}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
                  <span className="text-sm text-slate-600">{event.attendees?.length || 0} going</span>
                  <button
                    type="button"
                    onClick={() => register(event._id)}
                    disabled={isRegistered || registeringId === event._id}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 ${
                      isRegistered
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <Check size={14} />
                        Registered
                      </>
                    ) : (
                      <>
                        {registeringId === event._id ? 'Registering...' : 'Register'}
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      {!status && !error && visibleEvents.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <CalendarDays className="mx-auto text-slate-400" size={26} />
          <h3 className="mt-3 font-semibold text-slate-900">No events in this category</h3>
          <p className="mt-1 text-sm text-slate-500">Choose another category or check back later.</p>
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !creating) setShowCreateForm(false)
        }}>
          <form onSubmit={createEvent} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Community event</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">Host an event</h2>
                <p className="mt-1 text-sm text-slate-500">Share a gathering with your alumni community.</p>
              </div>
              <button type="button" aria-label="Close event form" onClick={() => setShowCreateForm(false)} disabled={creating} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold text-slate-700">Event name</span>
                <input required maxLength={120} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-300 focus:bg-white" />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-semibold text-slate-700">Category</span>
                <select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none">
                  <option value="community">Meetup</option><option value="reunion">Reunion</option><option value="webinar">Webinar</option><option value="career">Career event</option>
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-semibold text-slate-700">Date and time</span>
                <input required type="datetime-local" min={new Date().toISOString().slice(0, 16)} value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold text-slate-700">Location or meeting link</span>
                <input maxLength={160} value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-300 focus:bg-white" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold text-slate-700">Description</span>
                <textarea maxLength={1000} rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-300 focus:bg-white" />
              </label>
            </div>
            {formError && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" disabled={creating} onClick={() => setShowCreateForm(false)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <Button type="submit" disabled={creating}>{creating ? 'Publishing...' : 'Publish event'}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default EventsPage
