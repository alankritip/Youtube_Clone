// Express routes for managing comments on videos.
 

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import Comment from '../models/CommentModel.js';

const router = Router();

/**
 * @route GET /video/:videoId
 * @description Get all comments for a specific video (newest first)
 */
router.get('/video/:videoId', async (req, res) => {
  const comments = await Comment.find({ video: req.params.videoId })
    .populate('user', 'username avatar')
    .sort({ createdAt: -1 });

  res.json(comments);
});