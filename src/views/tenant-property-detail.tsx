'use client';

<<<<<<< HEAD
import { useState, useMemo } from 'react';
import { useRouter } from '@/lib/router';
import { 
  useAuthStore, 
  usePropertyStore, 
  useFavoriteStore, 
  useInspectionStore,
  useRentalStore,
  useBidStore,
  useNotificationStore,
  useActivityStore
} from '@/lib/store';
import { 
  Property, 
  RentalType, 
  UserRole,
  ReportReason
} from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Heart, 
  Calendar, 
  Home, 
  ArrowLeft,
  CheckCircle,
  Clock,
  MessageCircle,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
  Shield,
  Gavel,
  AlertCircle,
  Loader2,
  Flag,
  HelpCircle,
} from 'lucide-react';
=======
import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { useAuthStore, usePropertyStore, useInspectionStore, useBidStore, useRentalStore, useNotificationStore, useFavoriteStore, useReportStore, calculateTotalPackage } from '@/lib/store';
import { Property, PropertyType, BreakdownItem, ReportReason } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
<<<<<<< HEAD
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
=======
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
<<<<<<< HEAD
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
=======
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import {
  MapPin,
  Bed,
  Bath,
  Home,
  Shield,
  ArrowLeft,
  CheckCircle,
  User,
  Calendar,
  Loader2,
  MessageCircle,
  Banknote,
  Gavel,
  FileText,
  Printer,
  Clock,
  AlertCircle,
  Heart,
  Flag,
  Car,
  PawPrint,
  TreeDeciduous,
  TreePalm,
  Armchair,
  HelpCircle,
} from 'lucide-react';
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
import { useToast } from '@/hooks/use-toast';

// Format price in Nigerian Naira
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

