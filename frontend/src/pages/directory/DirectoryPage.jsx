import { useEffect, useState } from 'react'
import { ArrowRight, MapPin, MoreHorizontal, Search, Settings } from 'lucide-react'
import { api } from '../../services/api'
import { Filter, PageTitle } from '../../components/Ui'

function DirectoryPage({ findMode = false, navigate }) {
  const [query, setQuery] = useState('')
  const [alumni, setAlumni] = useState([])
  const [status, setStatus] = useState('Loading alumni...')

  useEffect(() => {
    api
      .getAlumni(query ? `?search=${encodeURIComponent(query)}` : '')
      .then((result) => {
        setAlumni(result.alumni)
        setStatus('')
      })
      .catch((error) => setStatus(error.message))
  }, [query])

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow={findMode ? 'Find your people' : 'Alumni network'}
        title={findMode ? 'Find an alumni connection' : 'Alumni Directory'}
        text="Search verified alumni by experience, location, and shared interests."
      />

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, company, role or skill"
            className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 shadow-sm hover:border-blue-200 hover:text-blue-600">
          <Settings size={16} />
          Filters
          <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">6</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Filter label="Batch" value="All batches" />
        <Filter label="Department" value="All departments" />
        <Filter label="Location" value="All locations" />
        <Filter label="Industry" value="All industries" />
      </div>

      {status && <p className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">{status}</p>}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>
          <span className="font-semibold text-slate-900">{alumni.length}</span> alumni found
        </p>
        <p>
          Sort by: <span className="font-semibold text-slate-900">Most relevant</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {alumni.map((person) => (
          <article key={person._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <img
                src={person.image || 'https://i.pravatar.cc/160?img=47'}
                alt={person.name}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Verified
                </span>
                <button className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">{person.name}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {person.title || 'Alumni member'} at <span className="font-semibold text-slate-900">{person.company || 'Community'}</span>
            </p>

            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <MapPin size={13} className="text-slate-400" />
              <span>
                {person.location || 'Location not added'} · Class of {person.batch || '—'}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(person.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={() => navigate('My Profile')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View profile
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => api.connect(person._id)}
                className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
              >
                Connect
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default DirectoryPage
