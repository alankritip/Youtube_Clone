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


/**
 * @route POST /video/:videoId
 * @description Add a comment to a video
 * @access Private
 */
router.post(
  '/video/:videoId',
  verifyJWT,
  [body('text').isLength({ min: 1 }).withMessage('Comment cannot be empty')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const comment = await Comment.create({
      video: req.params.videoId,
      user: req.user.id,
      text: req.body.text
    });

    const populated = await comment.populate('user', 'username avatar');
    res.status(201).json(populated);
  }
);


/**
 * @route PATCH /:id
 * @description Edit a comment (only by the comment's owner)
 * @access Private
 */
router.patch('/:id', verifyJWT, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  if (String(comment.user) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  if (req.body.text) comment.text = req.body.text;
  await comment.save();

  res.json(comment);
});
