import express from 'express'
import { register, login, getMe, updateProfile, refreshToken } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)

// Protected routes
router.get('/me', authenticateToken, getMe)
router.put('/profile', authenticateToken, updateProfile)
router.post('/refresh', authenticateToken, refreshToken)

export default router
