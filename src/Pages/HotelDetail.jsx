import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import './DetailPage.css'

const hotels = [
  {
    id: 1,
    name: 'The RuMa Hotel & Residences',
    videoUrl: 'https://www.youtube.com/embed/C6C8wTOiIZI?si=_UW2RUWSsQ9LiWnP',
    location: 'Kuala Lumpur',
    subtitle: 'Balearic Islands, Spain',
    address: '7, Jalan Kia Peng, Kuala Lumpur, 50450 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur',
    rating: 4.5,
    reviewCount: '1.5k',
    description: 'The RuMa Hotel & Residences, Kuala Lumpur is a luxurious urban retreat in the Golden Triangle, just steps from KLCC and the Petronas Twin Towers. Its elegantly designed rooms and suites offer sweeping city views, blending modern luxury with local charm.\n\nGuests can enjoy fine dining at ATAS, crafted cocktails at SEVEN Lobby Bar, or relaxing moments at The Librari. Wellness facilities include the UR SPA, a cantilevered infinity pool, and a 24-hour gym, combining relaxation with city energy.\n\nWith its prime location, refined amenities, and personalised service, The RuMa provides a serene yet vibrant escape in the heart of Kuala Lumpur.',
    highlights: [
      'Centrally Located in Kuala Lumpur',
      '5-Minute Drive From KLCC',
      '7 Minutes From Ampang Park',
      'KLCC Tower View',
      'Free Wi-Fi Connection',
      'SPA World',
    ],
    facilities: [
      { icon: '📶', label: 'Wi-Fi' },
      { icon: '🏊', label: 'Indoor swimming pool' },
      { icon: '🌿', label: 'Terrace' },
      { icon: '🏠', label: 'Balcony' },
      { icon: '🍽', label: 'Restaurant' },
      { icon: '💆', label: 'SPA world' },
      { icon: '💄', label: 'Luxury cosmetic amenities' },
      { icon: '🏋', label: 'Fitness' },
      { icon: '🧖', label: 'Sauna' },
      { icon: '🗼', label: 'KLCC tower view' },
    ],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
    ],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.8!2d101.713!3d3.153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37d12d669c1f%3A0x4f3c7a6e48c07e3!2sThe%20RuMa%20Hotel%20and%20Residences!5e0!3m2!1sen!2smy!4v1700000000000',
    reviews: [
      {
        name: 'Rogayah.ha',
        avatar: 'R',
        rating: 4.3,
        label: 'Amazing',
        text: 'Staying at The RuMa Hotel and Residences was an exceptional experience for the two of us and truly made our trip to Kuala Lumpur special. The room was beautifully designed, spacious, and incredibly comfortable, offering a perfect balance of luxury and warmth. We especially loved the peaceful atmosphere and thoughtful details that made the stay feel intimate and relaxing.',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&q=80',
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=200&q=80',
        ],
      },
      {
        name: 'Badrul_hensem',
        avatar: 'B',
        rating: 4.7,
        label: 'Excellent',
        text: 'Our family stay at The RuMa Hotel and Residences was truly enjoyable and exceeded our expectations. The room was spacious, comfortable, and thoughtfully designed, giving us plenty of space to relax with our children after a long day exploring the city. The calm and elegant atmosphere made the hotel feel like a peaceful retreat in the middle of Kuala Lumpur.',
        images: [],
      },
    ],
    rooms: [
      {
        name: 'Standard Double Room',
        img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80',
        amenities: ['1 double bed', '100 sq ft', 'air-condition', 'TV', 'all inclusive', 'KLCC tower view', 'bath'],
        priceMin: 550,
        priceMax: 950,
      },
      {
        name: 'Standard Single Room',
        img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=80',
        amenities: ['2 single bed', '100 sq ft', 'air-condition', 'TV', 'all inclusive', 'KLCC tower view', 'bath'],
        priceMin: 500,
        priceMax: 900,
      },
    ],
  },
  {
    id: 2,
    name: 'Hilton Hotel KL',
    location: 'Kuala Lumpur',
    subtitle: 'KL Sentral, Kuala Lumpur',
    address: '3, Jalan Stesen Sentral, KL Sentral, 50470 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur',
    rating: 4.2,
    reviewCount: '2.1k',
    description: 'Hilton Kuala Lumpur is a modern landmark hotel situated at KL Sentral, the city\'s main transportation hub. Offering direct access to the KLIA Ekspres and major rail lines, it is the ideal base for both business and leisure travellers exploring the city.\n\nThe hotel features spacious rooms with floor-to-ceiling windows overlooking the city skyline, along with world-class dining at Vasco\'s and a stunning rooftop pool.',
    highlights: [
      'Located at KL Sentral Transport Hub',
      'Direct Access to KLIA Ekspres Train',
      'Rooftop Infinity Pool with City Views',
      'Multiple Dining Outlets',
      'Free Wi-Fi Throughout',
      '10 Minutes to Bukit Bintang',
    ],
    facilities: [
      { icon: '📶', label: 'Wi-Fi' },
      { icon: '🏊', label: 'Rooftop pool' },
      { icon: '🍽', label: 'Restaurant' },
      { icon: '🚉', label: 'Train access' },
      { icon: '🏋', label: 'Fitness centre' },
      { icon: '🧴', label: 'Spa & wellness' },
      { icon: '🅿', label: 'Parking' },
      { icon: '🍸', label: 'Lobby bar' },
      { icon: '💼', label: 'Business centre' },
      { icon: '🛎', label: '24hr concierge' },
    ],
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80',
      'https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?w=400&q=80',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80',
    ],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.1!2d101.686!3d3.134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc49c701efeae7%3A0xf4d98e5b2f1c287d!2sHilton%20Kuala%20Lumpur!5e0!3m2!1sen!2smy!4v1700000000000',
    reviews: [
      {
        name: 'TravellerMike',
        avatar: 'T',
        rating: 4.2,
        label: 'Great',
        text: 'The location at KL Sentral is unbeatable for getting around the city. Room was clean and modern with excellent views. Staff were very helpful throughout our stay.',
        images: [],
      },
    ],
    rooms: [
      {
        name: 'Deluxe King Room',
        img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80',
        amenities: ['1 king bed', '120 sq ft', 'air-condition', 'TV', 'city view', 'minibar', 'bath'],
        priceMin: 280,
        priceMax: 520,
      },
      {
        name: 'Twin Room',
        img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=80',
        amenities: ['2 single beds', '110 sq ft', 'air-condition', 'TV', 'city view', 'minibar', 'shower'],
        priceMin: 240,
        priceMax: 460,
      },
    ],
  },
  {
    id: 3,
    name: 'Element KL',
    location: 'Kuala Lumpur',
    subtitle: 'Damansara, Kuala Lumpur',
    address: 'No. 8, Jalan Damansara, 50490 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur',
    rating: 3.8,
    reviewCount: '980',
    description: 'Element Kuala Lumpur is a contemporary extended-stay hotel designed for the modern traveller who values sustainability and well-being. Nestled near Masjid Negara and the National Museum, it offers a calm retreat amid the urban buzz.\n\nThe hotel features studio and one-bedroom suites with fully equipped kitchens, ideal for longer stays. Guests enjoy the outdoor pool, Naturi restaurant serving health-inspired cuisine, and a fully equipped fitness centre.',
    highlights: [
      'Extended-Stay Suites with Full Kitchen',
      'Near Masjid Negara and National Museum',
      'Outdoor Pool and Sundeck',
      'Health-Inspired Dining at Naturi',
      'Eco-Friendly and Sustainable Design',
      'Free Bicycle Rentals for Guests',
    ],
    facilities: [
      { icon: '📶', label: 'Wi-Fi' },
      { icon: '🏊', label: 'Outdoor pool' },
      { icon: '🍽', label: 'Restaurant' },
      { icon: '🍳', label: 'In-room kitchen' },
      { icon: '🏋', label: 'Fitness centre' },
      { icon: '🚲', label: 'Bicycle rental' },
      { icon: '♻', label: 'Eco-friendly' },
      { icon: '🌿', label: 'Garden terrace' },
      { icon: '🧺', label: 'Laundry' },
      { icon: '🅿', label: 'Parking' },
    ],
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80',
    ],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.2!2d101.692!3d3.141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sen!2smy!4v1700000000000',
    reviews: [
      {
        name: 'EcoTraveller',
        avatar: 'E',
        rating: 3.8,
        label: 'Good',
        text: 'Great choice for a longer stay. The kitchen in the room is very convenient and the eco-friendly approach is refreshing. Pool area is nice and relaxing. Would recommend for families.',
        images: [],
      },
    ],
    rooms: [
      {
        name: 'Studio Suite',
        img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80',
        amenities: ['1 queen bed', '150 sq ft', 'air-condition', 'kitchenette', 'TV', 'garden view', 'shower'],
        priceMin: 120,
        priceMax: 220,
      },
      {
        name: 'One Bedroom Suite',
        img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=80',
        amenities: ['1 king bed', '220 sq ft', 'air-condition', 'full kitchen', 'TV', 'pool view', 'bath'],
        priceMin: 180,
        priceMax: 320,
      },
    ],
  },
]

