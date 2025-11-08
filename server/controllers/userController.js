const User = require('../models/User');
const jwt = require('jsonwebtoken');
const aiService = require('../services/aiService');

/**
 * User Controller
 * Handles authentication and user profile management
 */

class UserController {
  /**
   * Register new user
   */
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Validation
      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password, and name are required' });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Create user
      const user = new User({
        email,
        password,
        name,
        isOnboarded: false,
        profileCompleteness: 0,
      });

      await user.save();

      // Generate token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      return res.status(201).json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
        message: 'User registered successfully',
      });
    } catch (error) {
      console.error('Registration error:', error.message);
      return res.status(500).json({ message: 'Registration failed', error: error.message });
    }
  }

  /**
   * Login user
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      return res.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          niche: user.niche,
          isOnboarded: user.isOnboarded,
        },
        token,
        message: 'Login successful',
      });
    } catch (error) {
      console.error('Login error:', error.message);
      return res.status(500).json({ message: 'Login failed', error: error.message });
    }
  }

  /**
   * Get user profile
   */
  async getProfile(req, res) {
    try {
      const userId = req.userId;
      const user = await User.findById(userId).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({ success: true, user });
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      return res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req, res) {
    try {
      const userId = req.userId;
      const { name, niche, targetAudience, postingStyle, preferences } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update fields
      if (name) user.name = name;
      if (niche) user.niche = niche;
      if (targetAudience) user.targetAudience = targetAudience;
      if (postingStyle) user.postingStyle = postingStyle;
      if (preferences) user.preferences = { ...user.preferences, ...preferences };

      // Calculate profile completeness
      user.profileCompleteness = this._calculateProfileCompleteness(user);

      await user.save();

      return res.json({
        success: true,
        user,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error.message);
      return res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
  }

  /**
   * Complete user onboarding
   */
  async completeOnboarding(req, res) {
    try {
      const userId = req.userId;
      const { niche, targetAudience, postingStyle, niches } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user data
      user.niche = niche;
      user.targetAudience = targetAudience;
      user.postingStyle = postingStyle;
      if (niches) user.niches = niches;
      user.isOnboarded = true;
      user.profileCompleteness = 100;

      await user.save();

      return res.json({
        success: true,
        user,
        message: 'Onboarding completed successfully',
      });
    } catch (error) {
      console.error('Error completing onboarding:', error.message);
      return res.status(500).json({ message: 'Failed to complete onboarding', error: error.message });
    }
  }

  /**
   * Connect social media account
   */
  async connectSocialMedia(req, res) {
    try {
      const userId = req.userId;
      const { platform, pageId, accessToken, profileId } = req.body;

      if (!platform || !accessToken) {
        return res.status(400).json({ message: 'Platform and access token are required' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (platform === 'facebook') {
        user.socialMediaAccounts.facebook = {
          pageId,
          accessToken,
          connected: true,
        };
      } else if (platform === 'linkedin') {
        user.socialMediaAccounts.linkedin = {
          profileId,
          accessToken,
          connected: true,
        };
      } else {
        return res.status(400).json({ message: 'Invalid platform' });
      }

      await user.save();

      return res.json({
        success: true,
        user,
        message: `${platform} account connected successfully`,
      });
    } catch (error) {
      console.error('Error connecting social media:', error.message);
      return res.status(500).json({ message: 'Failed to connect social media', error: error.message });
    }
  }

  /**
   * Get profiling questions
   */
  async getProfilingQuestions(req, res) {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const questions = await aiService.generateProfilingQuestions({
        niche: user.niche,
        targetAudience: user.targetAudience,
      });

      return res.json({
        success: true,
        questions,
      });
    } catch (error) {
      console.error('Error getting profiling questions:', error.message);
      return res.status(500).json({ message: 'Failed to get questions', error: error.message });
    }
  }

  /**
   * Update user preferences based on profiling answers
   */
  async updateProfilingAnswers(req, res) {
    try {
      const userId = req.userId;
      const { answers, niches } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (niches) {
        user.niches = niches;
      }

      user.profileCompleteness = this._calculateProfileCompleteness(user);

      await user.save();

      return res.json({
        success: true,
        user,
        message: 'Profiling answers saved successfully',
      });
    } catch (error) {
      console.error('Error updating profiling answers:', error.message);
      return res.status(500).json({ message: 'Failed to save answers', error: error.message });
    }
  }

  /**
   * Calculate profile completeness percentage
   * @private
   */
  _calculateProfileCompleteness(user) {
    let completeness = 0;
    const maxPoints = 6;

    if (user.name) completeness++;
    if (user.niche) completeness++;
    if (user.targetAudience) completeness++;
    if (user.postingStyle) completeness++;
    if (user.socialMediaAccounts.facebook.connected) completeness++;
    if (user.socialMediaAccounts.linkedin.connected) completeness++;

    return Math.round((completeness / maxPoints) * 100);
  }
}

module.exports = new UserController();
