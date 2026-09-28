import { ArrowRight, BriefcaseBusiness, CalendarDays, HeartHandshake, Menu, Network, Sparkles, Users } from 'lucide-react'
import Brand from '../../components/Brand'
import { people } from '../../data/platformData'

const benefits = [
  {
    icon: Network,
    title: 'Alumni directory',
    text: 'Search verified alumni by role, company, interests, and location to find the right connection faster.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Career opportunities',
    text: 'Get access to roles, internships, and referrals shared directly by alumni across industries.',
  },
  {
    icon: CalendarDays,
    title: 'Events and reunions',
    text: 'Stay in the loop with networking sessions, community meetups, and milestone reunions.',
  },
  {
    icon: HeartHandshake,
    title: 'Mentorship pathways',
    text: 'Connect with mentors who understand your journey and can help you navigate the next step.',
  },
]

const highlightCards = [
  {
    name: 'Priya Sharma',
    role: 'Product Designer',
    company: 'Atlassian',
    location: 'Bengaluru',
    image: people[0].image,
    skills: ['Figma', 'Design systems'],
  },
  {
    name: 'Rahul Menon',
    role: 'Software Engineer',
    company: 'Microsoft',
    location: 'Hyderabad',
    image: people[1].image,
    skills: ['React', 'Cloud'],
  },
  {
    name: 'Aarav Kapoor',
    role: 'Growth Manager',
    company: 'Razorpay',
    location: 'Mumbai',
    image: people[2].image,
    skills: ['Strategy', 'Marketing'],
  },
]

function BenefitCard({ icon: Icon, title, text }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={20} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  )
}

function FeatureCard({ item }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={item.image}
            alt={item.name}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
            <p className="mt-1 text-xs text-slate-500">{item.role}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Available
        </span>
      </div>

      <div className="mt-5 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-900">Company:</span> {item.company}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Location:</span> {item.location}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>

      <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
        View profile
        <ArrowRight size={15} />
      </button>
    </article>
  )
}

function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-8">
        <Brand />

        <nav className="hidden items-center gap-8 md:flex">
          <button
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Platform
          </button>
          <button
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Community
          </button>
          <button
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            onClick={onStart}
          >
            For administrators
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            className="hidden text-sm font-medium text-slate-600 transition hover:text-blue-600 sm:inline-flex"
            onClick={onStart}
          >
            Sign in
          </button>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Join network
            <ArrowRight size={16} />
          </button>
          <button className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-700 md:hidden">
            <Menu size={18} />
          </button>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-10 md:px-8 lg:grid-cols-2 lg:pb-24 lg:pt-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              <Sparkles size={14} />
              Centralized alumni intelligence
            </div>

            <h1 className="mt-6 text-5xl font-bold leading-none tracking-[-0.06em] text-slate-900 md:text-6xl">
              Connect. Network.
              <span className="block text-blue-600">Grow together.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
              One trusted platform for alumni, students, and the people who help a community move forward.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onStart}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Search alumni
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-blue-600"
              >
                Explore the platform
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {people.map((person) => (
                  <img
                    key={person.name}
                    src={person.image}
                    alt={person.name}
                    className="h-9 w-9 rounded-full border-2 border-slate-50 object-cover shadow-sm"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">12,400+</span> alumni already connected
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-7 rounded-[35%] bg-blue-100 blur-3xl" />
            <div className="relative rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(37,99,235,0.12)]">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                Live alumni network
              </div>

              <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 bg-[linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:32px_32px] p-4">
                <div className="absolute left-[18%] top-[33%] h-px w-[35%] rotate-[16deg] bg-blue-200" />
                <div className="absolute left-[26%] top-[52%] h-px w-[25%] rotate-[-24deg] bg-blue-200" />
                <div className="absolute left-[49%] top-[62%] h-px w-[22%] rotate-[20deg] bg-blue-200" />

                <div className="absolute left-[55%] top-[16%] flex flex-col items-center">
                  <img src={people[0].image} alt={people[0].name} className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-md" />
                  <span className="mt-2 text-sm font-semibold text-slate-700">Priya</span>
                </div>

                <div className="absolute left-[14%] top-[42%] flex flex-col items-center">
                  <img src={people[1].image} alt={people[1].name} className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-md" />
                  <span className="mt-2 text-sm font-semibold text-slate-700">Rahul</span>
                </div>

                <div className="absolute left-[59%] top-[63%] flex flex-col items-center">
                  <img src={people[2].image} alt={people[2].name} className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-md" />
                  <span className="mt-2 text-sm font-semibold text-slate-700">Aarav</span>
                </div>

                <div className="absolute left-[30%] top-[71%] flex flex-col items-center">
                  <img src={people[3].image} alt={people[3].name} className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-md" />
                  <span className="mt-2 text-sm font-semibold text-slate-700">Meera</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-200 pt-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-slate-900">84%</p>
                  <p className="mt-1 text-xs text-slate-500">Profile coverage</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">48</p>
                  <p className="mt-1 text-xs text-slate-500">Countries reached</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">1,280</p>
                  <p className="mt-1 text-xs text-slate-500">Open connections</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-y border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 md:px-8">
            <span>Microsoft</span>
            <span>Google</span>
            <span>Atlassian</span>
            <span>Razorpay</span>
            <span>Deloitte</span>
          </div>
        </div>

        <section id="benefits" className="mx-auto max-w-6xl px-6 py-20 md:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Platform</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] text-slate-900">
                Everything your alumni network needs.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Create a stronger community through career support, trusted introductions, and meaningful engagement.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((item) => (
              <BenefitCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section id="featured" className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Community</p>
                <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] text-slate-900">
                  Meet people already helping others grow.
                </h2>
              </div>
              <button
                onClick={onStart}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                See more profiles
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {highlightCards.map((item) => (
                <FeatureCard key={item.name} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20 md:px-8">
          <div className="rounded-[32px] bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-10 text-white shadow-[0_25px_70px_rgba(37,99,235,0.35)] md:px-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">Ready to begin?</p>
                <h2 className="mt-3 text-3xl font-bold tracking-[-0.06em] md:text-4xl">
                  Build your next chapter with the people who know the path.
                </h2>
              </div>
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Join the network
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LandingPage
