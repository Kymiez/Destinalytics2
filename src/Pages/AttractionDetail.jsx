import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import './DetailPage.css'

const attractions = [
  {
    id: 1,
    name: 'Aquaria KLCC',
    location: 'Kuala Lumpur',
    address: 'Kuala Lumpur Convention Centre, Jalan Pinang, Kuala Lumpur City Centre, 50088 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur',
    rating: 4.3,
    reviewCount: '2.3k',
    priceAdult: 55,
    priceKid: 45,
    description: 'Nestled beneath the iconic skyline of Kuala Lumpur, Aquaria KLCC is an immersive underwater sanctuary that offers visitors a fascinating journey into the wonders of marine life. Located below the Kuala Lumpur Convention Centre and just steps away from the Petronas Twin Towers, this world-class oceanarium places you in the heart of the city.\n\nThe highlight of Aquaria KLCC is its spectacular 90-metre underwater tunnel, where sharks, stingrays, sea turtles, and giant fish glide gracefully above and around you, creating an unforgettable and immersive experience.',
    highlights: [
      'Beneath KLCC, Near Petronas Twin Towers',
      '90-Metre Underwater Tunnel With Sharks, Rays, And Sea Turtles',
      'Over 5,000 Marine And Freshwater Animals',
      'Around 4.3/5, Popular With Tourists And Families',
      'About 1–2 Hours, Suitable For All Ages',
    ],
    facilities: [
      { icon: '🌊', label: 'Underwater Tunnel' },
      { icon: '👨‍👩‍👧', label: 'Family-Friendly' },
      { icon: '🎓', label: 'Educational Displays' },
      { icon: '🐠', label: 'Tropical Fish' },
      { icon: '👁', label: 'Views' },
      { icon: '🛍', label: 'Merchandise' },
    ],
    images: [
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=80',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
    ],
    videoUrl: '',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.8!2d101.713!3d3.153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37d12d669c1f%3A0x4f3c7a6e48c07e3!2sAquaria%20KLCC!5e0!3m2!1sen!2smy!4v1700000000000',
    reviews: [
      {
        name: 'FamilyTraveller',
        avatar: 'F',
        rating: 4.3,
        label: 'Amazing',
        text: 'Took the kids here and they absolutely loved it! The underwater tunnel is breathtaking — watching sharks swim overhead is something they still talk about. Very well maintained and staff are friendly. Easily 2 hours well spent.',
        images: [
          'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=200&q=80',
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&q=80',
        ],
      },
      {
        name: 'KLExplorer',
        avatar: 'K',
        rating: 4.0,
        label: 'Great',
        text: 'Really impressive collection of marine life. The touch pool area was a highlight for the younger ones. Can get crowded on weekends so I recommend going on a weekday morning for the best experience.',
        images: [],
      },
    ],
    calendar: {
      month: 'January 2026',
      year: 2026,
      monthIndex: 0,
      firstDay: 3,
      days: 31,
      prices: [55,65,55,50,45,70,70,35,65,45,55,50,65,70,55,35,35,65,45,70,65,55,65,35,55,45,65,65,null,null,null],
    },
  },
  {
    id: 2,
    name: 'KLCC Park',
    location: 'Kuala Lumpur',
    address: 'Jalan Ampang, Kuala Lumpur City Centre, 50088 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur',
    rating: 4.6,
    reviewCount: '5.1k',
    priceAdult: 0,
    priceKid: 0,
    description: 'KLCC Park is a beautifully landscaped urban park sitting in the shadow of the iconic Petronas Twin Towers. Spanning 50 acres, it offers a serene escape from the city buzz with its lush greenery, jogging tracks, and the famous Symphony Lake.\n\nThe park comes alive every evening with the Lake Symphony water fountain show, perfectly choreographed to music. A wading pool for children, a dedicated jogging path, and stunning views of the twin towers make this a must-visit for everyone.',
    highlights: [
      'Free Entry for All Visitors',
      'Iconic Petronas Twin Towers Backdrop',
      'Symphony Lake Fountain Show Every Evening',
      'Children\'s Wading Pool and Playground',
      '1.3km Jogging Track Around the Park',
      'Open Daily 7AM – 10PM',
    ],
    facilities: [
      { icon: '🌳', label: 'Landscaped Gardens' },
      { icon: '🏃', label: 'Jogging Track' },
      { icon: '⛲', label: 'Fountain Show' },
      { icon: '👶', label: 'Kids Playground' },
      { icon: '🚻', label: 'Public Toilets' },
      { icon: '🍦', label: 'Food Vendors' },
    ],
    images: [
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80',
      'https://images.unsplash.com/photo-1545571023-af6a5de16be5?w=400&q=80',
      'https://images.unsplash.com/photo-1532094349884-543559c8c2b5?w=400&q=80',
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80',
    ],
    videoUrl: '',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.8!2d101.713!3d3.153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37d12d669c1f%3A0x4f3c7a6e48c07e3!2sKLCC%20Park!5e0!3m2!1sen!2smy!4v1700000000000',
    reviews: [
      {
        name: 'ParkLover',
        avatar: 'P',
        rating: 4.6,
        label: 'Excellent',
        text: 'One of the most beautiful parks I have visited in any city. The view of the Twin Towers from the park is simply stunning, especially at night during the fountain show. Perfect for a morning jog or an evening stroll.',
        images: [],
      },
    ],
    calendar: {
      month: 'January 2026',
      year: 2026,
      monthIndex: 0,
      firstDay: 3,
      days: 31,
      prices: Array(31).fill(0),
    },
  },
  {
    id: 3,
    name: 'Batu Caves',
    location: 'Gombak, KL',
    address: 'Batu Caves, 68100 Batu Caves, Selangor, Malaysia',
    rating: 4.5,
    reviewCount: '8.2k',
    priceAdult: 5,
    priceKid: 3,
    description: 'Batu Caves is one of Malaysia\'s most iconic landmarks and the most popular Hindu shrine outside of India. A series of caves and cave temples located inside a limestone hill, it is most famous for the giant golden statue of Lord Murugan at the entrance and the 272 colourful steps leading to the main Temple Cave.\n\nThe site draws millions of visitors annually and is particularly spectacular during the Thaipusam festival when thousands of devotees gather for one of Asia\'s most vibrant religious celebrations.',
    highlights: [
      '272 Colourful Steps to the Main Temple Cave',
      'Giant 42.7 Metre Golden Statue of Lord Murugan',
      'One of the Most Popular Hindu Shrines Outside India',
      'Natural Limestone Cave Formation Over 400 Million Years Old',
      'Spectacular Thaipusam Festival Celebrations',
      'Free-Roaming Monkeys Throughout the Complex',
    ],
    facilities: [
      { icon: '🛕', label: 'Hindu Temple' },
      { icon: '🪨', label: 'Cave Exploration' },
      { icon: '📸', label: 'Photography Spots' },
      { icon: '🐒', label: 'Wildlife Viewing' },
      { icon: '🚻', label: 'Public Toilets' },
      { icon: '🍜', label: 'Food Stalls' },
    ],
    images: [
      'https://images.unsplash.com/photo-1545571023-af6a5de16be5?w=800&q=80',
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80',
      'https://images.unsplash.com/photo-1532094349884-543559c8c2b5?w=400&q=80',
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80',
    ],
    videoUrl: '',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.8!2d101.683!3d3.237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37d12d669c1f%3A0x4f3c7a6e48c07e3!2sBatu%20Caves!5e0!3m2!1sen!2smy!4v1700000000000',
    reviews: [
      {
        name: 'CulturalExplorer',
        avatar: 'C',
        rating: 4.5,
        label: 'Amazing',
        text: 'An absolutely stunning place that combines natural beauty with cultural significance. The climb up the 272 steps is worth every effort. Go early in the morning to avoid the crowds and the heat. The golden statue is breathtaking up close.',
        images: [
          'https://images.unsplash.com/photo-1545571023-af6a5de16be5?w=200&q=80',
        ],
      },
    ],
    calendar: {
      month: 'January 2026',
      year: 2026,
      monthIndex: 0,
      firstDay: 3,
      days: 31,
      prices: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,null,null,null],
    },
  },
]

