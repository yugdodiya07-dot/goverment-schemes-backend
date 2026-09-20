import mongoose from 'express';
import { connectDatabase } from '../config/database.js';
import { Admin } from '../models/Admin.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Scheme } from '../models/Scheme.js';

const categoriesData = [
  {
    name: 'Agriculture & Rural Development',
    slug: 'agriculture-rural-development',
    icon: 'Wheat',
    description: 'Direct income support, crop insurance, solar pumps, and fertilizers for farmers and rural households.',
  },
  {
    name: 'Health & Wellness',
    slug: 'health-wellness',
    icon: 'HeartPulse',
    description: 'Free healthcare covers, maternal care, subsidized medicine, and life/disability insurance.',
  },
  {
    name: 'Education & Skill Training',
    slug: 'education-skill-training',
    icon: 'GraduationCap',
    description: 'Merit scholarships, free coaching, higher education loans, and industrial skill apprenticeship.',
  },
  {
    name: 'Women & Child Development',
    slug: 'women-child-development',
    icon: 'Baby',
    description: 'Empowerment programs, girl child savings funds, maternal nutritional aid, and self-help group loans.',
  },
  {
    name: 'Business, MSME & Entrepreneurship',
    slug: 'business-msme-entrepreneurship',
    icon: 'Briefcase',
    description: 'Collateral-free micro loans, artisan credit, startup seed funds, and vendor credit lines.',
  },
  {
    name: 'Housing & Urban Development',
    slug: 'housing-urban-development',
    icon: 'Home',
    description: 'Pucca housing subsidies, affordable urban rental complexes, and clean sanitation support.',
  },
  {
    name: 'Social Welfare & Inclusion',
    slug: 'social-welfare-inclusion',
    icon: 'Users',
    description: 'Old age pensions, divyangjan aids, widow assistance, and minority scholarships.',
  },
  {
    name: 'Science, IT & Employment',
    slug: 'science-it-employment',
    icon: 'Laptop',
    description: 'Tech innovation grants, digital literacy missions, and employment guarantee programs.',
  },
];

import { schemesData } from './schemesData.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    await connectDatabase();

    // 1. Seed or update Admin
    console.log('👑 Seeding Admin account...');
    let admin = await Admin.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      admin = await Admin.create({
        name: 'Portal Super Administrator',
        email: 'admin@gmail.com',
        password: 'Admin@2026',
        phone: '9876543210',
        role: 'admin',
        status: 'Active',
        department: 'National Informatics Centre',
        designation: 'Director General (e-Governance)',
      });
      console.log('  ✅ Created Admin (admin@gmail.com / Admin@2026)');
    } else {
      admin.password = 'Admin@2026';
      admin.status = 'Active';
      await admin.save();
      console.log('  ✅ Updated Admin password to Admin@2026');
    }

    // 2. Seed or update Demo Citizen
    console.log('👤 Seeding Demo Citizen account...');
    let citizen = await User.findOne({ email: 'citizen@gmail.com' });
    if (!citizen) {
      citizen = await User.create({
        name: 'Aarav Sharma',
        email: 'citizen@gmail.com',
        password: 'Citizen@2026',
        phone: '9876501234',
        role: 'citizen',
        status: 'Active',
        age: 28,
        gender: 'Male',
        state: 'Gujarat',
        district: 'Ahmedabad',
        annualIncome: 350000,
        occupation: 'Farmer',
        category: 'OBC',
        disabilityStatus: false,
        specialStatus: ['Farmer'],
      });
      console.log('  ✅ Created Citizen (citizen@gmail.com / Citizen@2026)');
    }

    // 3. Seed Categories
    console.log('📂 Seeding Scheme Categories...');
    // Delete old legacy categories
    await Category.deleteMany({ slug: { $nin: categoriesData.map((c) => c.slug) } });

    const categoryMap = new Map<string, any>();

    for (const cat of categoriesData) {
      const existing = await Category.findOneAndUpdate(
        { slug: cat.slug },
        { ...cat, isActive: true },
        { upsert: true, new: true }
      );
      categoryMap.set(cat.slug, existing._id);
    }
    console.log(`  ✅ Synced ${categoryMap.size} active categories`);

    // 4. Seed Schemes
    console.log('📜 Seeding Schemes with 8-Factor criteria...');
    try {
      await Scheme.collection.dropIndex('code_1');
    } catch (e) {
      // index does not exist or already dropped
    }
    let seededSchemes = 0;

    for (const scheme of schemesData) {
      const categoryId = categoryMap.get(scheme.categorySlug);
      if (!categoryId) continue;

      await Scheme.findOneAndUpdate(
        { slug: scheme.slug },
        {
          title: scheme.title,
          slug: scheme.slug,
          category: categoryId,
          ministry: scheme.ministry,
          department: scheme.department,
          shortDescription: scheme.shortDescription,
          description: scheme.description,
          benefitType: scheme.benefitType,
          financialBenefit: scheme.financialBenefit,
          eligibilityCriteria: scheme.eligibilityCriteria,
          requiredDocuments: scheme.requiredDocuments,
          applicationProcess: scheme.applicationProcess,
          officialUrl: scheme.officialUrl,
          helplineNumber: scheme.helplineNumber,
          tags: scheme.tags,
          status: 'Active',
        },
        { upsert: true, new: true }
      );
      seededSchemes++;
    }

    // Update scheme counts per category
    for (const [slug, catId] of categoryMap.entries()) {
      const count = await Scheme.countDocuments({ category: catId, status: 'Active' });
      await Category.findByIdAndUpdate(catId, { schemeCount: count });
    }

    console.log(`  ✅ Successfully seeded ${seededSchemes} government schemes!`);
    console.log('🎉 Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
