import express from 'express'
import Activity from '../models/Activity.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get user's recent activity
router.get('/', authenticateToken, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()

    res.json(activities)
  } catch (error) {
    console.error('Get activities error:', error)
    res.status(500).json({
      error: 'Failed to get activities',
      code: 'FETCH_ERROR'
    })
  }
})

// Add new activity
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, title, description, relatedId, metadata } = req.body

    const success = await Activity.addActivity(
      req.user._id,
      type,
      title,
      description,
      relatedId,
      metadata
    )

    if (success) {
      res.status(201).json({ message: 'Activity added successfully' })
    } else {
      res.status(500).json({ error: 'Failed to add activity' })
    }
  } catch (error) {
    console.error('Add activity error:', error)
    res.status(500).json({
      error: 'Failed to add activity',
      code: 'CREATE_ERROR'
    })
  }
})

// Remove activities by recipe ID
router.delete('/recipe/:recipeId', authenticateToken, async (req, res) => {
  try {
    const { recipeId } = req.params

    await Activity.deleteMany({ 
      userId: req.user._id, 
      relatedId: recipeId 
    })

    res.json({ message: 'Activities removed successfully' })
  } catch (error) {
    console.error('Remove activities by recipe ID error:', error)
    res.status(500).json({
      error: 'Failed to remove activities',
      code: 'DELETE_ERROR'
    })
  }
})

export default router