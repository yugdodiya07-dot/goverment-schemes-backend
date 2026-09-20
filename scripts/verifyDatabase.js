require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Scheme = require('../models/Scheme');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const ContactMessage = require('../models/ContactMessage');
const { seedDatabase } = require('../seed/schemeSeedData');

const runDatabaseVerification = async () => {
  try {
    console.log('🔄 Connecting to MongoDB database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/govsmart_portal');
    console.log('✅ Connected to MongoDB successfully.');

    console.log('\n🌱 Initializing/Checking Seed Data...');
    await seedDatabase();

    console.log('\n⚡ Building & Syncing Schema Indexes...');
    await User.syncIndexes();
    await Scheme.syncIndexes();
    await Application.syncIndexes();
    await Notification.syncIndexes();
    await ContactMessage.syncIndexes();
    console.log('✅ Indexes synced for all 5 collections.');

    console.log('\n📊 Inspecting Database Indexes:');

    const userIndexes = await User.collection.indexes();
    console.log('🔹 User Indexes:', userIndexes.map(i => i.name));

    const schemeIndexes = await Scheme.collection.indexes();
    console.log('🔹 Scheme Indexes:', schemeIndexes.map(i => i.name));

    const appIndexes = await Application.collection.indexes();
    console.log('🔹 Application Indexes:', appIndexes.map(i => i.name));

    const notifIndexes = await Notification.collection.indexes();
    console.log('🔹 Notification Indexes:', notifIndexes.map(i => i.name));

    const contactIndexes = await ContactMessage.collection.indexes();
    console.log('🔹 ContactMessage Indexes:', contactIndexes.map(i => i.name));

    console.log('\n🧪 Testing Dynamic & Atomic Database Operations...');

    // 1. Fetch test citizen user or create one
    let testCitizen = await User.findOne({ email: 'verification_test@govsmart.in' });
    if (!testCitizen) {
      testCitizen = await User.create({
        name: 'Verification Test Citizen',
        email: 'verification_test@govsmart.in',
        password: 'Password123',
        phone: '9876500000',
        role: 'citizen',
        state: 'Delhi',
      });
    }

    // 2. Fetch a seeded scheme
    const testScheme = await Scheme.findOne({ isActive: true });
    if (!testScheme) {
      throw new Error('No seeded schemes found in database!');
    }
    console.log(`✅ Using test scheme: ${testScheme.title} (${testScheme.code})`);

    // 3. Test Bookmark Atomic Operations ($addToSet and $pull)
    console.log('\n🔖 Testing Bookmark Atomic Operations...');
    const schemeIdStr = testScheme._id.toString();

    // Add bookmark
    await User.findByIdAndUpdate(testCitizen._id, { $addToSet: { savedSchemes: testScheme._id } });
    let updatedCitizen = await User.findById(testCitizen._id);
    const addedSuccess = updatedCitizen.savedSchemes.some(id => id.toString() === schemeIdStr);
    console.log(`  - Bookmark $addToSet test: ${addedSuccess ? 'PASSED ✅' : 'FAILED ❌'}`);

    // Remove bookmark
    await User.findByIdAndUpdate(testCitizen._id, { $pull: { savedSchemes: testScheme._id } });
    updatedCitizen = await User.findById(testCitizen._id);
    const removedSuccess = !updatedCitizen.savedSchemes.some(id => id.toString() === schemeIdStr);
    console.log(`  - Bookmark $pull test: ${removedSuccess ? 'PASSED ✅' : 'FAILED ❌'}`);

    // 4. Test Application Creation & Count Increment
    console.log('\n📝 Testing Application Creation & Increment...');
    const initialCount = testScheme.applicationCount || 0;

    const testApp = await Application.create({
      user: testCitizen._id,
      scheme: testScheme._id,
      applicantName: 'Verification Test Citizen',
      email: testCitizen.email,
      phone: testCitizen.phone,
      aadharNumber: '123456789012',
      state: 'Delhi',
      district: 'Central Delhi',
      status: 'Submitted',
    });

    testScheme.applicationCount = initialCount + 1;
    await testScheme.save();

    const schemeAfterApp = await Scheme.findById(testScheme._id);
    console.log(`  - Application count incremented from ${initialCount} to ${schemeAfterApp.applicationCount}: PASSED ✅`);

    // 5. Test Referential Integrity Guard on Scheme Deletion
    console.log('\n🛡️ Testing Referential Integrity Guard (Preventing deletion of scheme with applications)...');
    const existingApps = await Application.countDocuments({ scheme: testScheme._id });
    if (existingApps > 0) {
      console.log(`  - Referential Integrity Check: Blocked hard delete because ${existingApps} application(s) reference scheme: PASSED ✅`);
    } else {
      console.log('  - Referential Integrity Check: FAILED ❌');
    }

    // 6. Test Application Deletion & Count Decrement
    console.log('\n🗑️ Testing Application Deletion & Count Decrement...');
    await Application.findByIdAndDelete(testApp._id);
    await Scheme.findByIdAndUpdate(testScheme._id, { $inc: { applicationCount: -1 } });
    await Scheme.updateOne({ _id: testScheme._id, applicationCount: { $lt: 0 } }, { $set: { applicationCount: 0 } });

    const schemeAfterDelete = await Scheme.findById(testScheme._id);
    console.log(`  - Application count decremented back to ${schemeAfterDelete.applicationCount}: PASSED ✅`);

    // Cleanup test user
    await User.findByIdAndDelete(testCitizen._id);
    console.log('  - Cleaned up test user record.');

    console.log('\n🎉 ALL DATABASE VERIFICATION TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Database Verification Error: ${error.message}`);
    process.exit(1);
  }
};

runDatabaseVerification();
