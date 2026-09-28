import { ArrowRight, HeartHandshake, MapPin, Zap } from 'lucide-react'
import { people } from '../../data/platformData'
import { Button, PageTitle } from '../../components/Ui'

function MentorshipPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Give and get guidance"
        title="Find a Mentor"
        text="Build a relationship with someone who has already walked the path you are on."
      >
        <Button icon={HeartHandshake}>Become a mentor</Button>
      </PageTitle>

      <div className="rounded-[28px] border border-blue-100 bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white shadow-[0_20px_60px_rgba(37,99,235,0.25)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <HeartHandshake size={22} />
            </div>
            <div>
              <p className="text-lg font-semibold">Want to give back?</p>
              <p className="mt-1 text-sm text-blue-100">
                Share your experience and help the next generation move with confidence.
              </p>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">
            Learn about mentoring
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>
          <span className="font-semibold text-slate-900">1,284</span> mentors available
        </p>
        <p>
          Sort by: <span className="font-semibold text-slate-900">Best match</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {people.map((person, index) => (
          <article key={person.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <img src={person.image} alt={person.name} className="h-14 w-14 rounded-full object-cover" />
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {index === 1 ? '2 slots left' : 'Available'}
              </span>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">{person.name}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {person.title} at <span className="font-semibold text-slate-900">{person.company}</span>
            </p>

            <div className="mt-4 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Zap size={13} className="text-blue-600" />
                <span>{index + 4}+ years</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-blue-600" />
                <span>{person.location}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {person.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>

            <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              Request mentorship
              <ArrowRight size={14} />
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

export default MentorshipPage
