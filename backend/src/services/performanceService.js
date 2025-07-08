import os from 'os'
import process from 'process'

/**
 * Get current system performance metrics
 */
export const getSystemMetrics = () => {
  const totalMemory = os.totalmem()
  const freeMemory = os.freemem()
  const usedMemory = totalMemory - freeMemory
  const memoryUsagePercentage = ((usedMemory / totalMemory) * 100).toFixed(2)

  // CPU usage (approximation)
  const cpus = os.cpus()
  const cpuCount = cpus.length

  // Process memory usage
  const processMemory = process.memoryUsage()

  // System uptime
  const systemUptime = os.uptime()
  const processUptime = process.uptime()

  // Load average (Unix systems only)
  let loadAverage = [0, 0, 0]
  try {
    loadAverage = os.loadavg()
  } catch (error) {
    // Windows doesn't support loadavg
  }

  return {
    system: {
      platform: os.platform(),
      arch: os.arch(),
      cpuCount: cpuCount,
      totalMemory: Math.round(totalMemory / 1024 / 1024), // MB
      freeMemory: Math.round(freeMemory / 1024 / 1024), // MB
      usedMemory: Math.round(usedMemory / 1024 / 1024), // MB
      memoryUsagePercentage: parseFloat(memoryUsagePercentage),
      uptime: Math.round(systemUptime), // seconds
      loadAverage: loadAverage.map(load => parseFloat(load.toFixed(2)))
    },
    process: {
      pid: process.pid,
      nodeVersion: process.version,
      uptime: Math.round(processUptime), // seconds
      memory: {
        rss: Math.round(processMemory.rss / 1024 / 1024), // MB
        heapTotal: Math.round(processMemory.heapTotal / 1024 / 1024), // MB
        heapUsed: Math.round(processMemory.heapUsed / 1024 / 1024), // MB
        external: Math.round(processMemory.external / 1024 / 1024) // MB
      }
    },
    timestamp: new Date().toISOString()
  }
}

/**
 * Format uptime in human readable format
 */
export const formatUptime = (seconds) => {
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

/**
 * Get performance status based on metrics
 */
export const getPerformanceStatus = (metrics) => {
  const memoryUsage = metrics.system.memoryUsagePercentage
  const loadAvg = metrics.system.loadAverage[0] // 1-minute load average
  const cpuCount = metrics.system.cpuCount
  
  // Determine status based on memory and CPU load
  if (memoryUsage > 90 || loadAvg > cpuCount * 1.5) {
    return 'critical'
  } else if (memoryUsage > 75 || loadAvg > cpuCount) {
    return 'warning'
  } else {
    return 'good'
  }
}