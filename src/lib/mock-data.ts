import { User, Property, InspectionRequest, BreakdownItem, Notification, Message, RentalAgreement, Bid, PropertyReport, Announcement, Favorite } from './types';

// ============ MOCK USERS ============
export const mockUsers: User[] = [
  {
    id: 'user-tenant-1',
    name: 'Adebayo Okonkwo',
    email: 'adebayo@email.com',
    password: 'password123',
    role: 'tenant',
    isActive: true,
    isVerified: false,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'user-tenant-2',
    name: 'Chioma Nwankwo',
    email: 'chioma@email.com',
    password: 'password123',
    role: 'tenant',
    isActive: true,
    isVerified: false,
    createdAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'user-landlord-1',
    name: 'Chief Emeka Okafor',
    email: 'emeka@email.com',
    password: 'password123',
    role: 'landlord',
    isActive: true,
    isVerified: true,
    phone: '+2348012345678',
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'user-landlord-2',
    name: 'Alhaji Ibrahim Musa',
    email: 'ibrahim@email.com',
    password: 'password123',
    role: 'landlord',
    isActive: true,
    isVerified: false,
    phone: '+2348098765432',
    createdAt: '2024-01-11T10:00:00Z',
  },
  {
    id: 'user-solicitor-1',
    name: 'Barrister Funke Adeyemi',
    email: 'funke@email.com',
    password: 'password123',
    role: 'solicitor',
    isActive: true,
    isVerified: true,
    phone: '+2348023456789',
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: 'user-solicitor-2',
    name: 'Barrister Olumide Bankole',
    email: 'olumide@email.com',
    password: 'password123',
    role: 'solicitor',
    isActive: true,
    isVerified: false,
    phone: '+2348034567890',
    createdAt: '2024-01-06T10:00:00Z',
  },
  {
    id: 'user-admin-1',
    name: 'Admin User',
    email: 'admin@oyalandlord.com',
    password: 'admin123',
    role: 'admin',
    isActive: true,
    isVerified: true,
    createdAt: '2024-01-01T10:00:00Z',
  },
];

