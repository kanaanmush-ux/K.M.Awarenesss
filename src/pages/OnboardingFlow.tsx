import { useState } from 'react'

type OCategory = 'GOVERNMENT' | 'PARANORMAL' | 'TECHNOLOGY' | 'HISTORY' | 'SPACE'

const INTERESTS: { id: OCategory; emoji: string; label: string; desc: string }[] = [
  { id: 'GOVERNMENT', emoji: '🏛', label: 'Government', desc: 'Cover-ups, agencies, policies' },
  { id: 'PARANORMAL', emoji: '👁', label: 'Paranormal', desc: 'UAPs, entities, unexplained' },
  { id: 'TECHNOLOGY', emoji: '⚡', label: 'Technology', desc: 'AI, surveillance, digital ops' },
  { id: 'HISTORY', emoji: '📜', label: 'History', desc: 'Suppressed events, lost eras' },
  { id: 'SPACE', emoji: '🌌', label: 'Space', desc: 'Cosmos, quarantine, contact' },
]

const C = {
  teal: '#1aacab', tealDeep: '#0d6e6e', tealDark: '#148e8e',
  orange: '#e07838', cream: '#f5e6c8',
  bg: '#0c2f2f', surface: '#0f3535', surface2: '#133d3d',
  border: '#1e5050', text: '#f0f7f7', muted: '#6aadad',
}

interface OnboardingPreferences {
  interests: OCategory[]
  notifications: { breaking: boolean; comments: boolean; weekly: boolean }
}

interface Props { onComplete: (preferences: OnboardingPreferences) => Promise<void> }

