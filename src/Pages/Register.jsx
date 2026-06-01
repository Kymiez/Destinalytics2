import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Registration failed. Please try again.')
        setLoading(false)
        return
      }

      // Save token and user info
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      navigate('/')
    } catch (err) {
      setError('Cannot connect to server. Make sure the server is running.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Left: Hero */}
      <div className="auth-hero">
        <img
          src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=80"
          alt="Kuala Lumpur skyline"
          className="auth-hero-img"
        />
        <div className="auth-hero-overlay" />
        <div className="auth-hero-content">
          <div className="auth-hero-logo">
            <img src="/logo.png" alt="Destinalytics" className="auth-hero-logo-img" />
            <span>Destinalytics</span>
          </div>
          <h1 className="auth-hero-title">
            Start Your<br /><span className="auth-accent">Kuala Lumpur</span><br />Journey Today
          </h1>
          <p className="auth-hero-sub">
            Create your Destinalytics account and explore smart tourism experiences, hotel comparisons, attractions, and personalized trip planning.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-card-logo">
            <img src="/logo.png" alt="Destinalytics" className="auth-card-logo-img" />
            <span className="auth-card-brand">Destinalytics</span>
          </div>

          <h2 className="auth-card-title">Create Account</h2>
          <p className="auth-card-sub">Register and begin planning your next adventure.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create password (min. 6 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className={`auth-btn ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Create Account'}
            </button>

            <p className="auth-switch">
              Already have an account?{' '}
              <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register