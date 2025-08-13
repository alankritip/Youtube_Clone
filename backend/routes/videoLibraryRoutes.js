/** Express routes for managing the video library.
 * Includes CRUD operations, search/filter, like/dislike, and view tracking.
 */

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import Video from '../models/VideoModel.js';

const router = Router();



/**
 * @route GET /
 * @description Retrieve paginated videos with optional search and filtering by category
 * @query {string} q - text search term (search by title)
 * @query {string} category - filter category ('All' for no filter)
 * @query {number} page - page number for pagination (default 1)
 * @query {number} limit - number of videos per page (default 12)
 */
router.get('/', async (req, res) => {
  const { q, category, page = 1, limit = 12 } = req.query;

  const filter = {};
  if (q) filter.$text = { $search: q };               // Mongo text search on title
  if (category && category !== 'All') filter.category = category;

  const videos = await Video.find(filter)
    .populate('channel', 'channelName')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Video.countDocuments(filter);
  res.json({ videos, total });
});


/**
 * @route POST /
 * @description Create a new video entry (metadata only, actual files are hosted externally)
 * @access Private
 */
router.post(
  '/',
  verifyJWT,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('videoUrl').isURL().withMessage('Valid videoUrl required'),
    body('thumbnailUrl').isURL().withMessage('Valid thumbnailUrl required'),
    body('channel').notEmpty().withMessage('Channel ID required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const video = await Video.create({
      ...req.body,
      uploader: req.user.id
    });

    res.status(201).json(video);
  }
);


/**
 * @route GET /:id
 * @description Get a single video by ID
 */
router.get('/:id', async (req, res) => {
  const video = await Video.findById(req.params.id)
    .populate('channel', 'channelName')
    .populate('uploader', 'username avatar');
  if (!video) return res.status(404).json({ message: 'Video not found' });
  res.json(video);
});



/**
 * @route PATCH /:id
 * @description Update video details (only allowed for uploader)
 * @access Private
 */
router.patch('/:id', verifyJWT, async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });
  if (String(video.uploader) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  // Allow updating only specific fields
  const fields = ['title', 'description', 'thumbnailUrl', 'category'];
  fields.forEach(f => (req.body[f] !== undefined ? (video[f] = req.body[f]) : null));

  await video.save();
  res.json(video);
});


/**
 * @route DELETE /:id
 * @description Delete a video (only allowed for uploader)
 * @access Private
 */
router.delete('/:id', verifyJWT, async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });
  if (String(video.uploader) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  await video.deleteOne();
  res.json({ message: 'Video deleted successfully' });
});


/**
 * @route POST /:id/view
 * @description Increment video view count
 */
router.post('/:id/view', async (req, res) => {
  const video = await Video.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!video) return res.status(404).json({ message: 'Video not found' });
  res.json({ views: video.views });
});


/**
 * @route POST /:id/like
 * @description Toggle like for the video (removes dislike if exists)
 * @access Private
 */
router.post('/:id/like', verifyJWT, async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });

  const uid = req.user.id;
  const liked = video.likes.some((u) => String(u) === uid);

  if (liked) {
    video.likes.pull(uid);
  } else {
    video.likes.addToSet(uid);
    video.dislikes.pull(uid);
  }

  await video.save();
  res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
});



/**
 * @route POST /:id/dislike
 * @description Toggle dislike for the video (removes like if exists)
 * @access Private
 */
router.post('/:id/dislike', verifyJWT, async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });

  const uid = req.user.id;
  const disliked = video.dislikes.some((u) => String(u) === uid);

  if (disliked) {
    video.dislikes.pull(uid);
  } else {
    video.dislikes.addToSet(uid);
    video.likes.pull(uid);
  }

  await video.save();
  res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
});

export default router;