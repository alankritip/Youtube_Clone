import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true, index: 'text' },
  description:  { type: String, default: '' },
  videoUrl:     { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  channel:      { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  uploader:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views:        { type: Number, default: 0 },
  likes:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  category:     { type: String, default: 'All' },
  uploadDate:   { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Video', VideoSchema);
