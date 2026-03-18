'use client';

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
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'user' | 'property' | 'inspection' | 'report' | 'announcement';
    id: string;
    action: string;
  } | null>(null);
  
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [viewingPropertyId, setViewingPropertyId] = useState<string | null>(null);
  const [viewingInspectionId, setViewingInspectionId] = useState<string | null>(null);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletionReason, setDeletionReason] = useState('');
  
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
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Platform Users</CardTitle>
                  <CardDescription>View and manage all registered accounts</CardDescription>
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
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewingUserId(user.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setConfirmDialog({
                              open: true,
                              type: 'user',
                              id: user.id,
                              action: 'delete',
                            })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
                  <CardTitle>Property Listings</CardTitle>
                  <CardDescription>Manage properties across the platform</CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search address, code, or title..."
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
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => {
                    const landlord = getUserById(property.landlordId);
                    return (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div className="font-medium">
                            {property.title}
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {property.propertyCode}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{property.location}</TableCell>
                        <TableCell>₦{property.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={property.available ? 'default' : 'secondary'}>
                            {property.available ? 'Available' : 'Rented'}
                          </Badge>
                        </TableCell>
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
                    <Input 
                      value={newFaqQ} 
                      onChange={(e) => setNewFaqQ(e.target.value)} 
                      placeholder="e.g., How do I register as a landlord?" 
                      className="bg-white dark:bg-black border-primary/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Answer</Label>
                    <Textarea 
                      value={newFaqA} 
                      onChange={(e) => setNewFaqA(e.target.value)} 
                      placeholder="Enter the answer..."
                      rows={3}
                      className="bg-white dark:bg-black border-primary/10"
                    />
                  </div>
                  <Button 
                    onClick={async () => {
                      if (!newFaqQ.trim() || !newFaqA.trim()) {
                        toast({ title: 'Please fill both fields', variant: 'destructive' });
                        return;
                      }
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
                       <Shield className="h-4 w-4 text-primary" />
                       <span className="font-bold capitalize">{user.role}</span>
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
