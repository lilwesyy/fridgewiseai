import User from '../models/User.js'
import Recipe from '../models/Recipe.js'
import Activity from '../models/Activity.js'
import { getSystemMetrics, getPerformanceStatus } from '../services/performanceService.js'

/**
 * Get user statistics
 */
export const getUserStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments()
    
    // New users today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today }
    })
    
    // Active users in last 7 days
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const activeUsers = await User.countDocuments({
      lastActivity: { $gte: weekAgo }
    })

    res.json({
      success: true,
      data: {
        total: totalUsers,
        newToday: newUsersToday,
        active: activeUsers
      }
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics'
    })
  }
}

/**
 * Get recent users
 */
export const getRecentUsers = async (req, res) => {
  try {
    const recentUsers = await User.find()
      .select('email createdAt')
      .sort({ createdAt: -1 })
      .limit(10)

    res.json({
      success: true,
      data: recentUsers
    })
  } catch (error) {
    console.error('Error fetching recent users:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching recent users'
    })
  }
}

/**
 * Get all users
 */
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find()
      .select('email createdAt updatedAt name')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: allUsers
    })
  } catch (error) {
    console.error('Error fetching all users:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching all users'
    })
  }
}

/**
 * Get recipe statistics
 */
export const getRecipeStats = async (req, res) => {
  try {
    // Total recipes
    const totalRecipes = await Recipe.countDocuments()
    
    // Recipes created today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const recipesToday = await Recipe.countDocuments({
      createdAt: { $gte: today }
    })

    res.json({
      success: true,
      data: {
        total: totalRecipes,
        today: recipesToday
      }
    })
  } catch (error) {
    console.error('Error fetching recipe stats:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe statistics'
    })
  }
}

/**
 * Get activity statistics
 */
export const getActivityStats = async (req, res) => {
  try {
    // Activities in last 7 days
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const activities = await Activity.countDocuments({
      createdAt: { $gte: weekAgo }
    })

    res.json({
      success: true,
      data: {
        weekTotal: activities
      }
    })
  } catch (error) {
    console.error('Error fetching activity stats:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching activity statistics'
    })
  }
}

/**
 * Get online users (active in last 2 minutes)
 */
export const getOnlineUsers = async (req, res) => {
  try {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
    
    const onlineUsers = await User.find({
      lastSeen: { $gte: twoMinutesAgo }
    })
      .select('email name lastSeen')
      .sort({ lastSeen: -1 })

    res.json({
      success: true,
      data: {
        users: onlineUsers,
        count: onlineUsers.length
      }
    })
  } catch (error) {
    console.error('Error fetching online users:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching online users'
    })
  }
}

/**
 * Get performance metrics
 */
export const getPerformanceMetrics = async (req, res) => {
  try {
    const metrics = getSystemMetrics()
    const status = getPerformanceStatus(metrics)

    res.json({
      success: true,
      data: {
        metrics,
        status
      }
    })
  } catch (error) {
    console.error('Error fetching performance metrics:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching performance metrics'
    })
  }
}

/**
 * Get geolocation statistics
 */
export const getGeolocationStats = async (req, res) => {
  try {
    // Get user count by country
    const usersByCountry = await User.aggregate([
      {
        $match: {
          'location.country': { $exists: true, $ne: null, $ne: 'Unknown' }
        }
      },
      {
        $group: {
          _id: {
            country: '$location.country',
            countryCode: '$location.countryCode'
          },
          count: { $sum: 1 },
          cities: { $addToSet: '$location.city' }
        }
      },
      {
        $project: {
          _id: 0,
          country: '$_id.country',
          countryCode: '$_id.countryCode',
          userCount: '$count',
          cityCount: { $size: '$cities' }
        }
      },
      {
        $sort: { userCount: -1 }
      }
    ])

    // Get user count by city
    const usersByCity = await User.aggregate([
      {
        $match: {
          'location.city': { $exists: true, $ne: null, $ne: 'Unknown' }
        }
      },
      {
        $group: {
          _id: {
            city: '$location.city',
            country: '$location.country',
            countryCode: '$location.countryCode'
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          city: '$_id.city',
          country: '$_id.country',
          countryCode: '$_id.countryCode',
          userCount: '$count'
        }
      },
      {
        $sort: { userCount: -1 }
      },
      {
        $limit: 10
      }
    ])

    res.json({
      success: true,
      data: {
        countries: usersByCountry,
        cities: usersByCity,
        totalCountries: usersByCountry.length,
        totalWithLocation: await User.countDocuments({
          'location.country': { $exists: true, $ne: null, $ne: 'Unknown' }
        })
      }
    })
  } catch (error) {
    console.error('Error fetching geolocation stats:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching geolocation stats'
    })
  }
}

/**
 * Get all analytics data in one call
 */
export const getAllAnalytics = async (req, res) => {
  try {
    // Get current date for filtering
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)

    // Get all data in parallel without calling other functions that send responses
    const [
      totalUsers,
      newUsersToday,
      activeUsers,
      onlineUsers,
      recentUsersData,
      totalRecipes,
      recipesToday,
      activities
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: today } }),
      // Use updatedAt for active users since lastActivity doesn't exist
      User.countDocuments({ updatedAt: { $gte: weekAgo } }),
      User.find({ lastSeen: { $gte: twoMinutesAgo } }).select('email name lastSeen').sort({ lastSeen: -1 }),
      User.find().select('email createdAt').sort({ createdAt: -1 }).limit(5),
      Recipe.countDocuments(),
      Recipe.countDocuments({ createdAt: { $gte: today } }),
      Activity.countDocuments({ createdAt: { $gte: weekAgo } })
    ])

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          newToday: newUsersToday,
          active: activeUsers,
          online: onlineUsers.length
        },
        recipes: {
          total: totalRecipes,
          today: recipesToday
        },
        activities: {
          weekTotal: activities
        },
        recentUsers: recentUsersData,
        onlineUsers: onlineUsers
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data'
    })
  }
}