import { useState } from 'react'
import { ArrowRight, Building2, Globe2 } from 'lucide-react'
import { PageTitle } from '../../components/Ui'

function AlumniMapPage() {
  const [location, setLocation] = useState('All locations')

  const cities = [
    { name: 'Delhi', count: '2,840', x: '52%', y: '31%' },
    { name: 'Bengaluru', count: '2,210', x: '47%', y: '72%' },
    { name: 'Mumbai', count: '1,940', x: '34%', y: '59%' },
    { name: 'Dubai', count: '620', x: '13%', y: '42%' },
  ]

  const selected = cities.find((city) => city.name === location)

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="See your network"
        title="Alumni Map"
        text="Explore where your alumni community is making an impact around the world."
      />

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-xl font-semibold text-slate-900">Alumni distribution</p>
            <p className="mt-1 text-sm text-slate-500">12,480 alumni across 48 countries</p>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_top,_#dbeafe_0%,_#eff6ff_25%,_#f8fafc_65%)]">
            <div className="absolute inset-0 opacity-70">
              <svg viewBox="0 0 800 420" className="h-full w-full" preserveAspectRatio="none">
                <path d="M75 170c28-38 77-69 132-71 44-1 82 19 123 42 32 18 62 34 86 40 39 10 91 1 149-26 52-25 104-23 169 13 33 18 63 47 84 69l-22 80-760 3c-14-77-12-118 39-150z" fill="#dfeaf9" />
              </svg>
            </div>

            {cities.map((city) => (
              <button
                key={city.name}
                onClick={() => setLocation(city.name)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-1 text-xs font-semibold shadow-sm ${
                  location === city.name
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
                style={{ left: city.x, top: city.y }}
              >
                <span>{city.name}</span>
                <span className="ml-2 font-bold">{city.count}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-600" />1,500+</span>
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-300" />500 - 1,500</span>
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-slate-300" />Under 500</span>
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
            {location === 'All locations' ? 'Network snapshot' : location}
          </p>
          <p className="mt-4 text-4xl font-bold tracking-[-0.06em] text-slate-900">
            {selected?.count || '12,480'}
          </p>
          <p className="mt-2 text-sm text-slate-500">alumni in this network</p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Globe2 size={17} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">48</p>
                <p className="text-xs text-slate-500">countries</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Building2 size={17} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">1,126</p>
                <p className="text-xs text-slate-500">companies</p>
              </div>
            </div>
          </div>

          <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-600">
            View alumni
            <ArrowRight size={15} />
          </button>
        </aside>
      </div>
    </div>
  )
}

export default AlumniMapPage
