const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('server selection') || error.message.includes('connect') || error.message.includes('IP')) {
      console.log('💡 TIP: This usually means your IP is not whitelisted in MongoDB Atlas.');
      console.log('   1. Go to https://cloud.mongodb.com/');
      console.log('   2. Navigate to Network Access.');
      console.log('   3. Add your current IP or "0.0.0.0/0" for temporary testing.');
    }
    console.log('Server will continue to run, but database operations will fail.');
  }
};

module.exports = connectDB;
