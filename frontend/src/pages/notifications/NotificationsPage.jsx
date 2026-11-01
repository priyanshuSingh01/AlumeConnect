import { useEffect, useState } from 'react'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { api } from '../../services/api'
import { PageTitle, Panel } from '../../components/Ui'

function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [status, setStatus] = useState('Loading notifications...')
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  useEffect(() => {
    let active = true
    api
      .getNotifications()
      .then((result) => {
        if (active) {
          setNotifications(result.notifications)
          setStatus('')
        }
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

  const markRead = async (item) => {
    setUpdatingId(item._id)
    setError('')
    try {
      const updated = await api.markNotificationRead(item._id)
      setNotifications((current) => current.map((notification) => notification._id === item._id ? updated : notification))
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setUpdatingId('')
    }
  }

  const markAllRead = async () => {
    const unread = notifications.filter((item) => !item.read)
    for (const item of unread) await markRead(item)
  }

  const unreadCount = notifications.filter((item) => !item.read).length

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Stay up to date"
        title="Notifications"
        text="The latest activity from your alumni network."
      >
        {unreadCount > 0 && <button type="button" onClick={markAllRead} disabled={Boolean(updatingId)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700 disabled:opacity-60"><CheckCheck size={16} /> Mark all read</button>}
      </PageTitle>

      {status && <p role="status" className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">{status}</p>}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <Panel title="Recent activity">
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item._id}
              className={`flex items-center gap-3 rounded-xl border p-3 ${item.read ? 'border-slate-200 bg-slate-50' : 'border-blue-100 bg-blue-50/60'}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Bell size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{item.title}{!item.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-600 align-middle" />}</p>
                <p className="mt-1 text-xs text-slate-500">{item.body && <>{item.body} · </>}{new Date(item.createdAt).toLocaleString()}</p>
              </div>

              {!item.read && <button type="button" aria-label="Mark notification as read" onClick={() => markRead(item)} disabled={updatingId === item._id} className="rounded-lg p-2 text-blue-700 hover:bg-white disabled:opacity-60">{updatingId === item._id ? <span className="text-xs">Saving</span> : <Check size={17} />}</button>}
            </div>
          ))}
          {!status && !error && notifications.length === 0 && <div className="rounded-xl bg-slate-50 px-4 py-8 text-center"><Bell className="mx-auto text-slate-400" size={24} /><p className="mt-3 font-semibold text-slate-800">You’re all caught up</p><p className="mt-1 text-sm text-slate-500">New activity will show up here.</p></div>}
        </div>
      </Panel>
    </div>
  )
}

export default NotificationsPage
