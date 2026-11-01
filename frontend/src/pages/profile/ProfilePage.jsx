import { useMemo, useState } from 'react'
import { Check, MapPin, Pencil, X } from 'lucide-react'
import { api } from '../../services/api'
import { Button, PageTitle, Panel } from '../../components/Ui'

const profileTabs = ['About', 'Experience', 'Education', 'Achievements']

function ProfilePage({ user, onUserUpdate }) {
  const [activeTab, setActiveTab] = useState('About')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(() => ({
    title: user.title || '',
    company: user.company || '',
    department: user.department || '',
    location: user.location || '',
    batch: user.batch || '',
    bio: user.bio || '',
    skills: (user.skills || []).join(', '),
  }))

  const completion = useMemo(() => {
    const fields = [user.name, user.image, user.title, user.company, user.location, user.bio, user.skills?.length]
    return Math.round((fields.filter(Boolean).length / fields.length) * 100)
  }, [user])

  const saveProfile = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const updatedUser = await api.updateProfile({
        ...form,
        batch: form.batch ? Number(form.batch) : undefined,
        skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      })
      onUserUpdate(updatedUser)
      setEditing(false)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  const updateForm = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

  return (
    <div className="space-y-6">
      <PageTitle eyebrow="My profile" title={user.name} text="Keep your profile current so your community can find and connect with you.">
        <Button variant="secondary" onClick={() => { setEditing(true); setError('') }}><Pencil size={15} /> Edit profile</Button>
      </PageTitle>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_0.5fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-blue-100 via-sky-100 to-indigo-100" />
          <div className="p-5">
            <div className="flex items-center gap-4">
              {user.image
                ? <img src={user.image} alt={user.name} className="-mt-13 h-24 w-24 rounded-full border-4 border-white object-cover shadow-md" />
                : <span className="-mt-13 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-3xl font-bold text-blue-700 shadow-md">{user.name?.[0]}</span>}
              <div className="min-w-0 pt-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tighter text-slate-900">{user.name}</h2>
                  {user.isVerified && <span title="Verified profile" className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white"><Check size={12} /></span>}
                </div>
                <p className="mt-1 text-sm capitalize text-slate-600">{[user.title, user.company].filter(Boolean).join(' at ') || user.role}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin size={14} className="text-blue-600" />
                  <span>{[user.location, user.batch && `Class of ${user.batch}`].filter(Boolean).join(' · ') || 'Add your location and graduation year'}</span>
                </div>
              </div>
            </div>

            <div role="tablist" aria-label="Profile sections" className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              {profileTabs.map((tab) => (
                <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-3 py-2 text-xs font-semibold ${activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}>{tab}</button>
              ))}
            </div>

            <div role="tabpanel" className="mt-5 min-h-36">
              {activeTab === 'About' && (
                <div className="space-y-6">
                  <div><h3 className="text-lg font-semibold text-slate-900">About</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{user.bio || 'Add a short introduction to help your community get to know you.'}</p></div>
                  <div><h3 className="text-lg font-semibold text-slate-900">Skills and interests</h3><div className="mt-3 flex flex-wrap gap-2">{(user.skills || []).length ? user.skills.map((skill) => <span key={skill} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">{skill}</span>) : <p className="text-sm text-slate-500">No skills added yet.</p>}</div></div>
                </div>
              )}
              {activeTab === 'Experience' && <div><h3 className="text-lg font-semibold text-slate-900">Experience</h3>{user.title || user.company ? <article className="mt-3 rounded-xl border border-slate-200 p-4"><p className="font-semibold text-slate-900">{user.title || 'Current role'}</p><p className="mt-1 text-sm text-slate-600">{user.company || 'Company not added'}</p></article> : <p className="mt-2 text-sm text-slate-500">Add your current role and company to share your experience.</p>}</div>}
              {activeTab === 'Education' && <div><h3 className="text-lg font-semibold text-slate-900">Education</h3>{user.batch || user.department ? <article className="mt-3 rounded-xl border border-slate-200 p-4"><p className="font-semibold text-slate-900">{user.department || 'Alumni community'}</p><p className="mt-1 text-sm text-slate-600">{user.batch ? `Class of ${user.batch}` : 'Graduation year not added'}</p></article> : <p className="mt-2 text-sm text-slate-500">Add your department and graduation year to complete your education details.</p>}</div>}
              {activeTab === 'Achievements' && <div><h3 className="text-lg font-semibold text-slate-900">Achievements</h3><p className="mt-2 text-sm text-slate-500">No achievements added yet.</p></div>}
            </div>
          </div>
        </section>

        <aside>
          <Panel title="Profile completeness">
            <div className="space-y-4">
              <div className="flex items-end justify-between"><p className="text-4xl font-bold tracking-[-0.06em] text-slate-900">{completion}%</p><p className="text-xs text-slate-500">{completion === 100 ? 'Complete' : 'Keep going'}</p></div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200"><span className="block h-full rounded-full bg-blue-600 transition-all" style={{ width: `${completion}%` }} /></div>
              <p className="text-sm text-slate-500">A complete profile helps alumni and students find the right connections.</p>
              {completion < 100 && <button type="button" onClick={() => setEditing(true)} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Complete your profile</button>}
            </div>
          </Panel>
        </aside>
      </div>

      {editing && (
        <div role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !saving) setEditing(false)
        }}>
          <form onSubmit={saveProfile} className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Your profile</p><h2 id="edit-profile-title" className="mt-2 text-xl font-bold text-slate-900">Edit profile details</h2></div><button type="button" aria-label="Close edit profile" onClick={() => setEditing(false)} disabled={saving} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Current role</span><input value={form.title} onChange={updateForm('title')} maxLength={100} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-300 focus:bg-white" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Company / institution</span><input value={form.company} onChange={updateForm('company')} maxLength={100} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-300 focus:bg-white" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Department</span><input value={form.department} onChange={updateForm('department')} maxLength={100} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-300 focus:bg-white" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Location</span><input value={form.location} onChange={updateForm('location')} maxLength={100} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-300 focus:bg-white" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Graduation year</span><input type="number" min="1950" max="2100" value={form.batch} onChange={updateForm('batch')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-300 focus:bg-white" /></label>
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-slate-700">About you</span><textarea rows={3} maxLength={500} value={form.bio} onChange={updateForm('bio')} className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-300 focus:bg-white" /></label>
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Skills (comma separated)</span><input value={form.skills} onChange={updateForm('skills')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-300 focus:bg-white" /></label>
            </div>
            {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <div className="mt-5 flex justify-end gap-2"><button type="button" disabled={saving} onClick={() => setEditing(false)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button></div>
          </form>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
