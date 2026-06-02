const express = require('express')
const { PrismaClient } = require('@prisma/client')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

router.use(authMiddleware)

// GET /api/favorites — list current user favorites
router.get('/', async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    })
    res.json(favorites)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error.' })
  }
})

// POST /api/favorites — add a new favorite item
router.post('/', async (req, res) => {
  const { type, itemId, name, location, img, price, link } = req.body

  if (!type || !itemId || !name || !location || !link) {
    return res.status(400).json({ message: 'Missing favorite item data.' })
  }

  try {
    const favorite = await prisma.favorite.upsert({
      where: {
        userId_type_itemId: {
          userId: req.user.id,
          type,
          itemId
        }
      },
      update: {},
      create: {
        userId: req.user.id,
        type,
        itemId,
        name,
        location,
        img: img || null,
        price: Number(price) || 0,
        link
      }
    })
    res.status(201).json(favorite)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not save favorite.' })
  }
})

// DELETE /api/favorites/:id — remove favorite
router.delete('/:id', async (req, res) => {
  const favoriteId = Number(req.params.id)
  if (!favoriteId) {
    return res.status(400).json({ message: 'Invalid favorite id.' })
  }

  try {
    const favorite = await prisma.favorite.findUnique({
      where: { id: favoriteId }
    })
    if (!favorite || favorite.userId !== req.user.id) {
      return res.status(404).json({ message: 'Favorite not found.' })
    }

    await prisma.favorite.delete({ where: { id: favoriteId } })
    res.json({ message: 'Favorite removed.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not remove favorite.' })
  }
})

module.exports = router
