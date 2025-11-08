const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
    },
    niche: {
      type: String,
      default: null,
      description: 'User industry/niche (e.g., tech, business, lifestyle)',
    },
    niches: [
      {
        name: String,
        description: String,
        keywords: [String],
      },
    ],
    targetAudience: {
      type: String,
      default: null,
    },
    postingStyle: {
      type: String,
      enum: ['professional', 'casual', 'humorous', 'inspirational', 'educational'],
      default: 'professional',
    },
    socialMediaAccounts: {
      facebook: {
        pageId: String,
        accessToken: String,
        connected: { type: Boolean, default: false },
      },
      linkedin: {
        profileId: String,
        accessToken: String,
        connected: { type: Boolean, default: false },
      },
    },
    preferences: {
      autoPostingEnabled: { type: Boolean, default: false },
      postingFrequency: { type: String, enum: ['daily', 'weekly', 'custom'], default: 'daily' },
      bestTimeToPost: { type: String, default: '09:00' },
      includeHashtags: { type: Boolean, default: true },
      includeTrendingTopics: { type: Boolean, default: true },
      maxHashtags: { type: Number, default: 10 },
    },
    pastPosts: [
      {
        caption: String,
        engagement: Number,
        likes: Number,
        comments: Number,
        shares: Number,
        postedAt: Date,
      },
    ],
    profileCompleteness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
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

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
