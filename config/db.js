const mongoose = require('mongoose');
const { seedDatabase } = require('../seed/schemeSeedData');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/govsmart_portal');

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Automatically initialize database seed (admin account and 12 government schemes)
    await seedDatabase();
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
