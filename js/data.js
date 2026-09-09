/**
 * CropNex - Initial Demo Data Repository
 * Smart India Hackathon 2026 - PS ID 26033
 * Realistic datasets for crops, prices, tenders, orders, messages, and profiles.
 */

const INITIAL_PRODUCTS = [];

const INITIAL_TENDERS = [
  {
    id: 'TDR-2026-091',
    title: 'Supply of Fresh Vegetables & Fruits to District Civil Hospital',
    category: 'Vegetables',
    organization: 'Maharashtra Public Health Dept / District Civil Hospital',
    location: 'Nashik, Maharashtra',
    deadline: '2026-09-15',
    estimatedValue: '₹ 18,50,000',
    quantityReq: '25,000 kg seasonal assortment',
    eligibility: 'Registered Farmer Producer Organizations (FPOs), Cooperative Societies, Self-Help Groups (SHGs)',
    languages: ['English', 'Marathi'],
    sourceUrl: 'https://etenders.gov.in/eprocure/app',
    status: 'Active',
    description: 'Procurement of daily fresh vegetables (Tomatoes, Onions, Potatoes, Spinach, Cauliflower) and seasonal fruits for hospital kitchen meal preparation.'
  },
  {
    id: 'TDR-2026-084',
    title: 'Procurement of High-Grade Turmeric for NAFED Buffer Stock',
    category: 'Spices',
    organization: 'National Agricultural Cooperative Marketing Federation of India (NAFED)',
    location: 'Nanded & Sangli, Maharashtra',
    deadline: '2026-09-20',
    estimatedValue: '₹ 45,00,000',
    quantityReq: '35 Metric Tonnes (Salem / Nizamabad variety)',
    eligibility: 'Verified Farmers, Registered Primary Agricultural Credit Societies (PACS), FPOs',
    languages: ['English', 'Hindi'],
    sourceUrl: 'https://etenders.gov.in/eprocure/app',
    status: 'Active',
    description: 'Direct procurement of FAQ grade dry turmeric fingers with minimum 4.5% curcumin for national buffer stock and direct welfare distribution.'
  },
  {
    id: 'TDR-2026-077',
    title: 'Supply of Grade-A Rice & Wheat for Mid-Day Meal Scheme',
    category: 'Grains',
    organization: 'Food, Civil Supplies & Consumer Protection Dept',
    location: 'Pune & Ahmednagar District Schools',
    deadline: '2026-09-28',
    estimatedValue: '₹ 62,00,000',
    quantityReq: '80 Metric Tonnes (Lokwan Wheat / Sona Masoori Rice)',
    eligibility: 'Farmer Collectives, Agri Aggregators, Grain Millers with FSSAI certification',
    languages: ['English', 'Hindi', 'Marathi'],
    sourceUrl: 'https://etenders.gov.in/eprocure/app',
    status: 'Active',
    description: 'Distribution of pest-free, lab-certified staple grains to 420 government primary and upper primary schools under the PM POSHAN scheme.'
  },
  {
    id: 'TDR-2026-069',
    title: 'Procurement of Fresh Table Bananas for Prison Canteen Supplies',
    category: 'Fruits',
    organization: 'Inspector General of Prisons & Correctional Services',
    location: 'Yerwada Central Jail, Pune',
    deadline: '2026-09-12',
    estimatedValue: '₹ 8,40,000',
    quantityReq: '12,000 Dozens (Robusta / Grand Naine)',
    eligibility: 'Local Farmers, FPOs, Women SHGs',
    languages: ['English', 'Marathi'],
    sourceUrl: 'https://etenders.gov.in/eprocure/app',
    status: 'Active',
    description: 'Weekly scheduled supply of ripe, unblemished table bananas for inmate dietary standards.'
  },
  {
    id: 'TDR-2026-058',
    title: 'Supply of Solar Cold Storage & Drying Units for Village Clusters',
    category: 'Equipment',
    organization: 'Maharashtra Energy Development Agency (MEDA)',
    location: 'Solapur & Latur Rural',
    deadline: '2026-10-05',
    estimatedValue: '₹ 1,20,00,000',
    quantityReq: '15 Units of 5MT capacity each',
    eligibility: 'Agri-Tech Startups, Renewable Energy OEMs, FPO consortia',
    languages: ['English', 'Hindi'],
    sourceUrl: 'https://etenders.gov.in/eprocure/app',
    status: 'Upcoming',
    description: 'Turnkey installation and 3-year maintenance of decentralized farm-gate micro cold rooms powered by rooftop solar PV.'
  }
];