const bookingLinks = (hotelName) => [
  {
    label: 'Trip',
    color: '#1abc9c',
    url: `https://www.trip.com/hotels/search?keyword=${encodeURIComponent(hotelName)}`,
  },
  {
    label: 'Booking',
    color: '#003580',
    url: `https://www.booking.com/search.html?ss=${encodeURIComponent(hotelName)}`,
  },
  {
    label: 'Klook',
    color: '#ff5722',
    url: `https://www.klook.com/en-MY/search/?query=${encodeURIComponent(hotelName)}`,
  },
  {
    label: 'Agoda',
    color: '#e74c3c',
    url: `https://www.agoda.com/search?city=1756&textToSearch=${encodeURIComponent(hotelName)}`,
  },
]

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

function HotelDetail() {
  const { id } = useParams()
  const hotel = hotels.find(h => h.id === parseInt(id)) || hotels[0]
  const [activeImg, setActiveImg] = useState(0)
  const [view, setView] = useState('detail') // 'detail' | 'rooms'

  const links = bookingLinks(hotel.name)

  return (
    <div className="detail-page">

      {/* Hero */}
      <div className="detail-hero" style={{ backgroundImage: `url(${hotel.images[0]})` }}>
        <div className="detail-hero-overlay">
          <h1>{hotel.name}</h1>
          <p className="detail-hero-loc">{hotel.location}</p>
          <p className="detail-hero-sub">{hotel.subtitle}</p>
        </div>
      </div>

      {/* ── DETAIL VIEW ── */}
      {view === 'detail' && (
        <div className="detail-body">
          <div className="detail-left">

            {/* Gallery — smaller */}
            <div className="detail-gallery">
              <img src={hotel.images[activeImg]} alt={hotel.name} className="gallery-main-sm" />
              <div className="gallery-thumbs">
                {hotel.images.slice(1).map((img, i) => (
                  <img key={i} src={img} alt=""
                    className={`gallery-thumb ${activeImg === i + 1 ? 'thumb-active' : ''}`}
                    onClick={() => setActiveImg(i + 1)}
                  />
                ))}
              </div>
            </div>

            <Stars rating={hotel.rating} />

            <ul className="detail-highlights">
              {hotel.highlights.map((h, i) => (
                <li key={i}><span className="highlight-dot">○</span> {h}</li>
              ))}
            </ul>

            <div className="detail-description">
              {hotel.description.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
            </div>

            <div className="detail-facilities">
              <h3>Facilities</h3>
              <div className="facilities-grid">
                {hotel.facilities.map((f, i) => (
                  <div key={i} className="facility-item">
                    <span className="facility-icon">{f.icon}</span>
                    <span className="facility-label">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="reviews-section">
              <div className="reviews-header">
                <h3>Reviews</h3>
                <span className="reviews-score">
                  <strong>{hotel.rating}/5</strong> Outstanding · {hotel.reviewCount} reviews
                </span>
              </div>
              {hotel.reviews.map((r, i) => (
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

          </div>

          {/* Right column */}
          <div className="detail-right">
            <div className="detail-map-card">
              <iframe title="Hotel Map" src={hotel.mapSrc} width="100%" height="180"
                style={{ border: 0, borderRadius: '8px' }} allowFullScreen="" loading="lazy"
              ></iframe>
              <p className="detail-address">{hotel.address}</p>
            </div>

            <div className="detail-video">
  {hotel.videoUrl ? (
    <iframe
      src={hotel.videoUrl}
      title="Hotel Video"
      width="100%"
      height="200"
      style={{ border: 0, borderRadius: '8px' }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  ) : (
    <div className="video-thumb">
      <img src={hotel.images[0]} alt="No video available" />
      <div className="video-play">▶</div>
    </div>
  )}
</div>
          </div>
        </div>
      )}

      {/* ── ROOMS VIEW ── */}
      {view === 'rooms' && (
        <div className="rooms-body">
          <div className="detail-left">

            <div className="detail-gallery">
              <img src={hotel.images[activeImg]} alt={hotel.name} className="gallery-main-sm" />
              <div className="gallery-thumbs">
                {hotel.images.slice(1).map((img, i) => (
                  <img key={i} src={img} alt=""
                    className={`gallery-thumb ${activeImg === i + 1 ? 'thumb-active' : ''}`}
                    onClick={() => setActiveImg(i + 1)}
                  />
                ))}
              </div>
            </div>

            <Stars rating={hotel.rating} />

            <ul className="detail-highlights">
              {hotel.highlights.map((h, i) => (
                <li key={i}><span className="highlight-dot">○</span> {h}</li>
              ))}
            </ul>

            <div className="detail-description">
              {hotel.description.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
            </div>

            <div className="detail-facilities">
              <h3>Facilities</h3>
              <div className="facilities-grid">
                {hotel.facilities.map((f, i) => (
                  <div key={i} className="facility-item">
                    <span className="facility-icon">{f.icon}</span>
                    <span className="facility-label">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms Available */}
            <div className="rooms-section">
              <h3>Rooms available</h3>
              {hotel.rooms.map((room, i) => (
                <div key={i} className="room-card">
                  <img src={room.img} alt={room.name} className="room-img" />
                  <div className="room-info">
                    <h4>{room.name}</h4>
                    <div className="room-amenities">
                      {room.amenities.map((a, j) => (
                        <span key={j} className="room-amenity">
                          <span className="amenity-dot">•</span> {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="room-price-col">
                    <p className="room-price-label">Price Range</p>
                    <p className="room-price">RM {room.priceMin} – RM {room.priceMax}</p>
                    <div className="booking-btns">
                      {links.map((l, j) => (
                        <a key={j} href={l.url} target="_blank" rel="noreferrer"
                          className="booking-btn" style={{ background: l.color }}>
                          {l.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="detail-right">
            <div className="detail-map-card">
              <iframe title="Hotel Map" src={hotel.mapSrc} width="100%" height="180"
                style={{ border: 0, borderRadius: '8px' }} allowFullScreen="" loading="lazy"
              ></iframe>
              <p className="detail-address">{hotel.address}</p>
            </div>
            <div className="detail-video">
              <div className="video-thumb">
                <img src={hotel.images[0]} alt="Video" />
                <div className="video-play">▶</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter */}
      <footer className="newsletter">
        <h3>Subscribe to our newsletter</h3>
        <p>Know about our new offers first!</p>
        <div className="newsletter-form">
          <input type="email" placeholder="@gmail.com" />
          <button>Subscribe</button>
        </div>
      </footer>

      {/* Sticky Button */}
      <div className="sticky-bar">
        {view === 'detail' ? (
          <button className="sticky-btn" onClick={() => { setView('rooms'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            View Rooms Available →
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

export default HotelDetail