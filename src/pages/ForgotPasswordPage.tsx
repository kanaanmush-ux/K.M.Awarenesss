import { useState } from 'react'

interface Props { onBack: () => void; onReset: (email: string) => Promise<void> }

export default function ForgotPasswordPage({ onBack, onReset }: Props) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setMessage('')
    setIsSubmitting(true)
    try {
      await onReset(email.trim())
      setSubmitted(true)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to send reset instructions.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#e07838', borderRadius: '14px',
    padding: '14px 16px 14px 48px', color: 'white',
    fontFamily: "'Baloo 2', sans-serif", fontWeight: 700,
    fontSize: '14px', letterSpacing: '0.08em', textTransform: 'uppercase',
    width: '100%', border: 'none', outline: 'none',
  }

  return (
    <div style={{ backgroundColor: '#1aacab', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', fontFamily: "'Baloo 2', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* KM Logo */}
        <div style={{
          width: '110px', height: '110px', borderRadius: '50%',
          backgroundColor: '#f5e6c8', border: '2px dashed #3b7ea0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          <span style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1 }}>
            <span style={{ color: '#e07838' }}>K</span>
            <span style={{ color: '#3b7ea0' }}>M</span>
          </span>
        </div>

        {!submitted ? (
          <>
            <div style={{ width: '100%', marginBottom: '24px' }}>
              <h1 style={{ color: '#e07838', fontWeight: 900, fontSize: '26px', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1, marginBottom: '6px' }}>Forgot Password?</h1>
              <p style={{ color: 'white', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.9 }}>We'll send you reset instructions.</p>
            </div>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} width={20} height={20}>
                    <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" /><path d="M2 7l10 7 10-7" strokeLinecap="round" />
                  </svg>
                </div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter Email"
                  style={inputStyle} className="placeholder:text-white/70" required />
              </div>
              {message && <p role="alert" aria-live="polite" style={{ color: 'white', fontSize: '12px' }}>{message}</p>}
              <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#f5e6c8', color: '#e07838', fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '15px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: '14px', padding: '15px', cursor: 'pointer' }}>
                {isSubmitting ? 'SENDING...' : 'RESET PASSWORD'}
              </button>
            </form>
            <button onClick={onBack} style={{ marginTop: '20px', color: 'white', fontWeight: 600, fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Baloo 2', sans-serif", opacity: 0.9 }}>
              ← Back to Sign In
            </button>
          </>
        ) : (
          <>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e07838', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} width={30} height={30}>
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 style={{ color: '#e07838', fontWeight: 900, fontSize: '24px', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>Check Your Email!</h1>
            <p style={{ color: 'white', fontSize: '13px', fontWeight: 600, textAlign: 'center', opacity: 0.9, marginBottom: '24px', lineHeight: 1.5 }}>
              We sent a reset link to<br /><span style={{ color: '#f5e6c8' }}>{email}</span>
            </p>
            <button onClick={onBack} style={{ backgroundColor: '#f5e6c8', color: '#e07838', fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '15px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: '14px', padding: '15px', width: '100%', cursor: 'pointer' }}>
              BACK TO SIGN IN
            </button>
          </>
        )}
      </div>
    </div>
  )
}