const HISTORICAL_PRICE_DATA = {
  'Tomato': {
    current: 2400,
    predicted: 2650,
    expectedChange: '+10.4%',
    trend: 'increasing',
    confidence: 84,
    unit: '₹ / quintal',
    mandi: 'Nashik APMC',
    historical: [
      { date: '01 Aug', price: 2150 },
      { date: '05 Aug', price: 2200 },
      { date: '09 Aug', price: 2180 },
      { date: '13 Aug', price: 2260 },
      { date: '17 Aug', price: 2320 },
      { date: '21 Aug', price: 2380 },
      { date: '25 Aug', price: 2400 }
    ],
    forecast: [
      { date: '29 Aug', price: 2460 },
      { date: '02 Sep', price: 2520 },
      { date: '06 Sep', price: 2590 },
      { date: '10 Sep', price: 2650 }
    ],
    rationale: 'Monsoon-induced logistical slowdowns in southern production hubs combined with high festival demand in urban markets are projected to push wholesale rates higher over the next 14 days.'
  },
  'Onion': {
    current: 1800,
    predicted: 1720,
    expectedChange: '-4.4%',
    trend: 'decreasing',
    confidence: 89,
    unit: '₹ / quintal',
    mandi: 'Lasalgaon APMC',
    historical: [
      { date: '01 Aug', price: 1950 },
      { date: '05 Aug', price: 1920 },
      { date: '09 Aug', price: 1880 },
      { date: '13 Aug', price: 1860 },
      { date: '17 Aug', price: 1830 },
      { date: '21 Aug', price: 1810 },
      { date: '25 Aug', price: 1800 }
    ],
    forecast: [
      { date: '29 Aug', price: 1780 },
      { date: '02 Sep', price: 1750 },
      { date: '06 Sep', price: 1730 },
      { date: '10 Sep', price: 1720 }
    ],
    rationale: 'Increased buffer stock releases by government agencies and steady arrivals from central Maharashtra storages will maintain ample market liquidity and soften spot prices.'
  },
  'Potato': {
    current: 1500,
    predicted: 1580,
    expectedChange: '+5.3%',
    trend: 'increasing',
    confidence: 81,
    unit: '₹ / quintal',
    mandi: 'Ahmednagar Mandi',
    historical: [
      { date: '01 Aug', price: 1420 },
      { date: '05 Aug', price: 1440 },
      { date: '09 Aug', price: 1450 },
      { date: '13 Aug', price: 1480 },
      { date: '17 Aug', price: 1490 },
      { date: '21 Aug', price: 1500 },
      { date: '25 Aug', price: 1500 }
    ],
    forecast: [
      { date: '29 Aug', price: 1520 },
      { date: '02 Sep', price: 1540 },
      { date: '06 Sep', price: 1560 },
      { date: '10 Sep', price: 1580 }
    ],
    rationale: 'Steady consumption across processing units and gradual tapering of cold store inventory will offer moderate upward price support.'
  },
  'Wheat': {
    current: 2800,
    predicted: 2890,
    expectedChange: '+3.2%',
    trend: 'stable_up',
    confidence: 92,
    unit: '₹ / quintal',
    mandi: 'Solapur APMC',
    historical: [
      { date: '01 Aug', price: 2750 },
      { date: '05 Aug', price: 2760 },
      { date: '09 Aug', price: 2780 },
      { date: '13 Aug', price: 2790 },
      { date: '17 Aug', price: 2800 },
      { date: '21 Aug', price: 2800 },
      { date: '25 Aug', price: 2800 }
    ],
    forecast: [
      { date: '29 Aug', price: 2820 },
      { date: '02 Sep', price: 2840 },
      { date: '06 Sep', price: 2870 },
      { date: '10 Sep', price: 2890 }
    ],
    rationale: 'Consistent institutional procurement demand and low moisture premium batches will sustain firm spot prices throughout the month.'
  },
  'Turmeric': {
    current: 12000,
    predicted: 12850,
    expectedChange: '+7.1%',
    trend: 'increasing',
    confidence: 79,
    unit: '₹ / quintal',
    mandi: 'Nanded APMC',
    historical: [
      { date: '01 Aug', price: 11200 },
      { date: '05 Aug', price: 11400 },
      { date: '09 Aug', price: 11600 },
      { date: '13 Aug', price: 11750 },
      { date: '17 Aug', price: 11900 },
      { date: '21 Aug', price: 11950 },
      { date: '25 Aug', price: 12000 }
    ],
    forecast: [
      { date: '29 Aug', price: 12200 },
      { date: '02 Sep', price: 12450 },
      { date: '06 Sep', price: 12650 },
      { date: '10 Sep', price: 12850 }
    ],
    rationale: 'High export queries from Middle East and North America, combined with limited high-curcumin finger arrivals, are driving bullish sentiment.'
  }
};

const INITIAL_ORDERS = [];

const INITIAL_RETURNS = [];

