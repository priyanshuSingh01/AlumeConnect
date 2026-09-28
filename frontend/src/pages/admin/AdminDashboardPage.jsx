import { useEffect, useState } from 'react'
import { ClipboardCheck, LineChart, ShieldCheck, Users, Zap } from 'lucide-react'
import { api } from '../../services/api'
import { PageTitle, Panel, StatCard } from '../../components/Ui'

function AdminDashboardPage({ analyticsOnly = false }) {
  const [stats, setStats] = useState(null)
  const [status, setStatus] = useState('Loading admin data...')

  useEffect(() => {
    api
      .getAdminStats()
      .then((result) => {
        setStats(result)
        setStatus('')
      })
      .catch((error) => setStatus(error.message))
  }, [])

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Administration"
        title={analyticsOnly ? 'Engagement analytics' : 'Admin overview'}
        text="Manage alumni data and understand the health of your network."
      />

      {status && <p className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">{status}</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total alumni" value={stats?.total ?? '—'} change="Live from MongoDB" />
        <StatCard icon={ShieldCheck} label="Verified alumni" value={stats?.verified ?? '—'} change="Verification coverage" tone="green" />
        <StatCard icon={Zap} label="Active users" value={stats?.active ?? '—'} change="Last 30 days" tone="purple" />
        <StatCard icon={ClipboardCheck} label="Pending verification" value={stats?.pending ?? '—'} change="Needs attention" tone="orange" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Alumni by batch">
          <div className="flex h-52 items-end justify-between gap-3 pt-3">
            {['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'].map((year, index) => (
              <div key={year} className="flex flex-1 flex-col items-center gap-2">
                <span
                  className="block w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-400"
                  style={{ height: `${35 + index * 7}%` }}
                />
                <span className="text-[10px] text-slate-500">{year}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Alumni by industry">
          <div className="space-y-4">
            {['Technology', 'Finance & banking', 'Consulting', 'Healthcare'].map((industry, index) => (
              <div key={industry}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-700">{industry}</span>
                  <span className="font-semibold text-slate-900">
                    {[3842, 2184, 1640, 980][index].toLocaleString()}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                    style={{ width: `${78 - index * 15}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

export default AdminDashboardPage
