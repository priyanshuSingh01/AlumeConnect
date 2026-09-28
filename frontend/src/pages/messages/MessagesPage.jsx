import { useEffect, useState } from 'react'
import { Check, Mail, MoreHorizontal, Send } from 'lucide-react'
import { api } from '../../services/api'
import { PageTitle } from '../../components/Ui'

function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [status, setStatus] = useState('')

  const contactId = localStorage.getItem('alumconnect_contact_id')
  const currentUserId = localStorage.getItem('alumconnect_user_id')

  useEffect(() => {
    if (!contactId) return

    api
      .getMessages(contactId)
      .then((result) => setMessages(result.messages))
      .catch((error) => setStatus(error.message))
  }, [contactId])

  const send = async () => {
    if (!contactId || !text.trim()) return

    const message = await api.sendMessage(contactId, text.trim())
    setMessages((current) => [...current, message])
    setText('')
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Stay in touch"
        title="Messages"
        text="Keep your important conversations in one place."
      />

      {status && <p className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">{status}</p>}

      <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-200 bg-slate-50 p-4 lg:border-b-0 lg:border-r">
          <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
            <button className="flex-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm">
              All
            </button>
            <button className="flex-1 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500">
              Unread
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Select an alumni profile to start a conversation.
          </p>
        </aside>

        <section className="flex min-h-[500px] flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <div>
              <p className="text-base font-semibold text-slate-900">Conversation</p>
              <p className="text-xs text-slate-500">Messages are stored securely in MongoDB</p>
            </div>
            <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 bg-slate-50 p-4">
            {messages.map((message) => {
              const isSent = message.sender === currentUserId

              return (
                <div
                  key={message._id}
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    isSent
                      ? 'ml-auto bg-blue-600 text-white'
                      : 'bg-white text-slate-700 shadow-sm'
                  }`}
                >
                  <p>{message.text}</p>
                  <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isSent ? 'text-blue-100' : 'text-slate-400'}`}>
                    <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                    {isSent && <Check size={12} />}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-2 border-t border-slate-200 bg-white p-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
              <span className="text-lg">+</span>
            </button>
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && send()}
              placeholder={contactId ? 'Write a message...' : 'Open a profile to message'}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:bg-white"
            />
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100">
              <Mail size={17} />
            </button>
            <button
              onClick={send}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              <Send size={16} />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default MessagesPage