// ============ MOCK PROPERTIES ============
export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    propertyCode: 'OYA-7721',
    landlordId: 'user-landlord-1',
    title: 'Modern 3-Bedroom Flat in Lekki',
    description: 'A beautifully furnished 3-bedroom flat located in the heart of Lekki Phase 1. Features modern amenities, 24/7 security, constant water supply, and close proximity to shopping malls and schools. Perfect for families looking for comfort and convenience.',
    price: 2500000,
    location: 'Lekki Phase 1, Lagos',
    landmark: 'Near Admiralty Way',
    address: '15 Admiralty Way, Lekki Phase 1, Lagos',
    type: 'flat',
    bedrooms: 3,
    bathrooms: 2,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    available: true,
    solicitorId: 'user-solicitor-1',
    inspectionFee: 10000,
    whatsappEnabled: true,
    whatsappNumber: '+2348012345678',
    breakdownItems: [
      { name: 'Rent', amount: 2000000 },
      { name: 'Service Charge', amount: 300000 },
      { name: 'Caution Fee (Refundable)', amount: 150000 },
    ],
    featured: true,
    viewCount: 156,
    allowNegotiation: true,
    screeningQuestions: [],
    amenities: ['Pool', 'Gym'],
    security: ['Gated Estate', 'Security Guard', 'CCTV'],
    parking: ['Car Park'],
    furnishing: 'unfurnished',
    petPolicy: 'not-allowed',
    outdoorSpace: ['Balcony'],
    earliestMoveIn: '2024-02-01',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'prop-2',
    propertyCode: 'OYA-3342',
    landlordId: 'user-landlord-1',
    title: 'Cozy Studio Apartment in Yaba',
    description: 'A compact and affordable studio apartment perfect for young professionals. Located in Yaba with easy access to public transportation, markets, and tech hubs. Features built-in wardrobes, kitchenette, and shared laundry facilities.',
    price: 450000,
    location: 'Yaba, Lagos',
    landmark: 'Near Yaba Bus Stop',
    address: '8 Commercial Road, Yaba, Lagos',
    type: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b25ba?w=800',
    ],
    available: true,
    solicitorId: undefined,
    inspectionFee: 5000,
    whatsappEnabled: true,
    whatsappNumber: '+2348012345678',
    breakdownItems: [
      { name: 'Rent', amount: 400000 },
      { name: 'Caution Fee (Refundable)', amount: 50000 },
    ],
    featured: false,
    viewCount: 89,
    allowNegotiation: false,
    screeningQuestions: [],
    amenities: [],
    security: ['Security Guard'],
    parking: [],
    furnishing: 'semi-furnished',
    petPolicy: 'not-allowed',
    outdoorSpace: [],
    earliestMoveIn: '2024-02-15',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
  },
  {
    id: 'prop-3',
    propertyCode: 'OYA-9910',
    landlordId: 'user-landlord-2',
    title: 'Spacious Duplex in Maitama',
    description: 'A luxurious 5-bedroom duplex in the prestigious Maitama district. Features a swimming pool, generator house, security quarters, and a large compound. Ideal for diplomats and high-net-worth individuals seeking privacy and luxury.',
    price: 8000000,
    location: 'Maitama, Abuja',
    landmark: 'Near IBB Way',
    address: '42 IBB Way, Maitama, Abuja',
    type: 'duplex',
    bedrooms: 5,
    bathrooms: 4,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    ],
    available: true,
    solicitorId: 'user-solicitor-2',
    inspectionFee: 25000,
    whatsappEnabled: false,
    whatsappNumber: undefined,
    breakdownItems: [
      { name: 'Rent', amount: 6000000 },
      { name: 'Service Charge', amount: 1000000 },
      { name: 'Legal Fee', amount: 500000 },
      { name: 'Caution Fee (Refundable)', amount: 500000 },
    ],
    featured: true,
    viewCount: 234,
    allowNegotiation: true,
    screeningQuestions: [
      { id: 'q1', question: 'Do you have pets?' },
      { id: 'q2', question: 'What is your occupation?' },
    ],
    amenities: [],
    security: ['Gated Estate', 'Security Guard', 'CCTV'],
    parking: ['Car Park', 'Garage'],
    furnishing: 'furnished',
    petPolicy: 'allowed',
    outdoorSpace: ['Garden', 'Roof Terrace'],
    earliestMoveIn: '2024-03-01',
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
  },
  {
    id: 'prop-4',
    propertyCode: 'OYA-5567',
    landlordId: 'user-landlord-2',
    title: 'Self-Contain Room in Ikeja',
    description: 'A clean and well-maintained self-contain room in a secured compound in Ikeja. Features personal bathroom, kitchen space, and water heater. Perfect for students and young working-class individuals.',
    price: 350000,
    location: 'Ikeja, Lagos',
    landmark: 'Near Oba Akran Road',
    address: '23 Oba Akran Road, Ikeja, Lagos',
    type: 'room',
    bedrooms: 1,
    bathrooms: 1,
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
    ],
    available: true,
    solicitorId: undefined,
    inspectionFee: 3000,
    whatsappEnabled: true,
    whatsappNumber: '+2348098765432',
    breakdownItems: [
      { name: 'Rent', amount: 300000 },
      { name: 'Caution Fee (Refundable)', amount: 50000 },
    ],
    featured: false,
    viewCount: 67,
    allowNegotiation: false,
    screeningQuestions: [],
    amenities: [],
    security: ['Security Guard'],
    parking: [],
    furnishing: 'unfurnished',
    petPolicy: 'not-allowed',
    outdoorSpace: [],
    earliestMoveIn: '2024-02-01',
    createdAt: '2024-01-23T10:00:00Z',
    updatedAt: '2024-01-23T10:00:00Z',
  },
  {
    id: 'prop-5',
    propertyCode: 'OYA-2218',
    landlordId: 'user-landlord-1',
    title: '4-Bedroom Detached House in GRA',
    description: 'A beautiful detached house located in the serene GRA area of Ikeja. Features a large sitting room, dining area, fitted kitchen, boys quarters, and ample parking space. Very secure neighborhood with constant electricity.',
    price: 4500000,
    location: 'GRA Ikeja, Lagos',
    landmark: 'Near Reserve Road',
    address: '7 Reserve Road, GRA Ikeja, Lagos',
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    ],
    available: true,
    solicitorId: 'user-solicitor-1',
    inspectionFee: 15000,
    whatsappEnabled: true,
    whatsappNumber: '+2348012345678',
    breakdownItems: [
      { name: 'Rent', amount: 3500000 },
      { name: 'Service Charge', amount: 500000 },
      { name: 'Legal Fee', amount: 300000 },
      { name: 'Caution Fee (Refundable)', amount: 200000 },
    ],
    featured: true,
    viewCount: 45,
    allowNegotiation: true,
    screeningQuestions: [],
    amenities: ['Terrace', 'Pool'],
    security: ['Gated Estate', 'Security Guard', 'CCTV'],
    parking: ['Car Park', 'Garage'],
    furnishing: 'semi-furnished',
    petPolicy: 'allowed',
    outdoorSpace: ['Garden'],
    earliestMoveIn: '2024-02-20',
    createdAt: '2024-01-24T10:00:00Z',
    updatedAt: '2024-01-24T10:00:00Z',
  },
  {
    id: 'prop-6',
    propertyCode: 'OYA-4459',
    landlordId: 'user-landlord-2',
    title: 'Modern Maisonette in Asokoro',
    description: 'A contemporary 3-bedroom maisonette in Asokoro with modern finishes. Features open-plan living area, fitted kitchen with appliances, master bedroom en-suite, and a balcony with city views. Close to embassies and international schools.',
    price: 3500000,
    location: 'Asokoro, Abuja',
    landmark: 'Near Aminu Kano Crescent',
    address: '15 Aminu Kano Crescent, Asokoro, Abuja',
    type: 'maisonette',
    bedrooms: 3,
    bathrooms: 2,
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',
    ],
    available: false,
    solicitorId: undefined,
    inspectionFee: 12000,
    whatsappEnabled: true,
    whatsappNumber: '+2348098765432',
    breakdownItems: [
      { name: 'Rent', amount: 3000000 },
      { name: 'Service Charge', amount: 300000 },
      { name: 'Caution Fee (Refundable)', amount: 200000 },
    ],
    featured: false,
    viewCount: 112,
    allowNegotiation: false,
    screeningQuestions: [],
    amenities: [],
    security: ['Security Guard', 'CCTV'],
    parking: ['Car Park'],
    furnishing: 'furnished',
    petPolicy: 'not-allowed',
    outdoorSpace: ['Balcony'],
    earliestMoveIn: '2024-04-01',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
];

