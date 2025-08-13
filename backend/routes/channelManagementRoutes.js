//  Routes for creating and viewing channels.
 

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import Channel from '../models/ChannelModel.js';
import User from '../models/UserModel.js';
import Video from '../models/VideoModel.js';

const router = Router();

/** Create a new channel (requires Auth) */
router.post(
  '/',
  verifyJWT,
  [body('channelName').isLength({ min: 2 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { channelName, description, channelBanner } = req.body;
    const channel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: req.user.id
    });

    await User.findByIdAndUpdate(req.user.id, { $addToSet: { channels: channel._id } });
    res.status(201).json(channel);
  }
);

/** Get a channel’s details & videos */
router.get('/:id', async (req, res) => {
  const channel = await Channel.findById(req.params.id).populate('owner', 'username avatar');
  if (!channel) return res.status(404).json({ message: 'Channel not found' });

  const videos = await Video.find({ channel: channel._id }).sort({ createdAt: -1 });
  res.json({ channel, videos });
});

export default router;
