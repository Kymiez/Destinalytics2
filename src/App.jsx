import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './Pages/Home'
import Hotels from './Pages/Hotels'
import HotelDetail from './Pages/HotelDetail'
import Attractions from './Pages/Attractions'
import AttractionDetail from './Pages/AttractionDetail'
import TripPlanner from './Pages/TripPlanner'
import Profile from './Pages/Profile'
import Login from './Pages/Login'
import Register from './Pages/Register'

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { pathname } = useLocation()
  const isAuth = pathname === '/login' || pathname === '/register'

  return (
    <>
      {!isAuth && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/attractions" element={<Attractions />} />
        <Route path="/attractions/:id" element={<AttractionDetail />} />
        <Route path="/trip-planner" element={
          <ProtectedRoute>
            <TripPlanner />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App