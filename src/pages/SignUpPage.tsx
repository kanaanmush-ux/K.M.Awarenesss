import { useState } from 'react'

interface Props {
  onSignUp: (name: string, email: string, password: string) => Promise<boolean>
  onSignIn: () => void
}

export default function SignUpPage({ onSignUp, onSignIn }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!email.includes('@')) e.email = 'Valid email required'
    if (password.length < 6) e.password = 'Min 6 characters'
    if (password !== confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setMessage('')
    setIsSubmitting(true)
    try {
      const confirmationRequired = await onSignUp(name.trim(), email.trim(), password)
      if (confirmationRequired) setMessage('Check your email to confirm your account, then sign in.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create your account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#e07838',
    borderRadius: '14px',
    padding: '14px 16px 14px 48px',
    color: 'white',
    fontFamily: "'Baloo 2', sans-serif",
    fontWeight: 700,
    fontSize: '14px',
    letterSpacing: '0.08em',
    width: '100%',
    border: 'none',
    outline: 'none',
  }

  return (
    <div style={{ backgroundColor: '#1aacab', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', fontFamily: "'Baloo 2', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>

        {/* KM Logo */}
        <div style={{
          width: '110px', height: '110px', borderRadius: '50%',
          backgroundColor: '#f5e6c8', border: '2px dashed #3b7ea0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          <span style={{ fontSize: '32px', fontWeight: 900, fontFamily: "'Baloo 2', sans-serif", lineHeight: 1 }}>
            <span style={{ color: '#e07838' }}>K</span>
            <span style={{ color: '#3b7ea0' }}>M</span>
          </span>
        </div>

        {/* Subtitle */}
        <p style={{ color: 'white', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px', opacity: 0.9 }}>
          Create your account to join the archive.
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Full Name */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} width={20} height={20}>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Enter Full Name" style={inputStyle}
              className="placeholder:text-white/70"
            />
            {errors.name && <p style={{ color: '#fff', fontSize: '10px', marginTop: '4px', paddingLeft: '4px', opacity: 0.85 }}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} width={20} height={20}>
                <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 7l10 7 10-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Enter Email" style={inputStyle}
              className="placeholder:text-white/70"
            />
            {errors.email && <p style={{ color: '#fff', fontSize: '10px', marginTop: '4px', paddingLeft: '4px', opacity: 0.85 }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} width={20} height={20}>
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1.5" fill="white" />
              </svg>
            </div>
            <input
              type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter Password" style={{ ...inputStyle, paddingRight: '48px' }}
              className="placeholder:text-white/70"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
              {showPass ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} width={20} height={20}>
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} width={20} height={20}>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
            {errors.password && <p style={{ color: '#fff', fontSize: '10px', marginTop: '4px', paddingLeft: '4px', opacity: 0.85 }}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} width={20} height={20}>
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
                <path d="M9 16l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" stroke="white" />
              </svg>
            </div>
            <input
              type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Confirm Password" style={inputStyle}
              className="placeholder:text-white/70"
            />
            {errors.confirm && <p style={{ color: '#fff', fontSize: '10px', marginTop: '4px', paddingLeft: '4px', opacity: 0.85 }}>{errors.confirm}</p>}
          </div>

          {/* Remember + Have account */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div onClick={() => setRemember(!remember)} style={{
                width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.7)',
                backgroundColor: remember ? 'white' : 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {remember && <svg viewBox="0 0 12 12" width={10} height={10}><path d="M1 6l3 3 7-7" stroke="#1aacab" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>Remember Me</span>
            </label>
            <button type="button" onClick={onSignIn}
              style={{ color: 'white', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Baloo 2', sans-serif" }}>
              I have an account
            </button>
          </div>

          {message && <p role="status" aria-live="polite" style={{ color: 'white', fontSize: '12px', lineHeight: 1.4 }}>{message}</p>}

          {/* Sign Up button */}
          <button type="submit"
            style={{
              backgroundColor: '#f5e6c8', color: '#e07838', fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 800, fontSize: '16px', letterSpacing: '0.1em', textTransform: 'uppercase',
              border: 'none', borderRadius: '14px', padding: '16px', cursor: 'pointer',
              marginTop: '4px', transition: 'opacity 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            disabled={isSubmitting}>
            {isSubmitting ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </button>
        </form>

        {/* Social sign up */}
        <div style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>
          <p style={{ color: 'white', fontSize: '13px', fontWeight: 600, marginBottom: '16px', opacity: 0.9 }}>Or sign up with</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            {/* Google */}
            <button style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <svg viewBox="0 0 24 24" width={22} height={22}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
            {/* X / Twitter */}
            <button style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'black', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              <svg viewBox="0 0 24 24" width={20} height={20} fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
            {/* Facebook */}
            <button style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#1877F2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <svg viewBox="0 0 24 24" width={22} height={22} fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            {/* Apple */}
            <button style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'black', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              <svg viewBox="0 0 24 24" width={20} height={20} fill="white">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
