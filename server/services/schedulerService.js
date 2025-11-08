const cron = require('node-cron');
const User = require('../models/User');
const Post = require('../models/Post');
const aiService = require('./aiService');
const trendingService = require('./trendingService');
const imageService = require('./imageService');

/**
 * Scheduler Service
 * Handles automated daily post generation
 */

class SchedulerService {
  constructor() {
    this.jobs = new Map();
  }

  /**
   * Start scheduler for a user
   * @param {String} userId - User ID
   * @param {String} scheduleTime - Cron expression (default: daily at 9 AM)
   */
  async startScheduler(userId, scheduleTime = '0 9 * * *') {
    try {
      if (this.jobs.has(userId)) {
        console.log(`Scheduler already running for user ${userId}`);
        return;
      }

      const job = cron.schedule(scheduleTime, async () => {
        await this.generateDailyPost(userId);
      });

      this.jobs.set(userId, job);
      console.log(`✓ Scheduler started for user ${userId}`);
    } catch (error) {
      console.error('Error starting scheduler:', error.message);
    }
  }

  /**
   * Stop scheduler for a user
   * @param {String} userId - User ID
   */
  stopScheduler(userId) {
    try {
      const job = this.jobs.get(userId);
      if (job) {
        job.stop();
        this.jobs.delete(userId);
        console.log(`✓ Scheduler stopped for user ${userId}`);
      }
    } catch (error) {
      console.error('Error stopping scheduler:', error.message);
    }
  }

  /**
   * Generate daily post for a user
   * @private
   */
  async generateDailyPost(userId) {
    try {
      const user = await User.findById(userId);

      if (!user || !user.preferences.autoPostingEnabled) {
        return;
      }

      // Get trending topics
      const trendingTopics = await trendingService.getTrendingTopics(
        user.niche,
        user.niches?.flatMap((n) => n.keywords) || []
      );

      // Generate caption
      const captionData = await aiService.generateCaption({
        niche: user.niche,
        style: user.postingStyle,
        trendingTopics,
        targetAudience: user.targetAudience,
        pastEngagementData: user.pastPosts,
      });

      // Select image
      const image = await imageService.selectImageForCaption(
        captionData.caption,
        captionData.hashtags
      );

      // Create post draft
      const post = new Post({
        userId,
        caption: captionData.caption,
        hashtags: captionData.hashtags,
        trendingTopics: captionData.trendingTopics,
        imagePath: image?.path,
        imageUrl: image?.url,
        status: 'draft',
        aiMetadata: {
          generationModel: 'gpt-3.5-turbo',
          trendingTopicsSources: trendingTopics,
          confidenceScore: captionData.confidenceScore,
          userNiche: user.niche,
        },
      });

      await post.save();

      console.log(`✓ Daily post generated for user ${userId}: ${post._id}`);
    } catch (error) {
      console.error(`Error generating daily post for user ${userId}:`, error.message);
    }
  }

  /**
   * Start all active schedulers
   * Call this on server startup
   */
  async startAllSchedulers() {
    try {
      const users = await User.find({ 'preferences.autoPostingEnabled': true });

      for (const user of users) {
        const scheduleTime = this._convertTimeToExpression(user.preferences.bestTimeToPost);
        await this.startScheduler(user._id.toString(), scheduleTime);
      }

      console.log(`✓ Started ${users.length} schedulers`);
    } catch (error) {
      console.error('Error starting all schedulers:', error.message);
    }
  }

  /**
   * Convert time string (HH:MM) to cron expression
   * @private
   */
  _convertTimeToExpression(timeString) {
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      return `${minutes} ${hours} * * *`;
    } catch (error) {
      console.error('Error converting time to cron expression:', error.message);
      return '0 9 * * *'; // Default to 9 AM
    }
  }

  /**
   * Get scheduler status
   */
  getSchedulerStatus(userId) {
    const job = this.jobs.get(userId);
    return {
      userId,
      isRunning: !!job,
      totalSchedulers: this.jobs.size,
    };
  }

  /**
   * Get all active schedulers
   */
  getAllSchedulers() {
    return Array.from(this.jobs.entries()).map(([userId, job]) => ({
      userId,
      isRunning: true,
    }));
  }
}

module.exports = new SchedulerService();
