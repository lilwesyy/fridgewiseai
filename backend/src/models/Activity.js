import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['recipe_generated', 'recipe_saved', 'recipe_removed', 'profile_updated'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Indexes
activitySchema.index({ userId: 1, createdAt: -1 })
activitySchema.index({ createdAt: -1 })

// Static method to add activity
activitySchema.statics.addActivity = async function(userId, type, title, description = '', relatedId = null, metadata = {}) {
  try {
    // Create new activity
    await this.create({
      userId,
      type,
      title,
      description,
      relatedId,
      metadata
    })

    // Keep only last 20 activities per user
    const activities = await this.find({ userId }).sort({ createdAt: -1 }).skip(20)
    const oldActivityIds = activities.map(activity => activity._id)
    
    if (oldActivityIds.length > 0) {
      await this.deleteMany({ _id: { $in: oldActivityIds } })
    }

    return true
  } catch (error) {
    console.error('Failed to add activity:', error)
    return false
  }
}

const Activity = mongoose.model('Activity', activitySchema)
export default Activity