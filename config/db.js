const mongoose = require('mongoose');

/**
 * Connect to MongoDB with retries and helpful diagnostics.
 * Avoids crashing the server on first failure (useful while fixing Atlas IP whitelist).
 */
const connectDB = async (maxRetries = 10, delayMs = 5000) => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set. Please add it to your .env file.');
    return;
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      const hint =
        error?.message?.includes('IP') || error?.message?.includes('whitelist')
          ? 'Hint: Add your IP (or 0.0.0.0/0 for dev) in Atlas Network Access, and ensure your connection string has correct username/password.'
          : '';
      console.error(
        `MongoDB connection attempt ${attempt}/${maxRetries} failed: ${error.message}\n${hint}`
      );
      if (attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        console.error('Max retries reached. Server will keep running, but DB operations will fail until connectivity is restored.');
      }
    }
  }
};

module.exports = connectDB;
