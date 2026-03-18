'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
<<<<<<< HEAD
import { 
  useAuthStore, 
  usePropertyStore, 
  useInspectionStore, 
  useRentalStore,
  useBidStore,
  useNotificationStore,
  useActivityStore
} from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Building2, 
  Calendar, 
  CreditCard, 
  MoreVertical,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Pencil,
  Trash2,
  Users,
  MessageSquare,
  TrendingUp,
  Gavel,
} from 'lucide-react';
=======
import { useAuthStore, usePropertyStore, useInspectionStore, useBidStore, useRentalStore, useNotificationStore } from '@/lib/store';
import { Property, PropertyType, Rental } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Home,
  MapPin,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Shield,
  Eye,
  Gavel,
  Copy,
  Banknote,
  FileText,
  Printer,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
<<<<<<< HEAD
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { ChatWindow } from '@/components/chat-window';

// Format price
=======
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { AlertCircle as AlertTriangle, MessageSquare } from 'lucide-react';
import { ChatWindow } from '@/components/chat-window';

// Format price in Nigerian Naira
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

<<<<<<< HEAD
// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function LandlordDashboard() {
  const { navigate } = useRouter();
  const { currentUser, getUserById } = useAuthStore();
  const { properties, deleteProperty } = usePropertyStore();
  const { 
    getInspectionsByLandlord, 
    approveInspection, 
    rejectInspection 
  } = useInspectionStore();
  const { getRentalsByLandlord } = useRentalStore();
  const { getBidsByLandlord, updateBidStatus } = useBidStore();
  const { addNotification } = useNotificationStore();
  const { addActivity } = useActivityStore();
  const { toast } = useToast();

  const [activeChat, setActiveChat] = useState<{ userId: string; propertyId?: string } | null>(null);

  const myProperties = properties.filter(p => p.landlordId === currentUser?.id);
  const inspections = getInspectionsByLandlord(currentUser?.id || '');
  const rentals = getRentalsByLandlord(currentUser?.id || '');
  const bids = getBidsByLandlord(currentUser?.id || '');

  // Statistics
  const totalRevenue = rentals.reduce((acc, r) => acc + r.totalAmount, 0);
  const activeRentals = rentals.filter(r => r.status === 'active').length;
  const pendingInspections = inspections.filter(i => i.status === 'pending').length;

  const handleApproveInspection = (inspectionId: string, tenantId: string, propertyTitle: string) => {
    approveInspection(inspectionId);
    addNotification(
      tenantId,
      'inspection_request',
      `Good news! Your inspection request for ${propertyTitle} has been approved.`,
      ''
    );
    addActivity(currentUser?.id || '', 'inspection_action', `Approved inspection for ${propertyTitle}`);
    toast({
      title: 'Inspection Approved',
      description: 'The prospective tenant has been notified.',
    });
  };

  const handleRejectInspection = (inspectionId: string, tenantId: string, propertyTitle: string) => {
    rejectInspection(inspectionId);
    addNotification(
      tenantId,
      'inspection_request',
      `Your inspection request for ${propertyTitle} was declined.`,
      ''
    );
    addActivity(currentUser?.id || '', 'inspection_action', `Declined inspection for ${propertyTitle}`);
    toast({
      title: 'Inspection Declined',
      variant: 'destructive',
    });
  };

  const handleBidAction = (bidId: string, tenantId: string, status: 'accepted' | 'rejected', amount: number) => {
    updateBidStatus(bidId, status);
    addNotification(
      tenantId,
      'new_bid',
      `Your offer of ${formatPrice(amount)} has been ${status} by the landlord.`,
      ''
    );
    toast({
      title: `Bid ${status}`,
    });
  };

  const handleDeleteProperty = (id: string, title: string) => {
    if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      deleteProperty(id);
      addActivity(currentUser?.id || '', 'property_deleted', `Deleted property: ${title}`);
      toast({
        title: 'Property Deleted',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container px-4 py-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Landlord Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your listings, inspections, and rentals.
          </p>
        </div>
        <Button onClick={() => navigate('landlord-property-form')} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
=======
// Property type labels
const propertyTypeLabels: Record<PropertyType, string> = {
  flat: 'Flat',
  house: 'House',
  duplex: 'Duplex',
  room: 'Room',
  studio: 'Studio',
  maisonette: 'Maisonette',
};

export default function LandlordDashboard() {
  const { currentUser, getUserById } = useAuthStore();
  const { getPropertiesByLandlord, deleteProperty, updateProperty } = usePropertyStore();
  const { getPendingInspectionsByLandlord, updateInspectionStatus } = useInspectionStore();
  const { getRentalsByLandlord, updateRentalStatus } = useRentalStore();
  const { createNotification } = useNotificationStore();
  const { navigate } = useRouter();
  const { toast } = useToast();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [inspectionToApprove, setInspectionToApprove] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<{ userId: string; propertyId?: string } | null>(null);

  // Agreement dialog state
  const [agreementRental, setAgreementRental] = useState<Rental | null>(null);
  const [customRent, setCustomRent] = useState('');
  const [customCaution, setCustomCaution] = useState('');

  const myProperties = getPropertiesByLandlord(currentUser?.id || '');
  const pendingInspections = getPendingInspectionsByLandlord(currentUser?.id || '');
  const activeRentals = getRentalsByLandlord(currentUser?.id || '').filter((r: Rental) => r.status === 'active');
  
  const { bids, updateBidStatus } = useBidStore();
  const pendingBids = bids.filter(b => 
    b.status === 'pending' && 
    myProperties.some(p => p.id === b.propertyId)
  );

  const handleDeleteProperty = () => {
    if (propertyToDelete) {
      deleteProperty(propertyToDelete.id);
      toast({
        title: 'Property deleted',
        description: 'The property has been removed from your listings.',
      });
      setPropertyToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleToggleAvailability = (property: Property) => {
    updateProperty(property.id, { available: !property.available });
    toast({
      title: property.available ? 'Property marked as rented' : 'Property marked as available',
      description: property.available 
        ? 'The property is now marked as unavailable for inspection.' 
        : 'The property is now available for inspection.',
    });
  };

  const handleInspectionAction = (inspectionId: string, action: 'approved' | 'rejected') => {
    updateInspectionStatus(inspectionId, action);
    toast({
      title: action === 'approved' ? 'Inspection approved' : 'Inspection rejected',
      description: `The inspection request has been ${action}.`,
    });
    setInspectionToApprove(null);
  };

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in slide-in-from-top-4 duration-700">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Welcome, {currentUser?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-lg font-bold text-muted-foreground max-w-2xl">
            Streamline your property management and oversee inspection requests with precision.
          </p>
        </div>
        <Button 
          onClick={() => navigate('landlord-add-property')}
          className="h-12 px-6 text-lg font-extrabold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus className="mr-2 h-5 w-5 stroke-[3px]" />
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
          Add New Property
        </Button>
      </div>

<<<<<<< HEAD
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold tracking-tight">{formatPrice(totalRevenue)}</h3>
              <p className="text-xs text-muted-foreground mt-1">Life-time earnings</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">Properties</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-bold">{myProperties.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Listed properties</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Rentals</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-bold">{activeRentals}</div>
            <p className="text-xs text-muted-foreground mt-1">Current tenants</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-bold">{pendingInspections}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
=======
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="font-bold">Overview</TabsTrigger>
          <TabsTrigger value="offers" className="font-bold">Offers & Bids
            {pendingBids.length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-emerald-500">{pendingBids.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rentals" className="font-bold">Rentals & Agreements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-10 animate-in fade-in duration-500">
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-700 delay-100">
        <Card className="dark:bg-white/5 dark:border-white/10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Total Properties</CardDescription>
            <CardTitle className="text-4xl font-extrabold mt-1">{myProperties.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Listed property assets
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-white/5 dark:border-white/10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-emerald-500/5 rounded-full group-hover:bg-emerald-500/10 transition-colors" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Available</CardDescription>
            <CardTitle className="text-4xl font-extrabold mt-1">{myProperties.filter(p => p.available).length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500/80">Ready for inspection</span>
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-white/5 dark:border-white/10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-blue-500/5 rounded-full group-hover:bg-blue-500/10 transition-colors" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Rented Out</CardDescription>
            <CardTitle className="text-4xl font-extrabold mt-1">{myProperties.filter(p => !p.available).length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              <Home className="h-4 w-4 text-blue-500" />
              Currently occupied
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-white/5 dark:border-white/10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-amber-500/5 rounded-full group-hover:bg-amber-500/10 transition-colors" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Pending Requests</CardDescription>
            <CardTitle className="text-4xl font-extrabold mt-1">{pendingInspections.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Awaiting your action
            </p>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
          </CardContent>
        </Card>
      </div>

<<<<<<< HEAD
      <Tabs defaultValue="properties" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="properties">My Properties</TabsTrigger>
          <TabsTrigger value="inspections">Inspection Requests {pendingInspections > 0 && (
            <Badge className="ml-2 bg-primary text-white hover:bg-primary">{pendingInspections}</Badge>
          )}</TabsTrigger>
          <TabsTrigger value="offers">Offers/Bids {bids.filter(b => b.status === 'pending').length > 0 && (
            <Badge className="ml-2 bg-orange-500">{bids.filter(b => b.status === 'pending').length}</Badge>
          )}</TabsTrigger>
          <TabsTrigger value="rentals">Active Rentals</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-6">
          {myProperties.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold">No properties listed</h3>
              <p className="text-muted-foreground mb-6">Start earning by listing your first property.</p>
              <Button onClick={() => navigate('landlord-property-form')}>List Your First Property</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden group">
                  <div className="aspect-[16/10] relative">
                    <img
                      src={property.images[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800'}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge className={property.available ? "bg-green-600" : "bg-destructive text-white"}>
                        {property.available ? 'Available' : 'Rented'}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg truncate">{property.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate('landlord-property-form', { id: property.id })}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Property
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('tenant-property', { id: property.id })}>
                            <Eye className="mr-2 h-4 w-4" />
                            View as Tenant
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteProperty(property.id, property.title)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <p className="text-xl font-bold text-primary">{formatPrice(property.price)}</p>
                  </CardContent>
                  <CardFooter className="px-4 py-3 bg-muted/30 flex justify-between">
                    <div className="flex gap-4 text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {rentals.filter(r => r.propertyId === property.id && r.status === 'active').length} active
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {inspections.filter(i => i.propertyId === property.id && i.status === 'pending').length} pending
                      </span>
                    </div>
                    {property.available && (
                       <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-green-600 border-green-200">
                        Live
                      </Badge>
                    )}
                  </CardFooter>
=======
      {/* Pending Inspection Requests (if any) */}
      {pendingInspections.length > 0 && (
        <Card className="animate-in slide-in-from-left-4 duration-700 delay-200 border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-amber-600 dark:text-amber-400 text-2xl font-extrabold">
              <Clock className="h-6 w-6 stroke-[2.5px]" />
              Urgent Verifications
            </CardTitle>
            <CardDescription className="text-sm font-bold opacity-80">
              Direct inspection requests requiring your immediate decision.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-amber-500/20 hover:bg-transparent">
                  <TableHead className="font-extrabold text-amber-700/80 dark:text-amber-400/80">Property</TableHead>
                  <TableHead className="font-extrabold text-amber-700/80 dark:text-amber-400/80">Tenant</TableHead>
                  <TableHead className="font-extrabold text-amber-700/80 dark:text-amber-400/80">Date Requested</TableHead>
                  <TableHead className="text-right font-extrabold text-amber-700/80 dark:text-amber-400/80">Decisions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInspections.map((inspection) => {
                  const property = usePropertyStore.getState().getPropertyById(inspection.propertyId);
                  const tenant = getUserById(inspection.tenantId);
                  
                  if (!property) return null;
                  
                  return (
                    <TableRow key={inspection.id} className="border-amber-500/10 hover:bg-amber-500/5 transition-colors">
                      <TableCell>
                        <div className="py-2">
                          <div className="flex items-center gap-2">
                            <p className="font-extrabold text-base">{property.title}</p>
                            <Badge className="font-black h-5 text-[10px] bg-primary text-primary-foreground border-none">
                              {property.propertyCode}
                            </Badge>
                          </div>
                          <p className="text-sm font-bold text-muted-foreground flex items-center gap-1 mt-0.5 opacity-80">
                            <MapPin className="h-3 w-3" />
                            {property.location}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">{tenant?.name || 'Unknown'}</TableCell>
                      <TableCell className="font-bold text-[#008751] text-lg">
                        {new Date(inspection.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-3">
                          <Button 
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-700 font-extrabold px-4"
                            onClick={() => handleInspectionAction(inspection.id, 'approved')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="font-extrabold px-4"
                            onClick={() => handleInspectionAction(inspection.id, 'rejected')}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Pending Bids/Offers (if any) */}
      {pendingBids.length > 0 && (
        <Card className="animate-in slide-in-from-left-4 duration-700 delay-250 border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-2xl font-extrabold">
              <Banknote className="h-6 w-6 stroke-[2.5px]" />
              Property Offers & Bids
            </CardTitle>
            <CardDescription className="text-sm font-bold opacity-80">
              Prospective tenants have made offers on your properties.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-emerald-500/20 hover:bg-transparent">
                  <TableHead className="font-extrabold text-emerald-700/80 dark:text-emerald-400/80">Property</TableHead>
                  <TableHead className="font-extrabold text-emerald-700/80 dark:text-emerald-400/80">Tenant</TableHead>
                  <TableHead className="font-extrabold text-emerald-700/80 dark:text-emerald-400/80">Offer Amount</TableHead>
                  <TableHead className="text-right font-extrabold text-emerald-700/80 dark:text-emerald-400/80">Decisions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingBids.map((bid) => {
                  const property = usePropertyStore.getState().getPropertyById(bid.propertyId);
                  const tenant = getUserById(bid.tenantId);
                  
                  if (!property) return null;
                  
                  return (
                    <TableRow key={bid.id} className="border-emerald-500/10 hover:bg-emerald-500/5 transition-colors">
                      <TableCell>
                        <div className="py-2">
                          <div className="flex items-center gap-2">
                            <p className="font-extrabold text-base">{property.title}</p>
                            <Badge className="font-black h-5 text-[10px] bg-primary text-primary-foreground border-none">
                              {property.propertyCode}
                            </Badge>
                          </div>
                          <p className="text-sm font-bold text-muted-foreground flex items-center gap-1 mt-0.5 opacity-80">
                            <MapPin className="h-3 w-3" />
                            {property.location}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">{tenant?.name || 'Unknown'}</TableCell>
                      <TableCell className="font-bold text-[#008751] text-lg">
                        {formatPrice(bid.amount)}
                        <span className="text-xs text-muted-foreground font-normal ml-2 line-through">
                          {formatPrice(property.price)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-3">
                          <Button 
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-700 font-extrabold px-4"
                            onClick={() => {
                              updateBidStatus(bid.id, 'accepted');
                              toast({ title: 'Offer Accepted', description: 'The tenant will be notified.' });
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="font-extrabold px-4"
                            onClick={() => {
                              updateBidStatus(bid.id, 'rejected');
                              toast({ title: 'Offer Declined', description: 'The tenant will be notified.' });
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* My Properties */}
      <Card className="animate-in slide-in-from-bottom-4 duration-700 delay-300 dark:bg-white/5 dark:border-white/10 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div>
            <CardTitle className="text-2xl font-extrabold">Portfolio Assets</CardTitle>
            <CardDescription className="text-sm font-bold opacity-80">
              Real-time oversight of your listed properties and their performance.
            </CardDescription>
          </div>
          <div className="hidden sm:block">
             <Badge variant="outline" className="font-extrabold border-primary/30 text-primary bg-primary/5 uppercase tracking-tighter">
               {myProperties.length} LISTINGS
             </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {myProperties.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first property listing
              </p>
              <Button onClick={() => navigate('landlord-add-property')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Property
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {myProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden dark:bg-black/30 dark:border-white/10 group hover:border-primary/50 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row">
                    {/* Property Image */}
                    <div className="lg:w-64 h-48 lg:h-auto shrink-0 relative overflow-hidden">
                      {property.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Home className="h-12 w-12 text-muted-foreground opacity-30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                      <div className="absolute bottom-3 left-3 lg:hidden">
                        <Badge variant="secondary" className="font-extrabold">{propertyTypeLabels[property.type]}</Badge>
                      </div>
                    </div>
                    
                    {/* Property Details */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge variant="secondary" className="font-extrabold hidden lg:inline-flex">{propertyTypeLabels[property.type]}</Badge>
                          <Badge 
                            variant={property.available ? 'default' : 'destructive'} 
                            className={cn(
                              "font-extrabold px-3 py-0.5",
                              property.available ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                            )}
                          >
                            {property.available ? 'Listing Active' : 'Occupied'}
                          </Badge>
                          {property.solicitorId && (
                            <Badge variant="outline" className="text-[#008751] bg-[#008751]/5 border-[#008751]/30 font-extrabold">
                              <Shield className="h-3 w-3 mr-1.5 stroke-[3px]" />
                              Verified Asset
                            </Badge>
                          )}
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-black px-3 py-1">
                            CODE: {property.propertyCode}
                          </Badge>
                        </div>
                        <h3 className="font-extrabold text-2xl tracking-tight mb-1 group-hover:text-primary transition-colors">{property.title}</h3>
                        <p className="text-sm font-bold text-muted-foreground flex items-center gap-1.5 opacity-80">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {property.location}
                          {property.landmark && (
                            <span className="flex items-center before:content-['•'] before:mx-1.5 italic font-medium">
                              Near {property.landmark}
                            </span>
                          )}
                        </p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                           <div className="space-y-1">
                             <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Pricing</p>
                             <p className="text-lg font-extrabold text-[#008751] truncate">
                               {formatPrice(property.price)}<span className="text-[10px] ml-1 opacity-70">/yr</span>
                             </p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Views</p>
                             <p className="text-lg font-extrabold flex items-center gap-1.5">
                               <Eye className="h-4 w-4 text-blue-500" />
                               {property.viewCount || 0}
                             </p>
                           </div>
                           <div className="space-y-1">
                             <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Negotiable</p>
                             <p className="text-lg font-extrabold flex items-center gap-1.5 uppercase text-xs tracking-tighter">
                               {property.allowNegotiation ? (
                                 <span className="text-emerald-500 flex items-center gap-1"><Gavel className="h-4 w-4" /> YES</span>
                               ) : (
                                 <span className="text-muted-foreground/50">Fixed</span>
                               )}
                             </p>
                           </div>
                           <div className="space-y-1">
                             <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Actions</p>
                             <div className="flex gap-2">
                                 <Button 
                                   variant="outline" 
                                   size="icon" 
                                   className="h-8 w-8 rounded-lg border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/50 transition-all"
                                   onClick={() => setActiveChat({ userId: 'user-tenant-1', propertyId: property.id })}
                                 >
                                   <MessageSquare className="h-4 w-4" />
                                 </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-lg border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/50 transition-all"
                                  onClick={() => navigate('landlord-edit-property', { id: property.id })}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-white/10 bg-white/5">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="dark:bg-[#121212] dark:border-white/10 font-bold">
                                    <DropdownMenuItem onClick={() => handleToggleAvailability(property)}>
                                      {property.available ? (
                                        <>
                                          <XCircle className="mr-2 h-4 w-4 text-rose-500" />
                                          Mark as Rented
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                                          Mark as Available
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="dark:bg-white/5" />
                                    <DropdownMenuItem onClick={() => {
                                      const newProp = usePropertyStore.getState().duplicateProperty(property.id);
                                      if (newProp) {
                                        toast({ title: 'Listing Duplicated', description: 'A copy has been added to your portfolio.' });
                                      }
                                    }}>
                                      <Copy className="mr-2 h-4 w-4" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="dark:bg-white/5" />
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setPropertyToDelete(property);
                                        setDeleteDialogOpen(true);
                                      }}
                                      className="text-rose-500 focus:text-rose-400"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete Listing
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                </Card>
              ))}
            </div>
          )}
<<<<<<< HEAD
        </TabsContent>

        <TabsContent value="inspections">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Requests</CardTitle>
              <CardDescription>View and manage prospective tenant inspection requests.</CardDescription>
            </CardHeader>
            <CardContent>
              {inspections.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No inspection requests yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {inspections.map((inspection) => {
                    const property = properties.find(p => p.id === inspection.propertyId);
                    const tenant = getUserById(inspection.tenantId);
                    if (!property || !tenant) return null;

                    return (
                      <div key={inspection.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-xl gap-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {tenant.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold">{tenant.name}</p>
                            <p className="text-sm text-muted-foreground font-medium">
                              Interested in <span className="text-foreground">{property.title}</span>
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {inspection.date ? formatDate(inspection.date) : 'Flexible Date'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {formatDate(inspection.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                          {inspection.status === 'pending' ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 md:flex-none"
                                onClick={() => handleRejectInspection(inspection.id, tenant.id, property.title)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                              <Button 
                                size="sm" 
                                className="flex-1 md:flex-none"
                                onClick={() => handleApproveInspection(inspection.id, tenant.id, property.title)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setActiveChat({ userId: tenant.id, propertyId: property.id })}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Badge className={
                              inspection.status === 'approved' 
                                ? "bg-green-600" 
                                : "bg-destructive text-white"
                            }>
                              {inspection.status.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle>Price Negotiations</CardTitle>
              <CardDescription>Prospective tenants making offers on your properties.</CardDescription>
            </CardHeader>
            <CardContent>
              {bids.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No offers yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {bids.map((bid) => {
                    const property = properties.find(p => p.id === bid.propertyId);
                    const tenant = getUserById(bid.tenantId);
                    if (!property || !tenant) return null;

                    return (
                      <div key={bid.id} className="p-4 border rounded-xl hover:shadow-sm transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center">
                              <Gavel className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                <p className="font-bold text-lg">{formatPrice(bid.amount)}</p>
                                <Badge variant="outline" className="text-[10px] font-bold">
                                  {Math.round((bid.amount / property.price - 1) * 100)}% of asking
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Offer from <span className="font-semibold text-foreground">{tenant.name}</span> for {property.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Original Price: {formatPrice(property.price)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {bid.status === 'pending' ? (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleBidAction(bid.id, tenant.id, 'rejected', bid.amount)}
                                >
                                  Decline
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleBidAction(bid.id, tenant.id, 'accepted', bid.amount)}
                                >
                                  Accept Offer
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setActiveChat({ userId: tenant.id, propertyId: property.id })}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                               <Badge className={
                                bid.status === 'accepted' ? "bg-green-600" : "bg-destructive text-white"
                              }>
                                {bid.status.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rentals">
          <Card>
            <CardHeader>
              <CardTitle>Active Rentals</CardTitle>
              <CardDescription>Your current tenants and rental agreements.</CardDescription>
            </CardHeader>
            <CardContent>
              {rentals.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No active rentals.
                </div>
              ) : (
                <div className="rounded-xl border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rentals.map((rental) => {
                        const property = properties.find(p => p.id === rental.propertyId);
                        const tenant = getUserById(rental.tenantId);
                        if (!property || !tenant) return null;

                        return (
                          <TableRow key={rental.id} className="hover:bg-muted/20">
                            <TableCell className="font-semibold">{tenant.name}</TableCell>
                            <TableCell className="text-sm font-medium">{property.title}</TableCell>
                            <TableCell>
                              <Badge className={rental.status === 'active' ? "bg-green-600" : "secondary"}>
                                {rental.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{new Date(rental.startDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-sm">{new Date(rental.endDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => setActiveChat({ userId: tenant.id, propertyId: property.id })}>
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => navigate('tenant-property', { id: property.id })}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

=======
        </CardContent>
      </Card>
      </TabsContent>
      
      <TabsContent value="offers" className="space-y-6 animate-in fade-in duration-500">
        <Card className="dark:bg-white/5 dark:border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold flex items-center gap-2">
              <Banknote className="h-6 w-6 text-primary" />
              Offers & Bids
            </CardTitle>
            <CardDescription className="text-sm font-bold opacity-80">
              Manage price negotiations and offers from prospective tenants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingBids.length === 0 ? (
               <div className="text-center py-12">
                 <Gavel className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                 <h3 className="text-lg font-semibold mb-2">No Pending Offers</h3>
                 <p className="text-muted-foreground">You currently have no new offers on your properties.</p>
               </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-extrabold">Property</TableHead>
                    <TableHead className="font-extrabold">Tenant</TableHead>
                    <TableHead className="font-extrabold">Offer Amount</TableHead>
                    <TableHead className="text-right font-extrabold">Decisions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingBids.map((bid) => {
                    const property = usePropertyStore.getState().getPropertyById(bid.propertyId);
                    const tenant = getUserById(bid.tenantId);
                    if (!property) return null;
                    return (
                      <TableRow key={bid.id}>
                        <TableCell>
                          <div className="font-extrabold">{property.title}</div>
                          <div className="text-xs text-muted-foreground">{property.location}</div>
                        </TableCell>
                        <TableCell className="font-bold">{tenant?.name || 'Unknown'}</TableCell>
                        <TableCell className="font-bold text-[#008751]">
                          {formatPrice(bid.amount)}
                          <div className="text-xs text-muted-foreground line-through">{formatPrice(property.price)}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => {
                              updateBidStatus(bid.id, 'accepted');
                              toast({ title: 'Offer Accepted', description: 'Tenant notified.' });
                            }}>Accept</Button>
                            <Button size="sm" variant="destructive" onClick={() => {
                              updateBidStatus(bid.id, 'rejected');
                              toast({ title: 'Offer Declined', description: 'Tenant notified.' });
                            }}>Decline</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rentals" className="space-y-6 animate-in fade-in duration-500">
        <Card className="dark:bg-white/5 dark:border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Rentals & Agreements
            </CardTitle>
            <CardDescription className="text-sm font-bold opacity-80">
              Manage active rental agreements and generate contracts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeRentals.length === 0 ? (
               <div className="text-center py-12">
                 <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                 <h3 className="text-lg font-semibold mb-2">No Active Rentals</h3>
                 <p className="text-muted-foreground mb-4">You have no active rental agreements at the moment.</p>
                 <Button onClick={() => document.querySelector<HTMLButtonElement>('[value="overview"]')?.click()}>
                   Review Pending Inspections
                 </Button>
               </div>
            ) : (
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead className="font-extrabold">Property</TableHead>
                     <TableHead className="font-extrabold">Tenant</TableHead>
                     <TableHead className="font-extrabold">Dates</TableHead>
                     <TableHead className="font-extrabold">Amount</TableHead>
                     <TableHead className="text-right font-extrabold">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {activeRentals.map((rental: Rental) => {
                     const property = usePropertyStore.getState().getPropertyById(rental.propertyId);
                     const tenant = getUserById(rental.tenantId);
                     if (!property) return null;
                     return (
                       <TableRow key={rental.id}>
                         <TableCell>
                           <div className="font-extrabold">{property.title}</div>
                           <div className="text-xs text-muted-foreground">{property.propertyCode}</div>
                         </TableCell>
                         <TableCell className="font-bold">{tenant?.name || 'Unknown'}</TableCell>
                         <TableCell>
                           <div className="text-sm">
                             {new Date(rental.startDate).toLocaleDateString('en-GB')} - {new Date(rental.endDate).toLocaleDateString('en-GB')}
                           </div>
                         </TableCell>
                         <TableCell className="font-bold text-[#008751]">
                           {formatPrice(rental.totalAmount)}
                           <div className="text-xs font-normal text-muted-foreground capitalize">{rental.type}</div>
                         </TableCell>
                         <TableCell className="text-right">
                            <Button size="sm" variant="outline" onClick={() => {
                              setAgreementRental(rental);
                              setCustomRent(String(rental.totalAmount));
                              setCustomCaution(String(rental.cautionFee));
                            }}>
                              <FileText className="h-4 w-4 mr-2" />
                              Agreement
                            </Button>
                         </TableCell>
                       </TableRow>
                     );
                   })}
                 </TableBody>
               </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Property
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{propertyToDelete?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProperty}>
              Delete Property
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Rental Agreement Dialog */}
      {agreementRental && (() => {
        const prop = usePropertyStore.getState().getPropertyById(agreementRental.propertyId);
        const tenant = getUserById(agreementRental.tenantId);
        const rentAmount = parseFloat(customRent) || agreementRental.totalAmount;
        const cautionAmount = parseFloat(customCaution) || agreementRental.cautionFee;
        const startDate = new Date(agreementRental.startDate).toLocaleDateString('en-NG', { year:'numeric', month:'long', day:'numeric' });
        const endDate = new Date(agreementRental.endDate).toLocaleDateString('en-NG', { year:'numeric', month:'long', day:'numeric' });
        return (
          <Dialog open={!!agreementRental} onOpenChange={(open) => !open && setAgreementRental(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Rental Agreement
                </DialogTitle>
                <DialogDescription>
                  Review and customise the agreement before sending to tenant.
                </DialogDescription>
              </DialogHeader>

              {/* Editable fields */}
              <div className="grid sm:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="agr-rent">Total Rent (₦)</Label>
                  <Input
                    id="agr-rent"
                    type="number"
                    value={customRent}
                    onChange={(e) => setCustomRent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agr-caution">Caution Fee (₦)</Label>
                  <Input
                    id="agr-caution"
                    type="number"
                    value={customCaution}
                    onChange={(e) => setCustomCaution(e.target.value)}
                  />
                </div>
              </div>

              {/* Printable agreement block */}
              <div id="agreement-print-area" className="border rounded-lg p-6 space-y-4 text-sm bg-white dark:bg-black/40 print:shadow-none">
                <div className="text-center border-b pb-4">
                  <h2 className="text-xl font-bold">TENANCY AGREEMENT</h2>
                  <p className="text-muted-foreground text-xs mt-1">Oyalandlord Platform — Direct Landlord Connection</p>
                </div>

                <p>This Tenancy Agreement is made between:</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">LANDLORD</p>
                    <p className="font-semibold">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">TENANT</p>
                    <p className="font-semibold">{tenant?.name || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">{tenant?.email}</p>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">PROPERTY</p>
                  <p className="font-semibold">{prop?.title}</p>
                  <p className="text-xs text-muted-foreground">{prop?.location}{prop?.address ? ` — ${prop.address}` : ''}</p>
                  <p className="text-xs text-muted-foreground">Property Code: {prop?.propertyCode}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">TENANCY PERIOD</p>
                    <p className="text-xs">{startDate} — {endDate}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">FINANCIALS</p>
                    <p className="text-xs">Annual Rent: <span className="font-bold text-primary">{formatPrice(rentAmount)}</span></p>
                    <p className="text-xs">Caution Fee: <span className="font-bold">{formatPrice(cautionAmount)}</span> (refundable)</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-2 border-t pt-4">
                  <p>1. The tenant agrees to pay the annual rent of <strong>{formatPrice(rentAmount)}</strong> and a refundable caution fee of <strong>{formatPrice(cautionAmount)}</strong>.</p>
                  <p>2. The tenant shall use the property solely for residential purposes and maintain it in good condition.</p>
                  <p>3. Either party may terminate this agreement with 30 days written notice.</p>
                  <p>4. This agreement is governed by the laws of the Federal Republic of Nigeria.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-xs font-bold mb-6">LANDLORD SIGNATURE</p>
                    <div className="border-b border-foreground w-40" />
                    <p className="text-xs mt-1">{currentUser?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-6">TENANT SIGNATURE</p>
                    <div className="border-b border-foreground w-40" />
                    <p className="text-xs mt-1">{tenant?.name || '_________'}</p>
                  </div>
                </div>

                <div className="text-center text-xs text-muted-foreground border-t pt-3">
                  <p>Generated by Oyalandlord • {new Date().toLocaleDateString('en-NG')} • Receipt: {agreementRental.receiptNumber}</p>
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print / Save PDF
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    updateRentalStatus(agreementRental.id, 'pending_signature');
                    if (tenant) {
                      createNotification({
                        userId: tenant.id,
                        title: 'Rental Agreement Sent',
                        message: `Your landlord has sent a rental agreement for "${prop?.title}". Please review and sign.`,
                        type: 'rental',
                        actionUrl: 'tenant-rentals',
                      });
                    }
                    toast({ title: 'Agreement Sent!', description: 'Tenant has been notified to review and sign the agreement.' });
                    setAgreementRental(null);
                  }}
                >
                  <Banknote className="mr-2 h-4 w-4" />
                  Mark as Sent
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })()}

>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
      {activeChat && (
        <ChatWindow 
          otherUserId={activeChat.userId}
          propertyId={activeChat.propertyId}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}
