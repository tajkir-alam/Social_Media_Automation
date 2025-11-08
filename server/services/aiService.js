const axios = require('axios');

/**
 * AI Service for generating social media captions
 * Uses OpenAI API to create engaging captions with hashtags and trending topics
 */

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = 'gpt-3.5-turbo';
  }

  /**
   * Generate a caption for social media
   * @param {Object} options - Generation options
   * @param {String} options.niche - User's industry/niche
   * @param {String} options.style - Posting style (professional, casual, etc.)
   * @param {Array} options.trendingTopics - Array of trending topics
   * @param {String} options.targetAudience - Target audience description
   * @param {String} options.imageDescription - Description of the image
   * @param {Array} options.pastEngagementData - Past posts' engagement data
   * @returns {Promise<Object>} Generated caption with hashtags
   */
  async generateCaption(options) {
    try {
      const {
        niche = 'general',
        style = 'professional',
        trendingTopics = [],
        targetAudience = 'general audience',
        imageDescription = '',
        pastEngagementData = [],
      } = options;

      // Build the prompt
      const prompt = this._buildPrompt({
        niche,
        style,
        trendingTopics,
        targetAudience,
        imageDescription,
        pastEngagementData,
      });

      // Call OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert social media content creator. Generate engaging captions with relevant hashtags and trending topics. Always respond in valid JSON format.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      const parsed = JSON.parse(content);

      return {
        caption: parsed.caption,
        hashtags: parsed.hashtags || [],
        trendingTopics: parsed.trendingTopics || [],
        confidenceScore: parsed.confidenceScore || 0.8,
      };
    } catch (error) {
      console.error('AI Caption Generation Error:', error.message);
      throw new Error(`Failed to generate caption: ${error.message}`);
    }
  }

  /**
   * Build the prompt for caption generation
   * @private
   */
  _buildPrompt({
    niche,
    style,
    trendingTopics,
    targetAudience,
    imageDescription,
    pastEngagementData,
  }) {
    let prompt = `Generate a social media caption for the following context:\n\n`;
    prompt += `Niche: ${niche}\n`;
    prompt += `Posting Style: ${style}\n`;
    prompt += `Target Audience: ${targetAudience}\n`;

    if (imageDescription) {
      prompt += `Image Description: ${imageDescription}\n`;
    }

    if (trendingTopics.length > 0) {
      prompt += `Trending Topics to Consider: ${trendingTopics.join(', ')}\n`;
    }

    if (pastEngagementData.length > 0) {
      const avgEngagement = this._calculateAverageEngagement(pastEngagementData);
      prompt += `Past High-Engagement Patterns: ${JSON.stringify(avgEngagement)}\n`;
    }

    prompt += `\nRespond with a JSON object containing:
    {
      "caption": "engaging caption text",
      "hashtags": ["hashtag1", "hashtag2", ...],
      "trendingTopics": ["topic1", "topic2", ...],
      "confidenceScore": 0.0-1.0
    }`;

    return prompt;
  }

  /**
   * Calculate average engagement metrics
   * @private
   */
  _calculateAverageEngagement(posts) {
    if (posts.length === 0) return null;

    const sum = posts.reduce(
      (acc, post) => ({
        likes: acc.likes + (post.likes || 0),
        comments: acc.comments + (post.comments || 0),
        shares: acc.shares + (post.shares || 0),
      }),
      { likes: 0, comments: 0, shares: 0 }
    );

    return {
      avgLikes: Math.round(sum.likes / posts.length),
      avgComments: Math.round(sum.comments / posts.length),
      avgShares: Math.round(sum.shares / posts.length),
    };
  }

  /**
   * Generate questions to understand user better
   */
  async generateProfilingQuestions(userContext = {}) {
    try {
      const prompt = `Generate 5 specific questions to better understand a social media user's preferences and niche.
      Current context: ${JSON.stringify(userContext)}
      
      Respond with a JSON object:
      {
        "questions": ["question1", "question2", ...]
      }`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert at understanding user preferences and niches.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      const parsed = JSON.parse(content);
      return parsed.questions || [];
    } catch (error) {
      console.error('Error generating profiling questions:', error.message);
      return [];
    }
  }
}

module.exports = new AIService();
