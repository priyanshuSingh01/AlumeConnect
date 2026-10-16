import { Check, MapPin } from 'lucide-react'
import { PageTitle, Panel } from '../../components/Ui'

function ProfilePage({ user }) {
  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="My profile"
        title={user.name}
        text="Your profile helps the alumni community get to know you."
      />

      <div className="grid gap-4 xl:grid-cols-[1.5fr_0.5fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-linear-to-r from-blue-100 via-sky-100 to-indigo-100" />

          <div className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex items-center gap-4">
                {user.image
                  ? <img src={user.image} alt={user.name} className="-mt-13 h-24 w-24 rounded-full border-4 border-white object-cover shadow-md" />
                  : <span className="-mt-13 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-3xl font-bold text-blue-700 shadow-md">{user.name?.[0]}</span>}

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-tighter text-slate-900">{user.name}</h2>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Check size={12} />
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{[user.title, user.company].filter(Boolean).join(' at ') || user.role}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={14} className="text-blue-600" />
                    <span>{[user.location, user.batch && `Class of ${user.batch}`].filter(Boolean).join(' · ')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              {['About', 'Experience', 'Education', 'Achievements'].map((tab, index) => (
                <button
                  key={tab}
                  className={`rounded-full px-3 py-2 text-xs font-semibold ${
                    index === 0 ? 'bg-blue-50 text-blue-700' : 'bg-transparent text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">About</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{user.bio || 'Add a short introduction to help your community get to know you.'}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">Skills and interests</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(user.skills || []).length
                    ? user.skills.map((skill) => <span key={skill} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">{skill}</span>)
                    : <p className="text-sm text-slate-500">No skills added yet.</p>}
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside>
          <Panel title="Profile completeness">
            <div className="space-y-4">
              <p className="text-4xl font-bold tracking-[-0.06em] text-slate-900">{user.profileComplete ? '100%' : '60%'}</p>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                <span className="block h-full rounded-full bg-blue-600" style={{ width: user.profileComplete ? '100%' : '60%' }} />
              </div>
              <p className="text-sm text-slate-500">Thanks for sharing your profile with the community.</p>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

export default ProfilePage
