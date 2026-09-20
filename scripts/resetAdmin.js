require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const resetAdminAccount = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/govsmart_portal';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    let admin = await Admin.findOne({ email: 'portaladmin@gmail.com' });

    if (!admin) {
      console.log('Admin user not found. Creating new admin user portaladmin@gmail.com...');
      admin = await Admin.create({
        name: 'Government Portal Administrator',
        email: 'portaladmin@gmail.com',
        password: 'Admin@2026',
        role: 'admin',
        phone: '9876543210',
        department: 'National Informatics Centre',
        designation: 'Portal Super Administrator',
        status: 'Active',
      });
      console.log('✅ Admin user created with password Admin@2026');
    } else {
      console.log('Updating existing admin user password to Admin@2026...');
      admin.email = 'portaladmin@gmail.com';
      admin.password = 'Admin@2026';
      admin.status = 'Active';
      await admin.save();
      console.log('✅ Admin account password updated & reset successfully to Admin@2026');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting admin account:', error.message);
    process.exit(1);
  }
};

resetAdminAccount();
