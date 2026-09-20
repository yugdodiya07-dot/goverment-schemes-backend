const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Scheme = require('../models/Scheme');
const Application = require('../models/Application');

const realGovernmentSchemes = [
  {
    title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    code: 'PM-KISAN',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    department: 'Department of Agriculture & Farmers Welfare',
    category: 'Agriculture & Rural',
    shortDescription: 'Income support of ₹6,000 per year in three equal installments to all landholding farmer families.',
    fullDescription: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme with 100% funding from the Government of India. The scheme aims to supplement the financial needs of all landholding farmers families across the country to procure various inputs to ensure proper crop health and appropriate yields, commensurate with the anticipated farm income as well as for domestic needs. Under the scheme an income support of ₹6,000 per year in three equal installments is provided to all land-holding farmer families.',
    benefitType: 'Financial Assistance',
    benefitAmount: '₹6,000 / Year (in 3 equal installments of ₹2,000)',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 85,
      gender: 'All',
      maxIncome: 2500000,
      eligibleOccupations: ['Farmer'],
      eligibleStates: ['All'],
      eligibleCategories: ['All', 'SC', 'ST', 'OBC', 'General', 'EWS'],
      requiresDisability: false,
      requiredSpecialStatus: ['Farmer'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Landholding Ownership Papers (Khasra/Khatauni)',
      'Bank Account Passbook (Aadhaar Seeded)',
      'Passport Size Photo',
    ],
    officialWebsiteUrl: 'https://pmkisan.gov.in/',
    deadline: 'Open All Year / Continuous',
    isActive: true,
  },
  {
    title: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    code: 'PM-JAY',
    ministry: 'Ministry of Health and Family Welfare',
    department: 'National Health Authority (NHA)',
    category: 'Healthcare & Insurance',
    shortDescription: 'World’s largest government funded health insurance scheme offering ₹5 Lakh per family per year for secondary and tertiary care hospitalization.',
    fullDescription: 'Ayushman Bharat PM-JAY is the largest health assurance scheme in the world which aims at providing a health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families (approximately 55 crore beneficiaries) that form the bottom 40% of the Indian population as per Socio-Economic Caste Census (SECC) data. It covers medical examination, treatment, consultation, hospital accommodation, surgical intervention, and ICU services.',
    benefitType: 'Insurance Cover',
    benefitAmount: 'Up to ₹5,000,000 Health Cover per family per year',
    eligibilityCriteria: {
      minAge: 0,
      maxAge: 100,
      gender: 'All',
      maxIncome: 300000,
      eligibleOccupations: ['Farmer', 'Artisan', 'Street Vendor', 'Unemployed', 'Self-Employed', 'Employed'],
      eligibleStates: ['All'],
      eligibleCategories: ['All', 'SC', 'ST', 'OBC', 'EWS'],
      requiresDisability: false,
      requiredSpecialStatus: [],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card / SECC Beneficiary Proof',
      'Income Certificate',
      'Caste Certificate (if applicable)',
    ],
    officialWebsiteUrl: 'https://nha.gov.in/PM-JAY',
    deadline: 'Open All Year / Continuous',
    isActive: true,
  },
  {
    title: 'Pradhan Mantri Awas Yojana - Housing for All (PMAY)',
    code: 'PMAY-U',
    ministry: 'Ministry of Housing and Urban Affairs',
    department: 'National Mission Directorate - PMAY',
    category: 'Housing & Shelter',
    shortDescription: 'Credit-linked subsidy and financial assistance for construction or purchase of pucca house for EWS, LIG, and MIG families.',
    fullDescription: 'Pradhan Mantri Awas Yojana (Urban & Gramin) aims to provide all-weather pucca houses with basic amenities to all eligible urban and rural households. The scheme provides Central Assistance to implementing agencies through States/UTs and Credit Linked Subsidy (CLSS) through Primary Lending Institutions (PLIs) for home construction, enhancement, or purchase.',
    benefitType: 'Subsidy',
    benefitAmount: 'Up to ₹2.67 Lakh Interest Subsidy / ₹1.30 Lakh Direct Grant',
    eligibilityCriteria: {
      minAge: 21,
      maxAge: 70,
      gender: 'All',
      maxIncome: 1800000,
      eligibleOccupations: ['Farmer', 'Employed', 'Self-Employed', 'Business', 'Artisan', 'Street Vendor'],
      eligibleStates: ['All'],
      eligibleCategories: ['All', 'SC', 'ST', 'OBC', 'General', 'EWS'],
      requiresDisability: false,
      requiredSpecialStatus: [],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Income Certificate',
      'Affidavit stating applicant owns no pucca house in India',
      'Bank Account Passbook',
      'Property Ownership Document',
    ],
    officialWebsiteUrl: 'https://pmay-urban.gov.in/',
    deadline: 'Open All Year / Continuous',
    isActive: true,
  },
  {
    title: 'Pradhan Mantri Mudra Yojana (PMMY)',
    code: 'PMMY',
    ministry: 'Ministry of Finance',
    department: 'Department of Financial Services',
    category: 'Entrepreneurship & MSME',
    shortDescription: 'Collateral-free micro-credit up to ₹10 Lakh for non-corporate, non-farm small and micro enterprises under Shishu, Kishore, and Tarun schemes.',
    fullDescription: 'Pradhan Mantri MUDRA Yojana (PMMY) was launched by the Government of India for providing loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises. These loans are given by Commercial Banks, RRBs, Small Finance Banks, MFI and NBFCs. Loans are offered under three categories: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 Lakh), and Tarun (₹5 Lakh to ₹10 Lakh).',
    benefitType: 'Loan & Credit Support',
    benefitAmount: 'Collateral-Free Loan up to ₹10,00,000 (Shishu / Kishore / Tarun)',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 65,
      gender: 'All',
      maxIncome: 5000000,
      eligibleOccupations: ['Self-Employed', 'Business', 'Artisan', 'Street Vendor'],
      eligibleStates: ['All'],
      eligibleCategories: ['All', 'SC', 'ST', 'OBC', 'General', 'EWS'],
      requiresDisability: false,
      requiredSpecialStatus: [],
    },
    requiredDocuments: [
      'Aadhaar Card & PAN Card',
      'Business Plan / Project Report',
      'Proof of Business Identity and Address',
      'Bank Statement (Last 6 Months)',
    ],
    officialWebsiteUrl: 'https://www.mudra.org.in/',
    deadline: 'Open All Year / Continuous',
    isActive: true,
  },
  {
    title: 'National Scholarship Portal - Post-Matric & Pre-Matric Scholarships (NSP)',
    code: 'NSP-GOI',
    ministry: 'Ministry of Education & Ministry of Social Justice and Empowerment',
    department: 'Department of Higher Education',
    category: 'Education & Scholarships',
    shortDescription: 'Single integrated platform offering national scholarships and maintenance allowance to students from SC, ST, OBC, EWS, and Minority communities.',
    fullDescription: 'National Scholarship Portal (NSP) is a one-stop solution through which various services starting from student application, application receipt, processing, sanction and disbursal of various scholarships to Students are enabled. It encompasses Pre-Matric, Post-Matric, and Merit-cum-Means scholarships from Ministry of Education, Ministry of Social Justice & Empowerment, Ministry of Minority Affairs, and Ministry of Tribal Affairs.',
    benefitType: 'Scholarship',
    benefitAmount: '₹10,000 to ₹75,000 per annum + Tuition Fee Waiver',
    eligibilityCriteria: {
      minAge: 10,
      maxAge: 35,
      gender: 'All',
      maxIncome: 250000,
      eligibleOccupations: ['Student'],
      eligibleStates: ['All'],
      eligibleCategories: ['SC', 'ST', 'OBC', 'EWS', 'All'],
      requiresDisability: false,
      requiredSpecialStatus: ['Student'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Educational Marksheets / Certificates',
      'Income Certificate issued by Competent Authority',
      'Caste Certificate (if applicable)',
      'Bonafide Student Certificate from Institution',
    ],
    officialWebsiteUrl: 'https://scholarships.gov.in/',
    deadline: 'October 31, 2026',
    isActive: true,
  },
  {
    title: 'Sukanya Samriddhi Yojana (SSY)',
    code: 'SSY-GOI',
    ministry: 'Ministry of Finance',
    department: 'Department of Posts / National Savings Institute',
    category: 'Women & Child Empowerment',
    shortDescription: 'Government-backed high-interest savings scheme designed to secure the education and marriage future of the girl child under Beti Bachao Beti Padhao.',
    fullDescription: 'Sukanya Samriddhi Yojana is a small deposit scheme of the Government of India meant exclusively for a girl child and is launched as a part of Beti Bachao Beti Padhao campaign. The scheme offers an attractive interest rate (currently 8.2% per annum, tax-free under Section 80C) and can be opened by parents or legal guardians for a girl child before she turns 10 years old.',
    benefitType: 'Financial Assistance',
    benefitAmount: '8.2% Tax-Free Compound Annual Interest & Maturity Corpus',
    eligibilityCriteria: {
      minAge: 0,
      maxAge: 10,
      gender: 'Female',
      maxIncome: 10000000,
      eligibleOccupations: ['All', 'Student'],
      eligibleStates: ['All'],
      eligibleCategories: ['All', 'SC', 'ST', 'OBC', 'General', 'EWS'],
      requiresDisability: false,
      requiredSpecialStatus: [],
    },
    requiredDocuments: [
      'Birth Certificate of Girl Child',
      'Aadhaar Card of Parent/Guardian',
      'PAN Card of Guardian',
      'Address Proof',
    ],
    officialWebsiteUrl: 'https://www.nsiindia.gov.in/',
    deadline: 'Open All Year / Continuous',
    isActive: true,
  },
  {
    title: 'Stand-Up India Scheme for SC/ST and Women Entrepreneurs',
    code: 'STANDUP-IND',
    ministry: 'Ministry of Finance',
    department: 'Small Industries Development Bank of India (SIDBI)',
    category: 'Entrepreneurship & MSME',
    shortDescription: 'Bank loans between ₹10 Lakh and ₹1 Crore for at least one SC or ST borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.',
    fullDescription: 'Stand Up India Scheme facilitates bank loans between ₹10 lakh and ₹1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise. This enterprise may be in manufacturing, services, agri-allied activities, or the trading sector.',
    benefitType: 'Loan & Credit Support',
    benefitAmount: '₹10 Lakh to ₹1 Crore Enterprise Financing',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 70,
      gender: 'All',
      maxIncome: 50000000,
      eligibleOccupations: ['Self-Employed', 'Business', 'Artisan'],
      eligibleStates: ['All'],
      eligibleCategories: ['SC', 'ST', 'All'],
      requiresDisability: false,
      requiredSpecialStatus: ['Business'],
    },
    requiredDocuments: [
      'Aadhaar Card & PAN Card',
      'SC/ST Certificate (if applicable)',
      'Detailed Greenfield Project Report / DPR',
      'Company Incorporation Certificate / Partnership Deed',
    ],
    officialWebsiteUrl: 'https://www.standupmitra.in/',
    deadline: 'Open All Year / Continuous',
    isActive: true,
  },
  {
    title: 'Atal Pension Yojana (APY)',
    code: 'APY-GOI',
    ministry: 'Ministry of Finance',
    department: 'Pension Fund Regulatory and Development Authority (PFRDA)',
    category: 'Financial Inclusion',
    shortDescription: 'Guaranteed pension of ₹1,000 to ₹5,000 per month from age 60 for unorganized sector workers and citizens.',
    fullDescription: 'Atal Pension Yojana (APY) is a guaranteed pension scheme administered by PFRDA and backed by the Government of India. The scheme is open to all citizens in the age group of 18-40 years. Subscribers receive a guaranteed minimum monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 at the age of 60 years, depending on their contributions.',
    benefitType: 'Financial Assistance',
    benefitAmount: 'Guaranteed Monthly Pension of ₹1,000 to ₹5,000 after age 60',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 40,
      gender: 'All',
      maxIncome: 1200000,
      eligibleOccupations: ['Farmer', 'Artisan', 'Street Vendor', 'Self-Employed', 'Employed', 'Unemployed'],
      eligibleStates: ['All'],
      eligibleCategories: ['All', 'SC', 'ST', 'OBC', 'General', 'EWS'],
      requiresDisability: false,
      requiredSpecialStatus: [],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Savings Bank Account Passbook',
      'Nominee details & Address Proof',
    ],
    officialWebsiteUrl: 'https://www.pfrda.org.in/',
    deadline: 'Open All Year / Continuous',
    isActive: true,
  },
  {
    title: 'PM Vishwakarma Yojana for Traditional Artisans & Craftspeople',
    code: 'PM-VISHWA',
    ministry: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    department: 'Development Commissioner (MSME)',
    category: 'Skill Development',
    shortDescription: 'End-to-end support for traditional artisans across 18 trades including ₹15,000 toolkit incentive, collateral-free credit up to ₹3 Lakh, and skill training.',
    fullDescription: 'PM Vishwakarma is a Central Sector Scheme launched by the Prime Minister to provide holistic support to traditional artisans and craftspeople working with hands and tools. The scheme covers 18 traditional trades such as Carpenter, Boat Maker, Blacksmith, Goldsmith, Potter, Sculptor, Cobbler, Mason, Basket Weaver, Tailor, and Washerman. Benefits include PM Vishwakarma Certificate & ID card, ₹500/day training stipend, ₹15,000 Toolkit incentive, and collateral-free enterprise loan up to ₹3,00,000 at 5% interest.',
    benefitType: 'Skill Training',
    benefitAmount: '₹15,000 Toolkit Grant + Collateral-Free Loan up to ₹3 Lakh @ 5% interest',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 75,
      gender: 'All',
      maxIncome: 1500000,
      eligibleOccupations: ['Artisan', 'Self-Employed', 'Street Vendor'],
      eligibleStates: ['All'],
      eligibleCategories: ['All', 'OBC', 'SC', 'ST', 'General', 'EWS'],
      requiresDisability: false,
      requiredSpecialStatus: ['Artisan'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Bank Account Passbook (Aadhaar Seeded)',
      'Ration Card / Family Proof',
      'Trade Activity Verification Document',
    ],
    officialWebsiteUrl: 'https://pmvishwakarma.gov.in/',
    deadline: 'Open All Year / Continuous',
    isActive: true,
  },
  {
    title: 'PM Street Vendor’s AtmaNirbhar Nidhi (PM SVANidhi)',
    code: 'PM-SVANIDHI',
    ministry: 'Ministry of Housing and Urban Affairs',
    department: 'Urban Livelihood Mission',
    category: 'Financial Inclusion',
    shortDescription: 'Working capital micro-credit loan up to ₹50,000 with 7% interest subsidy for urban street vendors and hawkers.',
    fullDescription: 'PM SVANidhi scheme is a special micro-credit facility launched by the Ministry of Housing and Urban Affairs for providing affordable working capital loan to street vendors to resume their livelihoods. Vendors can avail a working capital loan of up to ₹10,000 in the first tranche, ₹20,000 in the second tranche, and ₹50,000 in the third tranche, with 7% per annum interest subsidy and cash-back incentives on digital transactions.',
    benefitType: 'Subsidy',
    benefitAmount: 'Working Capital Loan up to ₹50,000 + 7% Interest Subsidy',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 70,
      gender: 'All',
      maxIncome: 500000,
      eligibleOccupations: ['Street Vendor', 'Self-Employed'],
      eligibleStates: ['All'],
      eligibleCategories: ['All', 'SC', 'ST', 'OBC', 'EWS'],
      requiresDisability: false,
      requiredSpecialStatus: ['Street Vendor'],
    },
    requiredDocuments: [
      'Aadhaar Card linked with Mobile Number',
      'Certificate of Vending / Letter of Recommendation from Town Vending Committee',
      'Bank Passbook',
    ],
    officialWebsiteUrl: 'https://pmsvanidhi.mohua.gov.in/',
    deadline: 'December 31, 2026',
    isActive: true,
  },
  {
    title: 'Pradhan Mantri Ujjwala Yojana (PMUY - 2.0)',
    code: 'PMUY-GOI',
    ministry: 'Ministry of Petroleum and Natural Gas',
    department: 'Oil Marketing Companies (IOCL / BPCL / HPCL)',
    category: 'Women & Child Empowerment',
    shortDescription: 'Free LPG cooking gas connection and ₹300 per cylinder targeted subsidy for women belonging to poor households.',
    fullDescription: 'Pradhan Mantri Ujjwala Yojana (PMUY) is a flagship scheme with an objective to make clean cooking fuel such as LPG available to the rural and deprived households which were otherwise using traditional cooking fuels such as firewood, coal, and cow-dung cakes. PMUY 2.0 provides a deposit-free LPG connection to adult women belonging to poor households along with the first cylinder refill and hotplate free of cost.',
    benefitType: 'Subsidy',
    benefitAmount: 'Free LPG Gas Connection + ₹300 Subsidy per Refill Cylinder',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 85,
      gender: 'Female',
      maxIncome: 250000,
      eligibleOccupations: ['Farmer', 'Unemployed', 'Artisan', 'Street Vendor', 'Self-Employed', 'Employed'],
      eligibleStates: ['All'],
      eligibleCategories: ['All', 'SC', 'ST', 'OBC', 'EWS'],
      requiresDisability: false,
      requiredSpecialStatus: [],
    },
    requiredDocuments: [
      'Aadhaar Card of Applicant Woman',
      'Ration Card / BPL Household Card',
      'Bank Account Passbook (IFSC Code & Account Number)',
      'Passport Size Photo',
    ],
    officialWebsiteUrl: 'https://www.pmuy.gov.in/',
    deadline: 'Open All Year / Continuous',
    isActive: true,
  },
  {
    title: 'Digital India FutureSkills & Internship Scheme',
    code: 'DIGI-INDIA',
    ministry: 'Ministry of Electronics and Information Technology (MeitY)',
    department: 'National Institute of Electronics & Information Technology (NIELIT)',
    category: 'Skill Development',
    shortDescription: 'Advanced digital skills certification in AI, Cybersecurity, Cloud, and IoT with monthly stipend up to ₹10,000 for college students.',
    fullDescription: 'Under the Digital India initiative, MeitY offers structured internship opportunities and subsidized certifications in cutting-edge digital technologies including Artificial Intelligence, Machine Learning, Cybersecurity, Blockchain, and Cloud Computing. Selected interns and trainees receive hands-on project exposure with Government IT infrastructure and a monthly stipend of ₹10,000 during the training period.',
    benefitType: 'Skill Training',
    benefitAmount: '₹10,000 Monthly Stipend + Recognized MeitY Digital Skill Certificate',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 30,
      gender: 'All',
      maxIncome: 1200000,
      eligibleOccupations: ['Student', 'Unemployed'],
      eligibleStates: ['All'],
      eligibleCategories: ['All', 'SC', 'ST', 'OBC', 'General', 'EWS'],
      requiresDisability: false,
      requiredSpecialStatus: ['Student'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Degree / Diploma College Enrollment Proof',
      'Updated Resume / CV',
      'Bank Account Passbook',
    ],
    officialWebsiteUrl: 'https://www.digitalindia.gov.in/',
    deadline: 'July 31, 2026',
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    // 1. Check if the SINGLE default admin account exists
    let existingAdmin = await User.findOne({ email: 'portaladmin@gmail.com' }).select('+password');
    if (!existingAdmin) {
      existingAdmin = await User.findOne({ role: 'admin' }).select('+password');
    }

    if (!existingAdmin) {
      console.log('⚡ Initializing database seed: Creating single confidential Admin account...');
      await User.create({
        name: 'Government Portal Administrator',
        email: 'portaladmin@gmail.com',
        password: 'Admin@2026',
        role: 'admin',
        phone: '9876543210',
        state: 'New Delhi',
        district: 'Central Delhi',
        address: 'National Informatics Centre, CGO Complex, Lodhi Road, New Delhi',
        status: 'Active',
      });
      console.log('✅ Single default Admin account created successfully.');
    } else {
      existingAdmin.email = 'portaladmin@gmail.com';
      const isMatch = await existingAdmin.matchPassword('Admin@2026');
      if (!isMatch) {
        existingAdmin.password = 'Admin@2026';
        await existingAdmin.save();
        console.log('🔧 Updated Admin account password hash to match Admin@2026.');
      } else {
        await existingAdmin.save();
        console.log('ℹ️ Admin account already initialized in database.');
      }
    }

    // 2. Check if Government schemes are seeded
    let schemeCount = await Scheme.countDocuments();
    if (schemeCount === 0) {
      console.log('⚡ Seeding 12 authentic Government of India schemes...');
      await Scheme.insertMany(realGovernmentSchemes);
      schemeCount = await Scheme.countDocuments();
      console.log('✅ 12 Government schemes seeded successfully.');
    } else {
      console.log(`ℹ️ ${schemeCount} Government schemes already present in database.`);
    }

    // 3. Seed Sample Citizens
    const citizenCount = await User.countDocuments({ role: 'citizen' });
    if (citizenCount === 0) {
      console.log('⚡ Seeding sample citizen accounts for portal demonstration...');
      const sampleCitizens = [
        {
          name: 'Ramesh Kumar',
          email: 'ramesh.kumar@govsmart.in',
          password: 'Password123',
          role: 'citizen',
          phone: '9876512345',
          state: 'Uttar Pradesh',
          district: 'Varanasi',
          address: 'Village Ramnagar, Block Kashi, Varanasi',
          age: 42,
          gender: 'Male',
          annualIncome: 120000,
          occupation: 'Farmer',
          category: 'OBC',
          status: 'Active',
        },
        {
          name: 'Priya Sharma',
          email: 'priya.sharma@govsmart.in',
          password: 'Password123',
          role: 'citizen',
          phone: '9876523456',
          state: 'Maharashtra',
          district: 'Pune',
          address: 'Flat 402, Sunshine Apartments, Kothrud, Pune',
          age: 23,
          gender: 'Female',
          annualIncome: 85000,
          occupation: 'Student',
          category: 'EWS',
          status: 'Active',
        },
        {
          name: 'Sunita Devi',
          email: 'sunita.devi@govsmart.in',
          password: 'Password123',
          role: 'citizen',
          phone: '9876534567',
          state: 'Rajasthan',
          district: 'Jaipur',
          address: 'House No 12, Handicraft Colony, Sanganer, Jaipur',
          age: 38,
          gender: 'Female',
          annualIncome: 95000,
          occupation: 'Artisan',
          category: 'SC',
          status: 'Active',
        },
        {
          name: 'Amit Patel',
          email: 'amit.patel@govsmart.in',
          password: 'Password123',
          role: 'citizen',
          phone: '9876545678',
          state: 'Gujarat',
          district: 'Ahmedabad',
          address: 'Plot 88, GIDC Industrial Estate, Naroda, Ahmedabad',
          age: 31,
          gender: 'Male',
          annualIncome: 210000,
          occupation: 'Self-Employed',
          category: 'General',
          status: 'Active',
        },
        {
          name: 'Rajesh Singh',
          email: 'rajesh.singh@govsmart.in',
          password: 'Password123',
          role: 'citizen',
          phone: '9876556789',
          state: 'Delhi',
          district: 'Central Delhi',
          address: 'Stall 14, Janpath Market, Connaught Place, New Delhi',
          age: 45,
          gender: 'Male',
          annualIncome: 110000,
          occupation: 'Street Vendor',
          category: 'ST',
          status: 'Blocked',
        },
      ];

      for (const citizen of sampleCitizens) {
        await User.create(citizen);
      }
      console.log('✅ Sample citizens seeded successfully.');
    }

    // 4. Seed Sample Scheme Applications
    const appCount = await Application.countDocuments();
    if (appCount === 0) {
      console.log('⚡ Seeding sample scheme applications for Admin review center...');
      const ramesh = await User.findOne({ email: 'ramesh.kumar@govsmart.in' });
      const priya = await User.findOne({ email: 'priya.sharma@govsmart.in' });
      const sunita = await User.findOne({ email: 'sunita.devi@govsmart.in' });
      const amit = await User.findOne({ email: 'amit.patel@govsmart.in' });
      const rajesh = await User.findOne({ email: 'rajesh.singh@govsmart.in' });

      const pmKisan = await Scheme.findOne({ code: 'PM-KISAN' });
      const pmJay = await Scheme.findOne({ code: 'PM-JAY' });
      const pmay = await Scheme.findOne({ code: 'PMAY-U' });

      const sampleApps = [];

      if (ramesh && pmKisan) {
        sampleApps.push({
          user: ramesh._id,
          scheme: pmKisan._id,
          applicantName: ramesh.name,
          email: ramesh.email,
          phone: ramesh.phone,
          aadharNumber: '987654321012',
          state: ramesh.state,
          district: ramesh.district,
          address: ramesh.address,
          occupation: ramesh.occupation,
          annualIncome: ramesh.annualIncome,
          category: ramesh.category,
          status: 'Approved',
          remarks: 'Land holding papers verified by District Revenue Officer. Direct benefit transfer initiated.',
          documents: [
            { documentType: 'Aadhaar Card', filename: 'aadhaar_ramesh.pdf', path: '/uploads/sample_aadhaar.pdf' },
            { documentType: 'Landholding Proof', filename: 'khasra_ramesh.pdf', path: '/uploads/sample_land.pdf' },
          ],
          timeline: [
            { stage: 'Application Submitted', status: 'completed', title: 'Submitted by Citizen', comment: 'Application successfully registered.', officerName: 'System Verification' },
            { stage: 'Under Verification', status: 'completed', title: 'District Field Verification', comment: 'Land records verified.', officerName: 'District Collectorate' },
            { stage: 'Document Verified', status: 'completed', title: 'Document Screening Passed', comment: 'Aadhaar bank link active.', officerName: 'Aadhaar Nodal Officer' },
            { stage: 'Approved & Disbursed', status: 'completed', title: 'Sanction Order Issued', comment: 'First installment released to bank account.', officerName: 'State Nodal Officer' },
          ],
        });
      }

      if (priya && pmJay) {
        sampleApps.push({
          user: priya._id,
          scheme: pmJay._id,
          applicantName: priya.name,
          email: priya.email,
          phone: priya.phone,
          aadharNumber: '876543210987',
          state: priya.state,
          district: priya.district,
          address: priya.address,
          occupation: priya.occupation,
          annualIncome: priya.annualIncome,
          category: priya.category,
          status: 'Under Verification',
          remarks: 'Income certificate under physical verification by Tehsildar office.',
          documents: [
            { documentType: 'Aadhaar Card', filename: 'aadhaar_priya.pdf', path: '/uploads/sample_aadhaar.pdf' },
            { documentType: 'Income Certificate', filename: 'income_priya.pdf', path: '/uploads/sample_income.pdf' },
          ],
          timeline: [
            { stage: 'Application Submitted', status: 'completed', title: 'Submitted by Citizen', comment: 'Application received.', officerName: 'System Verification' },
            { stage: 'Under Verification', status: 'current', title: 'Field Verification Pending', comment: 'Income certificate check in progress.', officerName: 'Tehsildar Office' },
          ],
        });
      }

      if (sunita && pmKisan) {
        sampleApps.push({
          user: sunita._id,
          scheme: pmKisan._id,
          applicantName: sunita.name,
          email: sunita.email,
          phone: sunita.phone,
          aadharNumber: '765432109876',
          state: sunita.state,
          district: sunita.district,
          address: sunita.address,
          occupation: sunita.occupation,
          annualIncome: sunita.annualIncome,
          category: sunita.category,
          status: 'Document Verified',
          remarks: 'All documents verified successfully. Queued for final approval.',
          documents: [
            { documentType: 'Aadhaar Card', filename: 'aadhaar_sunita.pdf', path: '/uploads/sample_aadhaar.pdf' },
          ],
          timeline: [
            { stage: 'Application Submitted', status: 'completed', title: 'Submitted by Citizen', comment: 'Application received.', officerName: 'System Verification' },
            { stage: 'Under Verification', status: 'completed', title: 'Verification Completed', comment: 'Artisan record verified.', officerName: 'District Nodal Officer' },
            { stage: 'Document Verified', status: 'current', title: 'Ready for Sanction', comment: 'Awaiting final approval order.', officerName: 'State Approval Desk' },
          ],
        });
      }

      if (amit && pmay) {
        sampleApps.push({
          user: amit._id,
          scheme: pmay._id,
          applicantName: amit.name,
          email: amit.email,
          phone: amit.phone,
          aadharNumber: '654321098765',
          state: amit.state,
          district: amit.district,
          address: amit.address,
          occupation: amit.occupation,
          annualIncome: amit.annualIncome,
          category: amit.category,
          status: 'Submitted',
          remarks: 'Application successfully received and pending initial officer screening.',
          documents: [
            { documentType: 'Aadhaar Card', filename: 'aadhaar_amit.pdf', path: '/uploads/sample_aadhaar.pdf' },
          ],
          timeline: [
            { stage: 'Application Submitted', status: 'current', title: 'Submitted by Citizen', comment: 'Application queued for screening.', officerName: 'System' },
          ],
        });
      }

      if (rajesh && pmJay) {
        sampleApps.push({
          user: rajesh._id,
          scheme: pmJay._id,
          applicantName: rajesh.name,
          email: rajesh.email,
          phone: rajesh.phone,
          aadharNumber: '543210987654',
          state: rajesh.state,
          district: rajesh.district,
          address: rajesh.address,
          occupation: rajesh.occupation,
          annualIncome: rajesh.annualIncome,
          category: rajesh.category,
          status: 'Rejected',
          remarks: 'Ineligible due to duplicate Aadhaar registration under another family card.',
          documents: [
            { documentType: 'Aadhaar Card', filename: 'aadhaar_rajesh.pdf', path: '/uploads/sample_aadhaar.pdf' },
          ],
          timeline: [
            { stage: 'Application Submitted', status: 'completed', title: 'Submitted by Citizen', comment: 'Application received.', officerName: 'System Verification' },
            { stage: 'Rejected', status: 'rejected', title: 'Application Rejected', comment: 'Duplicate Aadhaar record.', officerName: 'Verification Officer' },
          ],
        });
      }

      if (sampleApps.length > 0) {
        await Application.insertMany(sampleApps);
        console.log(`✅ ${sampleApps.length} sample applications seeded successfully.`);

        // Increment scheme applicationCounts
        if (pmKisan) await Scheme.findByIdAndUpdate(pmKisan._id, { $inc: { applicationCount: 2 } });
        if (pmJay) await Scheme.findByIdAndUpdate(pmJay._id, { $inc: { applicationCount: 2 } });
        if (pmay) await Scheme.findByIdAndUpdate(pmay._id, { $inc: { applicationCount: 1 } });
      }
    }
  } catch (error) {
    console.error(`❌ Database Seed Error: ${error.message}`);
  }
};

module.exports = { seedDatabase, realGovernmentSchemes };
