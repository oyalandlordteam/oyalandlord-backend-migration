'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, 
  Property, 
  InspectionRequest, 
  InspectionStatus,
  SearchFilters, 
  UserRole,
  DashboardStats,
  BreakdownItem,
  RentalAgreement,
  RentalStatus,
  Bid,
  Message,
  MessageReply,
  Notification,
  PropertyReport,
  Announcement,
  Favorite,
} from './types';
import { 
  mockUsers, 
  mockProperties, 
  mockInspectionRequests, 
  mockRentalAgreements,
  mockBids,
  mockMessages,
  mockNotifications,
  mockReports,
  mockAnnouncements,
  mockFavorites,
  STORAGE_KEYS, 
  generateId,
  generateReceiptNumber,
  generatePropertyCode,
} from './mock-data';
import { AppSettings, ContentManagement, SolicitorComment } from './types';

// ============ AUTH STORE ============
interface AuthState {
  currentUser: User | null;
  users: User[];
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  initialize: () => Promise<void>;
  getSolicitors: () => User[];
  getUserById: (id: string) => User | undefined;
  getAllUsers: () => User[];
  updateUserStatus: (id: string, isActive: boolean) => Promise<boolean>;
  verifyUser: (id: string) => Promise<boolean>;
  deleteUser: (id: string, reason?: string) => Promise<boolean>;
  restoreUser: (id: string) => Promise<boolean>;
  permanentlyDeleteUser: (id: string) => Promise<boolean>;
  getUnverifiedUsers: () => User[];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        try {
          const response = await fetch('/api/users');
          const users = await response.json();
          
          set({ users, isInitialized: true });
          
          // Sync currentUser from localStorage but verify against DB
          const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
          if (storedCurrentUser) {
            const parsed = JSON.parse(storedCurrentUser);
            const userInDb = users.find((u: User) => u.id === parsed.id);
            if (userInDb && userInDb.isActive) {
              set({ currentUser: userInDb });
            } else {
              set({ currentUser: null });
              localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
            }
          }
        } catch (error) {
          console.error('Failed to initialize auth store:', error);
          set({ isInitialized: true });
        }
      },

      login: async (email, password) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          
          const result = await response.json();
          if (result.success) {
            set({ currentUser: result.user });
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(result.user));
            return { success: true, message: 'Login successful' };
          }
          return { success: false, message: result.message || 'Login failed' };
        } catch (error) {
          return { success: false, message: 'Server connection error' };
        }
      },

      register: async (name, email, password, role) => {
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, role }),
          });
          
          const result = await response.json();
          if (result.success) {
            set({ currentUser: result.user });
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(result.user));
            // Refresh user list
            const userListRes = await fetch('/api/users');
            const users = await userListRes.json();
            set({ users });
            return { success: true, message: 'Registration successful' };
          }
          return { success: false, message: result.message || 'Registration failed' };
        } catch (error) {
          return { success: false, message: 'Server connection error' };
        }
      },

      logout: () => {
        set({ currentUser: null });
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      },

      getSolicitors: () => {
        return get().users.filter(u => u.role === 'solicitor' && u.isActive);
      },

      getUserById: (id) => {
        return get().users.find(u => u.id === id);
      },

      getAllUsers: () => {
        return get().users;
      },

      updateUserStatus: async (id, isActive) => {
        try {
          const res = await fetch('/api/users', {
            method: 'PATCH',
            body: JSON.stringify({ id, isActive }),
          });
          if (res.ok) {
            const updatedUser = await res.json();
            const users = get().users.map(u => u.id === id ? { ...u, isActive } : u);
            set({ users });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      verifyUser: async (id) => {
        try {
          const res = await fetch('/api/users', {
            method: 'PATCH',
            body: JSON.stringify({ id, isVerified: true }),
          });
          if (res.ok) {
            const users = get().users.map(u => u.id === id ? { ...u, isVerified: true } : u);
            set({ users });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      deleteUser: async (id, reason) => {
        try {
          const res = await fetch(`/api/users?id=${id}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            const users = get().users.map(u => u.id === id ? { ...u, isDeleted: true, deletionReason: reason } : u);
            set({ users });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      restoreUser: async (id) => {
        try {
          const res = await fetch('/api/users', {
            method: 'PATCH',
            body: JSON.stringify({ id, isDeleted: false }),
          });
          if (res.ok) {
            const users = get().users.map(u => u.id === id ? { ...u, isDeleted: false } : u);
            set({ users });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      permanentlyDeleteUser: async (id) => {
        try {
          const res = await fetch(`/api/users?id=${id}&permanent=true`, {
            method: 'DELETE',
          });
          if (res.ok) {
            const users = get().users.filter(u => u.id !== id);
            set({ users });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      getUnverifiedUsers: () => {
        return get().users.filter(u => 
          (u.role === 'landlord' || u.role === 'solicitor') && !u.isVerified
        );
      },
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
  filters: SearchFilters;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  setFilters: (filters: SearchFilters) => void;
  getFilteredProperties: () => Property[];
  getPropertyById: (id: string) => Property | undefined;
  getPropertiesByLandlord: (landlordId: string) => Property[];
  getPropertiesBySolicitor: (solicitorId: string) => Property[];
  addProperty: (propertyData: Omit<Property, 'id' | 'landlordId' | 'createdAt' | 'updatedAt'>, landlordId: string) => Promise<Property | null>;
  updateProperty: (id: string, updates: Partial<Omit<Property, 'id' | 'landlordId' | 'createdAt'>>) => Promise<Property | null>;
  deleteProperty: (id: string, reason?: string) => Promise<boolean>;
  restoreProperty: (id: string) => Promise<boolean>;
  permanentlyDeleteProperty: (id: string) => Promise<boolean>;
  toggleAvailability: (id: string) => Promise<boolean>;
  toggleFeatured: (id: string) => Promise<boolean>;
  duplicateProperty: (id: string) => Promise<Property | null>;
  getAllProperties: () => Property[];
  getDeletedProperties: () => Property[];
  getStats: () => { total: number; available: number };
  incrementViewCount: (id: string) => Promise<void>;
  getPropertyByCode: (code: string) => Property | undefined;
}

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set, get) => ({
      properties: [],
      filters: {
        location: '',
        minPrice: undefined,
        maxPrice: undefined,
        type: 'all',
        bedrooms: 'all',
      },
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        try {
          const response = await fetch('/api/properties');
          const properties = await response.json();
          set({ properties, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize property store:', error);
          set({ isInitialized: true });
        }
      },

      setFilters: (filters) => {
        set({ filters });
      },

      getFilteredProperties: () => {
        const { properties, filters } = get();
        
        return properties.filter(p => {
          if (p.isDeleted) return false;
          if (!p.available) return false;
          
          if (filters.location && !p.location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
          }
          
          if (filters.minPrice !== undefined && p.price < filters.minPrice) {
            return false;
          }
          
          if (filters.maxPrice !== undefined && p.price > filters.maxPrice) {
            return false;
          }
          
          if (filters.type !== 'all' && p.type !== filters.type) {
            return false;
          }
          
          if (filters.bedrooms !== 'all' && p.bedrooms !== filters.bedrooms) {
            return false;
          }

          if (filters.nearbyAmenities && filters.nearbyAmenities.length > 0) {
            const hasAllAmenities = filters.nearbyAmenities.every(amenity => 
              p.nearbyAmenities?.includes(amenity)
            );
            if (!hasAllAmenities) return false;
          }

          if (filters.powerSupply && filters.powerSupply.length > 0) {
            const hasAnyPower = filters.powerSupply.some(power => 
              p.powerSupply?.includes(power)
            );
            if (!hasAnyPower) return false;
          }

          if (filters.waterSupply && filters.waterSupply.length > 0) {
            const hasAnyWater = filters.waterSupply.some(water => 
              p.waterSupply?.includes(water)
            );
            if (!hasAnyWater) return false;
          }
          
          return true;
        });
      },

      getPropertyById: (id) => {
        return get().properties.find(p => p.id === id);
      },

      getPropertiesByLandlord: (landlordId) => {
        return get().properties.filter(p => p.landlordId === landlordId && !p.isDeleted);
      },

      getPropertiesBySolicitor: (solicitorId) => {
        return get().properties.filter(p => p.solicitorId === solicitorId && !p.isDeleted);
      },

      getDeletedProperties: () => {
        return get().properties.filter(p => p.isDeleted);
      },

      addProperty: async (propertyData, landlordId) => {
        try {
          const propertyCode = propertyData.propertyCode || generatePropertyCode();
          const response = await fetch('/api/properties', {
            method: 'POST',
            body: JSON.stringify({ ...propertyData, landlordId, propertyCode }),
          });
          
          if (response.ok) {
            const newProperty = await response.json();
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
          const response = await fetch('/api/properties', {
            method: 'PATCH', // I'll update the API to handle PATCH with ID in body or use a dynamic route
            body: JSON.stringify({ id, ...updates }),
          });
          
          if (response.ok) {
            const updatedProperty = await response.json();
            const properties = get().properties.map(p => p.id === id ? updatedProperty : p);
            set({ properties });
            return updatedProperty;
          }
          return null;
        } catch (error) {
          return null;
        }
      },

      deleteProperty: async (id, reason) => {
        try {
          const res = await fetch(`/api/properties?id=${id}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            const properties = get().properties.map(p => 
              p.id === id ? { ...p, isDeleted: true, deletionReason: reason } : p
            );
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
            body: JSON.stringify({ id, isDeleted: false }),
          });
          if (res.ok) {
            const properties = get().properties.map(p => 
              p.id === id ? { ...p, isDeleted: false, deletionReason: undefined } : p
            );
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
          const res = await fetch(`/api/properties?id=${id}&permanent=true`, {
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

      toggleAvailability: async (id) => {
        const property = get().properties.find(p => p.id === id);
        if (!property) return false;
        return !!(await get().updateProperty(id, { available: !property.available }));
      },

      toggleFeatured: async (id) => {
        const property = get().properties.find(p => p.id === id);
        if (!property) return false;
        return !!(await get().updateProperty(id, { featured: !property.featured }));
      },

      duplicateProperty: async (id) => {
        const property = get().properties.find(p => p.id === id);
        if (!property) return null;
        
        const { id: _id, propertyCode: _pc, createdAt: _ca, updatedAt: _ua, ...rest } = property;
        const duplicatedData = {
          ...rest,
          title: `${rest.title} (Copy)`,
          available: false,
        };
        
        return get().addProperty(duplicatedData as unknown as Omit<Property, "id" | "landlordId" | "createdAt" | "updatedAt">, property.landlordId);
      },

      getAllProperties: () => {
        return get().properties.filter(p => !p.isDeleted);
      },

      getStats: () => {
        const properties = get().properties;
        return {
          total: properties.length,
          available: properties.filter(p => p.available).length,
        };
      },

      incrementViewCount: async (id) => {
        const property = get().properties.find(p => p.id === id);
        if (!property) return;
        await get().updateProperty(id, { viewCount: (property.viewCount || 0) + 1 });
      },
      
      getPropertyByCode: (code) => {
        if (!code) return undefined;
        const normalizedCode = code.trim().toUpperCase();
        return get().properties.find(p => p.propertyCode === normalizedCode || p.propertyCode === `OYA-${normalizedCode}`);
      },
    }),
    {
      name: 'oyalandlord-properties',
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);

// ============ INSPECTION STORE ============
interface InspectionState {
  inspectionRequests: InspectionRequest[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  getInspectionsByTenant: (tenantId: string) => InspectionRequest[];
  getInspectionsBySolicitor: (solicitorId: string) => InspectionRequest[];
  getInspectionsByLandlord: (landlordId: string) => InspectionRequest[];
  getPendingInspectionsBySolicitor: (solicitorId: string) => InspectionRequest[];
  getPendingInspectionsByLandlord: (landlordId: string) => InspectionRequest[];
  createInspectionRequest: (propertyId: string, tenantId: string, landlordId: string, date: string, time: string, notes?: string) => Promise<InspectionRequest | null>;
  updateInspectionStatus: (id: string, status: InspectionStatus) => Promise<boolean>;
  getInspectionById: (id: string) => InspectionRequest | undefined;
  getAllInspections: () => InspectionRequest[];
  deleteInspection: (id: string) => Promise<boolean>;
  getStats: () => { total: number; pending: number; approved: number; rejected: number };
}

export const useInspectionStore = create<InspectionState>()(
  persist(
    (set, get) => ({
      inspectionRequests: [],
      isInitialized: false,

      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        try {
          const res = await fetch('/api/inspections');
          const inspections = await res.json();
          set({ inspectionRequests: inspections, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize inspection store:', error);
          set({ isInitialized: true });
        }
      },

      getInspectionsByTenant: (tenantId) => {
        return get().inspectionRequests.filter(i => i.tenantId === tenantId);
      },

      getInspectionsBySolicitor: (solicitorId) => {
        const properties = usePropertyStore.getState().properties;
        const solicitorPropertyIds = properties
          .filter(p => p.solicitorId === solicitorId)
          .map(p => p.id);
        
        return get().inspectionRequests.filter(i => solicitorPropertyIds.includes(i.propertyId));
      },

      getInspectionsByLandlord: (landlordId) => {
        const properties = usePropertyStore.getState().properties;
        const landlordPropertyIds = properties
          .filter(p => p.landlordId === landlordId)
          .map(p => p.id);
        
        return get().inspectionRequests.filter(i => landlordPropertyIds.includes(i.propertyId));
      },

      getPendingInspectionsBySolicitor: (solicitorId) => {
        return get().getInspectionsBySolicitor(solicitorId).filter(i => i.status === 'pending');
      },

      getPendingInspectionsByLandlord: (landlordId) => {
        const { inspectionRequests } = get();
        const properties = usePropertyStore.getState().properties;
        
        return inspectionRequests.filter(i => {
          const property = properties.find(p => p.id === i.propertyId);
          return property?.landlordId === landlordId && 
                 !property.solicitorId && 
                 i.status === 'pending';
        });
      },

      createInspectionRequest: async (propertyId, tenantId, landlordId, date, time, notes) => {
        try {
          const res = await fetch('/api/inspections', {
            method: 'POST',
            body: JSON.stringify({ propertyId, tenantId, landlordId, date, time, notes }),
          });
          if (res.ok) {
            const newInspection = await res.json();
            set({ inspectionRequests: [...get().inspectionRequests, newInspection] });
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
            const inspectionRequests = get().inspectionRequests.map(i => i.id === id ? updated : i);
            set({ inspectionRequests });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      getInspectionById: (id) => {
        return get().inspectionRequests.find(i => i.id === id);
      },

      getAllInspections: () => {
        return get().inspectionRequests;
      },

      deleteInspection: async (id) => {
        try {
          const res = await fetch(`/api/inspections?id=${id}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            set({ inspectionRequests: get().inspectionRequests.filter(i => i.id !== id) });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      getStats: () => {
        const inspections = get().inspectionRequests;
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
  rentals: RentalAgreement[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  getRentalsByTenant: (tenantId: string) => RentalAgreement[];
  getRentalsByLandlord: (landlordId: string) => RentalAgreement[];
  getActiveRentalsByTenant: (tenantId: string) => RentalAgreement[];
  createRental: (data: Omit<RentalAgreement, 'id' | 'createdAt' | 'receiptNumber'>) => Promise<RentalAgreement | null>;
  updateRentalStatus: (id: string, status: RentalStatus) => Promise<boolean>;
  renewRental: (id: string, newEndDate: string) => Promise<RentalAgreement | null>;
  getRentalById: (id: string) => RentalAgreement | undefined;
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

      getActiveRentalsByTenant: (tenantId) => {
        return get().rentals.filter(r => r.tenantId === tenantId && r.status === 'active');
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

      renewRental: async (id, newEndDate) => {
        try {
          // This would ideally be a dedicated renewal endpoint, but I'll use a PATCH for simplicity here
          const res = await fetch('/api/rentals', {
            method: 'PATCH',
            body: JSON.stringify({ id, action: 'renew', newEndDate }),
          });
          if (res.ok) {
            const result = await res.json();
            // result might contain the new rental and the updated old rental
            // Refreshing the whole list is safer
            const refreshRes = await fetch('/api/rentals');
            const rentals = await refreshRes.json();
            set({ rentals });
            return result.newRental || null;
          }
          return null;
        } catch (error) {
          return null;
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
        
        try {
          const res = await fetch('/api/bids');
          const bids = await res.json();
          set({ bids, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize bid store:', error);
          set({ isInitialized: true });
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
        
        try {
          const res = await fetch('/api/messages');
          const messages = await res.json();
          set({ messages, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize message store:', error);
          set({ isInitialized: true });
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
        
        try {
          const res = await fetch('/api/notifications');
          const notifications = await res.json();
          set({ notifications, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize notification store:', error);
          set({ isInitialized: true });
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
        
        try {
          const res = await fetch('/api/favorites');
          const favorites = await res.json();
          set({ favorites, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize favorite store:', error);
          set({ isInitialized: true });
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
          const content = await res.json();
          set({ content: { ...defaultContent, ...content }, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize content store:', error);
          set({ isInitialized: true });
        }
      },

      updateFaq: async (faq) => {
        try {
          const res = await fetch('/api/content', {
            method: 'POST',
            body: JSON.stringify({ faq }),
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
            body: JSON.stringify({ aboutUs }),
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
            body: JSON.stringify({ termsAndConditions }),
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
          const settings = await res.json();
          set({ settings: { ...defaultSettings, ...settings }, isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize settings store:', error);
          set({ isInitialized: true });
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
