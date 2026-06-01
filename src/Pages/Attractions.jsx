import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './ListingPage.css'

const attractions = [
  { id: 1, name: 'Aquaria KLCC', location: 'Kuala Lumpur', category: 'Culture', price: 55, rating: 4.3, img: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&q=80' },
  { id: 2, name: 'KLCC Park', location: 'Kuala Lumpur', category: 'Nature', price: 0, rating: 4.6, img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80' },
  { id: 3, name: 'Batu Caves', location: 'Gombak, KL', category: 'Culture', price: 5, rating: 4.5, img: 'data:image/jpeg;base64,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' },
  { id: 4, name: 'KL Bird Park', location: 'Kuala Lumpur', category: 'Nature', price: 35, rating: 4.4, img: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&q=80' },
  { id: 5, name: 'Petrosains', location: 'KLCC, KL', category: 'Culture', price: 50, rating: 4.2, img: 'https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/wfu1eyafzhlwuu7imcsw.jpg' },
  { id: 6, name: 'KL Tower', location: 'Kuala Lumpur', category: 'Culture', price: 45, rating: 4.3, img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80' },
  { id: 7, name: 'Sunway Lagoon', location: 'Subang, KL', category: 'Adventure', price: 85, rating: 4.5, img: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&q=80' },
  { id: 8, name: 'Pavilion KL', location: 'Bukit Bintang, KL', category: 'Culture', price: 0, rating: 4.4, img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80' },
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

function Attractions() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [rating, setRating] = useState('')
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

  const filtered = attractions.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) &&
    (!category || a.category === category) &&
    (!rating || a.rating >= Number(rating))
  )

  return (
    <div className="listing-page">

      {/* Hero */}
      <section className="listing-hero listing-hero-attraction">
        <div className="listing-hero-overlay">
          <h1>Explore<br />Attractions</h1>
          <p>Discover the best of Kuala Lumpur!</p>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="listing-search-bar">
        <div className="search-input-wrap">
          <input
            type="text"
            placeholder="Search Attraction"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-dropdowns">
          <select
            className="listing-filter-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Nature">Nature</option>
            <option value="Culture">Culture</option>
            <option value="Adventure">Adventure</option>
          </select>
          <select
            className="listing-filter-select"
            value={rating}
            onChange={e => setRating(e.target.value)}
          >
            <option value="">All Ratings</option>
            <option value="4">4 stars & up</option>
            <option value="4.5">4.5 stars & up</option>
            <option value="5">5 stars</option>
          </select>
        </div>
      </section>

      {/* Count */}
      <div className="listing-count">{filtered.length} attractions available</div>

      {/* Card Grid */}
      <section className="listing-grid">
        {filtered.map(attraction => {
          const key = `Attraction-${attraction.id}`
          const existingFavorite = favoriteMap.get(key)

          return (
            <Link to={`/attractions/${attraction.id}`} key={attraction.id} className="listing-card">
              <div className="listing-card-img-wrap">
                <img src={attraction.img} alt={attraction.name} />
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
                          type: 'Attraction',
                          itemId: attraction.id,
                          name: attraction.name,
                          location: attraction.location,
                          img: attraction.img,
                          price: attraction.price,
                          link: `/attractions/${attraction.id}`
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
                <h3>{attraction.name}</h3>
                <p className="listing-card-location">{attraction.location}</p>
                <div className="listing-card-bottom">
                  <Stars rating={attraction.rating} />
                  <span className="listing-card-price">
                    {attraction.price === 0 ? <strong>Free</strong> : <>from <strong>RM {attraction.price}</strong></>}
                  </span>
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

export default Attractions