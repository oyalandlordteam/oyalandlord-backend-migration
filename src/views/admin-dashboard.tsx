'use client';

<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Home, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Search, 
  Plus, 
  Trash2, 
  BadgeCheck, 
  AlertCircle,
  Clock,
  LayoutDashboard,
  ShieldAlert,
  Megaphone,
  MapPin,
  Flag,
  Shield,
  Loader2,
  RefreshCcw,
  Edit
} from 'lucide-react';
import { 
  useAuthStore, 
  usePropertyStore, 
  useInspectionStore, 
  useRentalStore,
  useReportStore,
  useAnnouncementStore,
  useContentStore,
  getDashboardStats,
  User,
  Property,
  Inspection,
  Announcement
} from '@/lib/store';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { useRouter } from '@/lib/router';

export default function AdminDashboard() {
  const { toast } = useToast();
  const { navigate } = useRouter();
  
  // Stores
  const { users, verifyUser, deleteUser, getUserById, initialize: initAuth } = useAuthStore();
  const { 
    properties, 
    deleteProperty, 
    restoreProperty, 
    permanentlyDeleteProperty, 
    getDeletedProperties,
    initialize: initProps 
  } = usePropertyStore();
  const { inspections, updateInspectionStatus, initialize: initInspections } = useInspectionStore();
  const { initialize: initRentals } = useRentalStore();
  const { reports, updateReportStatus, initialize: initReports } = useReportStore();
  const { announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement, initialize: initAnnouncements } = useAnnouncementStore();
  const { content, updateFaq, updateAboutUs, updateTerms, initialize: initContent } = useContentStore();

  // Local state
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
=======
import { useEffect, useState } from 'react';
import { useRouter } from '@/lib/router';
import { useAuthStore, usePropertyStore, useInspectionStore, useReportStore, useAnnouncementStore, useContentStore, getDashboardStats } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Building2,
  Calendar,
  ArrowLeft,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Eye,
  UserX,
  Trash2,
  Home,
  MapPin,
  Flag,
  Megaphone,
  Plus,
  Edit,
  Shield,
  BadgeCheck,
  Loader2,
  RefreshCcw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Format price
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminDashboard() {
  const { navigate, goBack } = useRouter();
  const { users, updateUserStatus, deleteUser, getUserById, verifyUser, getUnverifiedUsers, restoreUser } = useAuthStore();
  const { properties, getStats: getPropertyStats, deleteProperty, restoreProperty, permanentlyDeleteProperty, getDeletedProperties, getPropertyByCode } = usePropertyStore();
  const { getAllInspections, updateInspectionStatus, getStats: getInspectionStats } = useInspectionStore();
  const { getAllReports, updateReportStatus, getPendingReports } = useReportStore();
  const { getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncementStore();
  const { content, updateFaq, updateAboutUs, updateTerms } = useContentStore();
  const { toast } = useToast();

  const { params } = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (params?.tab) {
      setActiveTab(params.tab as string);
    }
  }, [params?.tab]);
  const [searchQuery, setSearchQuery] = useState('');
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'user' | 'property' | 'inspection' | 'report' | 'announcement';
    id: string;
<<<<<<< HEAD
    action: string;
  } | null>(null);
  
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [viewingPropertyId, setViewingPropertyId] = useState<string | null>(null);
  const [viewingInspectionId, setViewingInspectionId] = useState<string | null>(null);
