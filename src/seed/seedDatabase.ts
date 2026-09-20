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

const schemesData = [
  {
    title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    slug: 'pm-kisan-samman-nidhi',
    categorySlug: 'agriculture-rural-development',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    department: 'Department of Agriculture & Farmers Welfare',
    shortDescription: 'Income support of ₹6,000 per year in three equal installments to all eligible farmer families.',
    description:
      'Pradhan Mantri Kisan Samman Nidhi is a Central Sector Scheme providing ₹6,000 annually in three equal installments directly into the Aadhaar-seeded bank accounts of all landholding farmers across India to support agricultural inputs and household expenses.',
    benefitType: 'Direct Benefit Transfer',
    financialBenefit: '₹6,000 per year (₹2,000 every 4 months directly into bank account)',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 85,
      gender: 'All',
      maxIncome: 2500000,
      eligibleStates: ['All'],
      eligibleOccupations: ['Farmer'],
      eligibleCategories: ['All'],
      requiresDisability: false,
      requiredSpecialStatus: ['Farmer'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Landholding Records (Khasra / Khatauni / 7/12 Extract)',
      'Bank Account Passbook with Aadhaar seeding',
      'Passport Size Photograph',
    ],
    applicationProcess: [
      'Navigate to the PM-KISAN online portal or visit your nearest Common Service Centre (CSC).',
      'Select "New Farmer Registration" and verify your Aadhaar number.',
      'Enter land ownership survey number and upload required documents.',
      'Submit the application and obtain your registration acknowledgment number.',
    ],
    officialUrl: 'https://pmkisan.gov.in/',
    helplineNumber: '155261 / 011-24300606',
    tags: ['Agriculture', 'Farmers', 'DBT', 'Income Support'],
  },
  {
    title: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    slug: 'ayushman-bharat-pmjay',
    categorySlug: 'health-wellness',
    ministry: 'Ministry of Health and Family Welfare',
    department: 'National Health Authority (NHA)',
    shortDescription: 'Free cashless health insurance cover up to ₹5,00,000 per family per year for secondary and tertiary hospitalization.',
    description:
      'Ayushman Bharat PM-JAY is the world’s largest government-funded health assurance scheme. It offers cashless inpatient hospitalization coverage of up to ₹5 Lakh per year for vulnerable families across over 27,000 empaneled government and private hospitals.',
    benefitType: 'Insurance',
    financialBenefit: 'Cashless medical treatment cover up to ₹5,00,000 per family annually',
    eligibilityCriteria: {
      minAge: 0,
      maxAge: 100,
      gender: 'All',
      maxIncome: 300000,
      eligibleStates: ['All'],
      eligibleOccupations: ['All'],
      eligibleCategories: ['All', 'SC', 'ST', 'OBC', 'EWS'],
      requiresDisability: false,
      requiredSpecialStatus: [],
    },
    requiredDocuments: ['Aadhaar Card', 'Ration Card / SECC Family ID', 'Income Certificate', 'Mobile Number'],
    applicationProcess: [
      'Check eligibility on the official portal via Aadhaar or Ration Card number.',
      'Visit any Ayushman Empaneled Hospital or CSC center with your KYC documents.',
      'Undergo biometric verification to generate your Ayushman Golden Card.',
    ],
    officialUrl: 'https://pmjay.gov.in/',
    helplineNumber: '14555 / 1800-111-565',
    tags: ['Health', 'Insurance', 'Hospitalization', 'Cashless'],
  },
  {
    title: 'Pradhan Mantri Mudra Yojana (PMMY)',
    slug: 'pm-mudra-yojana',
    categorySlug: 'business-msme-entrepreneurship',
    ministry: 'Ministry of Finance',
    department: 'Department of Financial Services',
    shortDescription: 'Collateral-free institutional loans up to ₹20 Lakh for non-corporate, non-farm small micro-enterprises.',
    description:
      'PMMY facilitates micro-credit to income-generating micro-enterprises under three categories: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 Lakh), and Tarun (₹5 Lakh to ₹20 Lakh) with zero collateral requirement.',
    benefitType: 'Loan / Credit',
    financialBenefit: 'Collateral-free business loan from ₹50,000 up to ₹20,00,000 at subsidized interest rates',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 65,
      gender: 'All',
      maxIncome: 100000000,
      eligibleStates: ['All'],
      eligibleOccupations: ['Self-Employed', 'Artisan', 'Street Vendor', 'Business Owner'],
      eligibleCategories: ['All'],
      requiresDisability: false,
      requiredSpecialStatus: [],
    },
    requiredDocuments: [
      'Aadhaar / Voter ID / PAN Card',
      'Proof of Business Enterprise Registration / Udyam Certificate',
      'Bank Account Statement for past 6 months',
      'Quotation of machinery/items to be purchased',
    ],
    applicationProcess: [
      'Prepare your micro-business proposal and quotation of goods.',
      'Apply online via the Udyamimitra portal or approach any scheduled commercial bank.',
      'Complete KYC verification and sanction formalities.',
    ],
    officialUrl: 'https://www.mudra.org.in/',
    helplineNumber: '1800-180-1111',
    tags: ['Business', 'MSME', 'Loans', 'Startups'],
  },
  {
    title: 'Pradhan Mantri Awas Yojana - Urban & Gramin (PMAY)',
    slug: 'pm-awas-yojana',
    categorySlug: 'housing-urban-development',
    ministry: 'Ministry of Housing and Urban Affairs',
    department: 'Housing for All Mission',
    shortDescription: 'Direct financial subsidy up to ₹2.67 Lakh for building or purchasing a permanent pucca house.',
    description:
      'PMAY aims to provide housing for all eligible urban and rural families. Beneficiaries receive credit-linked interest subsidies and direct financial transfers to construct or purchase their first pucca home.',
    benefitType: 'Subsidy',
    financialBenefit: 'Direct subsidy between ₹1,20,000 and ₹2,67,000 on housing construction / home loans',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 70,
      gender: 'All',
      maxIncome: 1800000,
      eligibleStates: ['All'],
      eligibleOccupations: ['All'],
      eligibleCategories: ['All', 'EWS', 'LIG', 'MIG', 'SC', 'ST'],
      requiresDisability: false,
      requiredSpecialStatus: [],
    },
    requiredDocuments: [
      'Aadhaar Card of all family members',
      'Income Certificate',
      'Affidavit stating no ownership of pucca house anywhere in India',
      'Land Title or Builder Agreement',
    ],
    applicationProcess: [
      'Visit the official PMAY portal and select Citizen Assessment.',
      'Enter Aadhaar number and fill out household socioeconomic details.',
      'Upload required income proofs and submit for municipal/gram panchayat geo-tagging.',
    ],
    officialUrl: 'https://pmaymis.gov.in/',
    helplineNumber: '1800-11-6163',
    tags: ['Housing', 'PMAY', 'Subsidy', 'Urban', 'Rural'],
  },
  {
    title: 'Sukanya Samriddhi Yojana (SSY)',
    slug: 'sukanya-samriddhi-yojana',
    categorySlug: 'women-child-development',
    ministry: 'Ministry of Finance / Ministry of Women & Child Development',
    department: 'Department of Posts & National Savings Institute',
    shortDescription: 'High-interest tax-free savings account for girl children offering 8.2% annual compounded return.',
    description:
      'Sukanya Samriddhi Yojana is a flagship Beti Bachao Beti Padhao initiative. Parents or legal guardians can open an account for girl children below 10 years of age with an attractive 8.2% interest rate and full triple tax exemption (EEE) under Section 80C.',
    benefitType: 'Direct Benefit Transfer',
    financialBenefit: '8.2% guaranteed annual compounded return with 100% income tax exemption',
    eligibilityCriteria: {
      minAge: 0,
      maxAge: 10,
      gender: 'Female',
      maxIncome: 100000000,
      eligibleStates: ['All'],
      eligibleOccupations: ['Student', 'Child'],
      eligibleCategories: ['All'],
      requiresDisability: false,
      requiredSpecialStatus: ['Girl Child'],
    },
    requiredDocuments: [
      'Birth Certificate of the Girl Child',
      'Identity Proof of Parent / Legal Guardian (Aadhaar/PAN)',
      'Address Proof (Electricity Bill/Ration Card)',
      'Passport size photos of child and parent',
    ],
    applicationProcess: [
      'Download form from Post Office or authorized commercial bank.',
      'Submit the initial deposit (minimum ₹250) along with birth and guardian proofs.',
      'Receive the SSY account passbook.',
    ],
    officialUrl: 'https://www.indiapost.gov.in/',
    helplineNumber: '1800-266-6868',
    tags: ['Girl Child', 'Savings', 'Tax Free', 'Education'],
  },
  {
    title: 'National Apprenticeship Promotion Scheme (NAPS)',
    slug: 'national-apprenticeship-promotion-scheme',
    categorySlug: 'education-skill-training',
    ministry: 'Ministry of Skill Development and Entrepreneurship',
    department: 'National Skill Development Corporation (NSDC)',
    shortDescription: 'Paid apprenticeship training with government stipend support up to ₹1,500 per month for youth.',
    description:
      'NAPS promotes apprenticeship training across industrial sectors by sharing 25% of the prescribed stipend (up to ₹1,500 per month per apprentice) directly to youth undertaking on-the-job industrial skilling.',
    benefitType: 'Skill Training',
    financialBenefit: 'Monthly stipend of ₹6,000 - ₹15,000 plus government subsidy of ₹1,500/month',
    eligibilityCriteria: {
      minAge: 14,
      maxAge: 35,
      gender: 'All',
      maxIncome: 100000000,
      eligibleStates: ['All'],
      eligibleOccupations: ['Student', 'Unemployed'],
      eligibleCategories: ['All'],
      requiresDisability: false,
      requiredSpecialStatus: [],
    },
    requiredDocuments: ['Aadhaar Card', 'Educational Certificate (10th/12th/ITI/Diploma/Degree)', 'Bank Account Passbook'],
    applicationProcess: [
      'Register as a Candidate on apprenticeshipindia.gov.in.',
      'Search for apprenticeship opportunities by industry sector and location.',
      'Apply online and receive contract offer from verified industrial employers.',
    ],
    officialUrl: 'https://www.apprenticeshipindia.gov.in/',
    helplineNumber: '011-25841264',
    tags: ['Skills', 'Apprenticeship', 'Youth', 'Stipend', 'Employment'],
  },
  {
    title: 'PM Vishwakarma Scheme',
    slug: 'pm-vishwakarma-scheme',
    categorySlug: 'business-msme-entrepreneurship',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    department: 'MSME Development Institute',
    shortDescription: 'End-to-end holistic support, ₹15,000 toolkit incentive, and collateral-free loans at 5% interest for traditional artisans.',
    description:
      'PM Vishwakarma provides recognition (Vishwakarma Certificate & ID), skill upgradation with ₹500/day stipend, modern toolkit incentive of ₹15,000, and credit support up to ₹3,00,000 at a concessional interest rate of 5% for 18 traditional artisan trades.',
    benefitType: 'Loan / Credit',
    financialBenefit: '₹15,000 Free Toolkit grant + ₹3,00,000 collateral-free loan at 5% interest rate',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 70,
      gender: 'All',
      maxIncome: 2500000,
      eligibleStates: ['All'],
      eligibleOccupations: ['Artisan', 'Self-Employed'],
      eligibleCategories: ['All'],
      requiresDisability: false,
      requiredSpecialStatus: ['Artisan', 'Craftsperson'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Mobile Number linked with Aadhaar',
      'Bank Account Details',
      'Ration Card / Family Declaration',
    ],
    applicationProcess: [
      'Visit nearest CSC (Common Services Centre) with Aadhaar and artisan trade proof.',
      'Complete biometric e-KYC and trade registration.',
      'Gram Panchayat / Urban Local Body verifies applicant credentials.',
    ],
    officialUrl: 'https://pmvishwakarma.gov.in/',
    helplineNumber: '1800-267-7777',
    tags: ['Artisans', 'Craftsmen', 'Toolkit', 'Loans', 'MSME'],
  },
  {
    title: 'Atal Pension Yojana (APY)',
    slug: 'atal-pension-yojana',
    categorySlug: 'social-welfare-inclusion',
    ministry: 'Ministry of Finance',
    department: 'Pension Fund Regulatory and Development Authority (PFRDA)',
    shortDescription: 'Guaranteed lifetime monthly pension of ₹1,000 to ₹5,000 from age 60 for unorganized sector workers.',
    description:
      'Atal Pension Yojana is a government-backed pension scheme targeted at workers in the unorganized sector. Subscribers receive a guaranteed minimum monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 from the age of 60 till death.',
    benefitType: 'Direct Benefit Transfer',
    financialBenefit: 'Guaranteed lifetime pension between ₹1,000 and ₹5,000 per month starting at age 60',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 40,
      gender: 'All',
      maxIncome: 100000000,
      eligibleStates: ['All'],
      eligibleOccupations: ['Farmer', 'Artisan', 'Street Vendor', 'Self-Employed', 'Unemployed', 'Employed'],
      eligibleCategories: ['All'],
      requiresDisability: false,
      requiredSpecialStatus: [],
    },
    requiredDocuments: ['Aadhaar Card', 'Savings Bank Account with Auto-Debit Facility', 'Active Mobile Number'],
    applicationProcess: [
      'Approach your bank branch or access net banking.',
      'Fill out the APY registration form specifying desired monthly pension amount and nominee details.',
      'Authorize auto-debit of monthly contribution from your savings account.',
    ],
    officialUrl: 'https://www.npscra.nsdl.co.in/',
    helplineNumber: '1800-110-069',
    tags: ['Pension', 'Retirement', 'Social Security', 'Senior Citizens'],
  },
];

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
    const categoryMap = new Map<string, any>();

    for (const cat of categoriesData) {
      const existing = await Category.findOneAndUpdate(
        { slug: cat.slug },
        { ...cat, isActive: true },
        { upsert: true, new: true }
      );
      categoryMap.set(cat.slug, existing._id);
    }
    console.log(`  ✅ Synced ${categoryMap.size} categories`);

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
