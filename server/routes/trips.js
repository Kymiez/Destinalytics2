const express = require('express')
const { PrismaClient } = require('@prisma/client')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

router.use(authMiddleware)

// GET /api/trips
router.get('/', async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    })

    res.json(trips)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error.' })
  }
})

// POST /api/trips
router.post('/', async (req, res) => {
  const { tripName, startDate, endDate, guests, estimatedBudget, totalCost, activities } = req.body

  if (!tripName || !startDate || !endDate) {
    return res.status(400).json({ message: 'Trip name, start date and end date are required.' })
  }

  try {
    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        tripName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        guests: parseInt(guests) || 1,
        estimatedBudget: parseFloat(estimatedBudget) || 0,
        totalCost: parseFloat(totalCost) || 0,
        activities: JSON.stringify(activities || [])
      }
    })

    res.status(201).json({
      id: trip.id,
      userId: trip.userId,
      createdAt: trip.createdAt,
      startDate: trip.startDate,
      endDate: trip.endDate,
      tripName,
      guests: parseInt(guests) || 1,
      estimatedBudget: parseFloat(estimatedBudget) || 0,
      totalCost: parseFloat(totalCost) || 0,
      activities: activities || []
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error.' })
  }
})

// PUT /api/trips/:id
router.put('/:id', async (req, res) => {
  const { tripName, startDate, endDate, guests, estimatedBudget, totalCost, activities } = req.body
  const tripId = parseInt(req.params.id)

  try {
    const existing = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id }
    })
    if (!existing) return res.status(404).json({ message: 'Trip not found.' })

    const updated = await prisma.trip.update({
      where: { id: tripId },
      data: {
        tripName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        guests: parseInt(guests) || 1,
        estimatedBudget: parseFloat(estimatedBudget) || 0,
        totalCost: parseFloat(totalCost) || 0,
        activities: JSON.stringify(activities || [])
      }
    })

    res.json({
      id: updated.id,
      userId: updated.userId,
      createdAt: updated.createdAt,
      startDate: updated.startDate,
      endDate: updated.endDate,
      tripName,
      guests,
      estimatedBudget: parseFloat(estimatedBudget) || 0,
      totalCost: parseFloat(totalCost) || 0,
      activities: activities || []
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error.' })
  }
})

// DELETE /api/trips/:id
router.delete('/:id', async (req, res) => {
  const tripId = parseInt(req.params.id)
  try {
    const existing = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id }
    })
    if (!existing) return res.status(404).json({ message: 'Trip not found.' })
    await prisma.trip.delete({ where: { id: tripId } })
    res.json({ message: 'Trip deleted successfully.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error.' })
  }
})

module.exports = router