=======
    action: 'delete' | 'suspend' | 'approve' | 'reject' | 'verify' | 'resolve' | 'review';
  } | null>(null);
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletionReason, setDeletionReason] = useState('');
<<<<<<< HEAD
  
  // CMS local state
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [aboutUs, setAboutUs] = useState('');
  const [terms, setTerms] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsInitializing(true);
      await Promise.all([
        initAuth(),
        initProps(),
        initInspections(),
        initRentals(),
        initReports(),
        initAnnouncements(),
        initContent()
      ]);
      setIsInitializing(false);
    };
    fetchData();
  }, [initAuth, initProps, initInspections, initRentals, initReports, initAnnouncements, initContent]);
  
  useEffect(() => {
    if (content) {
      setAboutUs(content.aboutUs);
      setTerms(content.termsAndConditions);
    }
  }, [content]);

  if (isInitializing) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">Initializing Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = getDashboardStats();
  
  // Filtered data
  const filteredUsers = users.filter(u => 
    !u.isDeleted && (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const activeProperties = properties.filter(p => !p.isDeleted);
  const filteredProperties = activeProperties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.propertyCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deletedProperties = getDeletedProperties();
  const filteredDeletedProperties = deletedProperties.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allInspections = inspections;
  const filteredInspections = allInspections.filter(i => {
    const prop = properties.find(p => p.id === i.propertyId);
    return prop?.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           prop?.propertyCode.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const unverifiedUsers = users.filter(u => !u.isVerified && !u.isDeleted && (u.role === 'landlord' || u.role === 'solicitor'));
  
  const filteredReports = reports.filter(r => {
    const prop = properties.find(p => p.id === r.propertyId);
    return prop?.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           r.reason.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handlers
  const handleConfirmAction = async () => {
    if (!confirmDialog) return;
    
    const { type, id, action } = confirmDialog;
    let success = false;

    try {
      if (type === 'user') {
        if (action === 'verify') success = await verifyUser(id);
        if (action === 'delete') success = await deleteUser(id, deletionReason);
      } else if (type === 'property') {
        if (action === 'delete') success = await deleteProperty(id, deletionReason);
      } else if (type === 'inspection') {
        if (action === 'approve') success = await updateInspectionStatus(id, 'approved');
        if (action === 'reject') success = await updateInspectionStatus(id, 'rejected');
      } else if (type === 'report') {
        if (action === 'resolve') success = await updateReportStatus(id, 'resolved');
      } else if (type === 'announcement') {
        if (action === 'delete') success = await deleteAnnouncement(id);
      }

      if (success) {
        toast({
          title: "Action completed",
          description: `Successfully ${action}ed the ${type}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setConfirmDialog(null);
      setDeletionReason('');
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.message) return;
    
    setIsSubmitting(true);
    const result = await createAnnouncement(announcementForm.title, announcementForm.message);
    setIsSubmitting(false);
    
    if (result) {
      toast({ title: 'Announcement created successfully' });
      setShowAnnouncementDialog(false);
      setAnnouncementForm({ title: '', message: '' });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <LayoutDashboard className="h-10 w-10 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Manage users, listings, and platform operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-sm font-bold bg-primary/5 border-primary/20">
            System Online
          </Badge>
          <Button variant="ghost" size="icon" onClick={() => initAuth()}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{stats.totalTenants} Tenants, {stats.totalLandlords} Landlords</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Home className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">{stats.availableProperties} Active Listings</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-200/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <BadgeCheck className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unverifiedUsers}</div>
            <p className="text-xs text-muted-foreground">Awaiting manual review</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inspections</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInspections}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingInspections} Pending Request(s)</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <Flag className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">Property flags for review</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1 flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="content">CMS</TabsTrigger>
          <TabsTrigger value="trash">Trash</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-yellow-600" />
                  Needs Attention
                </CardTitle>
                <CardDescription>Items requiring immediate action</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {unverifiedUsers.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-semibold">{unverifiedUsers.length} Unverified User(s)</p>
                          <p className="text-xs text-muted-foreground">Verification documents pending review</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setActiveTab('verification')}>Review</Button>
                    </div>
                  )}
                  {stats.pendingReports > 0 && (
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Flag className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-semibold">{stats.pendingReports} Active Report(s)</p>
                          <p className="text-xs text-muted-foreground">Properties reported for community violations</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setActiveTab('reports')}>View</Button>
                    </div>
                  )}
                  {stats.pendingInspections > 0 && (
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-semibold">{stats.pendingInspections} New Inspection(s)</p>
                          <p className="text-xs text-muted-foreground">Requests awaiting landlord/admin response</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setActiveTab('inspections')}>Manage</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" />
                  Global Broadcast
                </CardTitle>
                <CardDescription>Send platform-wide notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-xl border border-dashed">
                  Broadcasting announcements allows you to notify all users about system maintenance, updates, or special promotions. 
                </p>
                <Button className="w-full" onClick={() => setShowAnnouncementDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Announcement
                </Button>
              </CardContent>
            </Card>
          </div>
=======
  const [viewingPropertyId, setViewingPropertyId] = useState<string | null>(null);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [viewingInspectionId, setViewingInspectionId] = useState<string | null>(null);

  // Content tab state
  const [aboutUs, setAboutUs] = useState(content.aboutUs);
  const [terms, setTerms] = useState(content.termsAndConditions);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  const stats = getDashboardStats();
  const allInspections = getAllInspections();
  const allReports = getAllReports();
  const pendingReports = getPendingReports();
  const unverifiedUsers = getUnverifiedUsers();
  const announcements = getAllAnnouncements();

  // Filter users based on search
  const filteredUsers = users.filter(u => 
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter properties based on search (including property codes)
  const filteredProperties = properties.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.location.toLowerCase().includes(query) ||
      p.propertyCode?.toLowerCase().includes(query)
    );
  });

  const deletedProperties = getDeletedProperties();
  const filteredDeletedProperties = deletedProperties.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.location.toLowerCase().includes(query) ||
      p.propertyCode?.toLowerCase().includes(query)
    );
  });

  // Filter inspections based on search
  const filteredInspections = allInspections.filter(i => {
    const property = properties.find(p => p.id === i.propertyId);
    const tenant = getUserById(i.tenantId);
    return (
      property?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter reports based on search
  const filteredReports = allReports.filter(r => {
    const property = properties.find(p => p.id === r.propertyId);
    const reporter = getUserById(r.reporterId);
    return (
      property?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reporter?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleConfirmAction = () => {
    if (!confirmDialog) return;

    switch (confirmDialog.type) {
      case 'user':
        if (confirmDialog.action === 'delete') {
          if (deleteUser(confirmDialog.id, deletionReason)) {
            toast({ title: 'User deleted successfully' });
            setDeletionReason('');
          } else {
            toast({ title: 'Cannot delete this user', variant: 'destructive' });
          }
        } else if (confirmDialog.action === 'suspend') {
          const user = users.find(u => u.id === confirmDialog.id);
          if (user && updateUserStatus(confirmDialog.id, !user.isActive)) {
            toast({ title: `User ${user.isActive ? 'suspended' : 'activated'} successfully` });
          }
        } else if (confirmDialog.action === 'verify') {
          if (verifyUser(confirmDialog.id)) {
            toast({ title: 'User verified successfully' });
          }
        }
        break;
      case 'property':
        if (confirmDialog.action === 'delete') {
          if (deleteProperty(confirmDialog.id, deletionReason)) {
            toast({ 
              title: 'Property deleted successfully',
              action: (
                <Button variant="outline" size="sm" onClick={() => {
                  restoreProperty(confirmDialog.id);
                  toast({ title: 'Property restored' });
                }}>
                  <RefreshCcw className="h-4 w-4 mr-1" />
                  Undo
                </Button>
              )
            });
            setDeletionReason('');
          }
        }
        break;
      case 'inspection':
        if (confirmDialog.action === 'approve') {
          updateInspectionStatus(confirmDialog.id, 'approved');
          toast({ title: 'Inspection approved' });
        } else if (confirmDialog.action === 'reject') {
          updateInspectionStatus(confirmDialog.id, 'rejected');
          toast({ title: 'Inspection rejected' });
        }
        break;
      case 'report':
        if (confirmDialog.action === 'resolve') {
          updateReportStatus(confirmDialog.id, 'resolved');
          toast({ title: 'Report marked as resolved' });
        } else if (confirmDialog.action === 'review') {
          updateReportStatus(confirmDialog.id, 'reviewed');
          toast({ title: 'Report marked as reviewed' });
        }
        break;
      case 'announcement':
        if (confirmDialog.action === 'delete') {
          if (deleteAnnouncement(confirmDialog.id)) {
            toast({ title: 'Announcement deleted' });
          }
        }
        break;
    }

    setConfirmDialog(null);
  };

  const handleCreateAnnouncement = async () => {
    if (!announcementForm.title.trim() || !announcementForm.message.trim()) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    createAnnouncement(announcementForm.title, announcementForm.message);
    
    toast({ title: 'Announcement created successfully' });
    setShowAnnouncementDialog(false);
    setAnnouncementForm({ title: '', message: '' });
    setIsSubmitting(false);
  };


  // Dynamic section info per tab
  const sectionInfo: Record<string, { title: string; description: string }> = {
    overview: {
      title: 'Dashboard',
      description: 'Real-time platform overview — live stats, activity log, and system health',
    },
    users: {
      title: 'Users',
      description: 'View, suspend, verify, or remove all registered platform users',
    },
    verification: {
      title: 'Verify',
      description: 'Review and approve pending identity verifications from landlords and solicitors',
    },
    properties: {
      title: 'Properties',
      description: 'Browse, moderate, and manage all property listings on the platform',
    },
    inspections: {
      title: 'Inspections',
      description: 'Manage inspection requests from tenants — approve or reject pending visits',
    },
    reports: {
      title: 'Reports',
      description: 'Review flagged content and property complaints submitted by users',
    },
    announcements: {
      title: 'Announcements',
      description: 'Create and manage platform-wide announcements visible to all users',
    },
    content: {
      title: 'Content',
      description: 'Manage FAQ, About Us and Terms & Conditions shown to users',
    },
    trash: {
      title: 'Trash',
      description: 'Review soft-deleted properties — restore or permanently remove them',
    },
  };

  const currentSection = sectionInfo[activeTab] || sectionInfo['overview'];

  return (
    <div className="min-h-screen bg-secondary/10 px-4 py-8">
      {/* Dynamic Section Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-1">{currentSection.title}</h1>
        <p className="text-muted-foreground text-sm">{currentSection.description}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

        {/* Overview / Dashboard Tab */}
        <TabsContent value="overview">
          {/* Stat Cards Row 1 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Total Users</CardDescription>
                <CardTitle className="text-3xl font-extrabold">{stats.totalUsers}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold">{stats.totalTenants} Tenants</span>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold">{stats.totalLandlords} Landlords</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold">{stats.totalSolicitors} Solicitors</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> Properties</CardDescription>
                <CardTitle className="text-3xl font-extrabold">{stats.totalProperties}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  <span className="font-bold text-emerald-600">{stats.availableProperties}</span> available for rent
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Inspections</CardDescription>
                <CardTitle className="text-3xl font-extrabold">{stats.totalInspections}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  <span className="font-bold text-blue-600">{stats.pendingInspections}</span> pending approval
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1"><Flag className="h-3.5 w-3.5" /> Pending Reports</CardDescription>
                <CardTitle className="text-3xl font-extrabold text-yellow-600">{stats.pendingReports}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Require immediate attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Stat Cards Row 2 */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Unverified Users</CardDescription>
                <CardTitle className="text-3xl font-extrabold text-orange-500">{stats.unverifiedUsers}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Awaiting identity verification</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-violet-500">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1"><Megaphone className="h-3.5 w-3.5" /> Announcements</CardDescription>
                <CardTitle className="text-3xl font-extrabold text-violet-600">
                  {announcements.filter(a => a.isActive).length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{announcements.length} total announcements</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Platform Health</CardDescription>
                <CardTitle className="text-3xl font-extrabold text-green-600">Healthy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          {/* Live Activity Log */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                    </span>
                    Live Activity Log
                  </CardTitle>
                  <CardDescription className="mt-1">Real-time record of all platform events</CardDescription>
                </div>
                <Badge variant="outline" className="font-bold text-xs">
                  {new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })} — Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
                {(() => {
                  // Build a unified activity stream from all data sources
                  const events: {
                    id: string;
                    type: 'user_joined' | 'property_listed' | 'inspection_requested' | 'inspection_approved' | 'inspection_rejected' | 'report_filed' | 'announcement' | 'property_deleted' | 'user_deleted';
                    title: string;
                    detail: string;
                    timestamp: string;
                  }[] = [];

                  // User join events
                  users.forEach(u => {
                    if (u.createdAt) {
                      events.push({
                        id: `user-${u.id}`,
                        type: 'user_joined',
                        title: `New ${u.role} joined`,
                        detail: `${u.name} (${u.email}) registered as ${u.role}`,
                        timestamp: u.createdAt,
                      });
                    }
                    if (u.isDeleted && u.deletedAt) {
                      events.push({
                        id: `user-del-${u.id}`,
                        type: 'user_deleted',
                        title: 'User removed',
                        detail: `${u.name} was removed${u.deletionReason ? ` — Reason: ${u.deletionReason}` : ''}`,
                        timestamp: u.deletedAt,
                      });
                    }
                  });

                  // Property events
                  properties.forEach(p => {
                    if (p.createdAt) {
                      const landlord = getUserById(p.landlordId);
                      events.push({
                        id: `prop-${p.id}`,
                        type: 'property_listed',
                        title: 'Property listed',
                        detail: `"${p.title}" [${p.propertyCode}] listed by ${landlord?.name ?? 'Unknown'} in ${p.location}`,
                        timestamp: p.createdAt,
                      });
                    }
                    if (p.isDeleted && p.updatedAt) {
                      events.push({
                        id: `prop-del-${p.id}`,
                        type: 'property_deleted',
                        title: 'Property deleted',
                        detail: `"${p.title}" [${p.propertyCode}] removed${p.deletionReason ? ` — ${p.deletionReason}` : ''}`,
                        timestamp: p.updatedAt,
                      });
                    }
                  });

                  // Inspection events
                  allInspections.forEach(i => {
                    const property = properties.find(p => p.id === i.propertyId);
                    const tenant = getUserById(i.tenantId);
                    if (i.createdAt) {
                      events.push({
                        id: `insp-req-${i.id}`,
                        type: 'inspection_requested',
                        title: 'Inspection requested',
                        detail: `${tenant?.name ?? 'Tenant'} requested inspection of "${property?.title ?? 'Property'}"`,
                        timestamp: i.createdAt,
                      });
                    }
                    if (i.status === 'approved' && i.approvedAt) {
                      events.push({
                        id: `insp-app-${i.id}`,
                        type: 'inspection_approved',
                        title: 'Inspection approved',
                        detail: `Inspection for "${property?.title ?? 'Property'}" approved — scheduled ${i.date} at ${i.time}`,
                        timestamp: i.approvedAt,
                      });
                    }
                    if (i.status === 'rejected' && i.rejectedAt) {
                      events.push({
                        id: `insp-rej-${i.id}`,
                        type: 'inspection_rejected',
                        title: 'Inspection rejected',
                        detail: `Inspection for "${property?.title ?? 'Property'}" was declined`,
                        timestamp: i.rejectedAt,
                      });
                    }
                  });

                  // Report events
                  allReports.forEach(r => {
                    const property = properties.find(p => p.id === r.propertyId);
                    const reporter = getUserById(r.reporterId);
                    if (r.createdAt) {
                      events.push({
                        id: `report-${r.id}`,
                        type: 'report_filed',
                        title: 'Report filed',
                        detail: `${reporter?.name ?? 'User'} flagged "${property?.title ?? 'Property'}" — ${r.reason}`,
                        timestamp: r.createdAt,
                      });
                    }
                  });

                  // Announcement events
                  announcements.forEach(a => {
                    events.push({
                      id: `ann-${a.id}`,
                      type: 'announcement',
                      title: 'Announcement created',
                      detail: `"${a.title}" — ${a.isActive ? 'Active' : 'Inactive'}`,
                      timestamp: a.createdAt,
                    });
                  });

                  // Sort by most recent
                  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                  const typeConfig: Record<string, { dot: string; label: string; bg: string; text: string }> = {
                    user_joined:           { dot: 'bg-blue-500',   label: 'User',        bg: 'bg-blue-50 dark:bg-blue-950/30',   text: 'text-blue-700 dark:text-blue-300' },
                    user_deleted:          { dot: 'bg-red-500',    label: 'User',        bg: 'bg-red-50 dark:bg-red-950/30',     text: 'text-red-700 dark:text-red-300' },
                    property_listed:       { dot: 'bg-emerald-500',label: 'Property',    bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-300' },
                    property_deleted:      { dot: 'bg-red-400',    label: 'Property',    bg: 'bg-red-50 dark:bg-red-950/30',     text: 'text-red-600 dark:text-red-300' },
                    inspection_requested:  { dot: 'bg-sky-500',    label: 'Inspection',  bg: 'bg-sky-50 dark:bg-sky-950/30',     text: 'text-sky-700 dark:text-sky-300' },
                    inspection_approved:   { dot: 'bg-green-500',  label: 'Inspection',  bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-700 dark:text-green-300' },
                    inspection_rejected:   { dot: 'bg-orange-500', label: 'Inspection',  bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-300' },
                    report_filed:          { dot: 'bg-yellow-500', label: 'Report',      bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-700 dark:text-yellow-300' },
                    announcement:          { dot: 'bg-violet-500', label: 'Announcement',bg: 'bg-violet-50 dark:bg-violet-950/30',text: 'text-violet-700 dark:text-violet-300' },
                  };

                  if (events.length === 0) {
                    return (
                      <div className="text-center py-12 text-muted-foreground">
                        <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">No activity recorded yet</p>
                        <p className="text-xs opacity-60">Events will appear here as users interact with the platform</p>
                      </div>
                    );
                  }

                  return events.map((event, idx) => {
                    const cfg = typeConfig[event.type] || typeConfig['announcement'];
                    const date = new Date(event.timestamp);
                    const now = new Date();
                    const diffMs = now.getTime() - date.getTime();
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHrs = Math.floor(diffMs / 3600000);
                    const diffDays = Math.floor(diffMs / 86400000);
                    let relTime = '';
                    if (diffMins < 1) relTime = 'Just now';
                    else if (diffMins < 60) relTime = `${diffMins}m ago`;
                    else if (diffHrs < 24) relTime = `${diffHrs}h ago`;
                    else if (diffDays < 7) relTime = `${diffDays}d ago`;
                    else relTime = date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

                    return (
                      <div
                        key={event.id}
                        className={`flex items-start gap-3 px-3 py-2.5 rounded-lg ${cfg.bg} border border-transparent hover:border-border transition-all group`}
                      >
                        {/* Timeline dot */}
                        <div className="flex flex-col items-center pt-1 shrink-0">
                          <span className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />
                          {idx < events.length - 1 && (
                            <span className="w-px flex-1 bg-border mt-1 min-h-[16px]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text} border border-current/20`}>
                              {cfg.label}
                            </span>
                            <p className="text-sm font-bold leading-tight">{event.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{event.detail}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-bold shrink-0 mt-1 opacity-70 group-hover:opacity-100">
                          {relTime}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </CardContent>
          </Card>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
<<<<<<< HEAD
                  <CardTitle>Platform Users</CardTitle>
                  <CardDescription>View and manage all registered accounts</CardDescription>
=======
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage all platform users</CardDescription>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
<<<<<<< HEAD
                    <TableHead>User</TableHead>
=======
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
<<<<<<< HEAD
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-sm">{user.isActive ? 'Active' : 'Suspended'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
=======
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={user.isActive ? 'bg-green-600' : 'bg-destructive'}>
                          {user.isActive ? 'Active' : 'Suspended'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="text-right">
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewingUserId(user.id)}
<<<<<<< HEAD
=======
                            title="View Details"
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
<<<<<<< HEAD
                            variant="destructive"
=======
                            variant="outline"
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                            onClick={() => setConfirmDialog({
                              open: true,
                              type: 'user',
                              id: user.id,
<<<<<<< HEAD
                              action: 'delete',
                            })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
=======
                              action: 'suspend',
                            })}
                            disabled={user.role === 'admin'}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                          {user.isDeleted ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-primary hover:text-primary"
                              onClick={() => {
                                // Assuming restoreUser exists or using updateUserStatus
                                // Based on my store update, restoreUser does exist
                                (useAuthStore.getState() as any).restoreUser(user.id);
                                toast({ title: 'User restored' });
                              }}
                            >
                              <RefreshCcw className="h-4 w-4 mr-1" />
                              Undo
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setConfirmDialog({
                                open: true,
                                type: 'user',
                                id: user.id,
                                action: 'delete',
                              })}
                              disabled={user.role === 'admin'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
<<<<<<< HEAD
                  <CardTitle>Property Listings</CardTitle>
                  <CardDescription>Manage properties across the platform</CardDescription>
=======
                  <CardTitle>Property Management</CardTitle>
                  <CardDescription>View and manage all property listings</CardDescription>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
<<<<<<< HEAD
                    placeholder="Search address, code, or title..."
=======
                    placeholder="Search properties..."
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
<<<<<<< HEAD
                    <TableHead>Property</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Availability</TableHead>
=======
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Landlord</TableHead>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => {
                    const landlord = getUserById(property.landlordId);
<<<<<<< HEAD
                    return (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div className="font-medium">
=======
                    
                    return (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">
                          <div>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                            {property.title}
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {property.propertyCode}
                            </div>
                          </div>
                        </TableCell>
<<<<<<< HEAD
                        <TableCell>{property.location}</TableCell>
                        <TableCell>₦{property.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={property.available ? 'default' : 'secondary'}>
                            {property.available ? 'Available' : 'Rented'}
                          </Badge>
                        </TableCell>
=======
                        <TableCell>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property.location}
                          </span>
                        </TableCell>
                        <TableCell>{formatPrice(property.price)}/yr</TableCell>
                        <TableCell className="capitalize">{property.type}</TableCell>
                        <TableCell>
                          <Badge className={property.available ? 'bg-green-600' : 'bg-yellow-600'}>
                            {property.available ? 'Available' : 'Rented'}
                          </Badge>
                        </TableCell>
                        <TableCell>{landlord?.name || 'Unknown'}</TableCell>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setViewingPropertyId(property.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {property.isDeleted ? (
<<<<<<< HEAD
                                <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => restoreProperty(property.id)}
                              >
                                <RefreshCcw className="h-4 w-4" />
                              </Button>
                            ) : (
                                <Button
=======
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-primary hover:text-primary"
                                onClick={() => {
                                  restoreProperty(property.id);
                                  toast({ title: 'Property restored' });
                                }}
                              >
                                <RefreshCcw className="h-4 w-4 mr-1" />
                                Undo
                              </Button>
                            ) : (
                              <Button
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                                size="sm"
                                variant="destructive"
                                onClick={() => setConfirmDialog({
                                  open: true,
                                  type: 'property',
                                  id: property.id,
                                  action: 'delete',
                                })}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inspections Tab */}
        <TabsContent value="inspections">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Inspection Requests</CardTitle>
                  <CardDescription>Manage all inspection requests</CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search inspections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInspections.map((inspection) => {
                    const property = properties.find(p => p.id === inspection.propertyId);
                    const tenant = getUserById(inspection.tenantId);
                    
                    return (
                      <TableRow key={inspection.id}>
                        <TableCell className="font-medium">{property?.title || 'Unknown'}</TableCell>
                        <TableCell>{tenant?.name || 'Unknown'}</TableCell>
                        <TableCell>{formatDate(inspection.createdAt)}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              inspection.status === 'approved' ? 'bg-green-600' :
                              inspection.status === 'rejected' ? 'bg-destructive' :
                              'bg-yellow-600'
                            }
                          >
                            {inspection.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setViewingInspectionId(inspection.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {inspection.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => setConfirmDialog({
                                    open: true,
                                    type: 'inspection',
                                    id: inspection.id,
                                    action: 'approve',
                                  })}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setConfirmDialog({
                                    open: true,
                                    type: 'inspection',
                                    id: inspection.id,
                                    action: 'reject',
                                  })}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5" />
                    Verification Queue
                  </CardTitle>
                  <CardDescription>
                    Landlords and solicitors awaiting verification
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {unverifiedUsers.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Verified!</h3>
                  <p className="text-muted-foreground">
                    No pending verification requests
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unverifiedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setViewingUserId(user.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => setConfirmDialog({
                                open: true,
                                type: 'user',
                                id: user.id,
                                action: 'verify',
                              })}
                            >
                              <BadgeCheck className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    Reported Properties
                  </CardTitle>
                  <CardDescription>
                    Properties flagged by users for review
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Reports</h3>
                  <p className="text-muted-foreground">
                    All properties are in good standing
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => {
                      const property = properties.find(p => p.id === report.propertyId);
                      const reporter = getUserById(report.reporterId);
                      
                      return (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{property?.title || 'Unknown'}</TableCell>
                          <TableCell>{reporter?.name || 'Unknown'}</TableCell>
                          <TableCell className="capitalize">
                            {report.reason.replace('_', ' ')}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                report.status === 'resolved' ? 'bg-green-600' :
                                report.status === 'reviewed' ? 'bg-blue-600' :
                                'bg-yellow-600'
                              }
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate('tenant-property', { id: report.propertyId })}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {report.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      updateReportStatus(report.id, 'reviewed');
                                      toast({ title: 'Report marked as reviewed' });
                                    }}
                                  >
                                    Review
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => setConfirmDialog({
                                      open: true,
                                      type: 'report',
                                      id: report.id,
                                      action: 'resolve',
                                    })}
                                  >
                                    Resolve
                                  </Button>
                                </>
                              )}
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

        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Platform Announcements
                  </CardTitle>
                  <CardDescription>
                    Manage platform-wide announcements
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAnnouncementDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <div className="text-center py-12">
                  <Megaphone className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Announcements</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first platform announcement
                  </p>
                  <Button onClick={() => setShowAnnouncementDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Announcement
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-4 border rounded-lg flex items-start justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{announcement.title}</p>
                          <Badge variant={announcement.isActive ? 'default' : 'secondary'}>
                            {announcement.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {announcement.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created: {formatDate(announcement.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAnnouncement(announcement.id, { isActive: !announcement.isActive })}
                        >
                          {announcement.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setConfirmDialog({
                            open: true,
                            type: 'announcement',
                            id: announcement.id,
                            action: 'delete',
                          })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trash Tab (Deleted Properties) */}
        <TabsContent value="trash">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Deleted Properties</CardTitle>
                  <CardDescription>Archive of removed listings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredDeletedProperties.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Trash is empty</h3>
                  <p className="text-muted-foreground">Deleted properties will appear here</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeletedProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">
                          <div className="cursor-pointer hover:text-primary transition-colors" onClick={() => setViewingPropertyId(property.id)}>
                            {property.title}
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {property.propertyCode}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{property.location}</TableCell>
                        <TableCell className="text-sm text-muted-foreground italic max-w-[200px] truncate">
                          {property.deletionReason}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                restoreProperty(property.id);
                                toast({ title: 'Property restored' });
                              }}
                            >
                              <RefreshCcw className="h-4 w-4 mr-1" />
                              Restore
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                permanentlyDeleteProperty(property.id);
                                toast({ title: 'Property permanently removed' });
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions (FAQ)</CardTitle>
              <CardDescription>Manage common questions displayed to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
<<<<<<< HEAD
              <div className="space-y-4">
                {content.faq.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg bg-muted/20 relative group">
                    {editingFaqId === item.id ? (
                      <div className="space-y-3">
                        <Input 
                          value={item.question} 
                          onChange={(e) => {
                            const newFaq = content.faq.map(f => f.id === item.id ? { ...f, question: e.target.value } : f);
                          }} 
                          className="font-semibold"
                        />
                        <Textarea 
                          value={item.answer}
                          onChange={(e) => {
                            // ...
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold">{item.question}</h4>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{item.answer}</p>
                      </>
                    )}
                    
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary"
                        onClick={() => {
                          const question = prompt('Edit Question:', item.question);
                          const answer = prompt('Edit Answer:', item.answer);
                          if (question && answer) {
                            updateFaq(content.faq.map(f => f.id === item.id ? { ...f, question, answer } : f));
                            toast({ title: 'FAQ updated' });
                          }
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => {
                          updateFaq(content.faq.filter(f => f.id !== item.id));
                          toast({ title: 'FAQ removed' });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-lg">Add New FAQ</h4>
                  <Badge variant="outline">Draft Mode</Badge>
                </div>
                <div className="grid gap-4 bg-muted/30 p-6 rounded-2xl border border-dashed border-primary/20">
                  <div className="space-y-2">
                    <Label className="font-bold">Question</Label>
=======
              {content.faq.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg bg-muted/20 relative group">
                  <h4 className="font-semibold">{item.question}</h4>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{item.answer}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                    onClick={() => updateFaq(content.faq.filter(f => f.id !== item.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="pt-4 border-t space-y-4">
                <h4 className="font-medium">Add New FAQ</h4>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Question</Label>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                    <Input 
                      value={newFaqQ} 
                      onChange={(e) => setNewFaqQ(e.target.value)} 
                      placeholder="e.g., How do I register as a landlord?" 
<<<<<<< HEAD
                      className="bg-white dark:bg-black border-primary/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Answer</Label>
=======
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Answer</Label>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                    <Textarea 
                      value={newFaqA} 
                      onChange={(e) => setNewFaqA(e.target.value)} 
                      placeholder="Enter the answer..."
<<<<<<< HEAD
                      rows={3}
                      className="bg-white dark:bg-black border-primary/10"
                    />
                  </div>
                  <Button 
                    onClick={async () => {
=======
                      rows={3} 
                    />
                  </div>
                  <Button 
                    onClick={() => {
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                      if (!newFaqQ.trim() || !newFaqA.trim()) {
                        toast({ title: 'Please fill both fields', variant: 'destructive' });
                        return;
                      }
<<<<<<< HEAD
                      setIsSubmitting(true);
                      const success = await updateFaq([...content.faq, { id: Date.now().toString(), question: newFaqQ.trim(), answer: newFaqA.trim() }]);
                      setIsSubmitting(false);
                      if (success) {
                        setNewFaqQ('');
                        setNewFaqA('');
                        toast({ title: 'FAQ Published successfully' });
                      } else {
                        toast({ title: 'Failed to publish FAQ', variant: 'destructive' });
                      }
                    }}
                    className="w-full md:w-fit bg-[#008751] hover:bg-[#007043]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Publish to Website
=======
                      updateFaq([...content.faq, { id: Date.now().toString(), question: newFaqQ.trim(), answer: newFaqA.trim() }]);
                      setNewFaqQ('');
                      setNewFaqA('');
                      toast({ title: 'FAQ added successfully' });
                    }}
                    className="w-fit"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add FAQ
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Us</CardTitle>
              <CardDescription>Edit the About Us page content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                value={aboutUs} 
                onChange={(e) => setAboutUs(e.target.value)}
<<<<<<< HEAD
                rows={10}
                placeholder="Enter the About Us content..."
                className="font-medium leading-relaxed"
              />
              <Button 
                onClick={async () => {
                  setIsSubmitting(true);
                  const success = await updateAboutUs(aboutUs);
                  setIsSubmitting(false);
                  if (success) {
                    toast({ title: 'About Us Published' });
                  } else {
                    toast({ title: 'Failed to publish content', variant: 'destructive' });
                  }
                }}
                className="bg-[#008751] hover:bg-[#007043]"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                Publish About Us
=======
                rows={8}
                placeholder="Enter the About Us content..."
              />
              <Button 
                onClick={() => {
                  updateAboutUs(aboutUs);
                  toast({ title: 'About Us updated' });
                }}
              >
                Save About Us
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
              <CardDescription>Edit the platform's Terms and Conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                value={terms} 
                onChange={(e) => setTerms(e.target.value)}
<<<<<<< HEAD
                rows={15}
                placeholder="Enter the Terms & Conditions..."
                className="font-mono text-sm"
              />
              <Button 
                onClick={async () => {
                  setIsSubmitting(true);
                  const success = await updateTerms(terms);
                  setIsSubmitting(false);
                  if (success) {
                    toast({ title: 'Terms & Conditions Published' });
                  } else {
                    toast({ title: 'Failed to publish legal terms', variant: 'destructive' });
                  }
                }}
                className="bg-[#008751] hover:bg-[#007043]"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
                Publish Legal Terms
=======
                rows={12}
                placeholder="Enter the Terms & Conditions..."
              />
              <Button 
                onClick={() => {
                  updateTerms(terms);
                  toast({ title: 'Terms & Conditions updated' });
                }}
              >
                Save Terms & Conditions
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Announcement Dialog */}
      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>
              Create a platform-wide announcement that all users will see
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="announcementTitle">Title</Label>
              <Input
                id="announcementTitle"
                placeholder="e.g., Welcome to Oyalandlord!"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcementMessage">Message</Label>
              <Textarea
                id="announcementMessage"
                placeholder="Enter your announcement message..."
                rows={4}
                value={announcementForm.message}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnnouncementDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAnnouncement} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Megaphone className="mr-2 h-4 w-4" />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog?.open} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmDialog?.action} this {confirmDialog?.type}?
            </DialogDescription>
          </DialogHeader>
          
          {(confirmDialog?.type === 'property' || confirmDialog?.type === 'user') && confirmDialog?.action === 'delete' && (
            <div className="py-4 space-y-4">
              <Label>Reason for Deletion</Label>
              <Textarea 
                placeholder={`Why is this ${confirmDialog.type} being removed?`}
                value={deletionReason}
                onChange={(e) => setDeletionReason(e.target.value)}
                className="h-24"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(null)}>Cancel</Button>
            <Button 
              variant={confirmDialog?.action === 'delete' ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
              disabled={(confirmDialog?.type === 'property' || confirmDialog?.type === 'user') && confirmDialog?.action === 'delete' && !deletionReason.trim()}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Detail View */}
      <Dialog open={!!viewingUserId} onOpenChange={(open) => !open && setViewingUserId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information for platform user
            </DialogDescription>
          </DialogHeader>
          
          {viewingUserId && (() => {
            const user = users.find(u => u.id === viewingUserId);
            if (!user) return null;
            return (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase">Role</Label>
                    <div className="flex items-center gap-2">
<<<<<<< HEAD
                       <Shield className="h-4 w-4 text-primary" />
                       <span className="font-bold capitalize">{user.role}</span>
=======
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="font-bold capitalize">{user.role}</span>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase">Status</Label>
                    <div>
                      <Badge className={user.isActive ? 'bg-green-600' : 'bg-destructive'}>
                        {user.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                      {user.isDeleted && <Badge variant="secondary" className="ml-2">Deleted</Badge>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase">Joined</Label>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(user.createdAt)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase">Verified</Label>
                    <div className="flex items-center gap-2">
                       {user.isVerified ? (
                         <BadgeCheck className="h-4 w-4 text-green-600" />
                       ) : (
                         <Clock className="h-4 w-4 text-yellow-600" />
                       )}
                       <span className="text-sm">{user.isVerified ? 'Yes' : 'Pending'}</span>
                    </div>
                  </div>
                </div>

                {user.isDeleted && (
                  <div className="p-4 bg-destructive/5 border border-destructive/10 rounded-xl">
                    <Label className="text-xs text-destructive uppercase">Deletion Reason</Label>
                    <p className="text-sm italic text-destructive/80 mt-1">{user.deletionReason}</p>
                  </div>
                )}
              </div>
            );
          })()}
          
          <DialogFooter>
            <Button variant="outline" className="w-full" onClick={() => setViewingUserId(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inspection Detail View */}
      <Dialog open={!!viewingInspectionId} onOpenChange={(open) => !open && setViewingInspectionId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Inspection Details</DialogTitle>
            <DialogDescription>
              Details of the inspection request
            </DialogDescription>
          </DialogHeader>
          
          {viewingInspectionId && (() => {
            const inspection = allInspections.find(i => i.id === viewingInspectionId);
            if (!inspection) return null;
            const property = properties.find(p => p.id === inspection.propertyId);
            const tenant = getUserById(inspection.tenantId);
            return (
              <div className="space-y-6 py-4">
                <div className="p-4 border rounded-xl bg-muted/30">
                  <Label className="text-xs text-muted-foreground uppercase mb-2 block">Property</Label>
                  <p className="font-bold text-lg">{property?.title || 'Unknown Property'}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" /> {property?.location || 'Unknown'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase">Requester</Label>
                    <p className="font-semibold">{tenant?.name || 'Unknown'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase">Request Date</Label>
                    <p className="text-sm">{formatDate(inspection.createdAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase">Status</Label>
                    <div>
                      <Badge className={
                        inspection.status === 'approved' ? 'bg-green-600' :
                        inspection.status === 'rejected' ? 'bg-destructive' :
                        'bg-yellow-600'
                      }>
                        {inspection.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {inspection.status === 'pending' && (
                  <div className="pt-4 flex gap-2">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        updateInspectionStatus(inspection.id, 'approved');
                        setViewingInspectionId(null);
                        toast({ title: 'Inspection approved' });
                      }}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => {
                        updateInspectionStatus(inspection.id, 'rejected');
                        setViewingInspectionId(null);
                        toast({ title: 'Inspection rejected' });
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            );
          })()}
          
          <DialogFooter>
            <Button variant="outline" className="w-full" onClick={() => setViewingInspectionId(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Property Detail View (Read-Only as requested) */}
      <Dialog open={!!viewingPropertyId} onOpenChange={(open) => !open && setViewingPropertyId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Property Details</DialogTitle>
            <DialogDescription>
              Viewing full property information (Read-only Admin Mode)
            </DialogDescription>
          </DialogHeader>
          
          {viewingPropertyId && (
            (() => {
              const p = properties.concat(getDeletedProperties()).find(prop => prop.id === viewingPropertyId);
              if (!p) return null;
              const landlord = getUserById(p.landlordId);
              return (
                <div className="space-y-6 py-4">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <img 
                        src={p.images[0]} 
                        alt={p.title} 
                        className="w-full aspect-video object-cover rounded-xl border-2 shadow-sm" 
                      />
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {p.images.slice(1).map((img, i) => (
                          <img key={i} src={img} alt="" className="h-20 aspect-video object-cover rounded-lg border" />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold">{p.title}</h2>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {p.location}
                        </p>
                        <Badge className="mt-2 font-mono">{p.propertyCode}</Badge>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(p.price)}/year
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border rounded-xl">
                          <div className="text-xs text-muted-foreground uppercase">Type</div>
                          <div className="font-bold capitalize">{p.type}</div>
                        </div>
                        <div className="p-3 border rounded-xl">
                          <div className="text-xs text-muted-foreground uppercase">Bedrooms</div>
                          <div className="font-bold">{p.bedrooms}</div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-xl bg-muted/30">
                        <div className="text-xs text-muted-foreground uppercase mb-1">Landlord Information</div>
                        <div className="font-bold">{landlord?.name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{landlord?.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-bold mb-3">Description</h3>
                    <p className="text-muted-foreground leading-relaxed italic">{p.description}</p>
                  </div>
<<<<<<< HEAD
                  
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-bold mb-3">Amenities & Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {p.security?.map(a => <Badge key={a} variant="secondary">{a}</Badge>)}
                        {p.parking?.map(a => <Badge key={a} variant="secondary">{a}</Badge>)}
                        {p.outdoorSpace?.map(a => <Badge key={a} variant="secondary">{a}</Badge>)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-3">Policy</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Pets: {p.petPolicy}</Badge>
                        <Badge variant="outline">Furnishing: {p.furnishing}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-2 border-primary/10 rounded-2xl bg-primary/5">
                    <h3 className="text-lg font-bold mb-4">Financial Breakdown</h3>
                    <div className="space-y-2">
                      {p.breakdownItems.map(item => (
                        <div key={item.name} className="flex justify-between text-sm py-1 border-b border-primary/5 last:border-0">
                          <span>{item.name}</span>
                          <span className="font-bold">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-lg font-bold pt-2 text-primary">
                        <span>Total Annual Payment</span>
                        <span>{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(p.price + p.breakdownItems.reduce((acc, item) => acc + item.amount, 0))}</span>
                      </div>
                    </div>
                  </div>
                </div>
=======
                               <div className="grid sm:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold mb-3">Amenities & Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {p.security?.map(a => <Badge key={a} variant="secondary">{a}</Badge>)}
                      {p.parking?.map(a => <Badge key={a} variant="secondary">{a}</Badge>)}
                      {p.outdoorSpace?.map(a => <Badge key={a} variant="secondary">{a}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-3">Policy</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Pets: {p.petPolicy}</Badge>
                      <Badge variant="outline">Furnishing: {p.furnishing}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-2 border-primary/10 rounded-2xl bg-primary/5">
                  <h3 className="text-lg font-bold mb-4">Financial Breakdown</h3>
                  <div className="space-y-2">
                    {p.breakdownItems.map(item => (
                      <div key={item.name} className="flex justify-between text-sm py-1 border-b border-primary/5 last:border-0">
                        <span>{item.name}</span>
                        <span className="font-bold">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-lg font-bold pt-2 text-primary">
                      <span>Total Annual Payment</span>
                      <span>{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(p.price + p.breakdownItems.reduce((acc, item) => acc + item.amount, 0))}</span>
                    </div>
                  </div>
                </div>
</div>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
              );
            })()
          )}
          
          <DialogFooter>
            <Button variant="outline" className="w-full md:w-auto" onClick={() => setViewingPropertyId(null)}>
              Close Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
