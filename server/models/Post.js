const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    hashtags: [String],
    trendingTopics: [String],
    imagePath: {
      type: String,
      default: null,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['draft', 'approved', 'posted', 'failed', 'scheduled'],
      default: 'draft',
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    postedAt: {
      type: Date,
      default: null,
    },
    socialMediaIds: {
      facebook: String,
      linkedin: String,
    },
    engagement: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
    },
    aiMetadata: {
      generationModel: String,
      trendingTopicsSources: [String],
      confidenceScore: Number,
      userNiche: String,
    },
    editedCaption: {
      type: String,
      default: null,
    },
    editedHashtags: [String],
    approvalNotes: String,
    failureReason: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
postSchema.index({ userId: 1, status: 1 });
postSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
