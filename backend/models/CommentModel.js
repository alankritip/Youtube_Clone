import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:  { type: String, required: true, trim: true }
}, { timestamps: true });

export default mongoose.model('Comment', CommentSchema);
