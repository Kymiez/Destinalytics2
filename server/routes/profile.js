const express = require('express')
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

router.use(authMiddleware)

// GET /api/profile — get logged in user's profile
router.get('/', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, createdAt: true }
      // password is excluded
    })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error.' })
  }
})

// PUT /api/profile — update name or password
router.put('/', async (req, res) => {
  const { name, currentPassword, newPassword } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })

    const updateData = {}

    if (name) updateData.name = name

    // If user wants to change password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required.' })
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect.' })
      }
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, createdAt: true }
    })

    res.json({ message: 'Profile updated successfully.', user: updated })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error.' })
  }
})

module.exports = router