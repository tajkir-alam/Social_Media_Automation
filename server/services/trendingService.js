const axios = require('axios');

/**
 * Trending Topics Service
 * Fetches and analyzes trending topics relevant to user's niche
 */

class TrendingService {
  constructor() {
    this.sources = {
      twitter: 'https://api.twitter.com/2/trends',
      google: 'https://trends.google.com/trends/api',
      reddit: 'https://www.reddit.com/r/trending.json',
    };
  }

  /**
   * Get trending topics for a specific niche
   * @param {String} niche - User's niche/industry
   * @param {Array} keywords - Keywords related to user's niche
   * @returns {Promise<Array>} Array of trending topics
   */
  async getTrendingTopics(niche = 'general', keywords = []) {
    try {
      const topics = [];

      // Simulate trending topics based on niche
      // In production, this would call real APIs
      const nicheTopics = this._getNicheBasedTopics(niche);
      const keywordTopics = this._getKeywordBasedTopics(keywords);

      topics.push(...nicheTopics);
      topics.push(...keywordTopics);

      // Remove duplicates and limit to top 10
      const uniqueTopics = [...new Set(topics)].slice(0, 10);

      return uniqueTopics;
    } catch (error) {
      console.error('Error fetching trending topics:', error.message);
      return [];
    }
  }

  /**
   * Get niche-based trending topics
   * @private
   */
  _getNicheBasedTopics(niche) {
    const nicheTopicsMap = {
      tech: [
        'AI and Machine Learning',
        'Web3 and Blockchain',
        'Cloud Computing',
        'Cybersecurity',
        'DevOps',
        'Artificial Intelligence',
        'Software Development',
      ],
      business: [
        'Entrepreneurship',
        'Business Growth',
        'Leadership',
        'Marketing Strategy',
        'Sales Techniques',
        'Business Analytics',
        'Corporate Culture',
      ],
      lifestyle: [
        'Wellness',
        'Fitness Trends',
        'Mental Health',
        'Self-improvement',
        'Work-life Balance',
        'Productivity',
        'Personal Development',
      ],
      marketing: [
        'Digital Marketing',
        'Social Media Marketing',
        'Content Marketing',
        'SEO',
        'Email Marketing',
        'Influencer Marketing',
        'Marketing Automation',
      ],
      general: [
        'Trending Now',
        'Viral Content',
        'Current Events',
        'Popular Culture',
        'Entertainment',
        'News',
        'Social Trends',
      ],
    };

    return nicheTopicsMap[niche.toLowerCase()] || nicheTopicsMap['general'];
  }

  /**
   * Get keyword-based trending topics
   * @private
   */
  _getKeywordBasedTopics(keywords) {
    if (!keywords || keywords.length === 0) return [];

    // In production, this would search for trending topics related to keywords
    return keywords.slice(0, 5).map((keyword) => `${keyword} trends`);
  }

  /**
   * Analyze trending topics for relevance
   * @param {Array} topics - Array of topics to analyze
   * @param {String} niche - User's niche
   * @returns {Promise<Array>} Ranked topics by relevance
   */
  async analyzeRelevance(topics, niche) {
    try {
      // Score topics based on relevance to niche
      const scoredTopics = topics.map((topic) => ({
        topic,
        relevanceScore: this._calculateRelevanceScore(topic, niche),
      }));

      // Sort by relevance score
      return scoredTopics.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } catch (error) {
      console.error('Error analyzing topic relevance:', error.message);
      return [];
    }
  }

  /**
   * Calculate relevance score for a topic
   * @private
   */
  _calculateRelevanceScore(topic, niche) {
    // Simple relevance scoring based on keyword matching
    const nicheKeywords = this._getNicheKeywords(niche);
    const topicLower = topic.toLowerCase();

    let score = 0;
    nicheKeywords.forEach((keyword) => {
      if (topicLower.includes(keyword.toLowerCase())) {
        score += 0.5;
      }
    });

    // Base score for any topic
    score += 0.3;

    return Math.min(score, 1.0);
  }

  /**
   * Get keywords for a niche
   * @private
   */
  _getNicheKeywords(niche) {
    const keywordsMap = {
      tech: ['ai', 'code', 'software', 'development', 'tech', 'programming', 'data'],
      business: ['business', 'growth', 'sales', 'marketing', 'leadership', 'strategy'],
      lifestyle: ['health', 'wellness', 'fitness', 'life', 'personal', 'mindfulness'],
      marketing: ['marketing', 'social', 'content', 'brand', 'audience', 'engagement'],
    };

    return keywordsMap[niche.toLowerCase()] || [];
  }

  /**
   * Get trending hashtags for a topic
   * @param {String} topic - Topic to find hashtags for
   * @returns {Promise<Array>} Array of relevant hashtags
   */
  async getTrendingHashtags(topic) {
    try {
      // Simulate hashtag generation
      // In production, this would call real APIs
      const baseHashtags = [
        `#${topic.replace(/\s+/g, '')}`,
        `#${topic.split(' ')[0]}`,
        '#trending',
        '#viral',
      ];

      return baseHashtags.filter((tag) => tag.length > 2);
    } catch (error) {
      console.error('Error fetching trending hashtags:', error.message);
      return [];
    }
  }
}

module.exports = new TrendingService();