const bookingLinks = (name) => [
  { label: 'Klook', color: '#ff5722', url: `https://www.klook.com/en-MY/search/?query=${encodeURIComponent(name)}` },
  { label: 'Booking', color: '#003580', url: `https://www.booking.com/search.html?ss=${encodeURIComponent(name)}` },
  { label: 'Trip', color: '#1abc9c', url: `https://www.trip.com/search/?keyword=${encodeURIComponent(name)}` },
  { label: 'Agoda', color: '#e74c3c', url: `https://www.agoda.com/search?city=1756&textToSearch=${encodeURIComponent(name)}` },
  { label: 'Airbnb', color: '#e84393', url: `https://www.airbnb.com/s/${encodeURIComponent(name)}/experiences` },
]

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

function Stars({ rating, size = 'md' }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <div className="detail-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star ${size} ${i <= full ? 'filled' : (i === full + 1 && half ? 'half' : '')}`}>★</span>
      ))}
    </div>
  )
}

function AttractionDetail() {
  const { id } = useParams()
  const attraction = attractions.find(a => a.id === parseInt(id)) || attractions[0]
  const [activeImg, setActiveImg] = useState(0)
  const [view, setView] = useState('detail')
  const [adults, setAdults] = useState(0)
  const [kids, setKids] = useState(0)
  const [selectedDay, setSelectedDay] = useState(null)

  const links = bookingLinks(attraction.name)
  const cal = attraction.calendar

  const DetailContent = () => (
    <>
      <div className="detail-gallery">
        <img src={attraction.images[activeImg]} alt={attraction.name} className="gallery-main-sm" />
        <div className="gallery-thumbs">
          {attraction.images.slice(1).map((img, i) => (
            <img key={i} src={img} alt=""
              className={`gallery-thumb ${activeImg === i + 1 ? 'thumb-active' : ''}`}
              onClick={() => setActiveImg(i + 1)}
            />
          ))}
        </div>
      </div>

      <Stars rating={attraction.rating} />

      <ul className="detail-highlights">
        {attraction.highlights.map((h, i) => (
          <li key={i}><span className="highlight-dot">○</span> {h}</li>
        ))}
      </ul>

      <div className="detail-description">
        {attraction.description.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
      </div>

      <div className="detail-facilities">
        <h3>Facilities</h3>
        <div className="facilities-grid">
          {attraction.facilities.map((f, i) => (
            <div key={i} className="facility-item">
              <span className="facility-icon">{f.icon}</span>
              <span className="facility-label">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h3>Reviews</h3>
          <span className="reviews-score">
            <strong>{attraction.rating}/5</strong> Outstanding · {attraction.reviewCount} reviews
          </span>
        </div>
        {attraction.reviews.map((r, i) => (
          <div key={i} className="review-card">
            <div className="review-top">
              <div className="review-avatar">{r.avatar}</div>
              <div>
                <p className="review-name">{r.name}</p>
                <div className="review-rating-row">
                  <Stars rating={r.rating} size="sm" />
                  <span className="review-label">{r.rating}/5 {r.label}</span>
                </div>
              </div>
            </div>
            <p className="review-text">{r.text}</p>
            {r.images.length > 0 && (
              <div className="review-images">
                {r.images.map((img, j) => (
                  <img key={j} src={img} alt="review" className="review-img" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )

  const RightColumn = () => (
    <div className="detail-right">
      <div className="detail-map-card">
        <iframe title="Attraction Map" src={attraction.mapSrc} width="100%" height="180"
          style={{ border: 0, borderRadius: '8px' }} allowFullScreen="" loading="lazy"
        ></iframe>
        <p className="detail-address">{attraction.address}</p>
      </div>
      <div className="detail-video">
        {attraction.videoUrl ? (
          <iframe src={attraction.videoUrl} title="Attraction Video" width="100%" height="200"
            style={{ border: 0, borderRadius: '8px' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="video-thumb">
            <img src={attraction.images[0]} alt="Video placeholder" />
            <div className="video-play">▶</div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="detail-page">

      {/* Hero */}
      <div className="detail-hero" style={{ backgroundImage: `url(${attraction.images[0]})` }}>
        <div className="detail-hero-overlay">
          <h1>{attraction.name}</h1>
          <p className="detail-hero-loc">{attraction.location}</p>
        </div>
      </div>

      {/* ── DETAIL VIEW ── */}
      {view === 'detail' && (
        <div className="detail-body">
          <div className="detail-left"><DetailContent /></div>
          <RightColumn />
        </div>
      )}

      {/* ── PRICES VIEW ── */}
      {view === 'prices' && (
        <div className="prices-body">

          {/* Ticket selectors + booking logos */}
          <div className="prices-top">
            <div className="ticket-selectors">
              <div className="ticket-selector-item">
                <label>Adult</label>
                <select value={adults} onChange={e => setAdults(parseInt(e.target.value))} className="ticket-select">
                  {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="ticket-selector-item">
                <label>Kids</label>
                <select value={kids} onChange={e => setKids(parseInt(e.target.value))} className="ticket-select">
                  {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <button className="btn-confirm">Confirm</button>
            </div>
            <div className="booking-logos">
              {links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noreferrer"
                  className="booking-logo-btn" style={{ background: l.color }}
                  title={l.label}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="prices-calendar">
            <h3>Dates and prices</h3>
            <div className="cal-card-full">
              <div className="cal-header">
                <button className="cal-nav">‹</button>
                <span>{cal.month}</span>
                <button className="cal-nav">›</button>
              </div>
              <div className="cal-grid-full">
                {DAYS.map(d => (
                  <div key={d} className="cal-day-label-full">{d}</div>
                ))}
                {Array(cal.firstDay).fill(null).map((_, i) => (
                  <div key={`empty-${i}`}></div>
                ))}
                {cal.prices.map((price, i) =>
                  price !== null ? (
                    <button
                      key={i}
                      className={`cal-day-full ${selectedDay === i + 1 ? 'cal-day-selected' : ''}`}
                      onClick={() => setSelectedDay(i + 1)}
                    >
                      <span className="cal-date-full">{i + 1}</span>
                      <span className="cal-price-full">{price === 0 ? 'Free' : `RM ${price}`}</span>
                      {(adults > 0 || kids > 0) && (
                        <span className="cal-total-full">Total: RM {price === 0 ? adults * attraction.priceAdult + kids * attraction.priceKid : price + adults * attraction.priceAdult + kids * attraction.priceKid}</span>
                      )}
                    </button>
                  ) : <div key={`null-${i}`}></div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

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


      {/* Sticky Button */}
      <div className="sticky-bar">
        {view === 'detail' ? (
          <button className="sticky-btn" onClick={() => { setView('prices'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            See Price →
          </button>
        ) : (
          <button className="sticky-btn sticky-btn-back" onClick={() => { setView('detail'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            ← Back to Overview
          </button>
        )}
      </div>

    </div>
  )
}

export default AttractionDetail