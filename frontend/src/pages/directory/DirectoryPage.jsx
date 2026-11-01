import { useEffect, useState } from 'react'
import { ArrowRight, MapPin, Search, X } from 'lucide-react'
import { api } from '../../services/api'
import { PageTitle } from '../../components/Ui'

function DirectoryPage({ findMode = false, navigate, user, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [filters, setFilters] = useState({ batch: '', department: '', location: '', industry: '' })
  const [alumni, setAlumni] = useState([])
  const [status, setStatus] = useState('Loading community members...')
  const [connections, setConnections] = useState({})
  const [connectingId, setConnectingId] = useState('')
  const [connectionError, setConnectionError] = useState('')
  const [selectedProfile, setSelectedProfile] = useState(null)

  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      setStatus('Loading community members...')
      const searchParams = new URLSearchParams()
      if (query.trim()) searchParams.set('search', query.trim())
      for (const [key, value] of Object.entries(filters)) {
        if (value) searchParams.set(key, value)
      }
      const params = searchParams.size ? `?${searchParams.toString()}` : ''
      api
        .getAlumni(params)
        .then((result) => {
          if (!active) return
          setAlumni(result.alumni)
          setStatus('')
        })
        .catch((error) => {
          if (active) setStatus(error.message)
        })
    }, 250)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [filters, query])

  const options = {
    batch: [...new Set(alumni.map((person) => person.batch).filter(Boolean))].sort((a, b) => b - a),
    department: [...new Set(alumni.map((person) => person.department).filter(Boolean))].sort(),
    location: [...new Set(alumni.map((person) => person.location).filter(Boolean))].sort(),
    industry: [...new Set(alumni.map((person) => person.title).filter(Boolean))].sort(),
  }
  const activeFilterCount = Object.values(filters).filter(Boolean).length

  useEffect(() => {
    api
      .getConnections()
      .then(({ connections: sentConnections }) => {
        setConnections(Object.fromEntries(sentConnections.map(({ recipientId, status }) => [recipientId, status])))
      })
      .catch((error) => setConnectionError(error.message))
  }, [])

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

  const isStudent = user?.role === 'student'

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow={isStudent ? 'Student network' : 'Alumni network'}
        title={isStudent ? 'Meet your alumni community' : findMode ? 'Find your next connection' : 'Alumni & Student Directory'}
        text={isStudent
          ? 'Discover alumni, mentors, and peers by name, company, location, or skill.'
          : 'Find alumni and students by experience, location, and shared interests.'}
      />

      <div className={`rounded-2xl border p-4 ${isStudent ? 'border-violet-100 bg-violet-50' : 'border-blue-100 bg-blue-50'}`}>
        <p className={`text-sm font-semibold ${isStudent ? 'text-violet-900' : 'text-blue-900'}`}>
          {isStudent ? 'Build your career network' : 'Grow the community'}
        </p>
        <p className={`mt-1 text-xs ${isStudent ? 'text-violet-700' : 'text-blue-700'}`}>
          {isStudent
            ? 'Search real community profiles and reach out to alumni for guidance.'
            : 'Connect with fellow alumni and students looking to learn from your experience.'}
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, company, location or skill"
            aria-label="Search community members"
            className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        {activeFilterCount > 0 && <button type="button" onClick={() => setFilters({ batch: '', department: '', location: '', industry: '' })} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-blue-600">Clear {activeFilterCount} filter{activeFilterCount === 1 ? '' : 's'}</button>}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ['batch', 'Batch', 'All batches'],
          ['department', 'Department', 'All departments'],
          ['location', 'Location', 'All locations'],
          ['industry', 'Industry / role', 'All industries'],
        ].map(([key, label, placeholder]) => (
          <label key={key} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
            <span className="font-medium text-slate-500">{label}</span>
            <select value={filters[key]} onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))} aria-label={`Filter by ${label.toLowerCase()}`} className="max-w-40 bg-transparent font-semibold text-slate-800 outline-none">
              <option value="">{placeholder}</option>
              {options[key].map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        ))}
      </div>

      {status && <p role="status" className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">{status}</p>}
      {connectionError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{connectionError}</p>}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>
          <span className="font-semibold text-slate-900">{alumni.length}</span> people found
        </p>
        <p>
          Sort by: <span className="font-semibold text-slate-900">Most relevant</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {alumni.map((person) => (
          <article key={person._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              {person.image
                ? <img src={person.image} alt={person.name} className="h-14 w-14 rounded-full object-cover" />
                : <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">{person.name?.[0]}</span>}
              <div className="flex items-center gap-2">
                {person.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Verified
                  </span>
                )}
              </div>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">{person.name}</h3>
            <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold capitalize text-slate-600">{person.role}</span>
            <p className="mt-1 text-sm text-slate-600">
              {person.title || (person.role === 'student' ? 'Student' : 'Alumni member')} at <span className="font-semibold text-slate-900">{person.company || person.department || 'Community'}</span>
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
                onClick={() => setSelectedProfile(person)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View profile
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => sendConnection(person._id)}
                disabled={person._id === (user?.id || user?._id) || ['pending', 'accepted'].includes(connections[person._id]) || connectingId === person._id}
                className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {person._id === (user?.id || user?._id)
                  ? 'You'
                  : connectingId === person._id
                    ? 'Sending...'
                    : connections[person._id] === 'accepted'
                      ? 'Connected'
                      : connections[person._id] === 'pending'
                        ? 'Requested'
                        : 'Connect'}
              </button>
            </div>
          </article>
        ))}
      </div>
      {!status && alumni.length === 0 && (
        <p className="rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-500">
          No community members match this search yet. Try another name, company, or skill.
        </p>
      )}
      {selectedProfile && (
        <div role="dialog" aria-modal="true" aria-labelledby="profile-dialog-title" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedProfile(null)
        }}>
          <section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {selectedProfile.image
                  ? <img src={selectedProfile.image} alt="" className="h-14 w-14 rounded-full object-cover" />
                  : <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">{selectedProfile.name?.[0]}</span>}
                <div><h2 id="profile-dialog-title" className="text-xl font-bold text-slate-900">{selectedProfile.name}</h2><p className="text-sm capitalize text-slate-500">{selectedProfile.role}</p></div>
              </div>
              <button type="button" aria-label="Close profile" onClick={() => setSelectedProfile(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <p className="mt-4 text-sm text-slate-700">{[selectedProfile.title, selectedProfile.company].filter(Boolean).join(' at ') || selectedProfile.department || 'Community member'}</p>
            <p className="mt-2 text-sm text-slate-500">{[selectedProfile.location, selectedProfile.batch && `Class of ${selectedProfile.batch}`].filter(Boolean).join(' · ') || 'Location and graduation year not added'}</p>
            {selectedProfile.bio && <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">{selectedProfile.bio}</p>}
            {(selectedProfile.skills || []).length > 0 && <div className="mt-4 flex flex-wrap gap-2">{selectedProfile.skills.map((skill) => <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{skill}</span>)}</div>}
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => { setSelectedProfile(null); navigate('Messages', undefined, selectedProfile._id) }} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Message {selectedProfile.name?.split(/\s+/)[0]}</button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default DirectoryPage
