const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const tripRoutes = require('./routes/trips')
const profileRoutes = require('./routes/profile')
const favoriteRoutes = require('./routes/favorites')

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/trips', tripRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/favorites', favoriteRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Destinalytic API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

