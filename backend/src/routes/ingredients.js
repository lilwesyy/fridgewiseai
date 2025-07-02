import express from 'express'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Detect ingredients from image
router.post('/detect', authenticateToken, async (req, res) => {
  try {
    // Mock ingredient detection - in real app this would use RAM API or similar
    const mockIngredients = [
      'Tomatoes',
      'Onions', 
      'Garlic',
      'Basil',
      'Cheese',
      'Olive Oil'
    ]

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Update user scan stats
    await req.user.updateOne({ $inc: { 'stats.totalScans': 1 } })

    res.json({
      message: 'Ingredients detected successfully',
      ingredients: mockIngredients,
      confidence: 0.85,
      processingTime: '1.5s'
    })
  } catch (error) {
    console.error('Ingredient detection error:', error)
    res.status(500).json({
      error: 'Failed to detect ingredients',
      code: 'DETECTION_ERROR'
    })
  }
})

export default router
