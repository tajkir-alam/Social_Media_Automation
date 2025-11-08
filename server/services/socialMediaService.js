const axios = require('axios');

/**
 * Social Media Service
 * Handles posting to Facebook and LinkedIn
 */

class SocialMediaService {
  /**
   * Post to Facebook
   * @param {String} pageAccessToken - Facebook page access token
   * @param {String} pageId - Facebook page ID
   * @param {Object} postData - Post data
   * @param {String} postData.caption - Caption text
   * @param {String} postData.imageUrl - Image URL
   * @returns {Promise<Object>} Posted content ID
   */
  async postToFacebook(pageAccessToken, pageId, postData) {
    try {
      if (!pageAccessToken || !pageId) {
        throw new Error('Facebook credentials not configured');
      }

      const { caption, imageUrl } = postData;

      const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;

      const payload = {
        message: caption,
        access_token: pageAccessToken,
      };

      if (imageUrl) {
        payload.picture = imageUrl;
        payload.link = imageUrl;
      }

      const response = await axios.post(url, payload);

      return {
        success: true,
        platform: 'facebook',
        postId: response.data.id,
        url: `https://facebook.com/${response.data.id}`,
      };
    } catch (error) {
      console.error('Facebook posting error:', error.message);
      throw new Error(`Failed to post to Facebook: ${error.message}`);
    }
  }

  /**
   * Post to LinkedIn
   * @param {String} accessToken - LinkedIn access token
   * @param {String} profileId - LinkedIn profile/organization ID
   * @param {Object} postData - Post data
   * @param {String} postData.caption - Caption text
   * @param {String} postData.imageUrl - Image URL
   * @returns {Promise<Object>} Posted content ID
   */
  async postToLinkedIn(accessToken, profileId, postData) {
    try {
      if (!accessToken || !profileId) {
        throw new Error('LinkedIn credentials not configured');
      }

      const { caption, imageUrl } = postData;

      const url = 'https://api.linkedin.com/v2/ugcPosts';

      const payload = {
        author: `urn:li:person:${profileId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.PublishOpen': {
            commentaryV2: {
              text: caption,
            },
            media: [],
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      if (imageUrl) {
        payload.specificContent['com.linkedin.ugc.PublishOpen'].media.push({
          status: 'READY',
          description: {
            text: 'Image',
          },
          media: imageUrl,
          title: {
            text: 'Post Image',
          },
        });
      }

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      return {
        success: true,
        platform: 'linkedin',
        postId: response.data.id,
        url: `https://linkedin.com/feed/update/${response.data.id}`,
      };
    } catch (error) {
      console.error('LinkedIn posting error:', error.message);
      throw new Error(`Failed to post to LinkedIn: ${error.message}`);
    }
  }

  /**
   * Post to both platforms simultaneously
   * @param {Object} credentials - Social media credentials
   * @param {Object} postData - Post data
   * @returns {Promise<Array>} Results from both platforms
   */
  async postToAllPlatforms(credentials, postData) {
    try {
      const results = [];

      // Post to Facebook
      if (credentials.facebook?.pageAccessToken && credentials.facebook?.pageId) {
        try {
          const fbResult = await this.postToFacebook(
            credentials.facebook.pageAccessToken,
            credentials.facebook.pageId,
            postData
          );
          results.push(fbResult);
        } catch (error) {
          results.push({
            success: false,
            platform: 'facebook',
            error: error.message,
          });
        }
      }

      // Post to LinkedIn
      if (credentials.linkedin?.accessToken && credentials.linkedin?.profileId) {
        try {
          const liResult = await this.postToLinkedIn(
            credentials.linkedin.accessToken,
            credentials.linkedin.profileId,
            postData
          );
          results.push(liResult);
        } catch (error) {
          results.push({
            success: false,
            platform: 'linkedin',
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error posting to all platforms:', error.message);
      throw error;
    }
  }

  /**
   * Fetch engagement metrics from Facebook
   * @param {String} postId - Facebook post ID
   * @param {String} accessToken - Facebook access token
   * @returns {Promise<Object>} Engagement metrics
   */
  async getFacebookEngagement(postId, accessToken) {
    try {
      const url = `https://graph.facebook.com/v18.0/${postId}`;

      const response = await axios.get(url, {
        params: {
          fields: 'likes.summary(true).limit(0),comments.summary(true).limit(0),shares',
          access_token: accessToken,
        },
      });

      return {
        likes: response.data.likes?.summary?.total_count || 0,
        comments: response.data.comments?.summary?.total_count || 0,
        shares: response.data.shares?.count || 0,
      };
    } catch (error) {
      console.error('Error fetching Facebook engagement:', error.message);
      return { likes: 0, comments: 0, shares: 0 };
    }
  }

  /**
   * Fetch engagement metrics from LinkedIn
   * @param {String} postId - LinkedIn post ID
   * @param {String} accessToken - LinkedIn access token
   * @returns {Promise<Object>} Engagement metrics
   */
  async getLinkedInEngagement(postId, accessToken) {
    try {
      const url = `https://api.linkedin.com/v2/socialMetadata/${postId}`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      return {
        likes: response.data.likeCount || 0,
        comments: response.data.commentCount || 0,
        shares: response.data.shareCount || 0,
      };
    } catch (error) {
      console.error('Error fetching LinkedIn engagement:', error.message);
      return { likes: 0, comments: 0, shares: 0 };
    }
  }
}

module.exports = new SocialMediaService();
