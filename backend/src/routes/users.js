import express from 'express'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get user stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = req.user
    
    res.json({
      stats: user.stats,
      userId: user._id
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    res.status(500).json({
      error: 'Failed to get user stats',
      code: 'STATS_ERROR'
    })
  }
})

export default router
