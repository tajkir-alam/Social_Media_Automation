const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
    eventType: {
      type: String,
      enum: ['post_generated', 'post_approved', 'post_posted', 'post_failed', 'engagement_tracked'],
      required: true,
    },
    data: {
      caption: String,
      hashtags: [String],
      trendingTopics: [String],
      engagement: {
        likes: Number,
        comments: Number,
        shares: Number,
      },
      platform: {
        type: String,
        enum: ['facebook', 'linkedin', 'both'],
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
analyticsSchema.index({ userId: 1, eventType: 1 });
analyticsSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
