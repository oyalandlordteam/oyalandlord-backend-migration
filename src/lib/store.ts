import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============ TYPES ============

export type UserRole = 'tenant' | 'landlord' | 'solicitor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  isDeleted?: boolean;
  deletionReason?: string;
}

export interface Property {
  id: string;
  propertyCode: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  type: 'flat' | 'house' | 'self-contain' | 'mini-flat';
  bedrooms: number;
  furnished: boolean;
  amenities: string[];
  security: string[];
  parking: string[];
  outdoorSpace: string[];
  petPolicy: 'allowed' | 'not_allowed' | 'case_by_case';
  furnishing: 'furnished' | 'unfurnished' | 'semi-furnished';
  breakdownItems: BreakdownItem[];
  available: boolean;
  landlordId: string;
  isDeleted?: boolean;
  deletionReason?: string;
}

export interface BreakdownItem {
  name: string;
  amount: number;
}

export interface Inspection {
  id: string;
  propertyId: string;
  tenantId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Rental {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  status: 'active' | 'completed' | 'cancelled';
  rentAmount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Bid {
  id: string;
  propertyId: string;
  tenantId: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  propertyId?: string;
  rentalId?: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'inspection' | 'rental' | 'message' | 'system';
  read: boolean;
  createdAt: string;
}

export interface Favorite {
  userId: string;
  propertyId: string;
}

export interface PropertyReport {
  id: string;
  propertyId: string;
  reporterId: string;
  reason: 'misleading' | 'unavailable' | 'scam' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  isActive: boolean;
  createdAt: string;
}

export interface SolicitorComment {
  id: string;
  inspectionId: string;
  solicitorId: string;
  comment: string;
  createdAt: string;
}

export interface ContentManagement {
  faq: { id: string; question: string; answer: string }[];
  aboutUs: string;
  termsAndConditions: string;
}

export interface AppSettings {
  maintenanceMode: boolean;
  defaultInspectionFee: number;
  language: string;
}

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

// ============ AUTH STORE ============
interface AuthState {
  users: User[];
  currentUser: User | null;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  register: (name: string, email: string, role: UserRole) => Promise<User | null>;
  login: (email: string) => Promise<User | null>;
  logout: () => void;
  verifyUser: (id: string) => Promise<boolean>;
  deleteUser: (id: string, reason: string) => Promise<boolean>;
  getUserById: (id: string) => User | undefined;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        try {
          const res = await fetch('/api/users');
          if (!res.ok) throw new Error('Failed to fetch');
          const users = await res.json();
          set({ users, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize auth store:', error);
          set({ isInitialized: true });
        }
      },

      register: async (name, email, role) => {
        try {
          const res = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({ name, email, role }),
          });
          if (res.ok) {
            const newUser = await res.json();
            set({ users: [...get().users, newUser], currentUser: newUser });
            return newUser;
          }
          return null;
        } catch (error) {
          return null;
        }
      },

      login: async (email) => {
        try {
          const res = await fetch(`/api/users?email=${email}`);
          if (res.ok) {
            const user = await res.json();
            set({ currentUser: user });
            return user;
          }
          return null;
        } catch (error) {
          return null;
        }
      },

      logout: () => set({ currentUser: null }),

      verifyUser: async (id) => {
        try {
          const res = await fetch('/api/users', {
            method: 'PATCH',
            body: JSON.stringify({ id, isVerified: true }),
          });
          if (res.ok) {
            const updated = await res.json();
            const users = get().users.map(u => u.id === id ? updated : u);
            set({ users });
            if (get().currentUser?.id === id) {
              set({ currentUser: updated });
            }
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      deleteUser: async (id, reason) => {
        try {
          const res = await fetch('/api/users', {
            method: 'PATCH',
            body: JSON.stringify({ id, isDeleted: true, deletionReason: reason, isActive: false }),
          });
          if (res.ok) {
            const updated = await res.json();
            const users = get().users.map(u => u.id === id ? updated : u);
            set({ users });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      getUserById: (id) => get().users.find(u => u.id === id),
    }),
    {
      name: 'oyalandlord-auth',
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
);

// ============ PROPERTY STORE ============
interface PropertyState {
  properties: Property[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  getPropertyByCode: (code: string) => Property | undefined;
  getPropertyById: (id: string) => Property | undefined;
  getLandlordProperties: (landlordId: string) => Property[];
  createProperty: (data: Omit<Property, 'id' | 'propertyCode'>) => Promise<Property | null>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<boolean>;
  deleteProperty: (id: string, reason: string) => Promise<boolean>;
  restoreProperty: (id: string) => Promise<boolean>;
  permanentlyDeleteProperty: (id: string) => Promise<boolean>;
  getDeletedProperties: () => Property[];
}

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set, get) => ({
      properties: [],
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        try {
          const res = await fetch('/api/properties');
          if (!res.ok) throw new Error('Failed to fetch');
          const properties = await res.json();
          set({ properties, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize property store:', error);
          set({ isInitialized: true });
        }
      },

      getPropertyByCode: (code) => {
        return get().properties.find(p => p.propertyCode.toLowerCase() === code.toLowerCase());
      },

      getPropertyById: (id) => {
        return get().properties.find(p => p.id === id);
      },

      getLandlordProperties: (landlordId) => {
        return get().properties.filter(p => p.landlordId === landlordId && !p.isDeleted);
      },

      createProperty: async (data) => {
        try {
          const res = await fetch('/api/properties', {
            method: 'POST',
            body: JSON.stringify(data),
          });
          if (res.ok) {
            const newProperty = await res.json();
            set({ properties: [...get().properties, newProperty] });
            return newProperty;
          }
          return null;
        } catch (error) {
          return null;
        }
      },

      updateProperty: async (id, updates) => {
        try {
          const res = await fetch('/api/properties', {
            method: 'PATCH',
            body: JSON.stringify({ id, ...updates }),
          });
          if (res.ok) {
            const updated = await res.json();
            const properties = get().properties.map(p => p.id === id ? updated : p);
            set({ properties });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      deleteProperty: async (id, reason) => {
        try {
          const res = await fetch('/api/properties', {
            method: 'PATCH',
            body: JSON.stringify({ id, isDeleted: true, deletionReason: reason, available: false }),
          });
          if (res.ok) {
            const updated = await res.json();
            const properties = get().properties.map(p => p.id === id ? updated : p);
            set({ properties });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      restoreProperty: async (id) => {
        try {
          const res = await fetch('/api/properties', {
            method: 'PATCH',
            body: JSON.stringify({ id, isDeleted: false, deletionReason: null, available: true }),
          });
          if (res.ok) {
            const updated = await res.json();
            const properties = get().properties.map(p => p.id === id ? updated : p);
            set({ properties });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      permanentlyDeleteProperty: async (id) => {
        try {
          const res = await fetch(`/api/properties?id=${id}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            set({ properties: get().properties.filter(p => p.id !== id) });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      getDeletedProperties: () => {
        return get().properties.filter(p => p.isDeleted);
      },
    }),
    {
      name: 'oyalandlord-properties',
    }
  )
);

// ============ INSPECTION STORE ============
interface InspectionState {
  inspections: Inspection[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  getInspectionsByProperty: (propertyId: string) => Inspection[];
  getInspectionsByTenant: (tenantId: string) => Inspection[];
  getInspectionsByLandlord: (landlordId: string) => Inspection[];
  requestInspection: (propertyId: string, tenantId: string) => Promise<Inspection | null>;
  updateInspectionStatus: (id: string, status: 'approved' | 'rejected') => Promise<boolean>;
  getStats: () => { total: number; pending: number; approved: number; rejected: number };
}

export const useInspectionStore = create<InspectionState>()(
  persist(
    (set, get) => ({
      inspections: [],
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        try {
          const res = await fetch('/api/inspections');
          if (!res.ok) throw new Error('Failed to fetch');
          const inspections = await res.json();
          set({ inspections, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize inspection store:', error);
          set({ isInitialized: true });
        }
      },

      getInspectionsByProperty: (propertyId) => {
        return get().inspections.filter(i => i.propertyId === propertyId);
      },

      getInspectionsByTenant: (tenantId) => {
        return get().inspections.filter(i => i.tenantId === tenantId);
      },

      getInspectionsByLandlord: (landlordId) => {
        const properties = usePropertyStore.getState().getLandlordProperties(landlordId);
        const propertyIds = properties.map(p => p.id);
        return get().inspections.filter(i => propertyIds.includes(i.propertyId));
      },

      requestInspection: async (propertyId, tenantId) => {
        try {
          const res = await fetch('/api/inspections', {
            method: 'POST',
            body: JSON.stringify({ propertyId, tenantId }),
          });
          if (res.ok) {
            const newInspection = await res.json();
            set({ inspections: [...get().inspections, newInspection] });
            return newInspection;
          }
          return null;
        } catch (error) {
          return null;
        }
      },

      updateInspectionStatus: async (id, status) => {
        try {
          const res = await fetch('/api/inspections', {
            method: 'PATCH',
            body: JSON.stringify({ id, status }),
          });
          if (res.ok) {
            const updated = await res.json();
            const inspections = get().inspections.map(i => i.id === id ? updated : i);
            set({ inspections });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      getStats: () => {
        const inspections = get().inspections;
        return {
          total: inspections.length,
          pending: inspections.filter(i => i.status === 'pending').length,
          approved: inspections.filter(i => i.status === 'approved').length,
          rejected: inspections.filter(i => i.status === 'rejected').length,
        };
      },
    }),
    {
      name: 'oyalandlord-inspections',
    }
  )
);

// ============ RENTAL STORE ============
interface RentalState {
  rentals: Rental[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  getRentalsByTenant: (tenantId: string) => Rental[];
  getRentalsByLandlord: (landlordId: string) => Rental[];
  createRental: (data: Omit<Rental, 'id' | 'createdAt' | 'status'>) => Promise<Rental | null>;
  updateRentalStatus: (id: string, status: Rental['status']) => Promise<boolean>;
  getRentalById: (id: string) => Rental | undefined;
}

export const useRentalStore = create<RentalState>()(
  persist(
    (set, get) => ({
      rentals: [],
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        try {
          const res = await fetch('/api/rentals');
          if (!res.ok) throw new Error('Failed to fetch');
          const rentals = await res.json();
          set({ rentals, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize rental store:', error);
          set({ isInitialized: true });
        }
      },

      getRentalsByTenant: (tenantId) => {
        return get().rentals.filter(r => r.tenantId === tenantId);
      },

      getRentalsByLandlord: (landlordId) => {
        return get().rentals.filter(r => r.landlordId === landlordId);
      },

      createRental: async (data) => {
        try {
          const res = await fetch('/api/rentals', {
            method: 'POST',
            body: JSON.stringify(data),
          });
          if (res.ok) {
            const newRental = await res.json();
            set({ rentals: [...get().rentals, newRental] });
            return newRental;
          }
          return null;
        } catch (error) {
          return null;
        }
      },

      updateRentalStatus: async (id, status) => {
        try {
          const res = await fetch('/api/rentals', {
            method: 'PATCH',
            body: JSON.stringify({ id, status }),
          });
          if (res.ok) {
            const updated = await res.json();
            const rentals = get().rentals.map(r => r.id === id ? updated : r);
            set({ rentals });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      getRentalById: (id) => {
        return get().rentals.find(r => r.id === id);
      },
    }),
    {
      name: 'oyalandlord-rentals',
    }
  )
);

// ============ BID STORE ============
interface BidState {
  bids: Bid[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  getBidsByProperty: (propertyId: string) => Bid[];
  getBidsByTenant: (tenantId: string) => Bid[];
  hasBidOnProperty: (propertyId: string, tenantId: string) => boolean;
  createBid: (propertyId: string, tenantId: string, amount: number) => Promise<Bid | null>;
  updateBidStatus: (id: string, status: 'accepted' | 'rejected') => Promise<boolean>;
}

export const useBidStore = create<BidState>()(
  persist(
    (set, get) => ({
      bids: [],
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) {
          set({ bids: [], isInitialized: true });
          return;
        }

        try {
          const res = await fetch(`/api/bids?userId=${currentUser.id}`);
          if (!res.ok) throw new Error('Failed to fetch');
          const bids = await res.json();
          if (Array.isArray(bids)) {
            set({ bids, isInitialized: true });
          } else {
            set({ bids: [], isInitialized: true });
          }
        } catch (error) {
          console.error('Failed to initialize bid store:', error);
          set({ bids: [], isInitialized: true });
        }
      },

      getBidsByProperty: (propertyId) => {
        return get().bids.filter(b => b.propertyId === propertyId);
      },

      getBidsByTenant: (tenantId) => {
        return get().bids.filter(b => b.tenantId === tenantId);
      },

      hasBidOnProperty: (propertyId, tenantId) => {
        return get().bids.some(b => b.propertyId === propertyId && b.tenantId === tenantId);
      },

      createBid: async (propertyId, tenantId, amount) => {
        // Check if tenant has already bid on this property
        if (get().hasBidOnProperty(propertyId, tenantId)) {
          return null;
        }
        
        try {
          const res = await fetch('/api/bids', {
            method: 'POST',
            body: JSON.stringify({ propertyId, tenantId, amount }),
          });
          if (res.ok) {
            const newBid = await res.json();
            set({ bids: [...get().bids, newBid] });
            return newBid;
          }
          return null;
        } catch (error) {
          return null;
        }
      },

      updateBidStatus: async (id, status) => {
        try {
          const res = await fetch('/api/bids', {
            method: 'PATCH',
            body: JSON.stringify({ id, status }),
          });
          if (res.ok) {
            const updated = await res.json();
            const bids = get().bids.map(b => b.id === id ? updated : b);
            set({ bids });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },
    }),
    {
      name: 'oyalandlord-bids',
    }
  )
);

// ============ MESSAGE STORE ============
interface MessageState {
  messages: Message[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  getMessagesByUser: (userId: string) => Message[]; // Added to interface for completeness
  getMessagesBetweenUsers: (user1Id: string, user2Id: string, propertyId?: string) => Message[];
  createMessage: (senderId: string, receiverId: string, content: string, propertyId?: string, rentalId?: string) => Promise<Message | null>;
  markAsRead: (messageId: string) => Promise<boolean>;
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      messages: [],
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) {
          set({ messages: [], isInitialized: true });
          return;
        }

        try {
          const res = await fetch(`/api/messages?userId=${currentUser.id}`);
          if (!res.ok) throw new Error('Failed to fetch');
          const messages = await res.json();
          if (Array.isArray(messages)) {
            set({ messages, isInitialized: true });
          } else {
            set({ messages: [], isInitialized: true });
          }
        } catch (error) {
          console.error('Failed to initialize message store:', error);
          set({ messages: [], isInitialized: true });
        }
      },

      getMessagesByUser: (userId) => {
        return get().messages.filter(m => m.senderId === userId || m.receiverId === userId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      },

      getMessagesBetweenUsers: (user1Id, user2Id, propertyId) => {
        return get().messages.filter(m => 
          ((m.senderId === user1Id && m.receiverId === user2Id) || 
           (m.senderId === user2Id && m.receiverId === user1Id)) &&
          (!propertyId || m.propertyId === propertyId)
        ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      },

      createMessage: async (senderId, receiverId, content, propertyId, rentalId) => {
        try {
          const res = await fetch('/api/messages', {
            method: 'POST',
            body: JSON.stringify({ senderId, receiverId, content, propertyId, rentalId }),
          });
          if (res.ok) {
            const newMessage = await res.json();
            set({ messages: [...get().messages, newMessage] });
            return newMessage;
          }
          return null;
        } catch (error) {
          return null;
        }
      },

      markAsRead: async (messageId) => {
        try {
          const res = await fetch('/api/messages', {
            method: 'PATCH',
            body: JSON.stringify({ id: messageId, isRead: true }),
          });
          if (res.ok) {
            const updated = await res.json();
            const messages = get().messages.map(m => m.id === messageId ? updated : m);
            set({ messages });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },
    }),
    {
      name: 'oyalandlord-messages',
    }
  )
);

// ============ NOTIFICATION STORE ============
interface NotificationState {
  notifications: Notification[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  getNotificationsByUser: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
  createNotification: (data: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Promise<Notification | null>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: (userId: string) => Promise<boolean>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) {
          set({ notifications: [], isInitialized: true });
          return;
        }

        try {
          const res = await fetch(`/api/notifications?userId=${currentUser.id}`);
          if (!res.ok) throw new Error('Failed to fetch');
          
          const notifications = await res.json();
          if (Array.isArray(notifications)) {
            set({ notifications, isInitialized: true });
          } else {
            console.error('Expected array for notifications, got:', notifications);
            set({ notifications: [], isInitialized: true });
          }
        } catch (error) {
          console.error('Failed to initialize notification store:', error);
          set({ notifications: [], isInitialized: true });
        }
      },

      getNotificationsByUser: (userId) => {
        return get().notifications
          .filter(n => n.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getUnreadCount: (userId) => {
        return get().notifications.filter(n => n.userId === userId && !n.read).length;
      },

      createNotification: async (data) => {
        try {
          const res = await fetch('/api/notifications', {
            method: 'POST',
            body: JSON.stringify(data),
          });
          if (res.ok) {
            const newNotification = await res.json();
            set({ notifications: [...get().notifications, newNotification] });
            return newNotification;
          }
          return null;
        } catch (error) {
          return null;
        }
      },

      markAsRead: async (id) => {
        try {
          const res = await fetch('/api/notifications', {
            method: 'PATCH',
            body: JSON.stringify({ id, read: true }),
          });
          if (res.ok) {
            const updated = await res.json();
            const notifications = get().notifications.map(n => n.id === id ? updated : n);
            set({ notifications });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      markAllAsRead: async (userId) => {
        try {
          const res = await fetch('/api/notifications', {
            method: 'PATCH',
            body: JSON.stringify({ userId, all: true }),
          });
          if (res.ok) {
            const notifications = get().notifications.map(n => 
              n.userId === userId ? { ...n, read: true } : n
            );
            set({ notifications });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },
    }),
    {
      name: 'oyalandlord-notifications',
    }
  )
);

// ============ FAVORITES STORE ============
interface FavoriteState {
  favorites: Favorite[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  getFavoritesByUser: (userId: string) => Favorite[];
  isFavorite: (userId: string, propertyId: string) => boolean;
  addFavorite: (userId: string, propertyId: string) => Promise<Favorite | null>;
  removeFavorite: (userId: string, propertyId: string) => Promise<boolean>;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) {
          set({ favorites: [], isInitialized: true });
          return;
        }

        try {
          const res = await fetch(`/api/favorites?userId=${currentUser.id}`);
          if (!res.ok) throw new Error('Failed to fetch');
          const favorites = await res.json();
          if (Array.isArray(favorites)) {
            set({ favorites, isInitialized: true });
          } else {
            set({ favorites: [], isInitialized: true });
          }
        } catch (error) {
          console.error('Failed to initialize favorite store:', error);
          set({ favorites: [], isInitialized: true });
        }
      },

      getFavoritesByUser: (userId) => {
        return get().favorites.filter(f => f.userId === userId);
      },

      isFavorite: (userId, propertyId) => {
        return get().favorites.some(f => f.userId === userId && f.propertyId === propertyId);
      },

      addFavorite: async (userId, propertyId) => {
        try {
          const res = await fetch('/api/favorites', {
            method: 'POST',
            body: JSON.stringify({ userId, propertyId }),
          });
          if (res.ok) {
            const newFavorite = await res.json();
            set({ favorites: [...get().favorites, newFavorite] });
            return newFavorite;
          }
          return null;
        } catch (error) {
          return null;
        }
      },

      removeFavorite: async (userId, propertyId) => {
        try {
          const res = await fetch(`/api/favorites?userId=${userId}&propertyId=${propertyId}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            set({ favorites: get().favorites.filter(f => !(f.userId === userId && f.propertyId === propertyId)) });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },
    }),
    {
      name: 'oyalandlord-favorites',
    }
  )
);

// ============ REPORTS STORE ============
interface ReportState {
  reports: PropertyReport[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  getReportsByProperty: (propertyId: string) => PropertyReport[];
  getPendingReports: () => PropertyReport[];
  createReport: (data: Omit<PropertyReport, 'id' | 'createdAt' | 'status'>) => Promise<PropertyReport | null>;
  updateReportStatus: (id: string, status: PropertyReport['status']) => Promise<boolean>;
  getAllReports: () => PropertyReport[];
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [],
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        try {
          const res = await fetch('/api/reports');
          const reports = await res.json();
          set({ reports, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize report store:', error);
          set({ isInitialized: true });
        }
      },

      getReportsByProperty: (propertyId) => {
        return get().reports.filter(r => r.propertyId === propertyId);
      },

      getPendingReports: () => {
        return get().reports.filter(r => r.status === 'pending');
      },

      createReport: async (data) => {
        try {
          const res = await fetch('/api/reports', {
            method: 'POST',
            body: JSON.stringify(data),
          });
          if (res.ok) {
            const newReport = await res.json();
            set({ reports: [...get().reports, newReport] });
            return newReport;
          }
          return null;
        } catch (error) {
          return null;
        }
      },

      updateReportStatus: async (id, status) => {
        try {
          const res = await fetch('/api/reports', {
            method: 'PATCH',
            body: JSON.stringify({ id, status }),
          });
          if (res.ok) {
            const updated = await res.json();
            const reports = get().reports.map(r => r.id === id ? updated : r);
            set({ reports });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      getAllReports: () => {
        return get().reports;
      },
    }),
    {
      name: 'oyalandlord-reports',
    }
  )
);

// ============ ANNOUNCEMENTS STORE ============
interface AnnouncementState {
  announcements: Announcement[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  getActiveAnnouncements: () => Announcement[];
  createAnnouncement: (title: string, message: string) => Promise<Announcement | null>;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => Promise<boolean>;
  deleteAnnouncement: (id: string) => Promise<boolean>;
  getAllAnnouncements: () => Announcement[];
}

export const useAnnouncementStore = create<AnnouncementState>()(
  persist(
    (set, get) => ({
      announcements: [],
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        try {
          const res = await fetch('/api/announcements');
          const announcements = await res.json();
          set({ announcements, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize announcement store:', error);
          set({ isInitialized: true });
        }
      },

      getActiveAnnouncements: () => {
        return get().announcements.filter(a => a.isActive);
      },

      createAnnouncement: async (title, message) => {
        try {
          const res = await fetch('/api/announcements', {
            method: 'POST',
            body: JSON.stringify({ title, message }),
          });
          if (res.ok) {
            const newAnnouncement = await res.json();
            set({ announcements: [...get().announcements, newAnnouncement] });
            return newAnnouncement;
          }
          return null;
        } catch (error) {
          return null;
        }
      },

      updateAnnouncement: async (id, updates) => {
        try {
          const res = await fetch('/api/announcements', {
            method: 'PATCH',
            body: JSON.stringify({ id, ...updates }),
          });
          if (res.ok) {
            const updated = await res.json();
            const announcements = get().announcements.map(a => a.id === id ? updated : a);
            set({ announcements });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      deleteAnnouncement: async (id) => {
        try {
          const res = await fetch(`/api/announcements?id=${id}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            set({ announcements: get().announcements.filter(a => a.id !== id) });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      getAllAnnouncements: () => {
        return get().announcements;
      },
    }),
    {
      name: 'oyalandlord-announcements',
    }
  )
);

// ============ SOLICITOR COMMENT STORE ============
interface SolicitorCommentState {
  comments: SolicitorComment[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  getCommentsByInspection: (inspectionId: string) => SolicitorComment[];
  addComment: (inspectionId: string, solicitorId: string, comment: string) => Promise<SolicitorComment | null>;
}

export const useSolicitorCommentStore = create<SolicitorCommentState>()(
  persist(
    (set, get) => ({
      comments: [],
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        try {
          const res = await fetch('/api/solicitor-comments');
          const comments = await res.json();
          set({ comments, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize solicitor comments store:', error);
          set({ isInitialized: true });
        }
      },

      getCommentsByInspection: (inspectionId) => {
        return get().comments.filter(c => c.inspectionId === inspectionId);
      },

      addComment: async (inspectionId, solicitorId, comment) => {
        try {
          const res = await fetch('/api/solicitor-comments', {
            method: 'POST',
            body: JSON.stringify({ inspectionId, solicitorId, comment }),
          });
          if (res.ok) {
            const newComment = await res.json();
            set({ comments: [...get().comments, newComment] });
            return newComment;
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
    { name: 'oyalandlord-solicitor-comments' }
  )
);

// ============ CONTENT MANAGEMENT STORE ============
interface ContentState {
  content: ContentManagement;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  updateFaq: (faqItems: { id: string; question: string; answer: string }[]) => Promise<boolean>;
  updateAboutUs: (content: string) => Promise<boolean>;
  updateTerms: (content: string) => Promise<boolean>;
}

const defaultContent: ContentManagement = {
  faq: [
    { id: '1', question: 'How do I book an inspection?', answer: 'Search for a property you like, click View Details, and use the Book Inspection button.' },
    { id: '2', question: 'Do I pay an agent fee?', answer: 'No! Oyalandlord connects you directly to verified landlords, so there are absolutely no agent fees.' }
  ],
  aboutUs: 'Oyalandlord is a platform that connects verified landlords directly with tenants, eliminating exorbitant agent fees.',
  termsAndConditions: 'By using Oyalandlord, you agree to our terms of direct landlord-tenant connection...'
};

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      content: defaultContent,
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        try {
          const res = await fetch('/api/content');
          if (!res.ok) throw new Error('Failed to fetch');
          const data = await res.json();
          // The API returns the whole content object or defaults
          set({ content: { ...defaultContent, ...data }, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize content store:', error);
          set({ content: defaultContent, isInitialized: true });
        }
      },

      updateFaq: async (faq) => {
        try {
          const res = await fetch('/api/content', {
            method: 'POST',
            body: JSON.stringify({ key: 'faq', content: faq }),
          });
          if (res.ok) {
            const content = { ...get().content, faq };
            set({ content });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      updateAboutUs: async (aboutUs) => {
        try {
          const res = await fetch('/api/content', {
            method: 'POST',
            body: JSON.stringify({ key: 'aboutUs', content: aboutUs }),
          });
          if (res.ok) {
            const content = { ...get().content, aboutUs };
            set({ content });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      updateTerms: async (termsAndConditions) => {
        try {
          const res = await fetch('/api/content', {
            method: 'POST',
            body: JSON.stringify({ key: 'terms', content: termsAndConditions }),
          });
          if (res.ok) {
            const content = { ...get().content, termsAndConditions };
            set({ content });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },
    }),
    { name: 'oyalandlord-content' }
  )
);

// ============ APP SETTINGS STORE ============
interface SettingsState {
  settings: AppSettings;
  isInitialized: boolean;
  initialize: () => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  maintenanceMode: false,
  defaultInspectionFee: 5000,
  language: 'en',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        try {
          const res = await fetch('/api/settings');
          if (!res.ok) throw new Error('Failed to fetch');
          const settings = await res.json();
          set({ settings: { ...defaultSettings, ...settings }, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize settings store:', error);
          set({ settings: defaultSettings, isInitialized: true });
        }
      },

      updateSettings: async (updates) => {
        try {
          const res = await fetch('/api/settings', {
            method: 'PATCH',
            body: JSON.stringify(updates),
          });
          if (res.ok) {
            const settings = { ...get().settings, ...updates };
            set({ settings });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },
    }),
    { name: 'oyalandlord-settings' }
  )
);

// ============ HELPER FUNCTIONS ============

// Initialize all stores on client side
export const initializeStores = async () => {
  if (typeof window !== 'undefined') {
    await Promise.all([
      useAuthStore.getState().initialize(),
      usePropertyStore.getState().initialize(),
      useInspectionStore.getState().initialize(),
      useRentalStore.getState().initialize(),
      useBidStore.getState().initialize(),
      useMessageStore.getState().initialize(),
      useNotificationStore.getState().initialize(),
      useFavoriteStore.getState().initialize(),
      useReportStore.getState().initialize(),
      useAnnouncementStore.getState().initialize(),
      useSolicitorCommentStore.getState().initialize(),
      useContentStore.getState().initialize(),
      useSettingsStore.getState().initialize(),
    ]);
  }
};

// Calculate total package from breakdown items
export const calculateTotalPackage = (breakdownItems: BreakdownItem[] | undefined | null): number => {
  if (!breakdownItems || !Array.isArray(breakdownItems)) {
    return 0;
  }
  return breakdownItems.reduce((sum, item) => sum + (item.amount || 0), 0);
};

// Backward compatibility aliases
export const useBookingStore = useInspectionStore;

// Get dashboard stats for admin
export const getDashboardStats = (): DashboardStats => {
  const users = useAuthStore.getState().users;
  const properties = usePropertyStore.getState().properties;
  const inspectionStats = useInspectionStore.getState().getStats();
  const rentals = useRentalStore.getState().rentals;

  return {
    totalUsers: users.length,
    totalTenants: users.filter(u => u.role === 'tenant').length,
    totalLandlords: users.filter(u => u.role === 'landlord').length,
    totalSolicitors: users.filter(u => u.role === 'solicitor').length,
    unverifiedUsers: users.filter(u => !u.isVerified && (u.role === 'landlord' || u.role === 'solicitor')).length,
    totalProperties: properties.length,
    availableProperties: properties.filter(p => p.available).length,
    totalInspections: inspectionStats.total,
    pendingInspections: inspectionStats.pending,
    pendingReports: useReportStore.getState().getPendingReports().length,
  };
};
