import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, Check, UserRound } from 'lucide-react'
import { api } from '../../services/api'
import { PageTitle } from '../../components/Ui'

function EventsPage() {
  const [events, setEvents] = useState([])
  const [registered, setRegistered] = useState([])
  const [status, setStatus] = useState('Loading events...')

  useEffect(() => {
    api
      .getEvents()
      .then((result) => {
        setEvents(result.events)
        setStatus('')
      })
      .catch((error) => setStatus(error.message))
  }, [])

  const register = async (id) => {
    await api.registerEvent(id)
    setRegistered((current) => [...current, id])
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Stay involved"
        title="Events & gatherings"
        text="Make time for conversations that become the stories you keep."
      />

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {['All events', 'Meetups', 'Reunions', 'Career events'].map((tab, index) => (
          <button
            key={tab}
            className={`rounded-full px-3 py-2 text-xs font-semibold ${
              index === 0
                ? 'bg-blue-50 text-blue-700'
                : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {status && <p className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">{status}</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => {
          const date = new Date(event.date)
          const month = date.toLocaleDateString('en', { month: 'short' }).toUpperCase()
          const day = date.getDate()
          const formattedDate = date.toLocaleString()

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
                    onClick={() => register(event._id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                      registered.includes(event._id)
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {registered.includes(event._id) ? (
                      <>
                        <Check size={14} />
                        Registered
                      </>
                    ) : (
                      <>
                        Register
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
    </div>
  )
}

export default EventsPage
