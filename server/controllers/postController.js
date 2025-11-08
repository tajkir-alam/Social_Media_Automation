const Post = require('../models/Post');
const User = require('../models/User');
const aiService = require('../services/aiService');
const trendingService = require('../services/trendingService');
const socialMediaService = require('../services/socialMediaService');
const imageService = require('../services/imageService');
const Analytics = require('../models/Analytics');

/**
 * Post Controller
 * Handles all post-related operations
 */

class PostController {
  /**
   * Generate new post draft
   */
  async generatePost(req, res) {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
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

      // Log analytics
      await Analytics.create({
        userId,
        postId: post._id,
        eventType: 'post_generated',
        data: {
          caption: post.caption,
          hashtags: post.hashtags,
          trendingTopics: post.trendingTopics,
        },
      });

      return res.status(201).json({
        success: true,
        post,
        message: 'Post generated successfully',
      });
    } catch (error) {
      console.error('Error generating post:', error.message);
      return res.status(500).json({ message: 'Failed to generate post', error: error.message });
    }
  }

  /**
   * Get all posts for user
   */
  async getUserPosts(req, res) {
    try {
      const userId = req.userId;
      const { status = 'all', limit = 20, skip = 0 } = req.query;

      const query = { userId };
      if (status !== 'all') {
        query.status = status;
      }

      const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      const total = await Post.countDocuments(query);

      return res.json({
        success: true,
        posts,
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
      });
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      return res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
    }
  }

  /**
   * Get single post
   */
  async getPost(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.userId;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (post.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      return res.json({ success: true, post });
    } catch (error) {
      console.error('Error fetching post:', error.message);
      return res.status(500).json({ message: 'Failed to fetch post', error: error.message });
    }
  }

  /**
   * Update post draft
   */
  async updatePost(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.userId;
      const { caption, hashtags, approvalNotes } = req.body;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (post.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      if (post.status !== 'draft') {
        return res.status(400).json({ message: 'Can only edit draft posts' });
      }

      if (caption) {
        post.editedCaption = caption;
      }
      if (hashtags) {
        post.editedHashtags = hashtags;
      }
      if (approvalNotes) {
        post.approvalNotes = approvalNotes;
      }

      await post.save();

      return res.json({ success: true, post, message: 'Post updated successfully' });
    } catch (error) {
      console.error('Error updating post:', error.message);
      return res.status(500).json({ message: 'Failed to update post', error: error.message });
    }
  }

  /**
   * Approve and post to social media
   */
  async approveAndPost(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.userId;

      const post = await Post.findById(postId);
      const user = await User.findById(userId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (post.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      if (post.status !== 'draft') {
        return res.status(400).json({ message: 'Only draft posts can be approved' });
      }

      // Prepare post data
      const postData = {
        caption: post.editedCaption || post.caption,
        hashtags: post.editedHashtags || post.hashtags,
        imageUrl: post.imageUrl,
      };

      // Format caption with hashtags
      const formattedCaption = `${postData.caption}\n\n${postData.hashtags.join(' ')}`;

      // Post to social media
      const socialResults = await socialMediaService.postToAllPlatforms(
        user.socialMediaAccounts,
        {
          caption: formattedCaption,
          imageUrl: postData.imageUrl,
        }
      );

      // Update post status
      post.status = 'posted';
      post.postedAt = new Date();
      post.approvedAt = new Date();

      // Store social media IDs
      socialResults.forEach((result) => {
        if (result.success) {
          if (result.platform === 'facebook') {
            post.socialMediaIds.facebook = result.postId;
          } else if (result.platform === 'linkedin') {
            post.socialMediaIds.linkedin = result.postId;
          }
        } else {
          post.status = 'failed';
          post.failureReason = result.error;
        }
      });

      await post.save();

      // Log analytics
      await Analytics.create({
        userId,
        postId: post._id,
        eventType: 'post_posted',
        data: {
          caption: post.caption,
          hashtags: post.hashtags,
          platform: 'both',
        },
      });

      return res.json({
        success: true,
        post,
        socialResults,
        message: 'Post approved and published successfully',
      });
    } catch (error) {
      console.error('Error approving and posting:', error.message);
      return res.status(500).json({ message: 'Failed to post', error: error.message });
    }
  }

  /**
   * Delete post
   */
  async deletePost(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.userId;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (post.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      if (post.status !== 'draft') {
        return res.status(400).json({ message: 'Can only delete draft posts' });
      }

      await Post.findByIdAndDelete(postId);

      return res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error.message);
      return res.status(500).json({ message: 'Failed to delete post', error: error.message });
    }
  }

  /**
   * Get post analytics
   */
  async getPostAnalytics(req, res) {
    try {
      const userId = req.userId;

      const analytics = await Analytics.find({ userId }).sort({ timestamp: -1 }).limit(100);

      return res.json({ success: true, analytics });
    } catch (error) {
      console.error('Error fetching analytics:', error.message);
      return res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
    }
  }
}

module.exports = new PostController();
