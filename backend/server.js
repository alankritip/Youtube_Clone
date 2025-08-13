import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/dbConnector.js';

dotenv.config();
const app = express();


// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());


// Start Server
const PORT = process.env.PORT || 5000;
connectDatabase(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
});