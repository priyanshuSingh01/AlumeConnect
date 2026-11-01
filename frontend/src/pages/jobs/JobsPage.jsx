import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BriefcaseBusiness, Bookmark, MapPin, Search, X } from 'lucide-react'
import { api } from '../../services/api'
import { Button, PageTitle, Panel } from '../../components/Ui'

const emptyJob = { title: '', company: '', location: '', type: 'full-time', salary: '', description: '', applicationUrl: '', skills: '' }

function readSavedJobs() {
  try {
    const saved = JSON.parse(localStorage.getItem('alumconnect_saved_jobs') || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function JobsPage({ user }) {
  const [jobs, setJobs] = useState([])
  const [query, setQuery] = useState('')
  const [jobType, setJobType] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [status, setStatus] = useState('Loading opportunities...')
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [savedJobs, setSavedJobs] = useState(readSavedJobs)
  const [appliedJobs, setAppliedJobs] = useState({})
  const [workingJob, setWorkingJob] = useState('')
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [showComposer, setShowComposer] = useState(false)
  const [form, setForm] = useState(emptyJob)
  const [formError, setFormError] = useState('')
  const [creating, setCreating] = useState(false)
  const isJobPoster = user?.role === 'alumni' || user?.role === 'admin'

  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      setStatus('Loading opportunities...')
      const params = new URLSearchParams()
      if (query.trim()) params.set('search', query.trim())
      if (jobType) params.set('type', jobType)
      if (locationQuery.trim()) params.set('location', locationQuery.trim())
      const suffix = params.size ? `?${params.toString()}` : ''
      api.getJobs(suffix)
        .then(({ jobs: result }) => {
          if (!active) return
          setJobs(result)
          setStatus('')
          setError('')
        })
        .catch((loadError) => {
          if (active) {
            setStatus('')
            setError(loadError.message)
          }
        })
    }, 250)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [query, jobType, locationQuery])

  const visibleJobs = useMemo(
    () => showSavedOnly ? jobs.filter((job) => savedJobs.includes(job._id)) : jobs,
    [jobs, savedJobs, showSavedOnly],
  )

  const toggleSaved = (jobId) => {
    setSavedJobs((current) => {
      const next = current.includes(jobId) ? current.filter((id) => id !== jobId) : [...current, jobId]
      localStorage.setItem('alumconnect_saved_jobs', JSON.stringify(next))
      return next
    })
  }

  const handleReferral = async (job) => {
    setWorkingJob(job._id)
    setError('')
    setFeedback('')
    try {
      const result = await api.referJob(job._id)
      setFeedback(result.message || `Referral interest sent for ${job.title}.`)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setWorkingJob('')
    }
  }

  const handleApply = async (job) => {
    setWorkingJob(job._id)
    setError('')
    setFeedback('')
    try {
      const result = await api.applyJob(job._id)
      setAppliedJobs((current) => ({ ...current, [job._id]: true }))
      setFeedback(result.message)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setWorkingJob('')
    }
  }

  const submitJob = async (event) => {
    event.preventDefault()
    setCreating(true)
    setFormError('')
    try {
      const job = await api.createJob({
        ...form,
        skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      })
      setJobs((current) => [job, ...current])
      setShowComposer(false)
      setForm(emptyJob)
      setFeedback('Your opportunity has been published.')
    } catch (createError) {
      setFormError(createError.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Make your next move"
        title="Jobs & Internships"
        text="Discover opportunities shared by your alumni community."
      >
        {isJobPoster && <Button onClick={() => { setShowComposer(true); setFormError('') }}><BriefcaseBusiness size={16} /> Post an opportunity</Button>}
      </PageTitle>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_220px]">
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <Search size={18} className="text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search roles, companies, or skills" aria-label="Search jobs" className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
        </label>
        <select value={jobType} onChange={(event) => setJobType(event.target.value)} aria-label="Filter by job type" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm">
          <option value="">All job types</option><option value="full-time">Full time</option><option value="part-time">Part time</option><option value="internship">Internship</option><option value="contract">Contract</option><option value="remote">Remote</option>
        </select>
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <MapPin size={16} className="text-slate-400" />
          <input value={locationQuery} onChange={(event) => setLocationQuery(event.target.value)} placeholder="Any location" aria-label="Filter by location" className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{status || `${visibleJobs.length} ${visibleJobs.length === 1 ? 'opportunity' : 'opportunities'}`}</p>
        <button type="button" aria-pressed={showSavedOnly} onClick={() => setShowSavedOnly((current) => !current)} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${showSavedOnly ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600'}`}>
          <Bookmark size={15} /> {showSavedOnly ? 'Showing saved' : `Saved jobs (${savedJobs.length})`}
        </button>
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {feedback && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{feedback}</p>}

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          {visibleJobs.map((job) => (
            <article key={job._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-base font-bold text-blue-700">{job.company?.[0] || 'J'}</div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                    <p className="mt-1 flex flex-wrap items-center gap-1 text-sm text-slate-500">
                      <span>{job.company}</span><span>·</span><MapPin size={13} className="text-slate-400" /><span>{job.location || 'Location not listed'}</span>
                    </p>
                    {job.description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{job.description}</p>}
                  </div>
                </div>
                <button type="button" aria-label={savedJobs.includes(job._id) ? 'Remove saved job' : 'Save job'} aria-pressed={savedJobs.includes(job._id)} onClick={() => toggleSaved(job._id)} className={`rounded-lg p-2 ${savedJobs.includes(job._id) ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}>
                  <Bookmark size={19} fill={savedJobs.includes(job._id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">{job.type?.replace('-', ' ') || 'Role'}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">{job.salary || 'Salary not listed'}</span>
                {(job.skills || []).map((skill) => <span key={skill} className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700">{skill}</span>)}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500">Posted by {job.postedBy?.name || (typeof job.postedBy === 'string' && job.postedBy === (user?.id || user?._id) ? user.name : 'community member')}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => handleReferral(job)} disabled={workingJob === job._id} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-600 disabled:opacity-60">
                    {workingJob === job._id ? 'Please wait...' : 'Refer someone'}
                  </button>
                  <button type="button" onClick={() => handleApply(job)} disabled={Boolean(appliedJobs[job._id]) || workingJob === job._id || (job.postedBy?._id || job.postedBy)?.toString() === (user?.id || user?._id)?.toString()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                    {(job.postedBy?._id || job.postedBy)?.toString() === (user?.id || user?._id)?.toString() ? 'Your post' : appliedJobs[job._id] ? 'Interest sent' : workingJob === job._id ? 'Sending...' : 'I’m interested'}
                    {!appliedJobs[job._id] && (job.postedBy?._id || job.postedBy)?.toString() !== (user?.id || user?._id)?.toString() && <ArrowRight size={14} />}
                  </button>
                  {job.applicationUrl && <a href={job.applicationUrl} target="_blank" rel="noreferrer" className="rounded-xl px-2 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">Apply externally</a>}
                </div>
              </div>
            </article>
          ))}
          {!status && !error && visibleJobs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
              <BriefcaseBusiness className="mx-auto text-slate-400" size={26} />
              <h3 className="mt-3 font-semibold text-slate-900">{showSavedOnly ? 'No saved jobs match these filters' : 'No opportunities match your search'}</h3>
              <p className="mt-1 text-sm text-slate-500">Try changing the search or filters, or check back later.</p>
            </div>
          )}
        </div>

        <aside>
          <Panel title="Career preferences">
            <p className="text-sm leading-6 text-slate-600">Use search and filters to find roles that fit your goals. Save opportunities to revisit them later.</p>
            <button type="button" onClick={() => { setQuery(''); setJobType(''); setLocationQuery(''); setShowSavedOnly(false) }} className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700">Clear all filters</button>
          </Panel>
        </aside>
      </div>

      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !creating) setShowComposer(false)
        }}>
          <form onSubmit={submitJob} className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Community opportunity</p><h2 className="mt-2 text-xl font-bold text-slate-900">Post a role</h2></div>
              <button type="button" aria-label="Close job form" onClick={() => setShowComposer(false)} disabled={creating} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Job title *</span><input required maxLength={120} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-300 focus:bg-white" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Company *</span><input required maxLength={120} value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-300 focus:bg-white" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Location</span><input maxLength={120} value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Employment type</span><select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"><option value="full-time">Full time</option><option value="part-time">Part time</option><option value="internship">Internship</option><option value="contract">Contract</option><option value="remote">Remote</option></select></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Compensation</span><input maxLength={80} value={form.salary} onChange={(event) => setForm((current) => ({ ...current, salary: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Application URL</span><input type="url" placeholder="https://" value={form.applicationUrl} onChange={(event) => setForm((current) => ({ ...current, applicationUrl: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none" /></label>
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Skills (comma separated)</span><input value={form.skills} onChange={(event) => setForm((current) => ({ ...current, skills: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none" /></label>
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Role description</span><textarea rows={4} maxLength={4000} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none" /></label>
            </div>
            {formError && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}
            <div className="mt-5 flex justify-end gap-2"><button type="button" disabled={creating} onClick={() => setShowComposer(false)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><Button type="submit" disabled={creating}>{creating ? 'Publishing...' : 'Publish opportunity'}</Button></div>
          </form>
        </div>
      )}
    </div>
  )
}

export default JobsPage
