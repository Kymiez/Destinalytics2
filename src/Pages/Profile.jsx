import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Profile.css'

const DUMMY_WISHLIST = [
  { id: 1, name: 'St Regis KL', type: 'Hotel', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80', price: 300, location: 'Kuala Lumpur', link: '/hotels/4' },
  { id: 2, name: 'Sunway Lagoon', type: 'Attraction', img: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400&q=80', price: 85, location: 'Subang, KL', link: '/attractions/7' },
  { id: 3, name: 'Hyatt Centric Hotel KL', type: 'Hotel', img: 'https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?w=400&q=80', price: 340, location: 'Kuala Lumpur', link: '/hotels/7' },
  { id: 4, name: 'KL Bird Park', type: 'Attraction', img: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80', price: 35, location: 'Kuala Lumpur', link: '/attractions/4' },
]

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getDayCount(start, end) {
  if (!start || !end) return 0
  const diff = new Date(end) - new Date(start)
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)) + 1)
}

const TABS = ['Overview', 'Saved Planners', 'Wishlist', 'Favourites']

export default function Profile() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')
  const [selectedPlanner, setSelectedPlanner] = useState(null)
  const [wishlist, setWishlist] = useState(DUMMY_WISHLIST)

  const [user, setUser] = useState(null)
  const [planners, setPlanners] = useState([])
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editMode, setEditMode] = useState(false)
  const [userForm, setUserForm] = useState({ name: '', currentPassword: '', newPassword: '' })
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')
  const [editSuccess, setEditSuccess] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      setLoading(false)
      navigate('/login')
      return
    }

    setLoading(true)
    fetchProfile()
    fetchTrips()
    fetchFavourites()
  }, [token, navigate])

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
        return
      }
      const data = await res.json()
      setUser(data)
      setUserForm({ name: data.name, currentPassword: '', newPassword: '' })
    } catch (err) {
      setError('Failed to load profile.')
    } finally {
      setLoading(false)
    }
  }

  async function fetchTrips() {
    try {
      const res = await fetch('/api/trips', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()

      // Normalize each trip — handle both old schema (notes field) and new schema (direct fields)
      const normalized = data.map(trip => {
        // NEW SCHEMA: has tripName, estimatedBudget, totalCost, guests, activities directly
        if (trip.tripName !== undefined) {
          return {
            ...trip,
            name: trip.tripName,
            estimatedBudget: parseFloat(trip.estimatedBudget) || 0,
            totalCost: parseFloat(trip.totalCost) || 0,
            guests: trip.guests || 1,
            activities: Array.isArray(trip.activities)
              ? trip.activities
              : (() => { try { return JSON.parse(trip.activities || '[]') } catch { return [] } })(),
          }
        }

        // OLD SCHEMA fallback: everything was jammed into notes as JSON
        let notes = {}
        try { notes = JSON.parse(trip.notes || '{}') } catch {}
        const activities = notes.activities || []
        return {
          ...trip,
          name: trip.destination || 'Untitled Trip',
          estimatedBudget: parseFloat(notes.estimatedBudget) || 0,
          guests: notes.guests || 1,
          activities,
          totalCost: activities.reduce((s, a) => s + (parseFloat(a.cost) || 0), 0),
        }
      })

      setPlanners(normalized)
    } catch (err) {
      setError('Failed to load trips.')
    } finally {
      setLoading(false)
    }
  }

  async function fetchFavourites() {
    try {
      const res = await fetch('/api/favorites', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) {
        setFavourites([])
        return
      }
      const data = await res.json()
      setFavourites(data)
    } catch {
      setFavourites([])
    }
  }

  async function handleDeleteFavourite(e, favId) {
    e.stopPropagation()
    try {
      await fetch(`/api/favorites/${favId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setFavourites(prev => prev.filter(item => item.id !== favId))
    } catch {
      alert('Unable to remove favorite.')
    }
  }

  async function handleSaveProfile() {
    setEditSaving(true)
    setEditError('')
    setEditSuccess('')
    try {
      const body = { name: userForm.name }
      if (userForm.newPassword) {
        body.currentPassword = userForm.currentPassword
        body.newPassword = userForm.newPassword
      }
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) { setEditError(data.message || 'Failed to update.'); setEditSaving(false); return }
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      setEditSuccess('Profile updated successfully!')
      setEditSaving(false)
      setEditMode(false)
      setTimeout(() => setEditSuccess(''), 3000)
    } catch {
      setEditError('Cannot connect to server.')
      setEditSaving(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  async function handleDeleteTrip(e, tripId) {
    e.stopPropagation()
    if (!window.confirm('Delete this trip?')) return
    try {
      await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setPlanners(prev => prev.filter(p => p.id !== tripId))
    } catch {
      alert('Failed to delete trip.')
    }
  }

  function removeWishlist(id) {
    setWishlist(prev => prev.filter(w => w.id !== id))
  }

  const totalSpent = planners.reduce((s, p) => s + (parseFloat(p.totalCost) || 0), 0)
  const totalTrips = planners.length
  const totalDays = planners.reduce((s, p) => s + getDayCount(p.startDate, p.endDate), 0)
  const totalActivities = planners.reduce((s, p) => s + (p.activities?.length || 0), 0)

  if (loading) {
    return (
      <div className="profile-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: '#888' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: '#e05555' }}>
          <p>{error}</p>
          <button onClick={() => { setError(''); setLoading(true); fetchProfile(); fetchTrips() }}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  // ── PLANNER DETAIL VIEW ──
  if (selectedPlanner) {
    const p = selectedPlanner
    const budget = parseFloat(p.estimatedBudget) || 0
    const spent = parseFloat(p.totalCost) || 0
    const budgetLeft = budget - spent
    const activities = Array.isArray(p.activities) ? p.activities : []
    const sorted = [...activities].sort((a, b) => new Date(a.date) - new Date(b.date))

    return (
      <div className="profile-page">
        <div className="profile-detail-header">
          <button className="profile-back-btn" onClick={() => setSelectedPlanner(null)}>← Back to Profile</button>
          <h2>{p.name}</h2>
          <span className="profile-detail-dates">{formatDate(p.startDate)} → {formatDate(p.endDate)}</span>
        </div>
        <div className="profile-detail-body">
          <div className="profile-detail-stats">
            <div className="pds-card"><span className="pds-label">Estimated Budget</span><span className="pds-val green">RM {budget.toFixed(0)}</span></div>
            <div className="pds-card"><span className="pds-label">Total Spent</span><span className="pds-val orange">RM {spent.toFixed(0)}</span></div>
            <div className="pds-card">
              <span className="pds-label">{budgetLeft >= 0 ? 'Saved' : 'Over Budget'}</span>
              <span className={`pds-val ${budgetLeft >= 0 ? 'green' : 'red'}`}>RM {Math.abs(budgetLeft).toFixed(0)}</span>
            </div>
            <div className="pds-card"><span className="pds-label">Guests</span><span className="pds-val">{p.guests}</span></div>
            <div className="pds-card"><span className="pds-label">Days</span><span className="pds-val">{getDayCount(p.startDate, p.endDate)}</span></div>
            <div className="pds-card"><span className="pds-label">Activities</span><span className="pds-val">{activities.length}</span></div>
          </div>

          <h3 className="profile-detail-section-title">Activities</h3>
          <div className="profile-activity-list">
            {sorted.length === 0 && (
              <p style={{ color: '#888', padding: '1rem 0' }}>No activities recorded for this trip.</p>
            )}
            {sorted.map((act, i) => (
              <div key={i} className="profile-activity-item">
                {act.img
                  ? <img src={act.img} alt={act.name} className="profile-act-img" />
                  : <div className="profile-act-img" style={{ background: '#f0ede6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📍</div>
                }
                <div className="profile-act-info">
                  <span className="profile-act-name">{act.name}</span>
                  <span className="profile-act-meta">{act.date ? formatDate(act.date) : ''} {act.time ? `· ${act.time}` : ''}</span>
                  {act.type && <span className={`profile-act-type ${act.type?.toLowerCase()}`}>{act.type}</span>}
                </div>
                <span className="profile-act-cost">
                  {parseFloat(act.cost) > 0 ? `RM ${parseFloat(act.cost).toFixed(0)}` : 'Free'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── MAIN PROFILE ──
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-bg"></div>
        <div className="profile-header-content">
          <div className="profile-avatar">
            <span>{user?.name?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div className="profile-header-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <p className="profile-joined">Member since {formatDate(user?.createdAt)}</p>
          </div>
          <div className="profile-header-actions">
            <button className="profile-logout-btn" onClick={handleLogout}>🚪 Logout</button>
            <button className="profile-edit-btn" onClick={() => { setEditMode(!editMode); setEditError(''); setEditSuccess('') }}>
              {editMode ? 'Cancel' : '✏ Edit Profile'}
            </button>
          </div>
        </div>

        {editMode && (
          <div className="profile-edit-form">
            <div className="tp-field-row">
              <div className="tp-field">
                <label>Full Name</label>
                <input value={userForm.name} onChange={e => setUserForm(p => ({ ...p, name: e.target.value }))} />
              </div>
            </div>
            <div className="tp-field-row">
              <div className="tp-field">
                <label>Current Password</label>
                <input type="password" placeholder="Required to change password"
                  value={userForm.currentPassword} onChange={e => setUserForm(p => ({ ...p, currentPassword: e.target.value }))} />
              </div>
              <div className="tp-field">
                <label>New Password</label>
                <input type="password" placeholder="Leave blank to keep current"
                  value={userForm.newPassword} onChange={e => setUserForm(p => ({ ...p, newPassword: e.target.value }))} />
              </div>
            </div>
            {editError && <p style={{ color: '#e05555', fontSize: '0.82rem' }}>{editError}</p>}
            {editSuccess && <p style={{ color: '#2D5A40', fontSize: '0.82rem', background: '#edf7f0', padding: '0.5rem 0.8rem', borderRadius: '8px' }}>{editSuccess}</p>}
            <button className="tp-save-activity-btn" style={{ maxWidth: 160 }}
              onClick={handleSaveProfile} disabled={editSaving}>
              {editSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        <div className="profile-stats-bar">
          <div className="psb-item"><span className="psb-val">RM {totalSpent.toLocaleString()}</span><span className="psb-label">Total Spent</span></div>
          <div className="psb-divider"></div>
          <div className="psb-item"><span className="psb-val">{totalTrips}</span><span className="psb-label">Trips Planned</span></div>
          <div className="psb-divider"></div>
          <div className="psb-item"><span className="psb-val">{totalDays}</span><span className="psb-label">Days Travelled</span></div>
          <div className="psb-divider"></div>
          <div className="psb-item"><span className="psb-val">{totalActivities}</span><span className="psb-label">Activities</span></div>
          <div className="psb-divider"></div>
          <div className="psb-item"><span className="psb-val">{favourites.length}</span><span className="psb-label">Favourites</span></div>
          <div className="psb-divider"></div>
          <div className="psb-item"><span className="psb-val">{wishlist.length}</span><span className="psb-label">Wishlist</span></div>
        </div>
      </div>

      <div className="profile-tabs">
        {TABS.map(t => (
          <button key={t} className={`profile-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      <div className="profile-tab-content">

        {activeTab === 'Overview' && (
          <div className="profile-overview">
            <div className="profile-info-card">
              <h4>Personal Information</h4>
              <div className="pi-row"><span className="pi-label">Full Name</span><span>{user?.name}</span></div>
              <div className="pi-row"><span className="pi-label">Email</span><span>{user?.email}</span></div>
              <div className="pi-row"><span className="pi-label">Member Since</span><span>{formatDate(user?.createdAt)}</span></div>
            </div>

            <div className="profile-recent-card">
              <h4>Recent Trips</h4>
              {planners.length === 0 && (
                <div className="profile-empty">
                  <span>🗺️</span>
                  <p>No trips planned yet</p>
                  <Link to="/trip-planner" className="profile-explore-btn">Plan a Trip</Link>
                </div>
              )}
              {planners.slice(0, 2).map(p => (
                <div key={p.id} className="recent-trip-item" onClick={() => setSelectedPlanner(p)}>
                  <div className="rti-left">
                    <span className="rti-name">{p.name}</span>
                    <span className="rti-dates">{formatDate(p.startDate)} → {formatDate(p.endDate)}</span>
                  </div>
                  <div className="rti-right">
                    <span className="rti-cost">RM {parseFloat(p.totalCost).toFixed(0)}</span>
                    <span className="rti-arrow">→</span>
                  </div>
                </div>
              ))}
              {planners.length > 0 && (
                <button className="profile-view-all-btn" onClick={() => setActiveTab('Saved Planners')}>
                  View All Planners →
                </button>
              )}
            </div>

            {planners.length > 0 && (
              <div className="profile-spending-card">
                <h4>Spending Breakdown</h4>
                {planners.map(p => (
                  <div key={p.id} className="spending-row">
                    <span className="spending-name">{p.name}</span>
                    <div className="spending-bar-wrap">
                      <div className="spending-bar"
                        style={{ width: `${totalSpent > 0 ? (parseFloat(p.totalCost) / totalSpent) * 100 : 0}%` }}></div>
                    </div>
                    <span className="spending-amt">RM {parseFloat(p.totalCost).toFixed(0)}</span>
                  </div>
                ))}
                <div className="spending-total">Total: <strong>RM {totalSpent.toLocaleString()}</strong></div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Saved Planners' && (
          <div className="profile-planners">
            <div className="profile-section-header">
              <h3>Saved Planners</h3>
              <Link to="/trip-planner" className="profile-new-btn">+ New Trip</Link>
            </div>
            {planners.length === 0 && (
              <div className="profile-empty">
                <span>🗺️</span>
                <p>No saved trips yet</p>
                <Link to="/trip-planner" className="profile-explore-btn">Plan your first trip</Link>
              </div>
            )}
            {planners.map(p => {
              const budget = parseFloat(p.estimatedBudget) || 0
              const spent = parseFloat(p.totalCost) || 0
              const budgetLeft = budget - spent
              const activities = Array.isArray(p.activities) ? p.activities : []
              return (
                <div key={p.id} className="planner-card" onClick={() => setSelectedPlanner(p)}>
                  <div className="planner-card-left">
                    <div className="planner-preview-imgs">
                      {activities.slice(0, 3).map((a, i) => (
                        a.img
                          ? <img key={i} src={a.img} alt="" className="planner-preview-img" style={{ left: `${i * 22}px`, zIndex: 3 - i }} />
                          : <div key={i} className="planner-preview-img" style={{ left: `${i * 22}px`, zIndex: 3 - i, background: '#f0ede6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>📍</div>
                      ))}
                    </div>
                    <div className="planner-card-info">
                      <h4>{p.name}</h4>
                      <span className="planner-dates">📅 {formatDate(p.startDate)} → {formatDate(p.endDate)}</span>
                      <span className="planner-meta">{getDayCount(p.startDate, p.endDate)} days · {p.guests} guest{p.guests > 1 ? 's' : ''} · {activities.length} activities</span>
                    </div>
                  </div>
                  <div className="planner-card-right">
                    <div className="planner-budget-info">
                      <span className="planner-cost">RM {spent.toFixed(0)}</span>
                      <span className={`planner-budget-tag ${budgetLeft >= 0 ? 'under' : 'over'}`}>
                        {budgetLeft >= 0 ? `RM ${budgetLeft.toFixed(0)} saved` : `RM ${Math.abs(budgetLeft).toFixed(0)} over`}
                      </span>
                    </div>
                    <button className="ppc-remove-btn" style={{ marginRight: '0.5rem' }}
                      onClick={(e) => handleDeleteTrip(e, p.id)}>Delete</button>
                    <span className="planner-arrow">→</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'Wishlist' && (
          <div className="profile-wishlist">
            <div className="profile-section-header">
              <h3>My Wishlist</h3>
              <span className="profile-section-count">{wishlist.length} places</span>
            </div>
            {wishlist.length === 0 && (
              <div className="profile-empty">
                <span>🗺️</span>
                <p>Your wishlist is empty</p>
                <Link to="/attractions" className="profile-explore-btn">Explore Attractions</Link>
              </div>
            )}
            <div className="profile-grid">
              {wishlist.map(item => (
                <div key={item.id} className="profile-place-card">
                  <Link to={item.link} className="ppc-img-wrap">
                    <img src={item.img} alt={item.name} />
                    <span className={`ppc-type-badge ${item.type.toLowerCase()}`}>{item.type}</span>
                  </Link>
                  <div className="ppc-info">
                    <Link to={item.link} className="ppc-name">{item.name}</Link>
                    <span className="ppc-location">📍 {item.location}</span>
                    <div className="ppc-bottom">
                      <span className="ppc-price">{item.price === 0 ? 'Free' : `from RM ${item.price}`}</span>
                      <button className="ppc-remove-btn" onClick={() => removeWishlist(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Favourites' && (
          <div className="profile-wishlist">
            <div className="profile-section-header">
              <h3>My Favourites</h3>
              <span className="profile-section-count">{favourites.length} places</span>
            </div>
            {favourites.length === 0 ? (
              <div className="profile-empty">
                <span>💛</span>
                <p>No favorites saved yet.</p>
                <Link to="/hotels" className="profile-explore-btn">Browse Hotels</Link>
              </div>
            ) : (
              <div className="profile-grid">
                {favourites.map(item => (
                  <div key={item.id} className="profile-place-card">
                    <Link to={item.link} className="ppc-img-wrap">
                      <img src={item.img || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80'} alt={item.name} />
                      <span className={`ppc-type-badge ${item.type.toLowerCase()}`}>{item.type}</span>
                    </Link>
                    <div className="ppc-info">
                      <Link to={item.link} className="ppc-name">{item.name}</Link>
                      <span className="ppc-location">📍 {item.location}</span>
                      <div className="ppc-bottom">
                        <span className="ppc-price">{item.price > 0 ? `from RM ${item.price}` : 'Free'}</span>
                        <button className="ppc-remove-btn" onClick={(e) => handleDeleteFavourite(e, item.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      <footer className="newsletter">
        <h3>Destinalytics</h3>
        <p> © 2026 Destinalytics. All Rights Reserved.</p>
         <p> Hotel and attraction information, pricing, and booking services
        may be provided through third-party platforms.</p>
        <p>   Special thanks and credits to:</p>

  <div class="footer-logos">

        <a href="https://www.booking.com" target="_blank">
            Booking.com
        </a>

        <a href="https://www.agoda.com" target="_blank">
            Agoda
        </a>

        <a href="https://www.trip.com" target="_blank">
            Trip.com
        </a>

        <a href="https://www.klook.com" target="_blank">
            Klook
        </a>
          </div>

      </footer>

    </div>
  )
}