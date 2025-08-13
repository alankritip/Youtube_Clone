/**
 * @file dbConnector.js
 * @description Manages MongoDB connection using Mongoose.
 * @module config/dbConnector
 */

import mongoose from 'mongoose';

/**
 * Connect to MongoDB.
 * @param {string} uri - Full MongoDB connection string
 */
export const connectDatabase = async (uri) => {
  try {
    await mongoose.connect(uri, { dbName: 'tubevista_db' });
    console.log('MongoDB connection established successfully.');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};
