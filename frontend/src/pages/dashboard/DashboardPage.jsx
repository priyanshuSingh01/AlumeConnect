import { useEffect, useState } from 'react'
import { BriefcaseBusiness, ChevronRight, HeartHandshake, TrendingUp, Users, Zap } from 'lucide-react'
import { events, people } from '../../data/platformData'
import { api } from '../../services/api'
import { Button, PageTitle, Panel, StatCard } from '../../components/Ui'

function DashboardPage({ navigate, user }) {
  const fallbackSuggestions = people.filter((person) => person.name !== user?.name).slice(0, 4)
  const [suggestedPeople, setSuggestedPeople] = useState(fallbackSuggestions)

  useEffect(() => {
    let active = true
    const currentUserId = user?.id || user?._id

    api.getAlumni()
      .then((result) => {
        if (!active) return
        const alumni = Array.isArray(result?.alumni) ? result.alumni : []
        const filtered = alumni.filter((person) => {
          const personId = person?._id || person?.id
          return (
            person?.name &&
            person.name !== user?.name &&
            personId !== currentUserId &&
            person.email !== user?.email
          )
        }).slice(0, 4)

        if (filtered.length > 0) {
          setSuggestedPeople(filtered)
          return
        }

        setSuggestedPeople(fallbackSuggestions)
      })
      .catch(() => {
        if (active) setSuggestedPeople(fallbackSuggestions)
      })

    return () => {
      active = false
    }
  }, [user?.id, user?._id, user?.email, user?.name])

  const displayName = user?.name?.trim() || 'there'
  const firstName = displayName.split(/\s+/)[0] || displayName

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Overview"
        title={`Good morning, ${firstName}`}
        text="Here is what is happening across your alumni community today."
      >
        <Button variant="secondary" onClick={() => navigate('Alumni Directory')}>
          Explore directory
          <ChevronRight size={15} />
        </Button>
      </PageTitle>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total alumni" value="12,480" change="+8.4% this year" />
        <StatCard icon={Zap} label="Active alumni" value="8,936" change="+12.6% this month" tone="purple" />
        <StatCard icon={HeartHandshake} label="Available mentors" value="1,284" change="+94 this month" tone="green" />
        <StatCard icon={BriefcaseBusiness} label="Open opportunities" value="246" change="+18 new this week" tone="orange" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <Panel title="Alumni growth" action="View analytics">
          <div className="mb-4 flex items-end justify-between gap-4">
            <p className="text-3xl font-bold tracking-[-0.06em] text-slate-900">12,480</p>
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
              <TrendingUp size={14} />
              8.4%
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex w-10 flex-col justify-between py-2 text-[10px] text-slate-400">
              <span>15k</span>
              <span>10k</span>
              <span>5k</span>
              <span>0</span>
            </div>

            <div className="flex-1">
              <svg viewBox="0 0 700 220" className="h-52 w-full" preserveAspectRatio="none">
                <path
                  d="M0,190 C70,177 70,168 128,172 S190,132 240,145 S300,120 350,130 S420,95 470,105 S520,70 570,82 S640,44 700,48 L700,220 L0,220Z"
                  fill="#eaf1ff"
                />
                <path
                  d="M0,190 C70,177 70,168 128,172 S190,132 240,145 S300,120 350,130 S420,95 470,105 S520,70 570,82 S640,44 700,48"
                  fill="none"
                  stroke="#3976da"
                  strokeWidth="3"
                />
              </svg>
              <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Upcoming events" action="View all">
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.title}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <div className={`flex h-12 w-12 flex-col items-center justify-center rounded-xl ${event.color === 'blue' ? 'bg-blue-100 text-blue-700' : event.color === 'orange' ? 'bg-amber-100 text-amber-700' : event.color === 'green' ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'}`}>
                  <span className="text-[9px] font-bold uppercase">{event.month}</span>
                  <span className="text-lg font-bold">{event.date}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{event.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{event.meta}</p>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="New connections" action="View all">
          <div className="space-y-3">
            {suggestedPeople.map((person) => (
              <div key={person._id || person.name} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <div className="flex items-center gap-3">
                  <img src={person.image || 'https://i.pravatar.cc/160?img=47'} alt={person.name} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-slate-900">{person.name}</p>
                    <p className="text-xs text-slate-500">{person.title || 'Alumni member'}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const personId = person._id || person.id
                    if (personId) api.connect(personId)
                  }}
                  className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Quick actions" action="Manage">
          <div className="grid gap-3 sm:grid-cols-2">
            <button className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
              <p className="text-sm font-semibold text-slate-900">Find alumni</p>
              <p className="mt-1 text-xs text-slate-500">Search by company, skill, or location.</p>
            </button>
            <button className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
              <p className="text-sm font-semibold text-slate-900">Post a role</p>
              <p className="mt-1 text-xs text-slate-500">Share opportunities with your network.</p>
            </button>
            <button className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
              <p className="text-sm font-semibold text-slate-900">Host an event</p>
              <p className="mt-1 text-xs text-slate-500">Create a meetup or reunion for your community.</p>
            </button>
            <button className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
              <p className="text-sm font-semibold text-slate-900">Mentor someone</p>
              <p className="mt-1 text-xs text-slate-500">Offer guidance to the next generation.</p>
            </button>
          </div>
        </Panel>
      </div>
    </div>
  )
}

export default DashboardPage
