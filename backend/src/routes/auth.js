import express from 'express'
import { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  uploadAvatar, 
  removeAvatar,
  changePassword,
  upload 
} from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)

// Protected routes
router.get('/me', authenticateToken, getMe)
router.put('/profile', authenticateToken, updateProfile)

// Avatar routes
router.post('/avatar', authenticateToken, upload.single('avatar'), uploadAvatar)
router.delete('/avatar', authenticateToken, removeAvatar)

// Password change route
router.put('/change-password', authenticateToken, changePassword)

// Supporter/Donation routes
router.post('/supporter', authenticateToken, async (req, res) => {
  try {
    const { paypalTransactionId, amount } = req.body
    
    if (!paypalTransactionId || !amount) {
      return res.status(400).json({
        error: 'PayPal transaction ID and amount are required',
        code: 'MISSING_DONATION_DATA'
      })
    }
    
    // Update user supporter status
    const user = req.user
    user.supporter = {
      isSupporter: true,
      supporterSince: new Date(),
      donationAmount: user.supporter.donationAmount + parseFloat(amount),
      paypalTransactionId: paypalTransactionId
    }
    
    await user.save()
    
    res.json({
      message: 'Thank you for your support!',
      supporter: user.supporter
    })
    
  } catch (error) {
    console.error('Supporter registration error:', error)
    res.status(500).json({
      error: 'Failed to register supporter status',
      code: 'SUPPORTER_ERROR'
    })
  }
})

export default router
