'use client'

import { useState } from 'react'
import { site } from '@/lib/site'
import { Arrow } from './ui'

type Field = { name: string; label: string; type?: string; required?: boolean }

/**
 * The enquiry forms carry the same labels and subject options as the current
 * site. There is no backend in this front-end rebuild, so a completed form
 * opens the visitor's mail client addressed to the firm — no message is
 * silently dropped.
 */
export default function EnquiryForm({
  heading,
  fields,
  subjectLabel,
  subjects,
  messageLabel,
  note,
}: {
  heading: string
  fields: Field[]
  subjectLabel: string
  subjects: string[]
  messageLabel: string
  note?: string
}) {
  const [values, setValues] = useState<Record<string, string>>({})
  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }))

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const subject = values.subject || heading
    const body = [
      ...fields.map((f) => `${f.label}: ${values[f.name] ?? ''}`),
      `${subjectLabel}: ${values.subject ?? ''}`,
      '',
      `${messageLabel}:`,
      values.message ?? '',
    ].join('\n')
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  const inputCls =
    'peer w-full rounded-xl border border-line bg-white px-4 pb-2.5 pt-6 text-[0.95rem] text-ink outline-none transition-all duration-400 placeholder:text-transparent focus:border-gm-500 focus:ring-4 focus:ring-gm-100'
  const labelCls =
    'pointer-events-none absolute left-4 top-4 text-[0.82rem] text-muted transition-all duration-300 peer-focus:top-2 peer-focus:text-[0.68rem] peer-focus:text-gm-600 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[0.68rem]'

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      {fields.map((f) => (
        <div key={f.name} className="relative">
          <input
            id={f.name}
            name={f.name}
            type={f.type ?? 'text'}
            required={f.required}
            placeholder={f.label}
            value={values[f.name] ?? ''}
            onChange={(e) => set(f.name, e.target.value)}
            className={inputCls}
          />
          <label htmlFor={f.name} className={labelCls}>
            {f.label}
          </label>
        </div>
      ))}

      <div className="relative">
        <label htmlFor="subject" className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted">
          {subjectLabel}
        </label>
        <select
          id="subject"
          name="subject"
          value={values.subject ?? ''}
          onChange={(e) => set('subject', e.target.value)}
          className="w-full appearance-none rounded-xl border border-line bg-white px-4 py-3.5 text-[0.95rem] text-ink outline-none transition-all duration-400 focus:border-gm-500 focus:ring-4 focus:ring-gm-100"
        >
          <option value="">—</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={messageLabel}
          value={values.message ?? ''}
          onChange={(e) => set('message', e.target.value)}
          className={`${inputCls} resize-y`}
        />
        <label htmlFor="message" className={labelCls}>
          {messageLabel}
        </label>
      </div>

      <button
        type="submit"
        className="group inline-flex items-center gap-2.5 rounded-full bg-gm-600 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-gm-700 hover:shadow-[0_18px_36px_-14px_rgba(24,89,135,.7)]"
      >
        Send
        <Arrow />
      </button>

      {note && <p className="pt-1 text-[0.78rem] text-muted">{note}</p>}
    </form>
  )
}
