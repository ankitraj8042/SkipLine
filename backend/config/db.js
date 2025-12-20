const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password')) {
      console.error('\n❌ MongoDB URI is not properly configured!');
      console.error('Please update your .env file with a valid MongoDB Atlas connection string.\n');
      console.error('Steps to get your connection string:');
      console.error('1. Go to https://cloud.mongodb.com');
      console.error('2. Click "Connect" on your cluster');
      console.error('3. Choose "Connect your application"');
      console.error('4. Copy the connection string');
      console.error('5. Replace <password> with your actual database password');
      console.error('6. Update MONGODB_URI in your .env file\n');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}\n`);
    console.error('Common issues:');
    console.error('• Check if your password is correct in the connection string');
    console.error('• Verify your IP address is whitelisted in MongoDB Atlas');
    console.error('• Make sure you replaced <password> with your actual password');
    console.error('• Check your internet connection\n');
    process.exit(1);
  }
};

module.exports = connectDB;
