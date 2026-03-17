// User Types
export type UserRole = 'tenant' | 'landlord' | 'solicitor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean; // For landlords/solicitors verification badge
  phone?: string;
  nin?: string; // National Identity Number for verification
  documentUrl?: string; // Verification document URL
  createdAt: string;
  isDeleted?: boolean;
  deletionReason?: string;
  deletedAt?: string;
}

// Report Types
export type ReportReason = 'fake_listing' | 'already_rented' | 'wrong_price' | 'scam' | 'other';

export interface PropertyReport {
  id: string;
  propertyId: string;
  reporterId: string;
  reason: ReportReason;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

// Inspection Types
export interface InspectionRequest {
  id: string;
  propertyId: string;
  landlordId: string;
  tenantId: string;
  status: InspectionStatus;
  date: string;
  time: string;
  notes?: string;
  createdAt: string;
  requestedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
}

export type InspectionStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

// Dashboard / Stats Types
export type Booking = InspectionRequest;

export interface DashboardStats {
  totalUsers: number;
  totalTenants: number;
  totalLandlords: number;
  totalSolicitors: number;
  unverifiedUsers: number;
  totalProperties: number;
  availableProperties: number;
  totalInspections: number;
  pendingInspections: number;
  pendingReports: number;
}

// Property Types
export type PropertyType = 'flat' | 'house' | 'duplex' | 'room' | 'studio' | 'maisonette';

export interface BreakdownItem {
  id?: string;
  name: string;
  amount: number;
}

export interface Property {
  id: string;
  propertyCode: string;
  title: string;
  description: string;
  price: number; // Annual rent
  location: string;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  featured: boolean;
  available: boolean;
  landlordId: string;
  createdAt: string;
  updatedAt: string;
  amenities: string[];
  security?: string[];
  parking?: string[];
  outdoorSpace?: string[];
  petPolicy?: string;
  furnishing?: string;
  breakdownItems: BreakdownItem[];
  isDeleted?: boolean;
  deletionReason?: string;
  inspectionFee?: number;
  whatsappEnabled?: boolean;
  whatsappNumber?: string;
  solicitorId?: string;
  landmark?: string;
  allowNegotiation?: boolean;
  viewCount?: number;
  nearbyAmenities?: string[];
  powerSupply?: string[];
  waterSupply?: string[];
  rentPeriod?: string;
  screeningQuestions?: { id: string; question: string }[];
  earliestMoveIn?: string;
  address?: string;
}

// Search & Filter Types
export interface SearchFilters {
  location?: string;
  type?: PropertyType | 'all';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | 'all';
  nearbyAmenities?: string[];
  powerSupply?: string[];
  waterSupply?: string[];
}

// Rental Types
export type RentalStatus = 'active' | 'ended' | 'pending_signature' | 'cancelled' | 'expired';

export interface Rental {
  id: string;
  propertyId: string;
  landlordId: string;
  tenantId: string;
  type: 'rent' | 'buy';
  startDate: string;
  endDate: string;
  totalAmount: number;
  breakdownItems: BreakdownItem[];
  cautionFee: number;
  status: RentalStatus;
  receiptNumber?: string;
  agreementUrl?: string;
  renewedFrom?: string;
  renewedAt?: string;
  bidAccepted?: boolean;
  paymentHistory?: {
    id: string;
    amount: number;
    date: string;
    description: string;
    receiptNumber: string;
  }[];
  createdAt: string;
}

// Bidding Types
export interface Bid {
  id: string;
  propertyId: string;
  tenantId: string;
  amount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Message Types
export interface MessageReply {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Message {
  id: string;
  propertyId: string;
  rentalId?: string;
  senderId: string;
  recipientId: string;
  receiverId?: string; // For backward compatibility
  content: string;
  isRead: boolean;
  replies: MessageReply[];
  createdAt: string;
}

export type MessageType = 'general' | 'inquiry' | 'complaint';

// Notification Types
export type NotificationType = 'inspection' | 'rental' | 'message' | 'payment' | 'system';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  message: string;
  isActive: boolean;
  createdAt: string;
}

// Favorite Types
export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
}

// Solicitor Comment / Document Review
export interface SolicitorComment {
  id: string;
  inspectionId: string;
  solicitorId: string;
  comment: string;
  createdAt: string;
}

// Content Management
export interface ContentManagement {
  faq: { id: string; question: string; answer: string }[];
  aboutUs: string;
  termsAndConditions: string;
}

// App Settings
export interface AppSettings {
  maintenanceMode: boolean;
  maintenanceEndTime?: string;
  defaultInspectionFee: number;
  language: 'en' | 'pidgin' | 'yoruba' | 'hausa' | 'igbo';
}

// Screening Question
export interface ScreeningQuestion {
  id: string;
  question: string;
}

// Backward-compat alias used by store.ts
export type RentalAgreement = Rental;

// Property Form Data (for add/edit form)
export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  location: string;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  available: boolean;
  solicitorId: string | null;
  inspectionFee: number;
  whatsappEnabled: boolean;
  whatsappNumber: string;
  breakdownItems: BreakdownItem[];
  allowNegotiation: boolean;
  screeningQuestions: ScreeningQuestion[];
  security: string[];
  parking: string[];
  furnishing: string;
  petPolicy: string;
  outdoorSpace: string[];
  earliestMoveIn: string;
  landmark: string;
  address: string;
  nearbyAmenities?: string[];
  powerSupply?: string[];
  waterSupply?: string[];
  rentPeriod?: string;
}
