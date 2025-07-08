import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import adminAuth from '../middleware/admin.js'
import { 
  getUserStats, 
  getRecentUsers, 
  getAllUsers,
  getOnlineUsers,
  getRecipeStats, 
  getActivityStats,
  getPerformanceMetrics,
  getGeolocationStats,
  getAllAnalytics 
} from '../controllers/adminController.js'

const router = express.Router()

// Apply auth middleware to all admin routes
router.use(authenticateToken)
router.use(adminAuth)

// Analytics routes
router.get('/analytics', getAllAnalytics)
router.get('/users/stats', getUserStats)
router.get('/users/recent', getRecentUsers)
router.get('/users/all', getAllUsers)
router.get('/users/online', getOnlineUsers)
router.get('/recipes/stats', getRecipeStats)
router.get('/activities/stats', getActivityStats)
router.get('/performance', getPerformanceMetrics)
router.get('/geolocation', getGeolocationStats)

export default router