const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('ℹ️  MongoDB already connected.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // ── Connection event listeners ──────────────────────
    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      console.log('✅ MongoDB reconnected.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      isConnected = false;
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);

    if (
      error.message.includes('server selection') ||
      error.message.includes('connect') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('IP')
    ) {
      console.log('\n💡 TIP: Your IP may not be whitelisted in MongoDB Atlas.');
      console.log('   1. Go to https://cloud.mongodb.com/');
      console.log('   2. Network Access → Add IP Address');
      console.log('   3. Use "0.0.0.0/0" for development (unrestricted)\n');
    }

    console.log('⚠️  Server starting without DB. Database operations will fail until connection is restored.');
  }
};

/**
 * Gracefully closes the MongoDB connection.
 * Called on SIGTERM / SIGINT to allow in-flight queries to finish.
 */
const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    console.log('🔌 MongoDB connection closed gracefully.');
  }
};

module.exports = { connectDB, disconnectDB };
