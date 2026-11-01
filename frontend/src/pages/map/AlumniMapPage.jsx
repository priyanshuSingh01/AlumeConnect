import { useEffect, useState } from 'react'
import { ArrowRight, Building2, Globe2, MapPin, Users } from 'lucide-react'
import { api } from '../../services/api'
import { Button, PageTitle } from '../../components/Ui'

function AlumniMapPage({ navigate }) {
  const [network, setNetwork] = useState(null)
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('Loading community locations...')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.getAlumniLocations()
      .then((result) => {
        if (!active) return
        setNetwork(result)
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

  const locations = network?.locations || []
  const selected = locations.find((item) => item._id === location)
  const exploreLocation = () => {
    navigate('Find Alumni', selected?._id || '')
  }

  return (
    <div className="space-y-6">
      <PageTitle eyebrow="See your network" title="Alumni Map" text="Explore where verified alumni and complete student profiles are based." />
      {status && <p role="status" className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">{status}</p>}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div><h2 className="text-xl font-semibold text-slate-900">Community by location</h2><p className="mt-1 text-sm text-slate-500">Top locations from member profiles</p></div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{locations.length} locations</span>
          </div>
          {locations.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {locations.map((item, index) => {
                const maxCount = locations[0]?.count || 1
                const percentage = Math.max(8, Math.round((item.count / maxCount) * 100))
                return (
                  <button key={item._id} type="button" onClick={() => setLocation(item._id)} aria-pressed={location === item._id} className={`rounded-2xl border p-4 text-left transition ${location === item._id ? 'border-blue-300 bg-blue-50' : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'}`}>
                    <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 font-semibold text-slate-900"><MapPin size={15} className="text-blue-600" />{item._id}</span><span className="text-xs font-bold text-slate-500">#{index + 1}</span></div>
                    <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{item.count.toLocaleString()}</p>
                    <p className="mt-0.5 text-xs text-slate-500">community profiles</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200"><span className="block h-full rounded-full bg-blue-600" style={{ width: `${percentage}%` }} /></div>
                  </button>
                )
              })}
            </div>
          ) : !status && !error ? (
            <div className="rounded-xl bg-slate-50 px-4 py-10 text-center"><MapPin className="mx-auto text-slate-400" size={24} /><p className="mt-3 font-semibold text-slate-800">No locations added yet</p><p className="mt-1 text-sm text-slate-500">Member locations will appear here as profiles are completed.</p></div>
          ) : null}
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">{selected?._id || 'Network snapshot'}</p>
          <p className="mt-4 text-4xl font-bold tracking-[-0.06em] text-slate-900">{(selected?.count ?? network?.totalProfiles ?? 0).toLocaleString()}</p>
          <p className="mt-2 text-sm text-slate-500">{selected ? 'profiles in this location' : 'community profiles'}</p>
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Globe2 size={17} /></span><div><p className="text-lg font-bold text-slate-900">{network?.totalLocations ?? '—'}</p><p className="text-xs text-slate-500">locations listed</p></div></div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Building2 size={17} /></span><div><p className="text-lg font-bold text-slate-900">{network?.totalCompanies ?? '—'}</p><p className="text-xs text-slate-500">companies represented</p></div></div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Users size={17} /></span><div><p className="text-lg font-bold text-slate-900">{locations.length}</p><p className="text-xs text-slate-500">top locations shown</p></div></div>
          </div>
          <Button className="mt-6 w-full" disabled={!network} onClick={exploreLocation}>{selected ? `Find people in ${selected._id}` : 'Explore directory'}<ArrowRight size={15} /></Button>
          <p className="mt-2 text-xs text-slate-400">Counts reflect verified alumni and members with complete profiles.</p>
        </aside>
      </div>
    </div>
  )
}

export default AlumniMapPage
