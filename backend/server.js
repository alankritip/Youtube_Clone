import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/dbConnector.js';
import { notFound, errorHandler } from './middlewares/errorHandlers.js';

// Route imports
import authRoutes from './routes/userAuthRoutes.js';
import channelRoutes from './routes/channelManagementRoutes.js';
import videoRoutes from './routes/videoLibraryRoutes.js';
import commentRoutes from './routes/videoCommentsRoutes.js';

dotenv.config();
const app = express();

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
connectDatabase(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
});
