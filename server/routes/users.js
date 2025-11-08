const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const userController = require('../controllers/userController');

/**
 * User Routes
 */

// Public routes
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));

// Protected routes
router.get('/profile', authMiddleware, userController.getProfile.bind(userController));
router.put('/profile', authMiddleware, userController.updateProfile.bind(userController));
router.post('/onboarding/complete', authMiddleware, userController.completeOnboarding.bind(userController));
router.post('/social-media/connect', authMiddleware, userController.connectSocialMedia.bind(userController));
router.get('/profiling/questions', authMiddleware, userController.getProfilingQuestions.bind(userController));
router.post('/profiling/answers', authMiddleware, userController.updateProfilingAnswers.bind(userController));

module.exports = router;