// ============ MOCK INSPECTION REQUESTS ============
export const mockInspectionRequests: InspectionRequest[] = [
  {
    id: 'inspection-1',
    propertyId: 'prop-1',
    tenantId: 'user-tenant-1',
    landlordId: 'user-landlord-1',
    date: '2024-02-10',
    time: '14:00',
    createdAt: '2024-01-28T10:00:00Z',
    status: 'approved',
    approvedAt: '2024-01-29T14:00:00Z',
  },
  {
    id: 'inspection-2',
    propertyId: 'prop-3',
    tenantId: 'user-tenant-2',
    landlordId: 'user-landlord-1',
    date: '2024-02-15',
    time: '10:00',
    createdAt: '2024-02-01T09:00:00Z',
    status: 'pending',
  },
  {
    id: 'inspection-3',
    propertyId: 'prop-5',
    tenantId: 'user-tenant-1',
    landlordId: 'user-landlord-1',
    date: '2024-02-18',
    time: '11:00',
    createdAt: '2024-02-02T11:00:00Z',
    status: 'pending',
    notes: 'Would like to inspect on weekends if possible.',
  },
];

// ============ MOCK RENTAL AGREEMENTS ============
export const mockRentalAgreements: RentalAgreement[] = [
  {
    id: 'rental-1',
    propertyId: 'prop-1',
    tenantId: 'user-tenant-1',
    landlordId: 'user-landlord-1',
    type: 'rent',
    startDate: '2024-02-15T00:00:00Z',
    endDate: '2025-02-14T00:00:00Z',
    totalAmount: 2450000,
    breakdownItems: [
      { name: 'Rent', amount: 2000000 },
      { name: 'Service Charge', amount: 300000 },
      { name: 'Caution Fee (Refundable)', amount: 150000 },
    ],
    cautionFee: 150000,
    status: 'active',
    bidAccepted: true,
    receiptNumber: 'RCPT-2024-001',
    createdAt: '2024-02-10T10:00:00Z',
  },
];

