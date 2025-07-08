/**
 * Admin authorization middleware
 * Verifies that the authenticated user has admin privileges
 */

const adminAuth = (req, res, next) => {
  try {
    // Check if user is authenticated (auth middleware should run first)
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      })
    }

    // Check if user has admin email
    const adminEmail = 'mirco.carp@icloud.com'
    if (req.user.email !== adminEmail) {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      })
    }

    next()
  } catch (error) {
    console.error('Admin auth error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Server error in admin authorization' 
    })
  }
}

export default adminAuth