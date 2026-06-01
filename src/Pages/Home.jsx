import { Link } from 'react-router-dom'
import './Home.css'

const topAttractions = [
  { name: 'KLCC Park', visitors: 2000000 },
  { name: 'Aquaria', visitors: 1500000 },
  { name: 'Avenuek', visitors: 1200000 },
  { name: 'KL Tower', visitors: 900000 },
  { name: 'Petrosains', visitors: 600000 },
]

const topHotels = [
  { name: 'The RuMa', rating: 4.5 },
  { name: 'Hilton KL', rating: 4.2 },
  { name: 'Element KL', rating: 3.8 },
  { name: 'Aloft Hotel', rating: 3.5 },
  { name: 'Hyatt Centric', rating: 3.0 },
]

const hotelPriceRating = [
  { name: 'Impiana', price: 180, rating: 4.5 },
  { name: 'Ascott', price: 260, rating: 4.3 },
  { name: 'Agresso', price: 220, rating: 4.0 },
  { name: 'Le Meridien', price: 300, rating: 3.8 },
  { name: 'Hyatt', price: 340, rating: 4.2 },
  { name: 'Maze', price: 200, rating: 3.5 },
  { name: 'More', price: 380, rating: 2.8 },
]

const wordCloudWords = [
  { word: 'comfortable', size: 1.3 },
  { word: 'amazing', size: 2.2 },
  { word: 'vibrant', size: 1.1 },
  { word: 'beautiful', size: 1.9 },
  { word: 'fun', size: 1.5 },
  { word: 'convenient', size: 1.1 },
  { word: 'exciting', size: 1.0 },
  { word: 'peaceful', size: 1.0 },
  { word: 'affordable', size: 0.95 },
  { word: 'spacious', size: 1.0 },
  { word: 'safe', size: 0.9 },
  { word: 'relaxing', size: 0.95 },
]

const travelApps = [
  { name: 'agoda', price: 280, color: '#e74c3c', emoji: '🅰' },
  { name: 'booking', price: 320, color: '#3498db', emoji: '🦢' },
  { name: 'klook', price: 260, color: '#e8a020', emoji: '🎫' },
  { name: 'Trip', price: 350, color: '#1abc9c', emoji: '✈' },
  { name: 'B.', price: 330, color: '#2471a3', emoji: '🅱' },
  { name: 'airbnb', price: 400, color: '#e84393', emoji: '🏠' },
]

const bestOffers = [
  {
    name: 'Sunway Lagoon',
    location: 'SUNWAY',
    price: 85,
    tag: 'from RM 85',
    img: 'https://malaysiatravel-assets.s3.amazonaws.com/images/20200407-26620-sunway-lagoon-jpg',
  },
  {
    name: 'Bird Park',
    location: 'KUALA LUMPUR',
    price: 35,
    tag: 'from RM 35',
    img: 'https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/mecrumqlvh7grimv0yol.jpg',
  },
  {
    name: 'Petrosains',
    location: 'KLCC',
    price: 50,
    tag: 'from RM 50',
    img: 'https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/wfu1eyafzhlwuu7imcsw.jpg',
  },
]

const maxVisitors = Math.max(...topAttractions.map(a => a.visitors))
const maxRating = 5
const maxPrice = Math.max(...travelApps.map(a => a.price))

function Home() {
  return (
    <div className="home">

      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>Explore<br /><span className="hero-accent">Kuala Lumpur</span><br />with us</h1>
          <p>Discover possibilities of travelling!</p>
          <Link to="/attractions" className="btn-explore">Explore</Link>
        </div>
      </section>


      {/* Power BI Dashboard Placeholder */}
      <section className="powerbi-section">
        <div className="powerbi-placeholder">
          <iframe
            title="Dashboard fyp 2 - Copy"
            className="powerbi-iframe"
            src="https://app.powerbi.com/view?r=eyJrIjoiZTJiYmRlZGYtNjMyZi00MTYwLWI3MjUtZWFmNGY2ZmY3NDdiIiwidCI6IjE4Y2U3NmY2LTk5ZjQtNDU3Zi05ZjYyLWFjZDY1ZDliOTc3NyIsImMiOjEwfQ%3D%3D"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="promo-text">
          <h2>Visit Aquaria</h2>
          <p className="promo-sub">Tickets</p>
          <p className="promo-price">from <strong>RM 35</strong> <span>/person</span></p>
          <Link to="/attractions" className="btn-explore" style={{ marginTop: '1rem', display: 'inline-block' }}>Explore now</Link>
        </div>
        <div className="promo-images">
          <img src="https://www.visitselangor.com/wp-content/uploads/Aquaria-KLCC.jpg" />
          <div className="promo-img-stack">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Xsg0lIZlby-d0lzpwVizPesTXQOKPCWe6A&s" />
            <div className="promo-img-sm promo-hot">
              <img src="https://www.visitselangor.com/wp-content/uploads/Aquaria-KLCC.jpg" alt="Aquaria 3" />
              <span className="hot-badge">HOT OFFER</span>
            </div>
          </div>
        </div>
      </section>

      {/* Best Offers */}
      <section className="best-offers">
        <h3>Best offers this week</h3>
        <div className="offers-grid">
          {bestOffers.map((o, i) => (
            <Link to="/attractions" key={i} className="offer-card">
              <img src={o.img} alt={o.name} />
              <div className="offer-info">
                <span className="offer-location">{o.location}</span>
                <span className="offer-name">{o.name}</span>
                <span className="offer-price">{o.tag}</span>
              </div>
            </Link>
          ))}
        </div>
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

export default Home