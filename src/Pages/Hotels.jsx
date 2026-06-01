import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './ListingPage.css'

const hotels = [
  { id: 1, name: 'The RuMa Hotel & Residences', location: 'Bukit Bintang', price: 350, rating: 4.5, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },
  { id: 2, name: 'Hilton Hotel KL', location: 'Bukit Bintang', price: 135, rating: 4.2, img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80' },
  { id: 3, name: 'Element KL', location: 'Jalan Tun Razak', price: 120, rating: 3.8, img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80' },
  { id: 4, name: 'St Regis KL', location: 'KLCC', price: 300, rating: 4.7, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80' },
  { id: 5, name: 'Quill Residences, KL', location: 'KLCC', price: 250, rating: 4.0, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
  { id: 6, name: 'ALoft Hotel KL', location: 'Jalan Tun Razak', price: 220, rating: 3.9, img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80' },
  { id: 7, name: 'Hyatt Centric Hotel KL', location: 'Bukit Bintang', price: 340, rating: 4.3, img: 'https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?w=600&q=80' },
  { id: 8, name: 'Star Suites KLCC', location: 'KLCC', price: 400, rating: 4.6, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80' },
]

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'star filled' : 'star'}>★</span>
      ))}
    </div>
  )
}

function Hotels() {
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('All')
  const [priceFilter, setPriceFilter] = useState('All')
  const [favorites, setFavorites] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) return
    fetch('/api/favorites', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setFavorites(data))
      .catch(() => setFavorites([]))
  }, [token])

  const favoriteMap = new Map(favorites.map(f => [`${f.type}-${f.itemId}`, f]))

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) &&
    (locationFilter === 'All' || h.location === locationFilter) &&
    (priceFilter === 'All' || (() => {
      const [min, max] = priceFilter.split('-').map(Number)
      return h.price >= min && h.price <= max
    })())
  )

  return (
    <div className="listing-page">

      {/* Hero */}
      <section className="listing-hero listing-hero-hotel">
        <div className="listing-hero-overlay">
          <h1>Hotel<br />Getaway</h1>
          <p>Discover possibilities of travelling!</p>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="listing-search-bar">
        <div className="search-input-wrap">
          <input
            type="text"
            placeholder="Search Hotel"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-dropdowns">
          <select
            className="listing-filter-select"
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
          >
            <option value="All">Location</option>
            <option value="Bukit Bintang">Bukit Bintang</option>
            <option value="KLCC">KLCC</option>
            <option value="Jalan Tun Razak">Jalan Tun Razak</option>
          </select>
          <select
            className="listing-filter-select"
            value={priceFilter}
            onChange={e => setPriceFilter(e.target.value)}
          >
            <option value="All">Price</option>
            <option value="50-100">RM 50 - 100</option>
            <option value="101-200">RM 101 - 200</option>
            <option value="201-300">RM 201 - 300</option>
          </select>
        </div>
      </section>

      {/* Count */}
      <div className="listing-count">{filtered.length} trips available</div>

      {/* Card Grid */}
      <section className="listing-grid">
        {filtered.map(hotel => {
          const key = `Hotel-${hotel.id}`
          const existingFavorite = favoriteMap.get(key)

          return (
            <Link to={`/hotels/${hotel.id}`} key={hotel.id} className="listing-card">
              <div className="listing-card-img-wrap">
                <img src={hotel.img} alt={hotel.name} />
                <button
                  type="button"
                  className={`favorite-btn ${existingFavorite ? 'active' : ''}`}
                  onClick={async (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (!token) {
                      navigate('/login')
                      return
                    }

                    if (existingFavorite) {
                      await fetch(`/api/favorites/${existingFavorite.id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                      })
                      setFavorites(prev => prev.filter(item => item.id !== existingFavorite.id))
                      return
                    }

                    try {
                      const res = await fetch('/api/favorites', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          type: 'Hotel',
                          itemId: hotel.id,
                          name: hotel.name,
                          location: hotel.location,
                          img: hotel.img,
                          price: hotel.price,
                          link: `/hotels/${hotel.id}`
                        })
                      })
                      const data = await res.json()
                      if (!res.ok) throw new Error()
                      setFavorites(prev => [...prev, data])
                    } catch {
                      alert('Unable to update favorite.')
                    }
                  }}
                >
                  {existingFavorite ? '♥' : '♡'}
                </button>
              </div>
              <div className="listing-card-info">
                <h3>{hotel.name}</h3>
                <p className="listing-card-location">{hotel.location}</p>
                <div className="listing-card-bottom">
                  <Stars rating={hotel.rating} />
                  <span className="listing-card-price">from <strong>RM {hotel.price}</strong></span>
                </div>
              </div>
            </Link>
          )
        })}
      </section>

      {/* Newsletter */}
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

export default Hotels