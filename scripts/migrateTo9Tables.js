require('dotenv').config();
const mongoose = require('mongoose');

const Admin = require('../models/Admin');
const User = require('../models/User');
const Category = require('../models/Category');
const Scheme = require('../models/Scheme');
const EligibilityRule = require('../models/EligibilityRule');
const SavedScheme = require('../models/SavedScheme');
const EligibilityHistory = require('../models/EligibilityHistory');
const ContactMessage = require('../models/ContactMessage');
const Notification = require('../models/Notification');
const Application = require('../models/Application');

const { realGovernmentSchemes } = require('../seed/schemeSeedData');

const migrateTo9Tables = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/govsmart_portal';
    console.log(`🚀 Connecting to MongoDB database at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    const db = mongoose.connection.db;

    // 1. Seed/Update 'admins' collection
    console.log('\n1️⃣ Syncing `admins` collection...');
    let admin = await Admin.findOne({ email: 'portaladmin@gmail.com' });
    if (!admin) {
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
      console.log('  ✅ Created Admin account (portaladmin@gmail.com / Admin@2026)');
    } else {
      admin.password = 'Admin@2026';
      await admin.save();
      console.log('  ✅ Updated Admin account password (portaladmin@gmail.com / Admin@2026)');
    }

    // 2. Seed 'categories' collection
    console.log('\n2️⃣ Syncing `categories` collection...');
    const categoryData = [
      { name: 'Agriculture & Rural', slug: 'agriculture-rural', icon: 'bi-flower1', description: 'Agricultural loans, crop insurance, and rural livelihood support schemes.' },
      { name: 'Education & Scholarships', slug: 'education-scholarships', icon: 'bi-book-fill', description: 'Financial support, stipends, and scholarships for students.' },
      { name: 'Healthcare & Insurance', slug: 'healthcare-insurance', icon: 'bi-heart-pulse-fill', description: 'Free medical treatment, health cover, and life insurance schemes.' },
      { name: 'Housing & Shelter', slug: 'housing-shelter', icon: 'bi-house-heart-fill', description: 'Affordable housing subsidies for urban and rural families.' },
      { name: 'Entrepreneurship & MSME', slug: 'entrepreneurship-msme', icon: 'bi-briefcase-fill', description: 'Collateral-free loans, subsidies, and business support for entrepreneurs.' },
      { name: 'Women & Child Empowerment', slug: 'women-child-empowerment', icon: 'bi-person-arms-up', description: 'Dedicated welfare and financial security schemes for women and children.' },
      { name: 'Financial Inclusion', slug: 'financial-inclusion', icon: 'bi-wallet2', description: 'Zero-balance banking, direct benefit transfers, and pension plans.' },
      { name: 'Skill Development', slug: 'skill-development', icon: 'bi-tools', description: 'Vocational training, certifications, and job placement assistance.' },
    ];

    const categoryMap = {};
    for (const cat of categoryData) {
      let createdCat = await Category.findOne({ slug: cat.slug });
      if (!createdCat) {
        createdCat = await Category.create(cat);
      }
      categoryMap[cat.name] = createdCat._id;
    }
    console.log(`  ✅ Synced ${Object.keys(categoryMap).length} categories in \`categories\` collection.`);

    // 3. Seed/Sync 'schemes' & 'eligibility_rules' collections
    console.log('\n3️⃣ & 4️⃣ Syncing `schemes` and `eligibility_rules` collections...');
    for (const schemeItem of realGovernmentSchemes) {
      let existingScheme = await Scheme.findOne({ code: schemeItem.code });
      const catId = categoryMap[schemeItem.category];

      const schemePayload = {
        title: schemeItem.title,
        code: schemeItem.code,
        ministry: schemeItem.ministry,
        department: schemeItem.department,
        category: schemeItem.category,
        categoryRef: catId,
        shortDescription: schemeItem.shortDescription,
        fullDescription: schemeItem.fullDescription,
        benefitType: schemeItem.benefitType,
        benefitAmount: schemeItem.benefitAmount,
        eligibilityCriteria: schemeItem.eligibilityCriteria,
        requiredDocuments: schemeItem.requiredDocuments,
        officialWebsiteUrl: schemeItem.officialWebsiteUrl,
        deadline: schemeItem.deadline,
        isActive: true,
      };

      if (!existingScheme) {
        existingScheme = await Scheme.create(schemePayload);
      } else {
        Object.assign(existingScheme, schemePayload);
        await existingScheme.save();
      }

      // Create / Update corresponding EligibilityRule document
      let rule = await EligibilityRule.findOne({ scheme: existingScheme._id });
      const rulePayload = {
        scheme: existingScheme._id,
        minAge: schemeItem.eligibilityCriteria.minAge || 0,
        maxAge: schemeItem.eligibilityCriteria.maxAge || 100,
        gender: schemeItem.eligibilityCriteria.gender || 'All',
        maxIncome: schemeItem.eligibilityCriteria.maxIncome || 100000000,
        eligibleOccupations: schemeItem.eligibilityCriteria.eligibleOccupations || ['All'],
        eligibleStates: schemeItem.eligibilityCriteria.eligibleStates || ['All'],
        eligibleCategories: schemeItem.eligibilityCriteria.eligibleCategories || ['All'],
        requiresDisability: Boolean(schemeItem.eligibilityCriteria.requiresDisability),
        requiredSpecialStatus: schemeItem.eligibilityCriteria.requiredSpecialStatus || [],
      };

      if (!rule) {
        rule = await EligibilityRule.create(rulePayload);
      } else {
        Object.assign(rule, rulePayload);
        await rule.save();
      }

      existingScheme.eligibilityRuleRef = rule._id;
      await existingScheme.save();
    }

    const schemeCount = await Scheme.countDocuments();
    const ruleCount = await EligibilityRule.countDocuments();
    console.log(`  ✅ Synced ${schemeCount} schemes and ${ruleCount} eligibility rules.`);

    // 5. Sync 'users' collection (Citizens)
    console.log('\n5️⃣ Syncing `users` collection...');
    const sampleCitizens = [
      {
        name: 'Ramesh Kumar',
        email: 'ramesh.kumar@gmail.com',
        password: 'Password@123',
        phone: '9876543211',
        age: 42,
        gender: 'Male',
        state: 'Uttar Pradesh',
        district: 'Varanasi',
        address: 'Village Ramnagar, Varanasi, UP',
        annualIncome: 180000,
        occupation: 'Farmer',
        category: 'OBC',
        disabilityStatus: false,
        specialStatus: ['Farmer'],
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@gmail.com',
        password: 'Password@123',
        phone: '9876543212',
        age: 21,
        gender: 'Female',
        state: 'Rajasthan',
        district: 'Jaipur',
        address: 'Malviya Nagar, Jaipur, Rajasthan',
        annualIncome: 120000,
        occupation: 'Student',
        category: 'General',
        disabilityStatus: false,
        specialStatus: ['Single Girl Child', 'Student'],
      },
      {
        name: 'Amit Patel',
        email: 'amit.patel@gmail.com',
        password: 'Password@123',
        phone: '9876543213',
        age: 34,
        gender: 'Male',
        state: 'Gujarat',
        district: 'Ahmedabad',
        address: 'Gota, Ahmedabad, Gujarat',
        annualIncome: 350000,
        occupation: 'Self-Employed',
        category: 'General',
        disabilityStatus: false,
        specialStatus: [],
      },
    ];

    for (const citizen of sampleCitizens) {
      let existingUser = await User.findOne({ email: citizen.email });
      if (!existingUser) {
        await User.create(citizen);
      }
    }
    const citizenCount = await User.countDocuments({ role: 'citizen' });
    console.log(`  ✅ Synced ${citizenCount} citizen users in \`users\` collection.`);

    // 6. Sync 'saved_schemes' collection
    console.log('\n6️⃣ Syncing `saved_schemes` collection...');
    const ramesh = await User.findOne({ email: 'ramesh.kumar@gmail.com' });
    const pmKisan = await Scheme.findOne({ code: 'PM-KISAN' });
    const pmJay = await Scheme.findOne({ code: 'PM-JAY' });

    if (ramesh && pmKisan) {
      await SavedScheme.findOneAndUpdate(
        { user: ramesh._id, scheme: pmKisan._id },
        { user: ramesh._id, scheme: pmKisan._id },
        { upsert: true }
      );
    }
    if (ramesh && pmJay) {
      await SavedScheme.findOneAndUpdate(
        { user: ramesh._id, scheme: pmJay._id },
        { user: ramesh._id, scheme: pmJay._id },
        { upsert: true }
      );
    }
    const savedCount = await SavedScheme.countDocuments();
    console.log(`  ✅ Synced ${savedCount} bookmarks in \`saved_schemes\` collection.`);

    // 7. Sync 'eligibility_history' collection
    console.log('\n7️⃣ Syncing `eligibility_history` collection...');
    if (ramesh && pmKisan) {
      const historyExists = await EligibilityHistory.findOne({ user: ramesh._id });
      if (!historyExists) {
        await EligibilityHistory.create({
          user: ramesh._id,
          inputCriteria: {
            age: ramesh.age,
            gender: ramesh.gender,
            annualIncome: ramesh.annualIncome,
            occupation: ramesh.occupation,
            category: ramesh.category,
            state: ramesh.state,
            district: ramesh.district,
            disabilityStatus: ramesh.disabilityStatus,
            specialStatus: ramesh.specialStatus,
          },
          matchedSchemesCount: 2,
          matchedSchemeIds: [pmKisan._id, pmJay._id],
        });
      }
    }
    const historyCount = await EligibilityHistory.countDocuments();
    console.log(`  ✅ Synced ${historyCount} audit logs in \`eligibility_history\` collection.`);

    // 8. Sync 'contact_messages' collection
    console.log('\n8️⃣ Syncing `contact_messages` collection...');
    const msgCount = await ContactMessage.countDocuments();
    console.log(`  ✅ Synced ${msgCount} contact messages in \`contact_messages\` collection.`);

    // 9. Sync 'notifications' collection
    console.log('\n9️⃣ Syncing `notifications` collection...');
    if (ramesh) {
      const notifExists = await Notification.findOne({ recipient: ramesh._id });
      if (!notifExists) {
        await Notification.create({
          recipient: ramesh._id,
          title: 'Welcome to GovSmart Portal',
          message: 'Your citizen profile has been verified successfully.',
          type: 'System',
          link: '/dashboard',
        });
      }
    }
    const notifCount = await Notification.countDocuments();
    console.log(`  ✅ Synced ${notifCount} notifications in \`notifications\` collection.`);

    // Final database inspection
    console.log('\n========================================');
    console.log('🎉 ALL 9 DATABASE COLLECTIONS AUDITED & SYNCED');
    console.log('========================================');

    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      const cnt = await db.collection(col.name).countDocuments();
      console.log(`  🔹 Collection: ${col.name.padEnd(20)} | Documents: ${cnt}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Error:', err);
    process.exit(1);
  }
};

migrateTo9Tables();
