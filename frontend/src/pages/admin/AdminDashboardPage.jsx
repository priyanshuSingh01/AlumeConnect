import { useEffect, useState } from 'react'
import { Check, ClipboardCheck, ShieldCheck, Users, X, Zap } from 'lucide-react'
import { api } from '../../services/api'
import { PageTitle, Panel, StatCard } from '../../components/Ui'

function AdminDashboardPage({ analyticsOnly = false, verificationOnly = false }) {
  const [stats, setStats] = useState(null)
  const [status, setStatus] = useState('Loading admin data...')
  const [verificationUsers, setVerificationUsers] = useState([])
  const [updatingUser, setUpdatingUser] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let active = true
    const request = verificationOnly ? api.getVerificationQueue() : api.getAdminStats()
    request
      .then((result) => {
        if (!active) return
        if (verificationOnly) setVerificationUsers(result.users)
        else setStats(result)
        setStatus('')
      })
      .catch((error) => {
        if (active) setStatus(error.message)
      })
    return () => {
      active = false
    }
  }, [verificationOnly])

  const updateVerification = async (userId, approved) => {
    setUpdatingUser(userId)
    setActionError('')
    try {
      await api.updateVerification(userId, approved)
      setVerificationUsers((current) => current.filter((user) => user._id !== userId))
    } catch (error) {
      setActionError(error.message)
    } finally {
      setUpdatingUser('')
    }
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Administration"
        title={verificationOnly ? 'Verification queue' : analyticsOnly ? 'Engagement analytics' : 'Admin overview'}
        text={verificationOnly ? 'Review new community profiles and approve or reject verification requests.' : 'Manage alumni data and understand the health of your network.'}
      />

      {status && <p role={status.startsWith('Loading') ? 'status' : 'alert'} className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">{status}</p>}
      {verificationOnly ? (
        <section className="space-y-3">
          {actionError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{actionError}</p>}
          {!status && verificationUsers.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center"><ClipboardCheck className="mx-auto text-slate-400" size={26} /><h2 className="mt-3 font-semibold text-slate-900">Queue is clear</h2><p className="mt-1 text-sm text-slate-500">New profiles waiting for verification will appear here.</p></div>}
          {verificationUsers.map((candidate) => (
            <article key={candidate._id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {candidate.image ? <img src={candidate.image} alt="" className="h-12 w-12 rounded-full object-cover" /> : <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">{candidate.name?.[0]}</span>}
                <div><h2 className="font-semibold text-slate-900">{candidate.name}</h2><p className="text-sm text-slate-500">{candidate.email}</p><p className="mt-0.5 text-xs capitalize text-slate-500">{[candidate.role, candidate.title, candidate.company].filter(Boolean).join(' · ')}</p></div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => updateVerification(candidate._id, false)} disabled={updatingUser === candidate._id} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"><X size={15} /> Reject</button>
                <button type="button" onClick={() => updateVerification(candidate._id, true)} disabled={updatingUser === candidate._id} className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">{updatingUser === candidate._id ? 'Saving...' : <><Check size={15} /> Approve</>}</button>
              </div>
            </article>
          ))}
        </section>
      ) : (
      <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total alumni" value={stats?.total ?? '—'} change="Live from MongoDB" />
        <StatCard icon={ShieldCheck} label="Verified alumni" value={stats?.verified ?? '—'} change="Verification coverage" tone="green" />
        <StatCard icon={Zap} label="Active users" value={stats?.active ?? '—'} change="Last 30 days" tone="purple" />
        <StatCard icon={ClipboardCheck} label="Pending verification" value={stats?.pending ?? '—'} change="Needs attention" tone="orange" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Members by graduation year">
          {stats?.batches?.length ? (
          <div className="flex h-52 items-end justify-between gap-3 pt-3">
            {stats.batches.map(({ _id: year, count }) => (
              <div key={year} title={`${count} profiles`} className="flex flex-1 flex-col items-center gap-2">
                <span
                  className="block w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-400"
                  style={{ height: `${Math.max(8, (count / Math.max(...stats.batches.map((item) => item.count))) * 100)}%` }}
                />
                <span className="text-[10px] text-slate-500">{year}</span>
              </div>
            ))}
          </div>
          ) : <p className="py-12 text-center text-sm text-slate-500">Graduation year data will appear as profiles are completed.</p>}
        </Panel>

        <Panel title="Top companies and roles">
          {stats?.roles?.length ? <div className="space-y-4">
            {stats.roles.map(({ _id: label, count }) => (
              <div key={label}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-slate-700">{label}</span>
                  <span className="font-semibold text-slate-900">{count.toLocaleString()}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                    style={{ width: `${Math.max(8, (count / Math.max(...stats.roles.map((item) => item.count))) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          : <p className="py-12 text-center text-sm text-slate-500">Company and role data will appear as profiles are completed.</p>}
        </Panel>
      </div>
      </>
      )}
    </div>
  )
}

export default AdminDashboardPage