<<<<<<< HEAD
// Get initials for avatar fallback
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function TenantPropertyDetail() {
  const { navigate, goBack, params } = useRouter();
  const { currentUser, getUserById } = useAuthStore();
  const { getPropertyById } = usePropertyStore();
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const { 
    getInspectionsByTenant, 
    requestInspection 
  } = useInspectionStore();
  const { createRental, getRentalsByTenant } = useRentalStore();
  const { getBidsByTenant, createBid } = useBidStore();
  const { addNotification } = useNotificationStore();
  const { addActivity } = useActivityStore();
  const { toast } = useToast();

  const propertyId = params.id as string;
  const property = getPropertyById(propertyId);
  const landlord = property ? getUserById(property.landlordId) : null;
  const solicitor = property?.solicitorId ? getUserById(property.solicitorId) : null;

  // Dialog states
  const [showInspectionDialog, setShowInspectionDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferredDate, setPreferredDate] = useState('');
  const [note, setNote] = useState('');
  const [rentalType, setRentalType] = useState<RentalType>('rent');
  const [newEndDate, setNewEndDate] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [reportReason, setReportReason] = useState<ReportReason>('fake_listing');
  const [reportDescription, setReportDescription] = useState('');
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({});

  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!property) {
    return (
      <div className="container px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        <Button onClick={() => navigate('tenant-dashboard')}>
          Back to Dashboard
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

export default function TenantPropertyDetail() {
  const { params, navigate, goBack } = useRouter();
  const { currentUser, getUserById } = useAuthStore();
  const { getPropertyById, incrementViewCount } = usePropertyStore();
  const { createInspectionRequest, getInspectionsByTenant, updateInspectionStatus, getInspectionById } = useInspectionStore();
  const { createBid, hasBidOnProperty, getBidsByTenant, updateBidStatus, getBidsByProperty } = useBidStore();
  const { createRental, getRentalsByTenant, renewRental, getRentalById } = useRentalStore();
  const { createNotification } = useNotificationStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const { createReport } = useReportStore();
  const { toast } = useToast();
  
  const [showInspectionDialog, setShowInspectionDialog] = useState(false);
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [preferredDate, setPreferredDate] = useState('');
  const [note, setNote] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [rentalType, setRentalType] = useState<'rent' | 'buy'>('rent');
  const [newEndDate, setNewEndDate] = useState('');
  const [reportReason, setReportReason] = useState<ReportReason>('other');
  const [reportDescription, setReportDescription] = useState('');
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({});
  
  const [createdRentalId, setCreatedRentalId] = useState<string | null>(null);

  const property = getPropertyById(params.id);

  // Increment view count when property is viewed
  useEffect(() => {
    if (property?.id) {
      incrementViewCount(property.id);
    }
  }, [property?.id, incrementViewCount]);

  // Check if property is favorited
  const isPropertyFavorite = property && currentUser ? isFavorite(currentUser.id, property.id) : false;

  // Get inspection requests for this property by current user
  const userInspections = getInspectionsByTenant(currentUser?.id || '');
  const propertyInspection = userInspections.find(i => i.propertyId === property?.id);
  
  // Get existing rental for this property
  const userRentals = getRentalsByTenant(currentUser?.id || '');
  const existingRental = userRentals.find(r => r.propertyId === property?.id && r.status === 'active');
  
  // Check if user has already bid
  const hasBid = property ? hasBidOnProperty(property.id, currentUser?.id || '') : false;
  
  // Get user's bid for this property
  const userBids = getBidsByTenant(currentUser?.id || '');
  const userBid = userBids.find(b => b.propertyId === property?.id);

  // Calculate total package from breakdown
  const totalPackage = calculateTotalPackage(property?.breakdownItems);
  
  // Calculate caution fee
  const cautionFee = (() => {
    if (!property?.breakdownItems) return 0;
    const cautionItem = property.breakdownItems.find(item => 
      item.name.toLowerCase().includes('caution') || item.name.toLowerCase().includes('deposit')
    );
    return cautionItem?.amount || 0;
  })();

  // Calculate legal fee (only if solicitor attached)
  const legalFee = (() => {
    if (!property?.solicitorId || !property?.breakdownItems) return 0;
    const legalItem = property.breakdownItems.find(item => 
      item.name.toLowerCase().includes('legal')
    );
    return legalItem?.amount || 0;
  })();

  if (!property) {
    return (
      <div className="container px-4 py-16 text-center">
        <Home className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The property you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={() => navigate('tenant-dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
        </Button>
      </div>
    );
  }

<<<<<<< HEAD
  const isPropertyFavorite = currentUser ? isFavorite(currentUser.id, property.id) : false;
  
  const tenantInspections = currentUser ? getInspectionsByTenant(currentUser.id) : [];
  const propertyInspection = tenantInspections.find(i => i.propertyId === property.id);
  const canRequestInspection = !propertyInspection;
  const canMakePayment = propertyInspection?.status === 'approved';
  
  const tenantRentals = currentUser ? getRentalsByTenant(currentUser.id) : [];
  const existingRental = tenantRentals.find(r => r.propertyId === property.id && r.status === 'active');

  const tenantBids = currentUser ? getBidsByTenant(currentUser.id) : [];
  const userBid = tenantBids.find(b => b.propertyId === property.id);
  const hasBid = !!userBid;

  const totalPackage = property.breakdownItems.reduce((acc, item) => acc + item.amount, 0);

  const handleToggleFavorite = () => {
    if (currentUser) {
      toggleFavorite(currentUser.id, property.id);
      toast({
        title: isPropertyFavorite ? 'Removed from Favorites' : 'Added to Favorites',
        description: isPropertyFavorite 
          ? 'Property has been removed from your saved list.' 
          : 'Property has been added to your saved list.',
      });
      
      if (!isPropertyFavorite) {
        addActivity(currentUser.id, 'favorite', `Saved ${property.title} to favorites`, property.id);
      }
    }
  };

  const handleInspectionRequest = async () => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
    
    const screeningAnswersArray = Object.entries(screeningAnswers).map(([questionId, answer]) => ({
      questionId,
      answer
    }));

    requestInspection(currentUser.id, property.id, preferredDate, note, screeningAnswersArray);
    
    // Notify landlord
    addNotification(
      property.landlordId, 
      'inspection_request', 
      `${currentUser.name} requested an inspection for ${property.title}.`,
      property.id
    );

    // If there's a solicitor, notify them too
    if (property.solicitorId) {
      addNotification(
        property.solicitorId,
        'inspection_request',
        `New inspection request from ${currentUser.name} for ${property.title} requires your approval.`,
        property.id
      );
    }

    addActivity(currentUser.id, 'inspection_request', `Requested inspection for ${property.title}`, property.id);
    
    setIsSubmitting(false);
    setShowInspectionDialog(false);
    toast({
      title: 'Request Submitted',
      description: 'Your inspection request has been sent to the landlord.',
    });
  };

  const handleBidSubmit = async () => {
    if (!currentUser) return;
=======
  const landlord = getUserById(property.landlordId);
  const solicitor = property.solicitorId ? getUserById(property.solicitorId) : null;

  const handleInspectionRequest = async () => {
    if (!currentUser) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to request an inspection.',
        variant: 'destructive',
      });
      navigate('login');
      return;
    }

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    // Format screening answers for storage
    const screeningAnswersText = property.screeningQuestions && property.screeningQuestions.length > 0
      ? property.screeningQuestions.map(q => `Q: ${q.question}\nA: ${screeningAnswers[q.id] || 'Not answered'}`).join('\n\n')
      : undefined;
    
    const combinedNote = screeningAnswersText 
      ? `${note ? note + '\n\n' : ''}--- Screening Answers ---\n${screeningAnswersText}`
      : note || undefined;

    const inspection = createInspectionRequest(
      property.id, 
      property.landlordId, // Add landlordId
      currentUser.id, 
      preferredDate || '', 
      combinedNote
    );
    
    // Create notification for landlord
    createNotification({
      userId: property.landlordId,
      title: 'New Inspection Request',
      message: `You have a new inspection request for "${property.title}" from ${currentUser.name}.`,
      type: 'inspection',
      actionUrl: 'landlord-dashboard',
    });
    
    // If solicitor attached, notify them too
    if (property.solicitorId) {
      createNotification({
        userId: property.solicitorId,
        title: 'New Inspection Request',
        message: `You have a new inspection request to verify for "${property.title}".`,
        type: 'inspection',
        actionUrl: 'solicitor-dashboard',
      });
    }
    
    setIsSubmitting(false);
    setShowInspectionDialog(false);
    setScreeningAnswers({});
    setPreferredDate('');
    setNote('');

    toast({
      title: 'Inspection Request Submitted!',
      description: property.solicitorId 
        ? 'This property has a solicitor. Your request will require approval.'
        : 'Your request has been submitted. Check your inspections page for updates.',
    });
    
    navigate('tenant-inspections');
  };

  const handleWhatsAppContact = () => {
    if (property.whatsappEnabled && property.whatsappNumber) {
      const message = encodeURIComponent(`Hello, I'm interested in the property "${property.title}" listed on Oyalandlord. I would like to make an inquiry.`);
      window.open(`https://wa.me/${property.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    }
  };

  const handleBidSubmit = async () => {
    if (!currentUser || !bidAmount) return;
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid bid amount.',
        variant: 'destructive',
      });
      return;
    }
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
<<<<<<< HEAD
    createBid(currentUser.id, property.id, Number(bidAmount));
    
    addNotification(
      property.landlordId,
      'new_bid',
      `${currentUser.name} made an offer of ${formatPrice(Number(bidAmount))} for ${property.title}.`,
      property.id
    );

    addActivity(currentUser.id, 'bid', `Made an offer of ${formatPrice(Number(bidAmount))} for ${property.title}`, property.id);
    
    setIsSubmitting(false);
    setShowBidDialog(false);
    toast({
      title: 'Offer Submitted',
      description: 'Your bid has been sent to the landlord.',
=======
    const bid = createBid(property.id, currentUser.id, amount);
    
    if (!bid) {
      toast({
        title: 'Bid Failed',
        description: 'You have already placed a bid on this property.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }
    
    // Create notification for landlord
    createNotification({
      userId: property.landlordId,
      title: 'New Bid Received',
      message: `You have received a bid of ${formatPrice(amount)} for "${property.title}".`,
      type: 'system',
      actionUrl: 'landlord-dashboard',
    });
    
    setIsSubmitting(false);
    setShowBidDialog(false);
    setBidAmount('');
    
    toast({
      title: 'Bid Submitted!',
      description: 'Your bid has been submitted. You will be notified if it is accepted.',
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
    });
  };

  const handlePayment = async () => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
<<<<<<< HEAD
    await new Promise(resolve => setTimeout(resolve, 1500)); // Longer payment delay
    
    createRental(currentUser.id, property.id, property.landlordId, rentalType, totalPackage, property.breakdownItems);
    
    addNotification(
      property.landlordId,
      'payment_received',
      `Payment received for ${property.title}. Happy renting!`,
      property.id
    );

    addActivity(currentUser.id, 'payment', `Completed payment for ${property.title}`, property.id);
    
    setIsSubmitting(false);
    setShowPaymentDialog(false);
    setShowReceiptDialog(true);
    toast({
      title: 'Payment Successful',
      description: 'Your transaction has been processed and verified.',
=======
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // 1 year rental
    
    const rental = createRental({
      propertyId: property.id,
      tenantId: currentUser.id,
      landlordId: property.landlordId,
      type: rentalType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalAmount: totalPackage,
      breakdownItems: property.breakdownItems,
      cautionFee,
      status: 'active',
      bidAccepted: !!userBid?.status || false,
    });
    
    // Create notification for landlord
    createNotification({
      userId: property.landlordId,
      title: 'Property Rented',
      message: `Your property "${property.title}" has been rented by ${currentUser.name}.`,
      type: 'rental',
      actionUrl: 'landlord-dashboard',
    });
    
    setCreatedRentalId(rental.id);
    setIsSubmitting(false);
    setShowPaymentDialog(false);
    setShowReceiptDialog(true);
    
    toast({
      title: 'Payment Successful!',
      description: 'Your rental has been confirmed. You can view your receipt below.',
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
    });
  };

  const handleRenewal = async () => {
<<<<<<< HEAD
    if (!currentUser || !existingRental) return;
=======
    if (!existingRental || !newEndDate) return;
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
<<<<<<< HEAD
    // Simulate renewal
    addNotification(
      property.landlordId,
      'renewal_request',
      `${currentUser.name} requested a renewal for ${property.title}.`,
      property.id
    );

    addActivity(currentUser.id, 'renewal', `Requested renewal for ${property.title}`, property.id);
    
    setIsSubmitting(false);
    setShowRenewDialog(false);
    toast({
      title: 'Renewal Processed',
      description: 'Your renewal request has been sent.',
    });
  };

  const handleReportSubmit = async () => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate report
    addNotification(
      'admin-id',
      'property_report',
      `Property ${property.title} was reported for: ${reportReason}.`,
      property.id
    );

    addActivity(currentUser.id, 'report', `Reported property ${property.title}`, property.id);
    
    setIsSubmitting(false);
    setShowReportDialog(false);
    toast({
      title: 'Report Submitted',
      description: 'Our team will review this listing shortly.',
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleWhatsAppContact = () => {
    // Nigerian WhatsApp link format
    const msg = encodeURIComponent(`Hello, I'm interested in your property on Oyalandlord: ${property.title} (${property.location})`);
    const num = property.whatsappNumber || '';
    window.open(`https://wa.me/${num.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
=======
    const newRental = renewRental(existingRental.id, newEndDate);
    
    if (newRental) {
      createNotification({
        userId: property.landlordId,
        title: 'Rental Renewed',
        message: `${currentUser?.name} has renewed their rental for "${property.title}".`,
        type: 'rental',
        actionUrl: 'landlord-dashboard',
      });
      
      toast({
        title: 'Renewal Successful!',
        description: 'Your rental has been renewed.',
      });
    }
    
    setIsSubmitting(false);
    setShowRenewDialog(false);
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
  };

  const handlePrintReceipt = () => {
    window.print();
  };

<<<<<<< HEAD
  const receiptContent = existingRental ? (
    <div className="space-y-4 p-6 border rounded-lg bg-white dark:bg-black/20 font-sans print:p-10 print:border-none">
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-primary">Oyalandlord</h2>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Nigeria&apos;s Smart Rental Marketplace</p>
      </div>
      
      <div className="flex justify-between items-start text-xs uppercase text-muted-foreground font-semibold">
        <div>
          <p>Receipt Number</p>
          <p className="text-foreground font-mono">{existingRental.receiptNumber}</p>
        </div>
        <div className="text-right">
          <p>Date</p>
          <p className="text-foreground">{new Date(existingRental.startDate).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="py-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Payer Details</p>
        <p className="font-bold">{currentUser?.name}</p>
        <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
      </div>

      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Property</p>
        <p className="font-bold">{property.title}</p>
        <p className="text-xs">{property.location}</p>
=======
  const handleToggleFavorite = () => {
    if (!currentUser || !property) return;
    
    if (isPropertyFavorite) {
      removeFavorite(currentUser.id, property.id);
      toast({
        title: 'Removed from Favorites',
        description: 'Property has been removed from your favorites.',
      });
    } else {
      addFavorite(currentUser.id, property.id);
      toast({
        title: 'Added to Favorites',
        description: 'Property has been added to your favorites.',
      });
    }
  };

  const handleReportSubmit = async () => {
    if (!currentUser || !property) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    createReport({
      propertyId: property.id,
      reporterId: currentUser.id,
      reason: reportReason,
      description: reportDescription || undefined,
    });
    
    // Create notification for admin
    createNotification({
      userId: 'user-admin-1',
      title: 'Property Reported',
      message: `Property "${property.title}" has been reported for ${reportReason.replace('_', ' ')}.`,
      type: 'system',
    });
    
    setIsSubmitting(false);
    setShowReportDialog(false);
    setReportReason('other');
    setReportDescription('');
    
    toast({
      title: 'Report Submitted',
      description: 'Thank you for your report. We will review it shortly.',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const canRequestInspection = !propertyInspection || propertyInspection.status === 'rejected';
  const canMakePayment = propertyInspection?.status === 'approved' && !existingRental;

  // Receipt dialog content
  const receiptContent = createdRentalId ? (
    <div className="space-y-4">
      <div className="text-center border-b pb-4">
        <h2 className="text-xl font-bold">Oyalandlord</h2>
        <p className="text-sm text-muted-foreground">Rental Receipt</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Receipt No:</p>
          <p className="font-medium">{getRentalById(createdRentalId)?.receiptNumber}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Date:</p>
          <p className="font-medium">{new Date().toLocaleDateString('en-NG')}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Tenant:</p>
          <p className="font-medium">{currentUser?.name}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Landlord:</p>
          <p className="font-medium">{landlord?.name}</p>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <p className="font-medium mb-2">{property.title}</p>
        <p className="text-sm text-muted-foreground">{property.location}</p>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
      </div>
      
      <Table>
        <TableBody>
<<<<<<< HEAD
          {existingRental.breakdownItems.map((item, index) => (
            <TableRow key={index} className="border-none">
              <TableCell className="py-1">{item.name}</TableCell>
              <TableCell className="py-1 text-right">{formatPrice(item.amount)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="border-t-2 font-bold">
            <TableCell>TOTAL PAID</TableCell>
            <TableCell className="text-right text-primary">{formatPrice(existingRental.totalAmount)}</TableCell>
=======
          {property.breakdownItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell className="text-right">{formatPrice(item.amount)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="font-bold border-t-2">
            <TableCell>Total</TableCell>
            <TableCell className="text-right text-primary">{formatPrice(totalPackage)}</TableCell>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
          </TableRow>
        </TableBody>
      </Table>
      
<<<<<<< HEAD
      <div className="text-center pt-4 opacity-50 text-[10px]">
        <p>Digitally Generated Receipt • Secured by Oyalandlord Escrow</p>
=======
      <div className="border-t pt-4 text-sm">
        <div className="flex justify-between">
          <span>Rental Type:</span>
          <span className="capitalize">{rentalType}</span>
        </div>
        <div className="flex justify-between">
          <span>Duration:</span>
          <span>1 Year ({new Date().getFullYear()} - {new Date().getFullYear() + 1})</span>
        </div>
        {cautionFee > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Caution Fee (Refundable):</span>
            <span>{formatPrice(cautionFee)}</span>
          </div>
        )}
      </div>
      
      <div className="border-t pt-4 text-xs text-muted-foreground text-center">
        <p>Thank you for using Oyalandlord!</p>
        <p>No Agent Fee • Direct Landlord Connection</p>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
      </div>
    </div>
  ) : null;

  return (
    <div className="container px-4 py-8">
      {/* Back Button */}
<<<<<<< HEAD
      <Button variant="ghost" onClick={goBack} className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to listings
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Property Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photos Carousel */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden group bg-muted border border-border/50 shadow-xl">
            {property.images.length > 0 ? (
              <>
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium tracking-tight">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                <Home className="h-16 w-16 opacity-20" />
                <p className="font-medium tracking-tight">No images available for this property</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20 pointer-events-none uppercase font-bold text-[10px] tracking-wider py-0.5">
                    {property.type}
                  </Badge>
                  {property.available ? (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 pointer-events-none">
                      Available Now
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Rented</Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{property.title}</h1>
                <p className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <MapPin className="h-4 w-4 text-primary" />
                  {property.location}
                </p>
              </div>
              <div className="text-left md:text-right bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <p className="text-xs font-extrabold uppercase text-primary tracking-widest mb-1">Starting Price</p>
                <p className="text-3xl font-black text-primary">
                  {formatPrice(property.price)}
                </p>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Per Annum (Yearly)</p>
              </div>
            </div>

            <div className="flex gap-6 py-6 border-y items-center overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Bedrooms</p>
                  <p className="font-extrabold">{property.bedrooms} Rooms</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Bathrooms</p>
                  <p className="font-extrabold">{property.bathrooms} Baths</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Status</p>
                  <p className="font-extrabold">Verified</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                About this Property
              </h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {property.description}
              </p>
            </div>

            {/* Features/Amenities */}
            {property.features && property.features.length > 0 && (
              <div className="space-y-4 pt-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-gray-50/50 dark:bg-white/5 group hover:border-primary/30 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm font-bold tracking-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-4 pt-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Cost Breakdown
              </h2>
              <Card className="border-border/50 dark:bg-white/5 overflow-hidden">
                <Table>
                  <TableBody>
                    {property.breakdownItems.map((item, index) => (
                      <TableRow key={index} className="hover:bg-muted/30 border-border/50">
                        <TableCell className="font-bold text-muted-foreground py-4">{item.name}</TableCell>
                        <TableCell className="text-right font-extrabold py-4">{formatPrice(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-primary/5 hover:bg-primary/10 border-t-2 border-primary/20">
                      <TableCell className="font-extrabold text-primary py-5 text-lg">Total Move-in Package</TableCell>
                      <TableCell className="text-right font-black text-primary py-5 text-2xl">
                        {formatPrice(totalPackage)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200 dark:border-yellow-900/50">
                <p className="text-xs text-yellow-800 dark:text-yellow-400 font-bold leading-relaxed">
                  <AlertCircle className="h-3 w-3 inline-block mr-1 mb-0.5" />
                  Prices shown are for the first year and include all legal, caution, and verification fees. No hidden agent commissions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <Card className="sticky top-24 border-primary/20 shadow-xl shadow-primary/5">
=======
      <Button variant="ghost" onClick={goBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Search
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card className="overflow-hidden">
            <div className="aspect-[16/10] relative">
              {property.images[selectedImage] ? (
                <img
                  src={property.images[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Home className="h-16 w-16 text-muted-foreground/50" />
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="secondary">
                  {propertyTypeLabels[property.type]}
                </Badge>
                {property.solicitorId && (
                  <Badge variant="default">
                    <Shield className="h-3 w-3 mr-1" />
                    Solicitor Verified
                  </Badge>
                )}
              </div>
              <Badge className="absolute top-4 right-4 bg-green-600 text-white" variant="default">
                No Agent Fee
              </Badge>
            </div>
            
            {property.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {property.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-16 rounded-md overflow-hidden shrink-0 border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{property.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {property.location}
                  </CardDescription>
                  {property.address && (
                    <p className="text-sm text-muted-foreground mt-1">{property.address}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{formatPrice(property.price)}</p>
                  <p className="text-muted-foreground">per year</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">{property.bedrooms}</p>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">{property.bathrooms}</p>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Home className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="font-semibold capitalize">{property.type}</p>
                  <p className="text-sm text-muted-foreground">Type</p>
                </div>
              </div>

              <Separator />

              {/* Cost Breakdown Table */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Banknote className="h-5 w-5" />
                  Cost Breakdown
                </h3>
                <Card className="overflow-hidden">
                  <Table>
                    <TableBody>
                      {property.breakdownItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{formatPrice(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                      {/* Total */}
                      <TableRow className="bg-primary/5 border-t-2">
                        <TableCell className="font-bold">Total Package</TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          {formatPrice(totalPackage)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>
                {cautionFee > 0 && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Caution fee of {formatPrice(cautionFee)} is refundable if no damage to property
                  </p>
                )}
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              <Separator />

              {/* Availability */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Availability Status</h3>
                  <p className="text-sm text-muted-foreground">
                    This property is currently available for rent
                  </p>
                </div>
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Available
                </Badge>
              </div>

              {/* Property Features */}
              {(property.security?.length || property.parking?.length || property.outdoorSpace?.length || property.furnishing || property.petPolicy) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3">Property Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Security */}
                      {property.security && property.security.length > 0 && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Security</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {property.security.map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Parking */}
                      {property.parking && property.parking.length > 0 && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Car className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Parking</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {property.parking.map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Outdoor Space */}
                      {property.outdoorSpace && property.outdoorSpace.length > 0 && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <TreeDeciduous className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Outdoor</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {property.outdoorSpace.map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Furnishing */}
                      {property.furnishing && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Armchair className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Furnishing</span>
                          </div>
                          <Badge variant={property.furnishing === 'furnished' ? 'default' : 'secondary'}>
                            {property.furnishing === 'furnished' ? 'Fully Furnished' : property.furnishing === 'semi-furnished' ? 'Semi-Furnished' : 'Unfurnished'}
                          </Badge>
                        </div>
                      )}

                      {/* Pet Policy */}
                      {property.petPolicy && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <PawPrint className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Pet Policy</span>
                          </div>
                          <Badge variant={property.petPolicy === 'allowed' ? 'default' : 'secondary'}>
                            {property.petPolicy === 'allowed' ? 'Pets Allowed' : 'No Pets'}
                          </Badge>
                        </div>
                      )}

                      {/* Earliest Move-In */}
                      {property.earliestMoveIn && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Earliest Move-In</span>
                          </div>
                          <span className="text-sm">
                            {new Date(property.earliestMoveIn).toLocaleDateString('en-NG', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Negotiation Badge */}
              {property.allowNegotiation && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                    <Gavel className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Price Negotiation Enabled</span>
                    <Badge variant="secondary" className="ml-auto">Open to Offers</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card className="sticky top-24">
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
            <CardHeader>
              <CardTitle className="text-lg">Interested in this property?</CardTitle>
              <CardDescription>
                Request an inspection to view the property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Inspection Fee Display */}
              {(property.inspectionFee || 0) > 0 && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Inspection Fee</span>
                    <span className="font-semibold text-primary">{formatPrice(property.inspectionFee || 0)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Payable upon approved inspection
                  </p>
                </div>
              )}
              
              {/* Inspection Request Button */}
              {canRequestInspection && !existingRental && (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowInspectionDialog(true)}
                  disabled={!property.available}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Request Inspection
                </Button>
              )}
              
              {/* Already Requested */}
              {propertyInspection && propertyInspection.status === 'pending' && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Inspection Pending
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {property.solicitorId 
                      ? 'This property has a solicitor. Your request requires approval.'
                      : 'Your inspection request is being reviewed.'}
                  </p>
                </div>
              )}
              
              {/* Inspection Approved - Can Pay */}
              {canMakePayment && (
                <>
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Inspection Approved!
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You can now proceed with payment to rent this property.
                    </p>
                  </div>
                  
                  {/* Bid Button - Only show if negotiation is allowed */}
                  {property.allowNegotiation && !hasBid && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowBidDialog(true)}
                    >
                      <Gavel className="mr-2 h-4 w-4" />
                      Make an Offer
                    </Button>
                  )}
                  
                  {property.allowNegotiation && hasBid && userBid && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium">Your Offer</p>
                      <p className="text-lg font-bold text-primary">{formatPrice(userBid.amount)}</p>
                      <Badge variant={userBid.status === 'accepted' ? 'default' : userBid.status === 'rejected' ? 'destructive' : 'secondary'}
                        className={userBid.status === 'accepted' ? 'bg-green-600' : ''}>
                        {userBid.status}
                      </Badge>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    onClick={() => setShowPaymentDialog(true)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </Button>
                </>
              )}
              
              {/* Already Rented */}
              {existingRental && (
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      You are renting this property
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Expires: {new Date(existingRental.endDate).toLocaleDateString('en-NG')}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowReceiptDialog(true)}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    View Receipt
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowRenewDialog(true)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Renew Rental
                  </Button>
                </div>
              )}
              
              {/* WhatsApp Contact Button */}
              {property.whatsappEnabled && property.whatsappNumber && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleWhatsAppContact}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              )}
              
              {/* Favorite Button */}
              <Button 
                variant="outline" 
                className={`w-full ${isPropertyFavorite ? 'text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground' : ''}`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`mr-2 h-4 w-4 ${isPropertyFavorite ? 'fill-current' : ''}`} />
                {isPropertyFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              
              {/* Report Button */}
              <Button 
                variant="ghost" 
                className="w-full text-muted-foreground hover:text-destructive"
                onClick={() => setShowReportDialog(true)}
              >
                <Flag className="mr-2 h-4 w-4" />
                Report Property
              </Button>

              {property.solicitorId && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    <AlertCircle className="h-3 w-3 inline mr-1" />
                    This property has a solicitor. Your request will require approval.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Landlord Info */}
          {landlord && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Landlord</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(landlord.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{landlord.name}</p>
                    <p className="text-sm text-muted-foreground">Property Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Solicitor Info */}
          {solicitor && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Legal Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(solicitor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{solicitor.name}</p>
                    <p className="text-sm text-muted-foreground">Barrister</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  This solicitor will verify your inspection request to ensure legal compliance.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Inspection Request Dialog */}
      <Dialog open={showInspectionDialog} onOpenChange={setShowInspectionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Property Inspection</DialogTitle>
            <DialogDescription>
              Submit a request to inspect this property
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="font-semibold">{property.title}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {property.location}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(property.price)}/year
                  </p>
                  {/* Inspection Fee Display */}
                  {(property.inspectionFee || 0) > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Inspection Fee</span>
                      <span className="font-medium text-[#008751]">
                        {formatPrice(property.inspectionFee || 0)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Inspection Date (Optional)</Label>
              <Input
                id="preferredDate"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Additional Notes (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Any special requests or questions..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            {/* Screening Questions */}
            {property.screeningQuestions && property.screeningQuestions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <Label className="text-sm font-medium">Screening Questions</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Please answer the following questions from the landlord
                </p>
                {property.screeningQuestions.map((q, index) => (
                  <div key={q.id} className="space-y-1.5">
                    <Label htmlFor={`question-${q.id}`} className="text-sm">
                      {index + 1}. {q.question}
                    </Label>
                    <Textarea
                      id={`question-${q.id}`}
                      placeholder="Your answer..."
                      value={screeningAnswers[q.id] || ''}
                      onChange={(e) => setScreeningAnswers(prev => ({
                        ...prev,
                        [q.id]: e.target.value
                      }))}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowInspectionDialog(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleInspectionRequest} disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bid Dialog */}
      <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Make a Bid</DialogTitle>
            <DialogDescription>
              Submit your bid for this property. You can only bid once.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                You can only bid once on this property. Make it count!
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bidAmount">Your Bid Amount (₦)</Label>
              <Input
                id="bidAmount"
                type="number"
                placeholder="Enter your bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Listed price: {formatPrice(property.price)}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBidDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBidSubmit} disabled={isSubmitting || !bidAmount}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Gavel className="mr-2 h-4 w-4" />
              )}
              Submit Bid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Review the breakdown and confirm your payment
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Rental Type</Label>
              <div className="flex gap-2">
                <Button 
                  variant={rentalType === 'rent' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setRentalType('rent')}
                >
                  Rent
                </Button>
                <Button 
                  variant={rentalType === 'buy' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setRentalType('buy')}
                >
                  Buy
                </Button>
              </div>
            </div>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="font-semibold mb-2">{property.title}</p>
                <Table>
                  <TableBody>
                    {property.breakdownItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="py-1">{item.name}</TableCell>
                        <TableCell className="py-1 text-right">{formatPrice(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2">
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold text-primary">{formatPrice(totalPackage)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rental Receipt</DialogTitle>
            <DialogDescription>
              Your payment has been confirmed
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {receiptContent}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReceiptDialog(false)}>
              Close
            </Button>
            <Button onClick={handlePrintReceipt}>
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renewal Dialog */}
      <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Renew Rental</DialogTitle>
            <DialogDescription>
              Extend your rental for another period
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEndDate">New End Date</Label>
              <Input
                id="newEndDate"
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                min={existingRental ? new Date(existingRental.endDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenewal} disabled={isSubmitting || !newEndDate}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Calendar className="mr-2 h-4 w-4" />
              )}
              Confirm Renewal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Property Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report Property</DialogTitle>
            <DialogDescription>
              Let us know if there&apos;s an issue with this property listing
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Reason for Report</Label>
              <Select value={reportReason} onValueChange={(v) => setReportReason(v as ReportReason)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fake_listing">Fake Listing</SelectItem>
                  <SelectItem value="already_rented">Already Rented</SelectItem>
                  <SelectItem value="wrong_price">Wrong Price</SelectItem>
                  <SelectItem value="scam">Scam</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reportDescription">Additional Details (Optional)</Label>
              <Textarea
                id="reportDescription"
                placeholder="Please provide more details about the issue..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReportSubmit} disabled={isSubmitting} variant="destructive">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Flag className="mr-2 h-4 w-4" />
              )}
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