// ============ MOCK BIDS ============
export const mockBids: Bid[] = [
  {
    id: 'bid-1',
    propertyId: 'prop-1',
    tenantId: 'user-tenant-1',
    amount: 2400000,
    status: 'accepted',
    createdAt: '2024-02-08T10:00:00Z',
  },
];

// ============ MOCK MESSAGES ============
export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'user-tenant-1',
    receiverId: 'user-landlord-1',
    recipientId: 'user-landlord-1',
    propertyId: 'prop-1',
    rentalId: 'rental-1',
    content: 'The water pump in the apartment is not working properly. Please look into it.',
    createdAt: '2024-02-20T10:00:00Z',
    isRead: true,
    replies: [],
  },
  {
    id: 'msg-2',
    senderId: 'user-landlord-1',
    receiverId: 'user-tenant-1',
    recipientId: 'user-tenant-1',
    propertyId: 'prop-1',
    rentalId: 'rental-1',
    content: 'Thank you for letting me know. I will send a plumber today.',
    createdAt: '2024-02-20T11:30:00Z',
    isRead: false,
    replies: [],
  },
];

// ============ MOCK NOTIFICATIONS ============
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-tenant-1',
    title: 'Inspection Approved',
    message: 'Your inspection request for "Modern 3-Bedroom Flat in Lekki" has been approved.',
    type: 'inspection',
    read: false,
    actionUrl: 'tenant-inspections',
    createdAt: '2024-01-29T14:00:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-landlord-1',
    title: 'New Inspection Request',
    message: 'You have a new inspection request for "Modern 3-Bedroom Flat in Lekki".',
    type: 'inspection',
    read: true,
    actionUrl: 'landlord-dashboard',
    createdAt: '2024-01-28T10:00:00Z',
  },
];

// ============ HELPER FUNCTIONS ============

// Generate property code (e.g., OYA-1234)
export const generatePropertyCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing chars like 0, O, 1, I, L
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `OYA-${result}`;
};

// Generate unique IDs
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate receipt number
export const generateReceiptNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `RCPT-${year}-${random}`;
};

// Storage keys
export const STORAGE_KEYS = {
  USERS: 'oyalandlord_users',
  PROPERTIES: 'oyalandlord_properties',
  INSPECTION_REQUESTS: 'oyalandlord_inspection_requests',
  CURRENT_USER: 'oyalandlord_current_user',
  RENTAL_AGREEMENTS: 'oyalandlord_rental_agreements',
  BIDS: 'oyalandlord_bids',
  MESSAGES: 'oyalandlord_messages',
  NOTIFICATIONS: 'oyalandlord_notifications',
  REPORTS: 'oyalandlord_reports',
  ANNOUNCEMENTS: 'oyalandlord_announcements',
  FAVORITES: 'oyalandlord_favorites',
};

// ============ MOCK REPORTS ============
export const mockReports: PropertyReport[] = [
  {
    id: 'report-1',
    propertyId: 'prop-2',
    reporterId: 'user-tenant-2',
    reason: 'wrong_price',
    description: 'The actual price is higher than listed.',
    status: 'pending',
    createdAt: '2024-02-01T10:00:00Z',
  },
];

// ============ MOCK ANNOUNCEMENTS ============
export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Welcome!',
    message: 'Thank you for joining Nigeria\'s #1 agent-free rental platform. Find your perfect home today!',
    isActive: true,
    createdAt: '2024-01-01T10:00:00Z',
  },
];

// ============ MOCK FAVORITES ============
export const mockFavorites: Favorite[] = [
  {
    id: 'fav-1',
    userId: 'user-tenant-1',
    propertyId: 'prop-3',
    createdAt: '2024-01-28T10:00:00Z',
  },
  {
    id: 'fav-2',
    userId: 'user-tenant-1',
    propertyId: 'prop-5',
    createdAt: '2024-01-29T10:00:00Z',
  },
];

// Calculate total package from breakdown items
export const calculateTotalPackage = (breakdownItems: BreakdownItem[] | undefined | null): number => {
  if (!breakdownItems || !Array.isArray(breakdownItems)) {
    return 0;
  }
  return breakdownItems.reduce((sum, item) => sum + (item.amount || 0), 0);
};
