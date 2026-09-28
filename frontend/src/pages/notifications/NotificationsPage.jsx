import { useEffect, useState } from 'react'
import { Bell, MoreHorizontal } from 'lucide-react'
import { api } from '../../services/api'
import { PageTitle, Panel } from '../../components/Ui'

function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [status, setStatus] = useState('Loading notifications...')

  useEffect(() => {
    api
      .getNotifications()
      .then((result) => {
        setNotifications(result.notifications)
        setStatus('')
      })
      .catch((error) => setStatus(error.message))
  }, [])

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Stay up to date"
        title="Notifications"
        text="The latest activity from your alumni network."
      />

      {status && <p className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">{status}</p>}

      <Panel title="Recent activity">
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Bell size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.body || new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              <button className="rounded-lg p-1.5 text-slate-500 hover:bg-white">
                <MoreHorizontal size={17} />
              </button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

export default NotificationsPage
