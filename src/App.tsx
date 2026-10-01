import { useEffect, useState, useRef } from 'react'
import type { Provider } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import OnboardingFlow from './pages/OnboardingFlow'

type AuthScreen = 'loading' | 'signin' | 'signup' | 'forgot' | 'onboarding' | 'app'

type Category = 'ALL' | 'GOVERNMENT' | 'PARANORMAL' | 'TECHNOLOGY' | 'HISTORY' | 'SPACE'
type NavTab = 'home' | 'trending' | 'submit' | 'saved' | 'profile'

interface Comment { id: number; author: string; avatar: string; text: string; time: string }
interface Theory {
  id: number; title: string; excerpt: string; category: Exclude<Category, 'ALL'>
  author: string; avatar: string; date: string; image: string; comments: Comment[]
  upvotes: number; upvoted: boolean; saved: boolean; classified: boolean
}
interface Profile { name: string; handle: string; bio: string; avatar: string }
interface OnboardingPreferences {
  interests: Exclude<Category, 'ALL'>[]
  notifications: { breaking: boolean; comments: boolean; weekly: boolean }
}

const C = {
  teal: '#1aacab', tealDark: '#148e8e', tealDeep: '#0d6e6e',
  orange: '#e07838', cream: '#f5e6c8', creamDark: '#ead5a8',
  bg: '#0c2f2f', surface: '#0f3535', surface2: '#133d3d',
  border: '#1e5050', text: '#f0f7f7', muted: '#6aadad',
} as const

const CAT_COLORS: Record<Exclude<Category, 'ALL'>, string> = {
  GOVERNMENT: C.orange, PARANORMAL: '#9f5de2',
  TECHNOLOGY: C.teal, HISTORY: '#c4823a', SPACE: '#3b82f6',
}
const CAT_ICONS: Record<Exclude<Category, 'ALL'>, string> = {
  GOVERNMENT: '🏛', PARANORMAL: '👁', TECHNOLOGY: '⚡', HISTORY: '📜', SPACE: '🌌',
}
const CATS: Category[] = ['ALL', 'GOVERNMENT', 'PARANORMAL', 'TECHNOLOGY', 'HISTORY', 'SPACE']

// ─── comment thread ───────────────────────────────────────────────────────────

function CommentThread({ comments, onAdd }: { comments: Comment[]; onAdd: (t: string) => void }) {
  const [text, setText] = useState('')
  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text.trim()); setText('')
  }
  return (
    <div className="mt-4 pt-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
      {comments.length === 0 && (
        <p style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[11px] tracking-wider opacity-60">No transmissions yet</p>
      )}
      {comments.map(c => (
        <div key={c.id} className="flex gap-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[11px] font-bold"
            style={{ backgroundColor: C.tealDeep, border: `1px solid ${C.teal}40` }}>{c.avatar}</div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-0.5">
              <span style={{ fontFamily: "'Share Tech Mono',monospace", color: C.cream }} className="text-[11px] font-bold">{c.author}</span>
              <span style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[10px]">{c.time}</span>
            </div>
            <p style={{ color: '#b8d4d4', fontFamily: "'Source Sans 3',sans-serif" }} className="text-sm leading-relaxed">{c.text}</p>
          </div>
        </div>
      ))}
      <form onSubmit={submit} className="flex gap-2 pt-1">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Add your insight..."
          style={{ fontFamily: "'Source Sans 3',sans-serif", backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.text }}
          className="flex-1 text-sm px-3 py-2 outline-none placeholder:opacity-40 focus:border-[#1aacab] transition-colors rounded-sm" />
        <button type="submit" disabled={!text.trim()}
          style={{ fontFamily: "'Share Tech Mono',monospace", backgroundColor: C.orange }}
          className="text-white text-[11px] px-4 py-2 tracking-widest uppercase hover:brightness-110 transition-all disabled:opacity-30 rounded-sm">
          POST
        </button>
      </form>
    </div>
  )
}

// ─── theory card ─────────────────────────────────────────────────────────────

