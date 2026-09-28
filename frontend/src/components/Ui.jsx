import { ArrowRight } from 'lucide-react'

export function Button({
  children,
  variant = 'primary',
  icon: Icon,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  const variants = {
    primary: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-600',
    light: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    ghost: 'bg-transparent text-slate-600 hover:text-blue-600',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
      {Icon && <Icon size={16} />}
    </button>
  )
}

export function PageTitle({ eyebrow, title, text, children }) {
  return (
    <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p>
        )}
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.06em] text-slate-900 md:text-4xl">
          {title}
        </h1>
        {text && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{text}</p>}
      </div>
      {children}
    </div>
  )
}

export function Panel({ title, action, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {action && (
          <button className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
            {action}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

export function StatCard({ icon: Icon, label, value, change, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-violet-50 text-violet-600',
    green: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-amber-50 text-amber-600',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone] || tones.blue}`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-[-0.05em] text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-emerald-600">{change}</p>
        </div>
      </div>
    </div>
  )
}

export function Filter({ label, value }) {
  return (
    <button className="inline-flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-600 shadow-sm">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
      <span className="text-slate-400">⌄</span>
    </button>
  )
}
