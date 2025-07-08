import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import { updateHeartbeat } from '../controllers/userController.js'

const router = express.Router()

// Heartbeat endpoint - requires authentication
router.post('/heartbeat', authenticateToken, updateHeartbeat)

export default router