const INITIAL_MESSAGES = {
  'conv-farmer-1': {
    id: 'conv-farmer-1',
    participantId: 'farmer-001',
    participantName: 'Ramesh Patil',
    participantRole: 'Farmer (Tomato Producer)',
    avatar: '👨‍🌾',
    online: true,
    lastUpdated: '10:35 AM',
    messages: [
      { id: 'm1', sender: 'farmer', text: 'Namaskar Ajay ji. I received your order for 100kg Hybrid Tomatoes. Harvesting is scheduled for early morning tomorrow.', time: '10:30 AM' },
      { id: 'm2', sender: 'buyer', text: 'Great! Please ensure firm grading. When can we expect the dispatch from Nashik hub?', time: '10:32 AM' },
      { id: 'm3', sender: 'farmer', text: 'Dispatch will be around 7:00 AM via the CropNex shared cold van. It will reach Pune Market Yard by 11:30 AM.', time: '10:34 AM' },
      { id: 'm4', sender: 'buyer', text: 'Perfect. Thank you Ramesh ji!', time: '10:35 AM' }
    ]
  },
  'conv-farmer-2': {
    id: 'conv-farmer-2',
    participantId: 'farmer-002',
    participantName: 'Sunita Jadhav',
    participantRole: 'Farmer (Onion Producer)',
    avatar: '👩‍🌾',
    online: true,
    lastUpdated: 'Yesterday',
    messages: [
      { id: 'm1', sender: 'buyer', text: 'Sunita ji, do you have additional 500kg onion stock available for next week delivery?', time: 'Yesterday, 03:15 PM' },
      { id: 'm2', sender: 'farmer', text: 'Yes, we have 1200kg graded stock ready in storage. You can place the order anytime directly on CropNex.', time: 'Yesterday, 04:00 PM' }
    ]
  },
  'conv-farmer-3': {
    id: 'conv-farmer-3',
    participantId: 'farmer-003',
    participantName: 'Mahesh Shinde',
    participantRole: 'Farmer (Potato Cultivator)',
    avatar: '👨‍🌾',
    online: false,
    lastUpdated: '2 days ago',
    messages: [
      { id: 'm1', sender: 'buyer', text: 'Previous delivery of Kufri Pukhraj was excellent in quality. Thank you.', time: '25 Aug, 05:00 PM' },
      { id: 'm2', sender: 'farmer', text: 'Happy to serve directly without intermediaries. Looking forward to our next partnership.', time: '25 Aug, 05:15 PM' }
    ]
  }
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'New Order Received',
    message: 'Ajay Traders placed an order for 100 kg Tomato - Hybrid (Order #CNX-2026-1048).',
    time: '15 mins ago',
    read: false,
    type: 'order'
  },
  {
    id: 'notif-2',
    title: 'AI Price Trend Alert',
    message: 'Tomato wholesale rates are projected to increase by +10.4% in Nashik APMC over the next 10 days.',
    time: '1 hour ago',
    read: false,
    type: 'forecast'
  },
  {
    id: 'notif-3',
    title: 'New Government Tender Matched',
    message: 'New tender from Maharashtra Public Health Dept for Fresh Vegetable Supply (Est. ₹ 18.5 Lakhs).',
    time: '3 hours ago',
    read: true,
    type: 'tender'
  },
  {
    id: 'notif-4',
    title: 'Logistics Route Optimization',
    message: 'Your dispatch route to Pune Market Yard has been optimized with a 21% fuel reduction.',
    time: '1 day ago',
    read: true,
    type: 'logistics'
  }
];

const INITIAL_USER_PROFILES = {
  farmer: {
    name: 'Ramesh Patil',
    kisanId: 'KISAN-7821-MH',
    role: 'Farmer',
    farmName: 'Patil Organic Farms & Horticulture',
    village: 'Pimpalgaon Baswant',
    district: 'Nashik',
    state: 'Maharashtra',
    farmSize: '12.5 Acres',
    primaryCrops: 'Tomato, Onion, Grapes, Green Chilli',
    phone: '+91 94220 88712',
    email: 'ramesh.patil@cropnex.in',
    verified: true,
    kycStatus: 'Verified (Aadhaar & Land 7/12 Extract)',
    rating: 4.9,
    joinedDate: 'March 2024',
    activeListings: 4,
    totalDeliveries: 142
  },
  buyer: {
    username: 'ajay.traders',
    name: 'Ajay Traders (Ajay Agarwal)',
    role: 'Buyer',
    businessName: 'Ajay Wholesale & Distribution Pvt Ltd',
    buyerType: 'Wholesaler / Retail Supplier',
    location: 'Gultekdi Market Yard, Pune',
    district: 'Pune',
    state: 'Maharashtra',
    gstin: '27AABCA1234F1Z5',
    preferredCrops: 'Tomato, Onion, Potato, Grains',
    phone: '+91 98231 44521',
    email: 'procurement@ajaytraders.in',
    verified: true,
    rating: 4.8,
    joinedDate: 'January 2024',
    completedOrders: 24,
    totalSpent: '₹ 4,86,200'
  },
  admin: {
    name: 'CropNex Admin Console',
    role: 'Admin',
    department: 'Smart India Hackathon Operations',
    email: 'admin@cropnex.agri.gov.in',
    status: 'Super Administrator'
  }
};
