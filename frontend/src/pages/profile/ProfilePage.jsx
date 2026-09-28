import { useState } from 'react'
import { Check, MapPin, Network } from 'lucide-react'
import { api } from '../../services/api'
import { Button, PageTitle, Panel } from '../../components/Ui'

function ProfilePage() {
  const [message, setMessage] = useState('')

  const saveProfile = async () => {
    try {
      await api.updateProfile({
        title: 'Product Manager',
        company: 'Google',
        location: 'Bengaluru',
        skills: ['Product strategy', 'Figma', 'Research'],
      })
      setMessage('Profile saved successfully')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="My profile"
        title="Ananya Verma"
        text="Keep your professional story current so the right people can find you."
      >
        <Button variant="secondary" icon={Network} onClick={saveProfile}>
          Save profile
        </Button>
      </PageTitle>

      {message && <p className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}

      <div className="grid gap-4 xl:grid-cols-[1.5fr_0.5fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-blue-100 via-sky-100 to-indigo-100" />

          <div className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src="https://i.pravatar.cc/180?img=32"
                  alt="Ananya Verma"
                  className="mt-[-52px] h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-[-0.05em] text-slate-900">Ananya Verma</h2>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Check size={12} />
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">Product Manager at Google</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={14} className="text-blue-600" />
                    <span>Bengaluru, India · Class of 2020</span>
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
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  I enjoy building products that make complex things feel simple. Always happy to share notes on product careers, design systems, and making a transition into tech.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">Experience</h3>
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                    G
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Product Manager · Google</p>
                    <p className="mt-1 text-xs text-slate-500">2022 - Present · Bengaluru</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside>
          <Panel title="Profile completeness">
            <div className="space-y-4">
              <p className="text-4xl font-bold tracking-[-0.06em] text-slate-900">82%</p>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                <span className="block h-full rounded-full bg-blue-600" style={{ width: '82%' }} />
              </div>
              <p className="text-sm text-slate-500">Complete your profile to help alumni find you.</p>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

export default ProfilePage
