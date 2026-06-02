import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'
const API = import.meta.env.VITE_API_URL || ''

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed. Please try again.')
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
            Explore <span className="auth-accent">Kuala<br />Lumpur</span> with<br />Destinalytics
          </h1>
          <p className="auth-hero-sub">
            Discover hotels, attractions, smart trip planning, and personalized travel experiences with a modern tourism platform.
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

          <h2 className="auth-card-title">Welcome Back</h2>
          <p className="auth-card-sub">Login to continue your Kuala Lumpur journey.</p>

          <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-row">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="auth-forgot">Forgot Password?</a>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className={`auth-btn ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Login'}
            </button>

            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/register">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login