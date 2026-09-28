import { useEffect, useState } from 'react'
import { BriefcaseBusiness, MapPin, Search } from 'lucide-react'
import { api } from '../../services/api'
import { Button, Filter, PageTitle, Panel } from '../../components/Ui'

function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Loading opportunities...')

  useEffect(() => {
    api
      .getJobs(query ? `?search=${encodeURIComponent(query)}` : '')
      .then((result) => {
        setJobs(result.jobs)
        setStatus('')
      })
      .catch((error) => setStatus(error.message))
  }, [query])

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Make your next move"
        title="Jobs & Internships"
        text="Discover opportunities shared by your alumni community."
      >
        <Button icon={BriefcaseBusiness}>Post an opportunity</Button>
      </PageTitle>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search roles, companies, or skills"
            className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
        <Filter label="Type" value="All job types" />
        <Filter label="Location" value="All locations" />
      </div>

      {status && <p className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">{status}</p>}

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          {jobs.map((job) => (
            <article key={job._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-base font-bold text-blue-700">
                    {job.company?.[0] || 'J'}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <span>{job.company}</span>
                      <span>·</span>
                      <MapPin size={13} className="text-slate-400" />
                      <span>{job.location}</span>
                    </p>
                  </div>
                </div>

                <button className="text-xl text-slate-300 hover:text-red-500">♡</button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                  {job.type}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                  {job.salary || 'Salary not listed'}
                </span>
                {(job.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">Posted by alumni</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => api.request(`/jobs/${job._id}/refer`, { method: 'POST' })}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-600"
                  >
                    Refer someone
                  </button>
                  <Button>Apply now</Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside>
          <Panel title="Career preferences">
            <div className="space-y-4 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Preferred role</p>
                <p className="mt-2 font-semibold text-slate-900">Product & Design</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Work arrangement</p>
                <p className="mt-2 font-semibold text-slate-900">Hybrid</p>
              </div>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

export default JobsPage
