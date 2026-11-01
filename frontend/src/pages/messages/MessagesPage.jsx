import { useEffect, useMemo, useState } from 'react'
import { Check, MessageCircle, Search, Send } from 'lucide-react'
import { api } from '../../services/api'
import { PageTitle } from '../../components/Ui'

function MessagesPage({ user, initialContactId = '' }) {
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.getAlumni()
      .then(({ alumni }) => {
        if (!active) return
        const availableContacts = alumni.filter((person) => person._id !== (user?.id || user?._id))
        setContacts(availableContacts)
        const initialContact = availableContacts.find((person) => person._id === initialContactId)
        if (initialContact) {
          setSelectedContact(initialContact)
          setLoadingMessages(true)
        }
        setLoadingContacts(false)
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message)
          setLoadingContacts(false)
        }
      })
    return () => {
      active = false
    }
  }, [initialContactId, user?.id, user?._id])

  useEffect(() => {
    const contactId = selectedContact?._id
    if (!contactId) return undefined
    let active = true
    api.getMessages(contactId)
      .then(({ messages: conversation }) => {
        if (active) setMessages(conversation)
      })
      .catch((loadError) => {
        if (active) setError(loadError.message)
      })
      .finally(() => {
        if (active) setLoadingMessages(false)
      })
    return () => {
      active = false
    }
  }, [selectedContact])

  const visibleContacts = useMemo(() => contacts.filter((contact) => (
    `${contact.name} ${contact.title || ''} ${contact.company || ''}`.toLowerCase().includes(search.trim().toLowerCase())
  )), [contacts, search])

  const send = async (event) => {
    event?.preventDefault()
    if (!selectedContact || !text.trim() || sending) return
    setSending(true)
    setError('')
    try {
      const message = await api.sendMessage(selectedContact._id, text.trim())
      setMessages((current) => [...current, message])
      setText('')
    } catch (sendError) {
      setError(sendError.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageTitle eyebrow="Stay in touch" title="Messages" text="Start a conversation with people in your alumni community." />
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid min-h-[620px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[320px_1fr]">
        <aside className="flex min-h-0 flex-col border-b border-slate-200 bg-slate-50 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">Community</h2>
            <label className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <Search size={15} className="text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search message contacts" placeholder="Find a person" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
            </label>
          </div>
          <div className="max-h-[540px] flex-1 space-y-1 overflow-y-auto p-2">
            {loadingContacts && <p className="p-3 text-sm text-slate-500">Loading community...</p>}
            {!loadingContacts && visibleContacts.map((contact) => (
              <button key={contact._id} type="button" onClick={() => { setMessages([]); setError(''); setLoadingMessages(true); setSelectedContact(contact) }} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${selectedContact?._id === contact._id ? 'bg-blue-50' : 'hover:bg-white'}`}>
                {contact.image
                  ? <img src={contact.image} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                  : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{contact.name?.[0]}</span>}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-900">{contact.name}</span>
                  <span className="block truncate text-xs capitalize text-slate-500">{contact.title || contact.role}{contact.company ? ` · ${contact.company}` : ''}</span>
                </span>
              </button>
            ))}
            {!loadingContacts && visibleContacts.length === 0 && <p className="p-3 text-sm text-slate-500">{search ? 'No people match your search.' : 'No community contacts available yet.'}</p>}
          </div>
        </aside>

        <section className="flex min-h-[500px] min-w-0 flex-col">
          <div className="flex items-center gap-3 border-b border-slate-200 p-4">
            {selectedContact ? (
              <>
                {selectedContact.image
                  ? <img src={selectedContact.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                  : <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">{selectedContact.name?.[0]}</span>}
                <div><p className="font-semibold text-slate-900">{selectedContact.name}</p><p className="text-xs capitalize text-slate-500">{selectedContact.title || selectedContact.role}</p></div>
              </>
            ) : <div><p className="font-semibold text-slate-900">Your conversations</p><p className="text-xs text-slate-500">Choose a community member to start messaging.</p></div>}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {loadingMessages && <p className="text-sm text-slate-500">Loading conversation...</p>}
            {!selectedContact && !loadingMessages && (
              <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm"><MessageCircle size={22} /></span>
                <p className="mt-3 font-semibold text-slate-800">Select someone to get started</p>
                <p className="mt-1 text-sm text-slate-500">Your conversations will appear here.</p>
              </div>
            )}
            {selectedContact && !loadingMessages && messages.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No messages yet. Send the first one.</p>}
            {messages.map((message) => {
              const isSent = (message.sender?._id || message.sender)?.toString() === (user?.id || user?._id)?.toString()
              return (
                <div key={message._id} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${isSent ? 'ml-auto bg-blue-600 text-white' : 'bg-white text-slate-700 shadow-sm'}`}>
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isSent ? 'text-blue-100' : 'text-slate-400'}`}>
                    <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>{isSent && <Check size={12} />}
                  </div>
                </div>
              )
            })}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-slate-200 bg-white p-4">
            <input value={text} onChange={(event) => setText(event.target.value)} maxLength={2000} disabled={!selectedContact || sending} placeholder={selectedContact ? 'Write a message...' : 'Select a person to message'} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60" />
            <button type="submit" disabled={!selectedContact || !text.trim() || sending} aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              <Send size={16} />
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default MessagesPage