function TheoryCard({ theory, onUpvote, onSave, onAddComment }: {
  theory: Theory; onUpvote: (id: number) => void
  onSave: (id: number) => void; onAddComment: (id: number, text: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const color = CAT_COLORS[theory.category]
  return (
    <article style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
      className="overflow-hidden hover:border-[#1aacab60] transition-colors duration-300 rounded-sm">
      <div className="relative h-44 bg-[#0d3535] overflow-hidden">
        {theory.image && <img src={theory.image} alt={theory.title} className="w-full h-full object-cover opacity-60 hover:opacity-75 transition-opacity duration-500" />}
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${C.surface} 0%, transparent 60%)` }} />
        <div className="absolute top-3 left-3 flex gap-2 items-center">
          <span style={{ backgroundColor: color, fontFamily: "'Share Tech Mono',monospace" }}
            className="text-white text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 font-bold rounded-sm">{theory.category}</span>
          {theory.classified && (
            <span style={{ fontFamily: "'Special Elite',cursive", border: `1px solid ${C.orange}`, color: C.orange }}
              className="text-[10px] px-2 py-0.5 rotate-[-1deg] tracking-widest opacity-90">CLASSIFIED</span>
          )}
        </div>
        <button onClick={() => onSave(theory.id)}
          className="absolute top-3 right-3 p-1.5 rounded-full transition-all hover:scale-110"
          style={{ backgroundColor: theory.saved ? C.orange : '#0f353580' }}>
          <svg viewBox="0 0 24 24" fill={theory.saved ? 'white' : 'none'} stroke="white" strokeWidth={2} className="w-4 h-4">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <div style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[10px] tracking-wider mb-2 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
            style={{ backgroundColor: C.tealDeep }}>{theory.avatar}</div>
          <span>{theory.author}</span><span style={{ color: C.border }}>·</span><span>{theory.date}</span>
        </div>
        <h2 style={{ fontFamily: "'Special Elite',cursive", color: C.text }} className="text-[17px] leading-snug mb-2">{theory.title}</h2>
        <p style={{ color: '#8bbfbf', fontFamily: "'Source Sans 3',sans-serif" }} className="text-sm leading-relaxed line-clamp-2">{theory.excerpt}</p>
        <div className="flex items-center gap-3 mt-4">
          <button onClick={() => onUpvote(theory.id)}
            style={{ fontFamily: "'Share Tech Mono',monospace", backgroundColor: theory.upvoted ? C.orange : 'transparent', border: `1px solid ${theory.upvoted ? C.orange : C.border}`, color: theory.upvoted ? 'white' : C.muted }}
            className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 transition-all hover:border-[#e07838] hover:text-[#e07838] rounded-sm">
            <svg viewBox="0 0 24 24" fill={theory.upvoted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} className="w-3 h-3">
              <path d="M5 15l7-7 7 7" strokeLinecap="round" />
            </svg>
            {theory.upvotes}
          </button>
          <button onClick={() => setExpanded(!expanded)}
            style={{ fontFamily: "'Share Tech Mono',monospace", color: expanded ? C.teal : C.muted, border: `1px solid ${expanded ? C.teal + '60' : C.border}` }}
            className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 transition-all hover:border-[#1aacab60] hover:text-[#1aacab] rounded-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {theory.comments.length}
          </button>
        </div>
        {expanded && <CommentThread comments={theory.comments} onAdd={t => onAddComment(theory.id, t)} />}
      </div>
    </article>
  )
}

// ─── submit page ─────────────────────────────────────────────────────────────

function SubmitPage({ onSubmit, onCancel }: {
  onSubmit: (t: Omit<Theory, 'id' | 'upvotes' | 'upvoted' | 'saved' | 'comments'> & { imageFile: File | null }) => Promise<void>
  onCancel: () => void
}) {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState<Exclude<Category, 'ALL'>>('GOVERNMENT')
  const [classified, setClassified] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); if (!title.trim() || !excerpt.trim()) return
    setIsSubmitting(true)
    setSubmitError('')
    try {
      await onSubmit({
        title: title.trim(), excerpt: excerpt.trim(), category, classified,
        author: '', avatar: '', date: '', image: imagePreview || '', imageFile,
      })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to file this theory.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBase = { backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Source Sans 3',sans-serif" }

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100%' }}>
      {/* page header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3"
        style={{ backgroundColor: C.bg, borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onCancel} style={{ color: C.muted }} className="hover:text-white transition-colors p-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <h1 style={{ fontFamily: "'Special Elite',cursive", color: C.text }} className="text-xl leading-none">File a Theory</h1>
          <p style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[9px] tracking-[0.2em] mt-0.5">KM AWARENESS ARCHIVE</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5 max-w-xl mx-auto pb-8">
        {/* category */}
        <div>
          <label style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[10px] tracking-widest uppercase block mb-3">CATEGORY</label>
          <div className="flex flex-wrap gap-2">
            {(CATS.filter(c => c !== 'ALL') as Exclude<Category, 'ALL'>[]).map(c => (
              <button key={c} type="button" onClick={() => setCategory(c)}
                style={{
                  fontFamily: "'Share Tech Mono',monospace",
                  backgroundColor: category === c ? CAT_COLORS[c] : 'transparent',
                  borderColor: category === c ? CAT_COLORS[c] : C.border,
                  color: category === c ? 'white' : C.muted,
                }}
                className="text-[10px] tracking-widest uppercase px-3 py-1.5 border rounded-sm transition-all hover:border-[#1aacab60]">
                {CAT_ICONS[c]} {c}
              </button>
            ))}
          </div>
        </div>

        {/* title */}
        <div>
          <label style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[10px] tracking-widest uppercase block mb-2">THEORY TITLE</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="State your theory..."
            style={{ ...inputBase, fontFamily: "'Special Elite',cursive" }}
            className="w-full px-4 py-3 text-lg outline-none focus:border-[#1aacab] transition-colors placeholder:opacity-30 rounded-sm"
            required />
        </div>

        {/* body */}
        <div>
          <label style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[10px] tracking-widest uppercase block mb-2">EVIDENCE & DETAILS</label>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)}
            placeholder="Lay out your evidence, sources, and reasoning..." rows={5}
            style={inputBase}
            className="w-full px-4 py-3 text-sm leading-relaxed outline-none focus:border-[#1aacab] transition-colors resize-none placeholder:opacity-30 rounded-sm"
            required />
        </div>

        {/* image upload */}
        <div>
          <label style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[10px] tracking-widest uppercase block mb-2">EVIDENCE IMAGE (OPTIONAL)</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-sm opacity-80" />
              <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); if (fileRef.current) fileRef.current.value = '' }}
                style={{ backgroundColor: C.orange, fontFamily: "'Share Tech Mono',monospace" }}
                className="absolute top-2 right-2 text-white text-[10px] px-2 py-1 tracking-widest rounded-sm">REMOVE</button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()}
              style={{ borderColor: C.border, color: C.muted, fontFamily: "'Share Tech Mono',monospace" }}
              className="w-full border-2 border-dashed py-8 text-xs tracking-widest uppercase hover:border-[#1aacab60] hover:text-[#1aacab] transition-all flex flex-col items-center gap-2 rounded-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              TAP TO ATTACH IMAGE
            </button>
          )}
        </div>

        {/* classified toggle — fixed centering */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <button type="button" onClick={() => setClassified(!classified)}
            className="relative flex items-center shrink-0 transition-all"
            style={{
              width: '44px', height: '24px', borderRadius: '12px',
              backgroundColor: classified ? C.orange : C.surface2,
              border: `1px solid ${classified ? C.orange : C.border}`,
            }}>
            <span
              className="absolute transition-all"
              style={{
                width: '16px', height: '16px', borderRadius: '50%',
                backgroundColor: 'white',
                top: '50%', transform: 'translateY(-50%)',
                left: classified ? '24px' : '4px',
              }} />
          </button>
          <span style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-xs tracking-widest uppercase">MARK AS CLASSIFIED</span>
        </label>

        {submitError && <p role="alert" className="text-sm" style={{ color: C.orange }}>{submitError}</p>}
        <button type="submit" disabled={!title.trim() || !excerpt.trim() || isSubmitting}
          style={{ fontFamily: "'Share Tech Mono',monospace", backgroundColor: C.orange }}
          className="w-full py-4 text-white text-xs tracking-[0.2em] uppercase hover:brightness-110 transition-all disabled:opacity-30 rounded-sm">
          {isSubmitting ? 'FILING...' : 'FILE THEORY TO THE RECORD'}
        </button>
      </form>
    </div>
  )
}

// ─── profile page ─────────────────────────────────────────────────────────────

function ProfilePage({ profile, theories, onSave }: {
  profile: Profile; theories: Theory[]
  onSave: (p: Profile) => Promise<Profile>
}) {
  const [form, setForm] = useState(profile)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setForm(f => ({ ...f, avatar: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    setIsSaving(true)
    setSaveError('')
    try {
      const savedProfile = await onSave(form)
      setForm(savedProfile)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save your profile.')
    } finally {
      setIsSaving(false)
    }
  }

  const inputBase = { backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'Source Sans 3',sans-serif" }

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100%' }}>
      {/* header */}
      <div className="px-4 pt-8 pb-6" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", color: C.orange }} className="text-[10px] tracking-[0.25em] uppercase mb-2 flex items-center gap-2">
          <span className="w-6 h-px" style={{ backgroundColor: C.orange }} />
          OPERATIVE FILE
        </div>
        {/* avatar section */}
        <div className="flex items-end gap-5 mt-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold text-white"
              style={{ backgroundColor: C.tealDeep, border: `3px solid ${C.teal}` }}>
              {form.avatar.startsWith('data:') ? (
                <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span style={{ fontFamily: "'Special Elite',cursive" }}>{form.name ? form.name[0].toUpperCase() : '?'}</span>
              )}
            </div>
            <button onClick={() => fileRef.current?.click()}
              style={{ backgroundColor: C.orange }}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center hover:brightness-110 transition-all shadow-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-3.5 h-3.5">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <div>
            <h2 style={{ fontFamily: "'Special Elite',cursive", color: C.text }} className="text-2xl leading-none">
              {form.name || 'Unknown Operative'}
            </h2>
            <p style={{ fontFamily: "'Share Tech Mono',monospace", color: C.teal }} className="text-[11px] tracking-wider mt-1">
              {form.handle || '@anonymous'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {/* stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'THEORIES', value: theories.length },
            { label: 'SAVED', value: theories.filter(t => t.saved).length },
            { label: 'UPVOTED', value: theories.filter(t => t.upvoted).length },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}` }} className="p-3 text-center rounded-sm">
              <div style={{ fontFamily: "'Special Elite',cursive", color: C.cream }} className="text-2xl">{s.value}</div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[9px] tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* form fields */}
        <div style={{ border: `1px solid ${C.border}` }} className="rounded-sm overflow-hidden">
          <div style={{ backgroundColor: C.surface2, borderBottom: `1px solid ${C.border}` }} className="px-4 py-3">
            <p style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[10px] tracking-widest uppercase">Edit Profile</p>
          </div>
          <div className="p-4 space-y-4">
            {[
              { label: 'DISPLAY NAME', key: 'name', placeholder: 'How you appear in the archive' },
              { label: 'HANDLE', key: 'handle', placeholder: '@your_alias' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[10px] tracking-widest uppercase block mb-2">{label}</label>
                <input value={form[key as keyof Profile] as string}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder} style={inputBase}
                  className="w-full px-4 py-3 text-sm outline-none focus:border-[#1aacab] transition-colors placeholder:opacity-30 rounded-sm" />
              </div>
            ))}
            <div>
              <label style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[10px] tracking-widest uppercase block mb-2">BIO</label>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="What do you know that they don't?" rows={3} style={inputBase}
                className="w-full px-4 py-3 text-sm outline-none focus:border-[#1aacab] transition-colors resize-none placeholder:opacity-30 rounded-sm" />
            </div>
            <button type="button" onClick={handleSave} disabled={isSaving}
              style={{ fontFamily: "'Share Tech Mono',monospace", backgroundColor: saved ? C.tealDark : C.teal }}
              className="w-full py-3.5 text-white text-xs tracking-[0.2em] uppercase hover:brightness-110 transition-all rounded-sm">
              {isSaving ? 'SAVING...' : saved ? '✓ SAVED' : 'SAVE PROFILE'}
            </button>
            {saveError && <p role="alert" aria-live="polite" className="text-sm" style={{ color: C.orange }}>{saveError}</p>}
          </div>
        </div>

        {/* app info */}
        <div style={{ border: `1px solid ${C.border}` }} className="rounded-sm overflow-hidden">
          <div style={{ backgroundColor: C.surface2, borderBottom: `1px solid ${C.border}` }} className="px-4 py-3">
            <p style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[10px] tracking-widest uppercase">KM Awareness</p>
          </div>
          <div className="p-4 space-y-0">
            {['Community Guidelines', 'Privacy Policy', 'About the Archive', 'Report a Theory'].map(item => (
              <button key={item} style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted, borderBottom: `1px solid ${C.border}` }}
                className="w-full text-left text-xs tracking-widest py-3 hover:text-white transition-colors last:border-b-0">
                {item.toUpperCase()} →
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── home screen ─────────────────────────────────────────────────────────────

function HomeScreen({ theories, onUpvote, onSave, onAddComment, activeCategory, setActiveCategory }: {
  theories: Theory[]; onUpvote: (id: number) => void; onSave: (id: number) => void
  onAddComment: (id: number, text: string) => void
  activeCategory: Category; setActiveCategory: (c: Category) => void
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const filtered = activeCategory === 'ALL' ? theories : theories.filter(t => t.category === activeCategory)

  return (
    <div className="relative flex">
      {/* category sidebar — only visible when open */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 flex" onClick={() => setSidebarOpen(false)}>
          {/* backdrop */}
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />
          {/* panel */}
          <div className="relative w-56 flex flex-col py-4"
            style={{ backgroundColor: C.surface, borderRight: `1px solid ${C.border}` }}
            onClick={e => e.stopPropagation()}>
            <div className="px-4 pb-3 mb-1" style={{ borderBottom: `1px solid ${C.border}` }}>
              <p style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[10px] tracking-[0.2em] uppercase">Filter by Category</p>
            </div>
            {CATS.map(cat => {
              const isActive = activeCategory === cat
              const color = cat === 'ALL' ? C.teal : CAT_COLORS[cat as Exclude<Category, 'ALL'>]
              return (
                <button key={cat} onClick={() => { setActiveCategory(cat); setSidebarOpen(false) }}
                  className="flex items-center gap-3 px-4 py-3.5 transition-all text-left"
                  style={{ backgroundColor: isActive ? `${color}20` : 'transparent', borderLeft: `3px solid ${isActive ? color : 'transparent'}` }}>
                  <span className="text-base">{cat === 'ALL' ? '🗂' : CAT_ICONS[cat as Exclude<Category, 'ALL'>]}</span>
                  <div>
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", color: isActive ? color : C.muted }}
                      className="text-[11px] tracking-widest uppercase">{cat}</div>
                    {cat !== 'ALL' && (
                      <div style={{ fontFamily: "'Share Tech Mono',monospace", color: C.border }} className="text-[9px] tracking-wider mt-0.5">
                        {theories.filter(t => t.category === cat).length} FILES
                      </div>
                    )}
                  </div>
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* main */}
      <div className="flex-1 min-w-0">
        {/* hero */}
        <div className="px-4 pt-6 pb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", color: C.orange }} className="text-[10px] tracking-[0.25em] uppercase mb-2 flex items-center gap-2">
            <span className="w-6 h-px" style={{ backgroundColor: C.orange }} />
            CLASSIFIED COMMUNITY ARCHIVE
          </div>
          <h2 style={{ fontFamily: "'Special Elite',cursive", color: C.text }} className="text-3xl leading-tight mb-2">
            Stay aware.<br /><span style={{ color: C.cream }}>Connect the dots.</span>
          </h2>
          <p style={{ fontFamily: "'Source Sans 3',sans-serif", color: C.muted }} className="text-sm leading-relaxed">
            Urban myths, suppressed history, and theories the mainstream won't touch.
          </p>
          <div className="flex gap-6 mt-4">
            {[
              { label: 'THEORIES', value: theories.length },
              { label: 'COMMENTS', value: theories.reduce((a, t) => a + t.comments.length, 0) },
              { label: 'CLASSIFIED', value: theories.filter(t => t.classified).length },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Special Elite',cursive", color: C.cream }} className="text-2xl">{s.value}</div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[9px] tracking-[0.2em] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* filter bar */}
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
          <button onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm transition-all"
            style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted, border: `1px solid ${C.border}`, backgroundColor: 'transparent' }}
            title="Filter categories">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
            </svg>
            <span className="text-[10px] tracking-widest uppercase">Filter</span>
          </button>
          <span style={{ color: C.border }}>·</span>
          <span style={{ fontFamily: "'Share Tech Mono',monospace", color: activeCategory === 'ALL' ? C.teal : CAT_COLORS[activeCategory as Exclude<Category,'ALL'>] }}
            className="text-[10px] tracking-widest uppercase">
            {activeCategory === 'ALL' ? `All — ${theories.length} files` : `${activeCategory} — ${filtered.length} files`}
          </span>
          {activeCategory !== 'ALL' && (
            <button onClick={() => setActiveCategory('ALL')}
              style={{ color: C.muted, border: `1px solid ${C.border}`, fontFamily: "'Share Tech Mono',monospace" }}
              className="ml-auto text-[9px] tracking-widest uppercase px-2 py-1 hover:text-white transition-colors rounded-sm">
              CLEAR ✕
            </button>
          )}
        </div>

        {/* cards */}
        <div className="p-4 grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <p style={{ fontFamily: "'Special Elite',cursive", color: C.muted }} className="text-2xl mb-2">No files found</p>
              <p style={{ fontFamily: "'Share Tech Mono',monospace", color: C.border }} className="text-xs tracking-widest">BE THE FIRST TO FILE IN THIS CATEGORY</p>
            </div>
          ) : filtered.map(t => (
            <TheoryCard key={t.id} theory={t} onUpvote={onUpvote} onSave={onSave} onAddComment={onAddComment} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── trending screen ──────────────────────────────────────────────────────────

function TrendingScreen({ theories, onUpvote, onSave, onAddComment }: {
  theories: Theory[]; onUpvote: (id: number) => void
  onSave: (id: number) => void; onAddComment: (id: number, text: string) => void
}) {
  const sorted = [...theories].sort((a, b) => b.upvotes - a.upvotes)
  return (
    <div className="p-4">
      <div className="mb-5 pt-4">
        <h2 style={{ fontFamily: "'Special Elite',cursive", color: C.text }} className="text-2xl mb-1">Trending Now</h2>
        <p style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[10px] tracking-widest">RANKED BY COMMUNITY UPVOTES</p>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {sorted.map((t, i) => (
          <div key={t.id} className="relative">
            <div className="absolute -top-2 -left-2 z-10 w-8 h-8 flex items-center justify-center rounded-sm text-sm font-bold shadow"
              style={{ fontFamily: "'Special Elite',cursive", backgroundColor: i < 3 ? C.orange : C.surface2, color: i < 3 ? 'white' : C.muted }}>
              {i + 1}
            </div>
            <TheoryCard theory={t} onUpvote={onUpvote} onSave={onSave} onAddComment={onAddComment} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── saved screen ─────────────────────────────────────────────────────────────

function SavedScreen({ theories, onUpvote, onSave, onAddComment }: {
  theories: Theory[]; onUpvote: (id: number) => void
  onSave: (id: number) => void; onAddComment: (id: number, text: string) => void
}) {
  const saved = theories.filter(t => t.saved)
  return (
    <div className="p-4">
      <div className="mb-5 pt-4">
        <h2 style={{ fontFamily: "'Special Elite',cursive", color: C.text }} className="text-2xl mb-1">Saved Files</h2>
        <p style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[10px] tracking-widest">{saved.length} THEORIES IN YOUR DOSSIER</p>
      </div>
      {saved.length === 0 ? (
        <div className="py-20 text-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-12 h-12 mx-auto mb-3" style={{ color: C.border }}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ fontFamily: "'Special Elite',cursive", color: C.muted }} className="text-xl mb-2">Your dossier is empty</p>
          <p style={{ fontFamily: "'Share Tech Mono',monospace", color: C.border }} className="text-xs tracking-widest">BOOKMARK THEORIES TO BUILD YOUR FILE</p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {saved.map(t => <TheoryCard key={t.id} theory={t} onUpvote={onUpvote} onSave={onSave} onAddComment={onAddComment} />)}
        </div>
      )}
    </div>
  )
}

// ─── app ─────────────────────────────────────────────────────────────────────

function formatTimeAgo(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function MainApp({ initialProfile, onSaveProfile, client, userId }: {
  initialProfile: Profile
  onSaveProfile: (profile: Profile) => Promise<void>
  client: NonNullable<typeof supabase>
  userId: string
}) {
  const [theories, setTheories] = useState<Theory[]>([])
  const [activeCategory, setActiveCategory] = useState<Category>('ALL')
  const [activeTab, setActiveTab] = useState<NavTab>('home')
  const [showSubmit, setShowSubmit] = useState(false)
  const [profile, setProfile] = useState<Profile>(initialProfile)
  const [archiveError, setArchiveError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  async function loadTheories() {
    const [theoryResult, commentResult, profileResult, voteResult, savedResult] = await Promise.all([
      client.from('theories').select('id, title, excerpt, category, image_url, classified, created_at, author_id').order('created_at', { ascending: false }),
      client.from('comments').select('id, theory_id, author_id, text, created_at').order('created_at', { ascending: true }),
      client.from('profiles').select('id, display_name, handle, avatar_url'),
      client.from('theory_votes').select('theory_id, user_id'),
      client.from('saved_theories').select('theory_id, user_id').eq('user_id', userId),
    ])
    const queryError = theoryResult.error || commentResult.error || profileResult.error || voteResult.error || savedResult.error
    if (queryError) throw queryError

    const profiles = new Map((profileResult.data || []).map(row => [row.id, row]))
    const commentsByTheory = new Map<number, Comment[]>()
    for (const row of commentResult.data || []) {
      const author = profiles.get(row.author_id)
      const comments = commentsByTheory.get(row.theory_id) || []
      comments.push({
        id: row.id,
        author: author?.handle || author?.display_name || 'Anonymous',
        avatar: author?.avatar_url || (author?.display_name || 'A')[0].toUpperCase(),
        text: row.text,
        time: formatTimeAgo(row.created_at),
      })
      commentsByTheory.set(row.theory_id, comments)
    }
    const votesByTheory = new Map<number, { count: number; mine: boolean }>()
    for (const row of voteResult.data || []) {
      const votes = votesByTheory.get(row.theory_id) || { count: 0, mine: false }
      votes.count += 1
      votes.mine ||= row.user_id === userId
      votesByTheory.set(row.theory_id, votes)
    }
    const savedIds = new Set((savedResult.data || []).map(row => row.theory_id))
    setTheories((theoryResult.data || []).map(row => {
      const author = profiles.get(row.author_id)
      const votes = votesByTheory.get(row.id) || { count: 0, mine: false }
      return {
        id: row.id,
        title: row.title,
        excerpt: row.excerpt,
        category: row.category as Exclude<Category, 'ALL'>,
        author: author?.handle || author?.display_name || 'Anonymous',
        avatar: author?.avatar_url || (author?.display_name || 'A')[0].toUpperCase(),
        date: new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: row.image_url || '',
        comments: commentsByTheory.get(row.id) || [],
        upvotes: votes.count,
        upvoted: votes.mine,
        saved: savedIds.has(row.id),
        classified: row.classified,
      }
    }))
  }

  useEffect(() => {
    let active = true
    setIsLoading(true)
    loadTheories()
      .catch(error => { if (active) setArchiveError(error instanceof Error ? error.message : 'Unable to load the archive.') })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [client, userId])

  async function handleSaveProfile(nextProfile: Profile) {
    try {
      const savedProfile = await onSaveProfile(nextProfile)
      setProfile(savedProfile)
      setArchiveError('')
    } catch (error) {
      setArchiveError(error instanceof Error ? error.message : 'Unable to save your profile.')
      throw error
    }
  }

  async function handleUpvote(id: number) {
    try {
      const theory = theories.find(item => item.id === id)
      if (!theory) return
      const result = theory.upvoted
        ? await client.from('theory_votes').delete().eq('theory_id', id).eq('user_id', userId)
        : await client.from('theory_votes').insert({ theory_id: id, user_id: userId })
      if (result.error) throw result.error
      setTheories(prev => prev.map(item => item.id === id
        ? { ...item, upvoted: !theory.upvoted, upvotes: item.upvotes + (theory.upvoted ? -1 : 1) }
        : item))
      setArchiveError('')
    } catch (error) {
      setArchiveError(error instanceof Error ? error.message : 'Unable to update your vote.')
    }
  }
  async function handleSave(id: number) {
    try {
      const theory = theories.find(item => item.id === id)
      if (!theory) return
      const result = theory.saved
        ? await client.from('saved_theories').delete().eq('theory_id', id).eq('user_id', userId)
        : await client.from('saved_theories').insert({ theory_id: id, user_id: userId })
      if (result.error) throw result.error
      setTheories(prev => prev.map(item => item.id === id ? { ...item, saved: !theory.saved } : item))
      setArchiveError('')
    } catch (error) {
      setArchiveError(error instanceof Error ? error.message : 'Unable to update saved files.')
    }
  }
  async function handleAddComment(id: number, text: string) {
    try {
      const { data, error } = await client.from('comments')
        .insert({ theory_id: id, author_id: userId, text })
        .select('id, created_at').single()
      if (error) throw error
      setTheories(prev => prev.map(theory => theory.id === id ? {
        ...theory,
        comments: [...theory.comments, {
          id: data.id,
          author: profile.handle || profile.name || 'Anonymous',
          avatar: profile.name?.[0]?.toUpperCase() || 'A',
          text,
          time: formatTimeAgo(data.created_at),
        }],
      } : theory))
      setArchiveError('')
    } catch (error) {
      setArchiveError(error instanceof Error ? error.message : 'Unable to post your comment.')
    }
  }
  async function handleSubmitTheory(data: Omit<Theory, 'id' | 'upvotes' | 'upvoted' | 'saved' | 'comments'> & { imageFile: File | null }) {
    let imageUrl: string | null = null
    let imagePath: string | null = null
    if (data.imageFile) {
      const extension = data.imageFile.type.split('/')[1] || 'img'
      imagePath = `${userId}/${crypto.randomUUID()}.${extension}`
      const { error: uploadError } = await client.storage.from('theory-images').upload(imagePath, data.imageFile)
      if (uploadError) throw uploadError
      imageUrl = client.storage.from('theory-images').getPublicUrl(imagePath).data.publicUrl
    }
    const { error } = await client.from('theories').insert({
      author_id: userId,
      title: data.title,
      excerpt: data.excerpt,
      category: data.category,
      classified: data.classified,
      image_url: imageUrl,
    })
    if (error) {
      if (imagePath) await client.storage.from('theory-images').remove([imagePath])
      throw error
    }
    await loadTheories()
    setShowSubmit(false)
    setActiveTab('home')
  }

  const NAV: { tab: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      tab: 'home', label: 'Home',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    },
    {
      tab: 'trending', label: 'Trending',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    },
    {
      tab: 'submit', label: 'File',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>,
    },
    {
      tab: 'saved', label: 'Saved',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    },
    {
      tab: 'profile', label: 'Profile',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    },
  ]

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', fontFamily: "'Source Sans 3',sans-serif" }} className="flex flex-col">

      {/* top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: C.bg, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: C.cream, border: `2px dashed ${C.teal}` }}>
            <span style={{ fontFamily: "'Special Elite',cursive" }} className="text-sm font-bold leading-none select-none">
              <span style={{ color: C.orange }}>K</span><span style={{ color: C.tealDeep }}>M</span>
            </span>
          </div>
          <div>
            <div style={{ fontFamily: "'Special Elite',cursive", color: C.text }} className="text-base leading-none tracking-wide">KM Awareness</div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }} className="text-[9px] tracking-[0.2em]">STAY INFORMED</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted }}
            className="hidden sm:flex items-center gap-1.5 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.teal }} />
            {theories.length} ACTIVE FILES
          </div>
          {/* account button → goes to profile tab */}
          <button onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white hover:brightness-110 transition-all overflow-hidden"
            style={{ backgroundColor: profile.avatar.startsWith('data:') ? C.tealDeep : 'transparent', border: `2px solid ${activeTab === 'profile' ? C.orange : C.teal}` }}>
            {profile.avatar.startsWith('data:') ? (
              <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span style={{ fontFamily: "'Special Elite',cursive" }}>{profile.name ? profile.name[0].toUpperCase() : '?'}</span>
            )}
          </button>
        </div>
      </header>

      {/* main content */}
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: '72px' }}>
        {archiveError && (
          <div role="alert" className="mx-4 mt-3 border px-3 py-2 text-sm" style={{ borderColor: C.orange, color: C.cream }}>
            {archiveError}
          </div>
        )}
        {isLoading ? (
          <div className="py-20 text-center" style={{ color: C.muted, fontFamily: "'Share Tech Mono',monospace" }}>LOADING ARCHIVE...</div>
        ) : (
        showSubmit ? (
          <SubmitPage onSubmit={handleSubmitTheory} onCancel={() => setShowSubmit(false)} />
        ) : activeTab === 'home' ? (
          <HomeScreen theories={theories} onUpvote={handleUpvote} onSave={handleSave}
            onAddComment={handleAddComment} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        ) : activeTab === 'trending' ? (
          <TrendingScreen theories={theories} onUpvote={handleUpvote} onSave={handleSave} onAddComment={handleAddComment} />
        ) : activeTab === 'saved' ? (
          <SavedScreen theories={theories} onUpvote={handleUpvote} onSave={handleSave} onAddComment={handleAddComment} />
        ) : activeTab === 'profile' ? (
          <ProfilePage profile={profile} theories={theories} onSave={handleSaveProfile} />
        ) : null
        )}
      </main>

      {/* bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}` }}>
        {NAV.map(({ tab, label, icon }) => {
          const isFile = tab === 'submit'
          const isActive = !showSubmit ? activeTab === tab : tab === 'submit'
          return (
            <button key={tab}
              onClick={() => isFile ? setShowSubmit(true) : (setActiveTab(tab), setShowSubmit(false))}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all relative"
              style={{ color: isActive ? C.orange : C.muted }}>
              {isFile ? (
                <div className="w-11 h-11 rounded-full flex items-center justify-center -mt-5 shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: showSubmit ? C.tealDark : C.orange, color: 'white' }}>
                  {icon}
                </div>
              ) : icon}
              {!isFile && (
                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '9px', letterSpacing: '0.1em' }} className="uppercase">{label}</span>
              )}
              {isActive && !isFile && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full" style={{ backgroundColor: C.orange }} />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default function App() {
  const supabaseClient = supabase
  const [authScreen, setAuthScreen] = useState<AuthScreen>('loading')
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile>({ name: '', handle: '', bio: '', avatar: '' })

  async function loadProfile(id: string, fallbackName = '') {
    if (!supabaseClient) throw new Error('Supabase deployment settings are missing.')
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('display_name, handle, bio, avatar_url, onboarding_completed')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error

    let row = data
    if (!row) {
      const { data: inserted, error: insertError } = await supabaseClient
        .from('profiles')
        .upsert({ id, display_name: fallbackName || null }, { onConflict: 'id' })
        .select('display_name, handle, bio, avatar_url, onboarding_completed')
        .single()
      if (insertError) throw insertError
      row = inserted
    }

    const nextProfile = {
      name: row.display_name || fallbackName,
      handle: row.handle || '',
      bio: row.bio || '',
      avatar: row.avatar_url || '',
    }
    setUserId(id)
    setProfile(nextProfile)
    setAuthScreen(row.onboarding_completed ? 'app' : 'onboarding')
  }

  useEffect(() => {
    let active = true
    if (!supabaseClient) return () => { active = false }
    supabaseClient.auth.getSession().then(async ({ data, error }) => {
      if (!active) return
      if (error || !data.session) {
        setAuthScreen('signup')
        return
      }
      try {
        await loadProfile(data.session.user.id, data.session.user.user_metadata.display_name || '')
      } catch {
        if (active) setAuthScreen('signin')
      }
    })
    return () => { active = false }
  }, [])

  async function handleSignUp(name: string, email: string, password: string) {
    if (!supabaseClient) throw new Error('Supabase deployment settings are missing.')
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name },
        emailRedirectTo: window.location.origin,
      },
    })
    if (error) throw error
    if (!data.session || !data.user) return true
    await loadProfile(data.user.id, name)
    return false
  }

  async function handleSocialAuth(provider: Provider) {
    if (!supabaseClient) throw new Error('Supabase deployment settings are missing.')
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }

  async function handleSignIn(email: string, password: string) {
    if (!supabaseClient) throw new Error('Supabase deployment settings are missing.')
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password })
    if (error) throw error
    await loadProfile(data.user.id, data.user.user_metadata.display_name || '')
  }

  async function handlePasswordReset(email: string) {
    if (!supabaseClient) throw new Error('Supabase deployment settings are missing.')
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    if (error) throw error
  }

  async function handleOnboardingComplete(preferences: OnboardingPreferences) {
    if (!userId) throw new Error('Your session has expired. Please sign in again.')
    if (!supabaseClient) throw new Error('Supabase deployment settings are missing.')
    const { error } = await supabaseClient.from('profiles').update({
      interests: preferences.interests,
      notification_breaking: preferences.notifications.breaking,
      notification_comments: preferences.notifications.comments,
      notification_weekly: preferences.notifications.weekly,
      onboarding_completed: true,
    }).eq('id', userId)
    if (error) throw error
    setAuthScreen('app')
  }

  async function handleProfileSave(nextProfile: Profile) {
    if (!userId) throw new Error('Your session has expired. Please sign in again.')
    if (!supabaseClient) throw new Error('Supabase deployment settings are missing.')
    let avatarUrl = nextProfile.avatar
    if (nextProfile.avatar.startsWith('data:')) {
      const avatarBlob = await (await fetch(nextProfile.avatar)).blob()
      const extension = avatarBlob.type.split('/')[1] || 'img'
      const path = `${userId}/${crypto.randomUUID()}.${extension}`
      const { error: uploadError } = await supabaseClient.storage.from('avatars').upload(path, avatarBlob, {
        contentType: avatarBlob.type,
      })
      if (uploadError) throw uploadError
      avatarUrl = supabaseClient.storage.from('avatars').getPublicUrl(path).data.publicUrl
    }
    const { error } = await supabaseClient.from('profiles').update({
      display_name: nextProfile.name.trim() || null,
      handle: nextProfile.handle.trim().replace(/^@/, '') || null,
      bio: nextProfile.bio,
      avatar_url: avatarUrl || null,
    }).eq('id', userId)
    if (error) throw error
    const savedProfile = { ...nextProfile, avatar: avatarUrl }
    setProfile(savedProfile)
    return savedProfile
  }

  if (!supabaseClient) {
    return (
      <main className="min-h-screen grid place-items-center bg-[#0c2f2f] px-6 text-[#f0f7f7]">
        <section className="max-w-lg border border-[#1e5050] bg-[#0f3535] p-6">
          <h1 className="mb-3 text-xl font-bold text-[#f5e6c8]">Deployment configuration needed</h1>
          <p className="text-sm leading-6 text-[#b8d1d1]">
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to this Vercel project’s Environment Variables, then redeploy.
          </p>
        </section>
      </main>
    )
  }

  if (authScreen === 'loading') {
    return <div className="min-h-screen grid place-items-center bg-[#0c2f2f] text-[#f5e6c8]">Loading account...</div>
  }

  if (authScreen === 'signup')
    return <SignUpPage onSignUp={handleSignUp} onSocialSignUp={handleSocialAuth} onSignIn={() => setAuthScreen('signin')} />
  if (authScreen === 'signin')
    return <SignInPage onSignIn={handleSignIn} onSocialSignIn={handleSocialAuth} onSignUp={() => setAuthScreen('signup')} onForgotPassword={() => setAuthScreen('forgot')} />
  if (authScreen === 'forgot')
    return <ForgotPasswordPage onBack={() => setAuthScreen('signin')} onReset={handlePasswordReset} />
  if (authScreen === 'onboarding')
    return <OnboardingFlow onComplete={handleOnboardingComplete} />

  return <MainApp initialProfile={profile} onSaveProfile={handleProfileSave} client={supabaseClient} userId={userId!} />
}
