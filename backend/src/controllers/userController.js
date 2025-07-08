import User from '../models/User.js'

/**
 * Update user's last seen timestamp (heartbeat)
 */
export const updateHeartbeat = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      })
    }

    // Update lastSeen timestamp
    await User.findByIdAndUpdate(req.user._id, {
      lastSeen: new Date()
    })

    res.json({
      success: true,
      message: 'Heartbeat updated'
    })
  } catch (error) {
    console.error('Error updating heartbeat:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating heartbeat'
    })
  }
}