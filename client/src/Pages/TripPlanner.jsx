import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './TripPlanner.css'

const API = import.meta.env.VITE_API_URL || ''

const HOTELS = [
  { id: 'h1', name: 'The RuMa Hotel & Residences', type: 'Hotel', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80', price: 350 },
  { id: 'h2', name: 'Hilton Hotel KL', type: 'Hotel', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80', price: 135 },
  { id: 'h3', name: 'Element KL', type: 'Hotel', img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80', price: 120 },
  { id: 'h4', name: 'St Regis KL', type: 'Hotel', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80', price: 300 },
]

const ATTRACTIONS = [
  { id: 'a1', name: 'Aquaria KLCC', type: 'Attraction', img: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80', price: 55 },
  { id: 'a2', name: 'KLCC Park', type: 'Attraction', img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80', price: 0 },
  { id: 'a3', name: 'Batu Caves', type: 'Attraction', img: 'https://images.unsplash.com/photo-1545571023-af6a5de16be5?w=400&q=80', price: 5 },
  { id: 'a4', name: 'KL Bird Park', type: 'Attraction', img: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80', price: 35 },
  { id: 'a5', name: 'KL Tower', type: 'Attraction', img: 'https://images.unsplash.com/photo-1532094349884-543559c8c2b5?w=400&q=80', price: 45 },
]

const HOURS = ['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM',
  '1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM']

function getDates(start, end) {
  const dates = []
  const s = new Date(start)
  const e = new Date(end)
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d))
  }
  return dates
}

function formatDate(d) {
  return d.toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatDateKey(d) {
  return d.toISOString().split('T')[0]
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

const STEPS = { SETUP: 'setup', PLANNER: 'planner' }
const MODAL_TABS = { LIST: 'list', MANUAL: 'manual' }
const LOCAL_SAVED_TRIPS_KEY = 'tripPlannerSavedTrips'

function loadSessionSavedTrips() {
  try {
    const raw = window.sessionStorage.getItem(LOCAL_SAVED_TRIPS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveSessionSavedTrips(trips) {
  try {
    window.sessionStorage.setItem(LOCAL_SAVED_TRIPS_KEY, JSON.stringify(trips))
  } catch {
    // ignore session storage errors
  }
}

export default function TripPlanner() {
  const navigate = useNavigate()

  // Setup state
  const [step, setStep] = useState(STEPS.SETUP)
  const [tripName, setTripName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [estimatedBudget, setEstimatedBudget] = useState('')
  const [guests, setGuests] = useState(1)

  // Session saved planners
  const [localSavedTrips, setLocalSavedTrips] = useState(() => loadSessionSavedTrips())
  const [showLocalSavedModal, setShowLocalSavedModal] = useState(false)
  const [selectedLocalSavedTrip, setSelectedLocalSavedTrip] = useState(null)

  // Planner state
  const [activities, setActivities] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalTab, setModalTab] = useState(MODAL_TABS.LIST)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [viewCard, setViewCard] = useState(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [showSavedPlannerModal, setShowSavedPlannerModal] = useState(false)
  const [savedTrips, setSavedTrips] = useState([])
  const [selectedSavedTrip, setSelectedSavedTrip] = useState(null)
  const [loadingSavedTrips, setLoadingSavedTrips] = useState(false)
  const [savedTripsError, setSavedTripsError] = useState('')

  // Modal form state
  const [manualName, setManualName] = useState('')
  const [manualDesc, setManualDesc] = useState('')
  const [manualImg, setManualImg] = useState('')
  const [manualCost, setManualCost] = useState('')
  const [actDate, setActDate] = useState('')
  const [actTime, setActTime] = useState('9:00 AM')
  const [listSearch, setListSearch] = useState('')

  const dates = step === STEPS.PLANNER ? getDates(startDate, endDate) : []
  const totalCost = activities.reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0)
  const budget = parseFloat(estimatedBudget) || 0
  const budgetLeft = budget - totalCost
  const allPlaces = [...HOTELS, ...ATTRACTIONS]
  const filteredPlaces = allPlaces.filter(p => p.name.toLowerCase().includes(listSearch.toLowerCase()))

  function openModal() {
    setShowModal(true)
    setModalTab(MODAL_TABS.LIST)
    setSelectedPlace(null)
    setManualName(''); setManualDesc(''); setManualImg(''); setManualCost('')
    setActDate(startDate); setActTime('9:00 AM')
    setListSearch('')
  }

  function handleSelectPlace(place) {
    setSelectedPlace(place)
    setManualCost(String(place.price))
  }

  function handleSaveActivity() {
    const isManual = modalTab === MODAL_TABS.MANUAL
    const name = isManual ? manualName : selectedPlace?.name
    const img = isManual ? (manualImg || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80') : selectedPlace?.img
    const type = isManual ? 'Custom' : selectedPlace?.type
    if (!name || !actDate || !actTime) return

    const newActivity = {
      id: Date.now(),
      name,
      type,
      img,
      description: manualDesc || '',
      date: actDate,
      time: actTime,
      cost: parseFloat(isManual ? manualCost : manualCost) || 0,
    }
    setActivities(prev => [...prev, newActivity])
    setShowModal(false)
    setSaved(false)
  }

  function handleDeleteActivity(id) {
    setActivities(prev => prev.filter(a => a.id !== id))
    setSaved(false)
  }

  function handleOpenLocalSavedModal() {
    setShowLocalSavedModal(true)
    setSelectedLocalSavedTrip(localSavedTrips[0] || null)
  }

  function loadLocalSavedTrip(trip) {
    if (!trip) return
    setTripName(trip.tripName || '')
    setStartDate(trip.startDate || '')
    setEndDate(trip.endDate || '')
    setEstimatedBudget(String(trip.estimatedBudget || ''))
    setGuests(trip.guests || 1)
    setActivities(Array.isArray(trip.activities) ? trip.activities.map(a => ({ ...a })) : [])
    setShowLocalSavedModal(false)
    setSelectedLocalSavedTrip(trip)
    setStep(STEPS.PLANNER)
    setSaved(false)
  }

  async function handleShowSavedPlanners() {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login to view saved planners.')
      return
    }

    setShowSavedPlannerModal(true)
    setLoadingSavedTrips(true)
    setSavedTripsError('')
    setSavedTrips([])
    setSelectedSavedTrip(null)

    try {
      const res = await fetch(`${API}/api/trips`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) {
        setSavedTripsError(data.message || 'Unable to load saved planners.')
        return
      }
      const trips = Array.isArray(data) ? data : []
      setSavedTrips(trips)
      setSelectedSavedTrip(trips[0] || null)
    } catch (err) {
      setSavedTripsError('Cannot connect to server.')
    } finally {
      setLoadingSavedTrips(false)
    }
  }

  // ── SAVE TO DATABASE ──
async function handleSavePlanner() {
  const token = localStorage.getItem('token')
  setSaving(true)
  setSaveError('')

  const payload = {
    tripName,
    startDate,
    endDate,
    guests,
    estimatedBudget: parseFloat(estimatedBudget) || 0,
    totalCost,
    activities
  }

  const localTrip = {
    id: Date.now(),
    ...payload
  }
  setLocalSavedTrips(prev => {
    const next = [...prev, localTrip]
    saveSessionSavedTrips(next)
    return next
  })

  if (!token) {
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
    return
  }

  try {
const res = await fetch(`${API}/api/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (!res.ok) {
      setSaveError(data.message || 'Failed to save trip.')
      setSaving(false)
      return
    }

    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  } catch (err) {
    setSaveError('Cannot connect to server.')
    setSaving(false)
  }
}

  // ── SETUP SCREEN ──
  if (step === STEPS.SETUP) {
    return (
      <div className="tp-setup">
        <div className="tp-setup-card">
          <div className="tp-setup-icon">🗺️</div>
          <h2>Plan Your KL Trip</h2>
          <p>Set up your trip details to get started</p>

          <div className="tp-form">
            <div className="tp-field">
              <label>Trip Name</label>
              <input type="text" placeholder="e.g. KL Family Trip 2026"
                value={tripName} onChange={e => setTripName(e.target.value)} />
            </div>
            <div className="tp-field-row">
              <div className="tp-field">
                <label>Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="tp-field">
                <label>End Date</label>
                <input type="date" value={endDate}
                  min={startDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>
            <div className="tp-field-row">
              <div className="tp-field">
                <label>Estimated Budget (RM)</label>
                <input type="number" placeholder="e.g. 1200"
                  value={estimatedBudget} onChange={e => setEstimatedBudget(e.target.value)} />
              </div>
              <div className="tp-field">
                <label>Guests</label>
                <input type="number" min="1" value={guests}
                  onChange={e => setGuests(parseInt(e.target.value) || 1)} />
              </div>
            </div>
            <div className="tp-button-row">
              <button
                className="tp-start-btn"
                disabled={!tripName || !startDate || !endDate || !estimatedBudget}
                onClick={() => setStep(STEPS.PLANNER)}
              >
                Start Planning →
              </button>
              <button
                type="button"
                className="tp-secondary-btn tp-secondary-btn-setup"
                onClick={handleOpenLocalSavedModal}
              >
                View Saved Planners
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── PLANNER SCREEN ──
  return (
    <div className="tp-page">

      {/* Top bar */}
      <div className="tp-topbar">
        <div className="tp-topbar-left">
          <button className="tp-back-btn" onClick={() => setStep(STEPS.SETUP)}>←</button>
          <div className="tp-trip-name">{tripName}</div>
          <div className="tp-trip-meta">
            <span>📅 {startDate} → {endDate}</span>
            <span>👥 {guests} Guest{guests > 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="tp-topbar-right">
          <span className="tp-budget-display">RM {estimatedBudget}</span>
          <div className="tp-save-wrap">
            <button className="tp-save-btn" onClick={handleSavePlanner} disabled={saving}>
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Planner'}
            </button>
            {saveError && <p className="tp-save-error">{saveError}</p>}
          </div>
        </div>
      </div>

      <div className="tp-body">

        {/* Calendar */}
        <div className="tp-calendar-wrap">
          <div className="tp-calendar-header">
            <div className="tp-time-col-header"></div>
            {dates.map((d, i) => (
              <div key={i} className="tp-date-col-header">
                <span className="tp-day-name">{d.toLocaleDateString('en-MY', { weekday: 'short' })}</span>
                <span className="tp-day-num">{d.getDate()}</span>
              </div>
            ))}
          </div>

          <div className="tp-calendar-body">
            <div className="tp-time-col">
              {HOURS.map(h => (
                <div key={h} className="tp-time-slot">{h}</div>
              ))}
            </div>
            {dates.map((d, di) => {
              const dateKey = formatDateKey(d)
              const dayActivities = activities.filter(a => a.date === dateKey)
              return (
                <div key={di} className="tp-day-col">
                  {HOURS.map(h => (
                    <div key={h} className="tp-cell"></div>
                  ))}
                  {dayActivities.map(act => {
                    const hourIdx = HOURS.indexOf(act.time)
                    return (
                      <div key={act.id} className="tp-activity-card"
                        style={{ top: `${hourIdx * 52 + 8}px` }}
                        onClick={() => setViewCard(act)}
                      >
                        <img src={act.img} alt={act.name} className="tp-card-img" />
                        <div className="tp-card-info">
                          <span className="tp-card-time">{act.time}</span>
                          <span className="tp-card-name">{act.name}</span>
                          {act.cost > 0 && <span className="tp-card-cost">RM {act.cost}</span>}
                        </div>
                        <button className="tp-card-delete"
                          onClick={e => { e.stopPropagation(); handleDeleteActivity(act.id) }}>×</button>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          <button className="tp-add-btn" onClick={openModal}>+ Add Activity</button>
        </div>

        {/* Sidebar */}
        <div className="tp-sidebar">

          <div className="tp-budget-card">
            <h4>Budget Tracker</h4>
            <div className="tp-budget-row">
              <span>Estimated Budget</span>
              <span className="tp-budget-est">RM {budget.toFixed(0)}</span>
            </div>
            <div className="tp-budget-progress">
              <div className="tp-budget-bar"
                style={{ width: `${Math.min(100, (totalCost / budget) * 100)}%`,
                  background: totalCost > budget ? '#e05555' : '#2D5A40' }}
              ></div>
            </div>
            <div className="tp-budget-row">
              <span>Total Cost</span>
              <span className="tp-budget-total" style={{ color: totalCost > budget ? '#e05555' : '#2D5A40' }}>
                RM {totalCost.toFixed(0)}
              </span>
            </div>
            <div className={`tp-budget-status ${totalCost > budget ? 'over' : 'under'}`}>
              {totalCost > budget
                ? `⚠ Over budget by RM ${(totalCost - budget).toFixed(0)}`
                : `✓ Under budget by RM ${budgetLeft.toFixed(0)}`}
            </div>
          </div>

          <div className="tp-summary-card">
            <h4>Trip Summary</h4>
            <div className="tp-summary-row"><span>📅 Days</span><strong>{dates.length}</strong></div>
            <div className="tp-summary-row"><span>📍 Activities</span><strong>{activities.length}</strong></div>
            <div className="tp-summary-row"><span>👥 Guests</span><strong>{guests}</strong></div>
            <div className="tp-summary-row"><span>💰 Per Person</span>
              <strong>RM {guests > 0 ? (totalCost / guests).toFixed(0) : 0}</strong>
            </div>
          </div>

          {activities.length > 0 && (
            <div className="tp-itinerary-card">
              <h4>Daily Itinerary</h4>
              {dates.map((d, i) => {
                const dateKey = formatDateKey(d)
                const dayActs = activities.filter(a => a.date === dateKey)
                if (dayActs.length === 0) return null
                return (
                  <div key={i} className="tp-itinerary-day">
                    <div className="tp-itinerary-date">{formatDate(d)}</div>
                    {dayActs.sort((a,b) => HOURS.indexOf(a.time) - HOURS.indexOf(b.time)).map(act => (
                      <div key={act.id} className="tp-itinerary-item" onClick={() => setViewCard(act)}>
                        <span className="tp-it-time">{act.time}</span>
                        <span className="tp-it-name">{act.name}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>

      {/* ── ADD ACTIVITY MODAL ── */}
      {showModal && (
        <div className="tp-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="tp-modal" onClick={e => e.stopPropagation()}>
            <div className="tp-modal-header">
              <h3>Add Activity</h3>
              <button className="tp-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="tp-modal-tabs">
              <button className={`tp-modal-tab ${modalTab === MODAL_TABS.LIST ? 'active' : ''}`}
                onClick={() => { setModalTab(MODAL_TABS.LIST); setSelectedPlace(null) }}>
                Select from List
              </button>
              <button className={`tp-modal-tab ${modalTab === MODAL_TABS.MANUAL ? 'active' : ''}`}
                onClick={() => { setModalTab(MODAL_TABS.MANUAL); setSelectedPlace(null) }}>
                Add Manually
              </button>
            </div>

            <div className="tp-modal-body">

              {modalTab === MODAL_TABS.LIST && (
                <div className="tp-list-tab">
                  <input type="text" placeholder="Search hotels & attractions..."
                    value={listSearch} onChange={e => setListSearch(e.target.value)}
                    className="tp-list-search" />
                  <div className="tp-place-list">
                    {filteredPlaces.map(p => (
                      <div key={p.id}
                        className={`tp-place-item ${selectedPlace?.id === p.id ? 'selected' : ''}`}
                        onClick={() => handleSelectPlace(p)}
                      >
                        <img src={p.img} alt={p.name} className="tp-place-img" />
                        <div className="tp-place-info">
                          <span className="tp-place-name">{p.name}</span>
                          <span className="tp-place-type">{p.type}</span>
                        </div>
                        <span className="tp-place-price">
                          {p.price === 0 ? 'Free' : `RM ${p.price}`}
                        </span>
                      </div>
                    ))}
                  </div>
                  {selectedPlace && (
                    <div className="tp-selected-preview">
                      <img src={selectedPlace.img} alt={selectedPlace.name} />
                      <div>
                        <strong>{selectedPlace.name}</strong>
                        <span>{selectedPlace.type}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {modalTab === MODAL_TABS.MANUAL && (
                <div className="tp-manual-tab">
                  <div className="tp-field">
                    <label>Activity Name *</label>
                    <input type="text" placeholder="e.g. Lunch at Jalan Alor"
                      value={manualName} onChange={e => setManualName(e.target.value)} />
                  </div>
                  <div className="tp-field">
                    <label>Description</label>
                    <textarea placeholder="Add details about the activity..."
                      value={manualDesc} onChange={e => setManualDesc(e.target.value)} rows={3} />
                  </div>
                  <div className="tp-field">
                    <label>Image URL (optional)</label>
                    <input type="text" placeholder="https://..."
                      value={manualImg} onChange={e => setManualImg(e.target.value)} />
                  </div>
                </div>
              )}

              <div className="tp-field-row" style={{ marginTop: '1rem' }}>
                <div className="tp-field">
                  <label>Date *</label>
                  <select value={actDate} onChange={e => setActDate(e.target.value)} className="tp-select">
                    {dates.map((d, i) => (
                      <option key={i} value={formatDateKey(d)}>{formatDate(d)}</option>
                    ))}
                  </select>
                </div>
                <div className="tp-field">
                  <label>Time *</label>
                  <select value={actTime} onChange={e => setActTime(e.target.value)} className="tp-select">
                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div className="tp-field">
                <label>Estimated Cost (RM)</label>
                <input type="number" placeholder="0"
                  value={manualCost} onChange={e => setManualCost(e.target.value)} />
              </div>

            </div>

            <div className="tp-modal-footer">
              <button className="tp-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="tp-save-activity-btn" onClick={handleSaveActivity}
                disabled={modalTab === MODAL_TABS.LIST ? !selectedPlace : !manualName}>
                Save Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW CARD MODAL ── */}
      {viewCard && (
        <div className="tp-modal-overlay" onClick={() => setViewCard(null)}>
          <div className="tp-view-modal" onClick={e => e.stopPropagation()}>
            <img src={viewCard.img} alt={viewCard.name} className="tp-view-img" />
            <div className="tp-view-body">
              <div className="tp-view-header">
                <div>
                  <h3>{viewCard.name}</h3>
                  <span className="tp-view-type">{viewCard.type}</span>
                </div>
                <button className="tp-modal-close" onClick={() => setViewCard(null)}>×</button>
              </div>
              <div className="tp-view-meta">
                <span>📅 {viewCard.date}</span>
                <span>🕐 {viewCard.time}</span>
                {viewCard.cost > 0 && <span>💰 RM {viewCard.cost}</span>}
              </div>
              {viewCard.description && <p className="tp-view-desc">{viewCard.description}</p>}
              <button className="tp-delete-btn" onClick={() => { handleDeleteActivity(viewCard.id); setViewCard(null) }}>
                Remove Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {showLocalSavedModal && (
        <div className="tp-modal-overlay" onClick={() => setShowLocalSavedModal(false)}>
          <div className="tp-saved-modal" onClick={e => e.stopPropagation()}>
            <div className="tp-modal-header">
              <h3>Session Saved Planners</h3>
              <button className="tp-modal-close" onClick={() => setShowLocalSavedModal(false)}>×</button>
            </div>
            <div className="tp-saved-content">
              <div className="tp-saved-list">
                {localSavedTrips.length === 0 && (
                  <p className="tp-saved-empty">No saved planners available yet.</p>
                )}
                {localSavedTrips.map(trip => (
                  <button
                    key={trip.id}
                    className={`tp-saved-item ${selectedLocalSavedTrip?.id === trip.id ? 'active' : ''}`}
                    onClick={() => setSelectedLocalSavedTrip(trip)}
                  >
                    <div>
                      <strong>{trip.tripName}</strong>
                      <span>{formatDateDisplay(trip.startDate)} → {formatDateDisplay(trip.endDate)}</span>
                    </div>
                    <span>{Array.isArray(trip.activities) ? trip.activities.length : 0} activities</span>
                  </button>
                ))}
              </div>
              <div className="tp-saved-detail">
                {selectedLocalSavedTrip ? (
                  <>
                    <div className="tp-saved-header">
                      <h3>{selectedLocalSavedTrip.tripName}</h3>
                      <div className="tp-saved-meta-row">
                        <span>📅 {formatDateDisplay(selectedLocalSavedTrip.startDate)} → {formatDateDisplay(selectedLocalSavedTrip.endDate)}</span>
                        <span>👥 {selectedLocalSavedTrip.guests} guest{selectedLocalSavedTrip.guests > 1 ? 's' : ''}</span>
                        <span>💰 Budget RM {Number(selectedLocalSavedTrip.estimatedBudget).toFixed(0)}</span>
                        <span>🧾 Total RM {Number(selectedLocalSavedTrip.totalCost).toFixed(0)}</span>
                      </div>
                    </div>
                    <div className="tp-saved-activities">
                      {Array.isArray(selectedLocalSavedTrip.activities) && selectedLocalSavedTrip.activities.length > 0 ? selectedLocalSavedTrip.activities.map(act => (
                        <div key={act.id || `${act.name}-${act.date}-${act.time}`} className="tp-saved-activity">
                          <img src={act.img || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80'} alt={act.name} />
                          <div className="tp-saved-activity-info">
                            <strong>{act.name}</strong>
                            <span>{act.type} · {act.date} · {act.time}</span>
                            {act.description && <p>{act.description}</p>}
                          </div>
                          <span className="tp-saved-activity-cost">
                            {act.cost > 0 ? `RM ${act.cost}` : 'Free'}
                          </span>
                        </div>
                      )) : <p className="tp-saved-empty">This planner has no activities yet.</p>}
                    </div>
                    <button className="tp-save-btn" type="button" onClick={() => loadLocalSavedTrip(selectedLocalSavedTrip)}>
                      Load This Planner
                    </button>
                  </>
                ) : (
                  <div className="tp-saved-empty">Select a planner from the left to load it.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSavedPlannerModal && (
        <div className="tp-modal-overlay" onClick={() => setShowSavedPlannerModal(false)}>
          <div className="tp-saved-modal" onClick={e => e.stopPropagation()}>
            <div className="tp-modal-header">
              <h3>Saved Trip Planners</h3>
              <button className="tp-modal-close" onClick={() => setShowSavedPlannerModal(false)}>×</button>
            </div>
            <div className="tp-saved-content">
              <div className="tp-saved-list">
                {loadingSavedTrips && <p className="tp-saved-loading">Loading saved planners...</p>}
                {!loadingSavedTrips && savedTripsError && <p className="tp-saved-error">{savedTripsError}</p>}
                {!loadingSavedTrips && !savedTripsError && savedTrips.length === 0 && (
                  <p className="tp-saved-empty">No saved planners found. Save a trip first to view it here.</p>
                )}
                {!loadingSavedTrips && !savedTripsError && savedTrips.map(trip => (
                  <button
                    key={trip.id}
                    className={`tp-saved-item ${selectedSavedTrip?.id === trip.id ? 'active' : ''}`}
                    onClick={() => setSelectedSavedTrip(trip)}
                  >
                    <div>
                      <strong>{trip.tripName}</strong>
                      <span>{formatDateDisplay(trip.startDate)} → {formatDateDisplay(trip.endDate)}</span>
                    </div>
                    <span>{Array.isArray(trip.activities) ? trip.activities.length : 0} activities</span>
                  </button>
                ))}
              </div>
              <div className="tp-saved-detail">
                {selectedSavedTrip ? (
                  <>
                    <div className="tp-saved-header">
                      <h3>{selectedSavedTrip.tripName}</h3>
                      <div className="tp-saved-meta-row">
                        <span>📅 {formatDateDisplay(selectedSavedTrip.startDate)} → {formatDateDisplay(selectedSavedTrip.endDate)}</span>
                        <span>👥 {selectedSavedTrip.guests} guest{selectedSavedTrip.guests > 1 ? 's' : ''}</span>
                        <span>💰 Budget RM {Number(selectedSavedTrip.estimatedBudget).toFixed(0)}</span>
                        <span>🧾 Total RM {Number(selectedSavedTrip.totalCost).toFixed(0)}</span>
                      </div>
                    </div>
                    <div className="tp-saved-activities">
                      {Array.isArray(selectedSavedTrip.activities) && selectedSavedTrip.activities.length > 0 ? selectedSavedTrip.activities.map(act => (
                        <div key={act.id || `${act.name}-${act.date}-${act.time}`} className="tp-saved-activity">
                          <img src={act.img || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80'} alt={act.name} />
                          <div className="tp-saved-activity-info">
                            <strong>{act.name}</strong>
                            <span>{act.type} · {act.date} · {act.time}</span>
                            {act.description && <p>{act.description}</p>}
                          </div>
                          <span className="tp-saved-activity-cost">
                            {act.cost > 0 ? `RM ${act.cost}` : 'Free'}
                          </span>
                        </div>
                      )) : <p className="tp-saved-empty">This planner has no activities yet.</p>}
                    </div>
                  </>
                ) : (
                  <div className="tp-saved-empty">Select a planner from the left to see all details.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}