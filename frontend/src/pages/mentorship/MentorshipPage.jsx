import { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2, Clock3, HeartHandshake, MapPin, Search, X, Zap } from 'lucide-react'
import { api } from '../../services/api'
import { Button, PageTitle } from '../../components/Ui'

function MentorshipPage({ user, onUserUpdate }) {
  const [mentors, setMentors] = useState([])
  const [requests, setRequests] = useState({})
  const [incomingRequests, setIncomingRequests] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [incomingError, setIncomingError] = useState('')
  const [respondingId, setRespondingId] = useState('')
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [mentorProfile, setMentorProfile] = useState({
    isMentor: Boolean(user?.isMentor),
    availability: user?.mentorAvailability || 'unavailable',
  })
  const [updatingMentor, setUpdatingMentor] = useState(false)
  const [mentorError, setMentorError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([api.getMentors(), api.getMentorshipRequests()])
      .then(([mentorResult, requestResult]) => {
        if (!active) return
        setMentors(mentorResult.mentors)
        setIncomingRequests(requestResult.incomingRequests)
        setRequests(Object.fromEntries(requestResult.requests.map((request) => [
          request.mentor._id,
          { status: request.status, note: request.note },
        ])))
        setLoading(false)
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message)
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const isAlumni = user?.role === 'alumni'
  const filteredMentors = mentors.filter((mentor) => {
    const text = `${mentor.name} ${mentor.title || ''} ${mentor.company || ''} ${(mentor.skills || []).join(' ')}`.toLowerCase()
    return text.includes(search.trim().toLowerCase())
  })

  const updateMentorProfile = async (updates) => {
    setUpdatingMentor(true)
    setMentorError('')
    try {
      const updatedUser = await api.updateProfile(updates)
      onUserUpdate(updatedUser)
      setMentorProfile({
        isMentor: updatedUser.isMentor,
        availability: updatedUser.mentorAvailability,
      })
    } catch (updateError) {
      setMentorError(updateError.message)
    } finally {
      setUpdatingMentor(false)
    }
  }

  const submitRequest = async (event) => {
    event.preventDefault()
    if (!selectedMentor) return
    setSending(true)
    setRequestError('')
    try {
      const result = await api.requestMentorship({ mentorId: selectedMentor._id, note })
      setRequests((current) => ({
        ...current,
        [selectedMentor._id]: { status: result.request.status, note: result.request.note },
      }))
      setSelectedMentor(null)
      setNote('')
    } catch (submitError) {
      setRequestError(submitError.message)
    } finally {
      setSending(false)
    }
  }

  const respondToRequest = async (requestId, status) => {
    setRespondingId(requestId)
    setIncomingError('')
    try {
      await api.respondToMentorshipRequest(requestId, status)
      setIncomingRequests((current) => current.map((request) => (
        request._id === requestId ? { ...request, status } : request
      )))
    } catch (responseError) {
      setIncomingError(responseError.message)
    } finally {
      setRespondingId('')
    }
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow={isAlumni ? 'Share what you know' : 'Give and get guidance'}
        title={isAlumni ? 'Mentorship community' : 'Find a Mentor'}
        text={isAlumni
          ? 'Help students take their next step, or learn from experienced alumni in your network.'
          : 'Find an experienced alumnus who can help you navigate your next career step.'}
      >
        {isAlumni && (
          <Button
            variant={mentorProfile.isMentor ? 'secondary' : 'primary'}
            icon={mentorProfile.isMentor ? CheckCircle2 : HeartHandshake}
            disabled={updatingMentor}
            onClick={() => updateMentorProfile(mentorProfile.isMentor
              ? { isMentor: false, mentorAvailability: 'unavailable' }
              : { isMentor: true, mentorAvailability: 'available' })}
          >
            {updatingMentor ? 'Saving...' : mentorProfile.isMentor ? 'Stop mentoring' : 'Become a mentor'}
          </Button>
        )}
      </PageTitle>

      {isAlumni ? (
        <section className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-600 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <HeartHandshake size={22} />
              </span>
              <div>
                <p className="text-lg font-semibold">{mentorProfile.isMentor ? 'You are part of the mentor community' : 'Your experience can make a difference'}</p>
                <p className="mt-1 max-w-xl text-sm leading-6 text-blue-100">
                  {mentorProfile.isMentor
                    ? 'Students can now find your profile and request career guidance.'
                    : 'Become a mentor to help students with career questions, industry insights, and their next move.'}
                </p>
              </div>
            </div>
            {mentorProfile.isMentor && (
              <label className="flex items-center gap-2 text-sm font-medium">
                Availability
                <select
                  value={mentorProfile.availability}
                  disabled={updatingMentor}
                  onChange={(event) => updateMentorProfile({ mentorAvailability: event.target.value })}
                  className="rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-white outline-none [&>option]:text-slate-900"
                >
                  <option value="available">Available</option>
                  <option value="limited">Limited</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </label>
            )}
          </div>
          {mentorError && <p role="alert" className="mt-3 text-sm text-red-100">{mentorError}</p>}
        </section>
      ) : (
        <section className="rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 p-6 text-white shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200">A little guidance goes a long way</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Learn from someone who has been there.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
            Browse verified alumni mentors, share what you need help with, and keep track of your requests here.
          </p>
        </section>
      )}

      {isAlumni && mentorProfile.isMentor && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">Mentorship requests</h2>
              <p className="mt-1 text-sm text-slate-500">Review students who are looking for your guidance.</p>
            </div>
            {incomingRequests.some((request) => request.status === 'pending') && (
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                {incomingRequests.filter((request) => request.status === 'pending').length} pending
              </span>
            )}
          </div>
          {incomingError && <p role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{incomingError}</p>}
          {incomingRequests.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No mentorship requests yet. New requests will appear here.</p>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((request) => (
                <article key={request._id} className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    {request.requester.image
                      ? <img src={request.requester.image} alt={request.requester.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                      : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">{request.requester.name?.[0]}</span>}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{request.requester.name}</p>
                      <p className="mt-0.5 text-xs capitalize text-slate-500">
                        {[request.requester.title, request.requester.company].filter(Boolean).join(' · ') || request.requester.role}
                      </p>
                      {request.note && <p className="mt-2 text-sm leading-5 text-slate-600">{request.note}</p>}
                    </div>
                  </div>
                  {request.status === 'pending' ? (
                    <div className="flex shrink-0 gap-2 sm:justify-end">
                      <button
                        onClick={() => respondToRequest(request._id, 'declined')}
                        disabled={respondingId === request._id}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => respondToRequest(request._id, 'accepted')}
                        disabled={respondingId === request._id}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        {respondingId === request._id ? 'Saving...' : 'Accept'}
                      </button>
                    </div>
                  ) : (
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${request.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {request.status}
                    </span>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Available alumni mentors</h2>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? 'Loading mentors...' : `${filteredMentors.length} ${filteredMentors.length === 1 ? 'mentor' : 'mentors'} available`}
          </p>
        </div>
        <label className="flex min-w-64 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <Search size={16} className="text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search mentors or skills"
            aria-label="Search mentors"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {!loading && !error && filteredMentors.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <HeartHandshake className="mx-auto text-slate-400" size={28} />
          <h3 className="mt-3 font-semibold text-slate-900">{search ? 'No mentors match your search' : 'No mentors available right now'}</h3>
          <p className="mt-1 text-sm text-slate-500">{search ? 'Try another name, company, or skill.' : 'Please check back soon for available alumni mentors.'}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredMentors.map((mentor) => {
          const request = requests[mentor._id]
          const alreadyRequested = request?.status === 'pending' || request?.status === 'accepted'
          return (
            <article key={mentor._id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {mentor.image
                    ? <img src={mentor.image} alt={mentor.name} className="h-14 w-14 rounded-full object-cover" />
                    : <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">{mentor.name?.[0]}</span>}
                  <div>
                    <h3 className="font-semibold text-slate-900">{mentor.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{mentor.title || 'Alumni mentor'}</p>
                  </div>
                </div>
                <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${mentor.mentorAvailability === 'limited' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${mentor.mentorAvailability === 'limited' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  {mentor.mentorAvailability === 'limited' ? 'Limited' : 'Available'}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-600">
                {mentor.company ? `at ${mentor.company}` : mentor.department || 'Alumni community'}
                {mentor.batch ? ` · Class of ${mentor.batch}` : ''}
              </p>
              {mentor.bio && <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{mentor.bio}</p>}

              <div className="mt-4 flex flex-wrap gap-2">
                {(mentor.skills || []).map((skill) => (
                  <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">{skill}</span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
                {mentor.location && <><MapPin size={13} className="text-blue-600" /> <span>{mentor.location}</span></>}
                {mentor.location && mentor.mentorAvailability && <span className="mx-1 text-slate-300">·</span>}
                <Zap size={13} className="text-blue-600" />
                <span>{mentor.isMentor ? 'Alumni mentor' : 'Verified alumni'}</span>
              </div>

              <div className="mt-auto pt-5">
                {alreadyRequested ? (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 size={16} />
                    {request.status === 'accepted' ? 'Mentorship accepted' : 'Request sent'}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedMentor(mentor)
                      setNote(request?.note || '')
                      setRequestError('')
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    {request?.status === 'declined' ? 'Request again' : 'Request mentorship'}
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !sending) setSelectedMentor(null)
        }}>
          <form onSubmit={submitRequest} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Mentorship request</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">Message {selectedMentor.name}</h2>
                <p className="mt-1 text-sm text-slate-500">Share a little context so they know how they can help.</p>
              </div>
              <button type="button" onClick={() => setSelectedMentor(null)} disabled={sending} aria-label="Close dialog" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <label className="mt-5 block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Your note <span className="font-normal text-slate-400">(optional)</span></span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                maxLength={500}
                rows={4}
                placeholder="What would you like guidance with?"
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-300 focus:bg-white"
              />
              <span className="mt-1 block text-right text-xs text-slate-400">{note.length}/500</span>
            </label>
            {requestError && <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{requestError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setSelectedMentor(null)} disabled={sending} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <Button type="submit" disabled={sending || note.length > 500}>
                {sending ? <><Clock3 size={15} /> Sending...</> : 'Send request'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default MentorshipPage
