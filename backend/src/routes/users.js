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

// Update user preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const user = req.user
    const { preferences, language, dietaryRestrictions, cuisinePreferences, difficulty, maxCookingTime } = req.body
    
    // Handle nested preferences object or direct properties
    const prefsToUpdate = preferences || { language, dietaryRestrictions, cuisinePreferences, difficulty, maxCookingTime }
    
    // Update preferences
    if (prefsToUpdate.language !== undefined) {
      user.preferences.language = prefsToUpdate.language
    }
    if (prefsToUpdate.dietaryRestrictions !== undefined) {
      user.preferences.dietaryRestrictions = prefsToUpdate.dietaryRestrictions
    }
    if (prefsToUpdate.cuisinePreferences !== undefined) {
      user.preferences.cuisinePreferences = prefsToUpdate.cuisinePreferences
    }
    if (prefsToUpdate.difficulty !== undefined) {
      user.preferences.difficulty = prefsToUpdate.difficulty
    }
    if (prefsToUpdate.maxCookingTime !== undefined) {
      user.preferences.maxCookingTime = prefsToUpdate.maxCookingTime
    }
    
    await user.save()
    
    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    })
  } catch (error) {
    console.error('Update preferences error:', error)
    res.status(500).json({
      error: 'Failed to update preferences',
      code: 'PREFERENCES_UPDATE_ERROR'
    })
  }
})

export default router
