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

export default router
