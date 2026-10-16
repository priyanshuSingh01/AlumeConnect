import { useState } from 'react'
import { Camera, ImagePlus, UserRound } from 'lucide-react'
import { api } from '../../services/api'
import { Button } from '../../components/Ui'

const fieldClassName = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white'

function ProfileSetupPage({ user, onComplete }) {
  const [form, setForm] = useState({
    name: user.name || '',
    title: user.title || '',
    company: user.company || '',
    location: user.location || '',
    batch: user.batch || '',
    bio: user.bio || '',
    skills: (user.skills || []).join(', '),
    image: user.image || '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  const selectPhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please choose a JPG, PNG, or WebP image.')
      return
    }
    if (file.size > 1024 * 1024) {
      setError('Please choose an image smaller than 1 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setForm((current) => ({ ...current, image: reader.result }))
      setError('')
    }
    reader.onerror = () => setError('The selected image could not be read. Please try another one.')
    reader.readAsDataURL(file)
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      const updatedUser = await api.updateProfile({
        ...form,
        batch: form.batch ? Number(form.batch) : undefined,
        skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      })
      onComplete(updatedUser)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
      <form onSubmit={submit} className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Let’s set up your profile</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-slate-900">Tell your community about you</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Add a photo and a few details so people can recognize and connect with you.</p>

        <div className="mt-7 flex flex-col items-center gap-3 rounded-2xl bg-slate-50 p-6">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-50 text-blue-600 shadow-sm">
            {form.image ? <img src={form.image} alt="Profile preview" className="h-full w-full object-cover" /> : <UserRound size={36} />}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-600">
            {form.image ? <Camera size={16} /> : <ImagePlus size={16} />}
            {form.image ? 'Change photo' : 'Upload profile photo'}
            <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectPhoto} />
          </label>
          <p className="text-xs text-slate-500">Image file, up to 1 MB</p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Full name *</span>
            <input className={fieldClassName} value={form.name} onChange={update('name')} required maxLength={80} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Current role or study</span>
            <input className={fieldClassName} value={form.title} onChange={update('title')} placeholder="e.g. Software Engineer" maxLength={100} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Company or institution</span>
            <input className={fieldClassName} value={form.company} onChange={update('company')} placeholder="e.g. Google" maxLength={100} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Location *</span>
            <input className={fieldClassName} value={form.location} onChange={update('location')} placeholder="e.g. Bengaluru, India" required maxLength={100} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Graduation year</span>
            <input className={fieldClassName} type="number" value={form.batch} onChange={update('batch')} placeholder="e.g. 2024" min="1950" max="2100" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">About you</span>
            <textarea className={`${fieldClassName} min-h-24 resize-y`} value={form.bio} onChange={update('bio')} placeholder="Share a little about yourself and what you’re interested in." maxLength={500} />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Skills or interests</span>
            <input className={fieldClassName} value={form.skills} onChange={update('skills')} placeholder="Separate items with commas" />
          </label>
        </div>

        {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div className="mt-7 flex justify-end">
          <Button type="submit" disabled={saving || !form.image} className="disabled:cursor-not-allowed disabled:opacity-50">
            {saving ? 'Saving profile...' : 'Save and continue'}
          </Button>
        </div>
        {!form.image && <p className="mt-2 text-right text-xs text-slate-500">Upload a profile photo to continue.</p>}
      </form>
    </main>
  )
}

export default ProfileSetupPage