export default function OnboardingFlow({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<Set<OCategory>>(new Set())
  const [notifBreaking, setNotifBreaking] = useState(true)
  const [notifComments, setNotifComments] = useState(true)
  const [notifWeekly, setNotifWeekly] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  async function completeOnboarding() {
    setIsSaving(true)
    setSaveError('')
    try {
      await onComplete({
        interests: [...selected],
        notifications: { breaking: notifBreaking, comments: notifComments, weekly: notifWeekly },
      })
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save your preferences.')
    } finally {
      setIsSaving(false)
    }
  }

  const STEPS = ['Welcome', 'Interests', 'Notifications', 'Ready']

  function toggleInterest(id: OCategory) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function ProgressDots() {
    return (
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            width: i === step ? '24px' : '8px', height: '8px', borderRadius: '4px',
            backgroundColor: i === step ? C.orange : i < step ? C.teal : C.border,
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
    )
  }

  function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
    return (
      <button type="button" onClick={onChange}
        style={{
          width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer',
          backgroundColor: value ? C.teal : C.surface2,
          outline: `1px solid ${value ? C.teal : C.border}`,
          position: 'relative', transition: 'all 0.2s', flexShrink: 0,
        }}>
        <span style={{
          position: 'absolute', top: '50%', transform: 'translateY(-50%)',
          left: value ? '26px' : '4px', width: '18px', height: '18px',
          borderRadius: '50%', backgroundColor: 'white', transition: 'left 0.2s',
        }} />
      </button>
    )
  }

  // ── Step 0: Welcome ──
  if (step === 0) {
    return (
      <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: "'Source Sans 3', sans-serif" }}>
        <ProgressDots />
        {/* Logo */}
        <div style={{
          width: '96px', height: '96px', borderRadius: '50%',
          backgroundColor: C.cream, border: `2px dashed ${C.teal}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px',
        }}>
          <span style={{ fontFamily: "'Special Elite', cursive", fontSize: '28px', fontWeight: 900 }}>
            <span style={{ color: C.orange }}>K</span><span style={{ color: C.tealDeep }}>M</span>
          </span>
        </div>

        <div style={{ textAlign: 'center', maxWidth: '300px', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: "'Special Elite', cursive", color: C.text, fontSize: '32px', lineHeight: 1.2, marginBottom: '16px' }}>
            Welcome to<br /><span style={{ color: C.orange }}>KM Awareness</span>
          </h1>
          <p style={{ color: C.muted, fontSize: '15px', lineHeight: 1.6 }}>
            A community archive of urban myths, suppressed history, and the theories they don't want you to connect.
          </p>
        </div>

        {/* Feature highlights */}
        <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
          {[
            { icon: '📡', title: 'Browse the Archive', desc: 'Hundreds of community-filed theories' },
            { icon: '🗂', title: 'File Your Own', desc: 'Submit theories with evidence & images' },
            { icon: '💬', title: 'Join the Discussion', desc: 'Comment, upvote, and connect dots' },
          ].map(f => (
            <div key={f.title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '14px 16px' }}>
              <span style={{ fontSize: '22px', lineHeight: 1, marginTop: '2px' }}>{f.icon}</span>
              <div>
                <div style={{ fontFamily: "'Special Elite', cursive", color: C.text, fontSize: '16px', marginBottom: '2px' }}>{f.title}</div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", color: C.muted, fontSize: '11px', letterSpacing: '0.05em' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setStep(1)} style={{
          width: '100%', maxWidth: '340px', backgroundColor: C.orange, color: 'white',
          fontFamily: "'Share Tech Mono', monospace", fontWeight: 700, fontSize: '12px',
          letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none',
          borderRadius: '6px', padding: '16px', cursor: 'pointer',
        }}>
          GET STARTED →
        </button>
      </div>
    )
  }

  // ── Step 1: Interests ──
  if (step === 1) {
    return (
      <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px', fontFamily: "'Source Sans 3', sans-serif" }}>
        <ProgressDots />
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", color: C.orange, fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>
            STEP 2 OF 4
          </p>
          <h2 style={{ fontFamily: "'Special Elite', cursive", color: C.text, fontSize: '28px', lineHeight: 1.2, marginBottom: '8px' }}>
            What are you tracking?
          </h2>
          <p style={{ color: C.muted, fontSize: '14px' }}>Pick the categories that matter most to you.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          {INTERESTS.map(({ id, emoji, label, desc }) => {
            const isOn = selected.has(id)
            return (
              <button key={id} onClick={() => toggleInterest(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  backgroundColor: isOn ? `${C.teal}15` : C.surface,
                  border: `1.5px solid ${isOn ? C.teal : C.border}`,
                  borderRadius: '10px', padding: '14px 16px',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                }}>
                <span style={{ fontSize: '24px', width: '32px', textAlign: 'center' }}>{emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Special Elite', cursive", color: isOn ? C.text : C.muted, fontSize: '18px', lineHeight: 1, marginBottom: '3px' }}>{label}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", color: C.muted, fontSize: '10px', letterSpacing: '0.05em', opacity: 0.8 }}>{desc}</div>
                </div>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  backgroundColor: isOn ? C.teal : 'transparent',
                  border: `2px solid ${isOn ? C.teal : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isOn && <svg viewBox="0 0 12 12" width={10} height={10}><path d="M1 6l3 3 7-7" stroke="white" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button onClick={() => setStep(0)} style={{
            flex: '0 0 auto', backgroundColor: 'transparent', color: C.muted,
            fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', letterSpacing: '0.15em',
            textTransform: 'uppercase', border: `1px solid ${C.border}`, borderRadius: '6px',
            padding: '14px 20px', cursor: 'pointer',
          }}>← BACK</button>
          <button onClick={() => setStep(2)} style={{
            flex: 1, backgroundColor: selected.size > 0 ? C.orange : C.surface2, color: 'white',
            fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', letterSpacing: '0.2em',
            textTransform: 'uppercase', border: `1px solid ${selected.size > 0 ? C.orange : C.border}`,
            borderRadius: '6px', padding: '14px', cursor: 'pointer',
          }}>
            {selected.size > 0 ? `CONTINUE (${selected.size} selected) →` : 'SKIP →'}
          </button>
        </div>
      </div>
    )
  }

  // ── Step 2: Notifications ──
  if (step === 2) {
    return (
      <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px', fontFamily: "'Source Sans 3', sans-serif" }}>
        <ProgressDots />
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", color: C.orange, fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>
            STEP 3 OF 4
          </p>
          <h2 style={{ fontFamily: "'Special Elite', cursive", color: C.text, fontSize: '28px', lineHeight: 1.2, marginBottom: '8px' }}>
            Stay in the loop
          </h2>
          <p style={{ color: C.muted, fontSize: '14px' }}>Choose how you want to be alerted.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>
          {[
            { label: 'Breaking theories', desc: 'Alerts when high-upvote theories go live', value: notifBreaking, onChange: () => setNotifBreaking(v => !v) },
            { label: 'Comment replies', desc: 'When someone responds to your transmissions', value: notifComments, onChange: () => setNotifComments(v => !v) },
            { label: 'Weekly digest', desc: 'Sunday roundup of top theories', value: notifWeekly, onChange: () => setNotifWeekly(v => !v) },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 16px',
              borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <div>
                <div style={{ fontFamily: "'Special Elite', cursive", color: C.text, fontSize: '17px', marginBottom: '2px' }}>{item.label}</div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", color: C.muted, fontSize: '10px', letterSpacing: '0.05em' }}>{item.desc}</div>
              </div>
              <Toggle value={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '16px', marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '20px', flexShrink: 0 }}>🔒</span>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", color: C.muted, fontSize: '10px', lineHeight: 1.6, letterSpacing: '0.03em' }}>
            KM Awareness never sells your data or shares your identity. Notifications are optional and can be changed at any time in your profile settings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '24px' }}>
          <button onClick={() => setStep(1)} style={{
            flex: '0 0 auto', backgroundColor: 'transparent', color: C.muted,
            fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', letterSpacing: '0.15em',
            textTransform: 'uppercase', border: `1px solid ${C.border}`, borderRadius: '6px',
            padding: '14px 20px', cursor: 'pointer',
          }}>← BACK</button>
          <button onClick={() => setStep(3)} style={{
            flex: 1, backgroundColor: C.orange, color: 'white',
            fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', letterSpacing: '0.2em',
            textTransform: 'uppercase', border: 'none', borderRadius: '6px', padding: '14px', cursor: 'pointer',
          }}>CONTINUE →</button>
        </div>
      </div>
    )
  }

  // ── Step 3: Ready ──
  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: "'Source Sans 3', sans-serif", textAlign: 'center' }}>
      <ProgressDots />

      {/* animated check */}
      <div style={{
        width: '88px', height: '88px', borderRadius: '50%',
        backgroundColor: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '28px', boxShadow: `0 0 40px ${C.teal}50`,
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} width={40} height={40}>
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2 style={{ fontFamily: "'Special Elite', cursive", color: C.text, fontSize: '32px', lineHeight: 1.2, marginBottom: '12px' }}>
        You're all set,<br /><span style={{ color: C.orange }}>Operative.</span>
      </h2>
      <p style={{ color: C.muted, fontSize: '15px', lineHeight: 1.6, maxWidth: '280px', marginBottom: '40px' }}>
        Your profile is ready. The archive is waiting. Start connecting the dots.
      </p>

      {selected.size > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
          {[...selected].map(cat => (
            <span key={cat} style={{
              backgroundColor: C.surface2, border: `1px solid ${C.border}`,
              fontFamily: "'Share Tech Mono', monospace", color: C.teal,
              fontSize: '10px', letterSpacing: '0.15em', padding: '5px 12px', borderRadius: '4px',
            }}>
              {INTERESTS.find(i => i.id === cat)?.emoji} {cat}
            </span>
          ))}
        </div>
      )}

      {saveError && <p role="alert" aria-live="polite" style={{ color: C.cream, fontSize: '13px', marginBottom: '12px' }}>{saveError}</p>}
      <button onClick={completeOnboarding} disabled={isSaving} style={{
        width: '100%', maxWidth: '340px', backgroundColor: C.orange, color: 'white',
        fontFamily: "'Share Tech Mono', monospace", fontWeight: 700, fontSize: '12px',
        letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none',
        borderRadius: '6px', padding: '18px', cursor: 'pointer',
        boxShadow: `0 4px 20px ${C.orange}40`, opacity: isSaving ? 0.7 : 1,
      }}>
        {isSaving ? 'SAVING...' : 'ENTER THE ARCHIVE →'}
      </button>
    </div>
  )
}
