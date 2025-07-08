import axios from 'axios'

/**
 * Get geolocation data from IP address
 * Uses ipapi.co (free tier: 1000 requests/day)
 */
export const getLocationFromIP = async (ip) => {
  try {
    // Skip for localhost/private IPs - return null to exclude from geolocation stats
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return null
    }

    // Use ipapi.co for geolocation (free tier)
    const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
      timeout: 5000
    })

    const data = response.data

    return {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'XX', 
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      ip: ip,
      latitude: data.latitude || null,
      longitude: data.longitude || null
    }
  } catch (error) {
    console.error('Geolocation error:', error.message)
    
    // Fallback data
    return {
      country: 'Unknown',
      countryCode: 'XX',
      city: 'Unknown', 
      region: 'Unknown',
      ip: ip,
      latitude: null,
      longitude: null
    }
  }
}

/**
 * Extract real IP from request headers
 */
export const getRealIP = (req) => {
  // Check various headers for real IP (when behind proxy/nginx)
  const forwarded = req.headers['x-forwarded-for']
  const realIP = req.headers['x-real-ip']
  const cfIP = req.headers['cf-connecting-ip'] // Cloudflare
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfIP) {
    return cfIP
  }
  
  // Fallback to connection remote address
  return req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         req.ip || 
         '127.0.0.1'
}