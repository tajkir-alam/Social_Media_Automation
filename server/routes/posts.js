const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const postController = require('../controllers/postController');

/**
 * Post Routes
 * All routes require authentication
 */

// Generate new post
router.post('/', authMiddleware, postController.generatePost.bind(postController));

// Get user's posts
router.get('/', authMiddleware, postController.getUserPosts.bind(postController));

// Get single post
router.get('/:postId', authMiddleware, postController.getPost.bind(postController));

// Update post draft
router.put('/:postId', authMiddleware, postController.updatePost.bind(postController));

// Approve and post to social media
router.post('/:postId/approve', authMiddleware, postController.approveAndPost.bind(postController));

// Delete post
router.delete('/:postId', authMiddleware, postController.deletePost.bind(postController));

// Get analytics
router.get('/analytics/all', authMiddleware, postController.getPostAnalytics.bind(postController));

module.exports = router;
