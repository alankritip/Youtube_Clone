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
