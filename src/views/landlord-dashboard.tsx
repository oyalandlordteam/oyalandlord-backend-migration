'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { ChatWindow } from '@/components/chat-window';

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
          Add New Property
        </Button>
      </div>

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
          </CardContent>
        </Card>
      </div>

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
                </Card>
              ))}
            </div>
          )}
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
