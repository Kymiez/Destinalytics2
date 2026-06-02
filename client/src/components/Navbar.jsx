import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Hotel Bookings', path: '/hotels' },
    { label: 'Attractions', path: '/attractions' },
    { label: 'Trip Planner', path: '/trip-planner' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="Destinalytics" className="navbar-logo" />
        <span className="navbar-brand">Destinalytics</span>
      </div>
      <ul className="navbar-links">
        {links.map(link => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={location.pathname === link.path ? 'active' : ''}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="navbar-right">
        
        <Link to="/profile" className="navbar-avatar">
          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" alt="Profile" />
        </Link>
      </div>
    </nav>
  )
}

export default Navbar