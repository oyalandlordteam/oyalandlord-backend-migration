'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { 
  useAuthStore, 
  usePropertyStore, 
  useInspectionStore, 
  useRentalStore,
  useNotificationStore,
  useActivityStore,
  useReportStore
} from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  MoreVertical,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Trash2,
  Lock,
  Unlock,
  Eye,
  Settings,
  Download,
  Calendar,
  CreditCard,
  Flag,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
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
  const { navigate } = useRouter();
  const { users, currentUser, updateProfile, deleteUser } = useAuthStore();
  const { properties, deleteProperty, updateProperty } = usePropertyStore();
  const { inspections } = useInspectionStore();
  const { rentals } = useRentalStore();
  const { addNotification } = useNotificationStore();
  const { activities } = useActivityStore();
  const { reports, updateReportStatus } = useReportStore();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'user' | 'property' | 'report' } | null>(null);

  // Stats calculation
  const totalRevenue = rentals.reduce((acc, r) => acc + r.totalAmount, 0);
  const totalProperties = properties.length;
  const activeUsers = users.length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;

  // Filters
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (id: string, type: 'user' | 'property' | 'report', action: string) => {
    switch (type) {
      case 'user':
        if (action === 'delete') {
          setItemToDelete({ id, type: 'user' });
          setIsDeleteDialogOpen(true);
        } else if (action === 'toggle-status') {
          const user = users.find(u => u.id === id);
          if (user) {
            updateProfile(id, { isActive: !user.isActive });
            toast({
              title: `User ${user.isActive ? 'Deactivated' : 'Activated'}`,
              description: `${user.name}'s account status has been updated.`,
            });
          }
        }
        break;
      case 'property':
        if (action === 'delete') {
          setItemToDelete({ id, type: 'property' });
          setIsDeleteDialogOpen(true);
        } else if (action === 'toggle-featured') {
          const property = properties.find(p => p.id === id);
          if (property) {
            updateProperty({ ...property, isFeatured: !property.isFeatured });
            toast({ title: 'Success', description: 'Property featuring updated.' });
          }
        }
        break;
      case 'report':
        if (action === 'resolve') {
          updateReportStatus(id, 'resolved');
          toast({ title: 'Report Resolved', description: 'The issue has been marked as resolved.' });
        } else if (action === 'dismiss') {
          updateReportStatus(id, 'dismissed');
          toast({ title: 'Report Dismissed', description: 'The report has been hidden.' });
        }
        break;
    }
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'user') {
      deleteUser(itemToDelete.id);
      toast({ title: 'User Removed', variant: 'destructive' });
    } else if (itemToDelete.type === 'property') {
      deleteProperty(itemToDelete.id);
      toast({ title: 'Listing Removed', variant: 'destructive' });
    }

    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="container px-4 py-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold tracking-tight">System Administration</h1>
            <Badge className="bg-destructive text-destructive-foreground">Super Admin</Badge>
          </div>
          <p className="text-muted-foreground font-medium">
            Monitor system health, manage users, and moderate content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Audit Logs
          </Button>
          <Button size="sm">
            <Settings className="mr-2 h-4 w-4" />
            System Config
          </Button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-lg bg-primary text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="h-20 w-20" />
          </div>
          <CardHeader className="pb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">GTV (Gross Transaction Value)</p>
            <CardTitle className="text-3xl font-black">{formatCurrency(totalRevenue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <TrendingUp className="h-3 w-3" />
              <span>+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">User Base</p>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{activeUsers}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tight">
              <span className="text-green-600">84%</span> active engagement rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Inventory</p>
            <Building2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalProperties}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tight">
              {properties.filter(p => p.available).length} units available
            </p>
          </CardContent>
        </Card>

        <Card className={`border-none shadow-sm ${pendingReports > 0 ? 'bg-destructive/10 text-destructive' : 'bg-green-50 text-green-700'}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Security Alerts</p>
            <AlertTriangle className={`h-4 w-4 ${pendingReports > 0 ? 'animate-pulse' : ''}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">
              {pendingReports === 0 ? 'Clear' : `${pendingReports} Pending`}
            </div>
            <p className="text-[10px] font-bold mt-1 uppercase tracking-tight">
              {pendingReports === 0 ? 'No unresolved issues' : 'Immediate action required'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Control</TabsTrigger>
          <TabsTrigger value="reports" className="relative">
            Moderation Queue
            {pendingReports > 0 && (
              <Badge className="ml-2 bg-destructive text-destructive-foreground h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                {pendingReports}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="audit">Full Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="border-border/30">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Real-time Stream</CardTitle>
                    <CardDescription>Latest actions executed across the platform.</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs font-bold font-mono">LIVE_FEED</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y text-sm">
                    {activities.slice(0, 8).map((activity) => (
                      <div key={activity.id} className="p-4 flex gap-4 hover:bg-muted/30 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          {activity.type === 'auth_action' ? <ShieldCheck className="h-4 w-4 text-primary" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold leading-none">{activity.description}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium mt-1">
                             <span className="uppercase tracking-widest">{formatDate(activity.createdAt)}</span>
                             <span className="w-1 h-1 rounded-full bg-border" />
                             <span>ID: {activity.userId.substring(0, 8)}...</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-muted/20 text-center">
                    <Button variant="link" size="sm" className="text-xs font-bold">View all activity logs →</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Health Summary */}
              <div className="space-y-6">
                <Card className="border-border/30">
                   <CardHeader>
                    <CardTitle className="text-lg">Service Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <span className="font-bold text-sm">Web Dashboard</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest">v4.0.2 Stable</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <span className="font-bold text-sm">Backend API Gateway</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest">99.9% Uptime</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                        <span className="font-bold text-sm">Payment Processor (Interswitch)</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest">High Latency</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/30 bg-muted/10">
                  <CardHeader>
                    <CardTitle className="text-base font-bold">Admin Quick Search</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search global database (Users, Properties, Trans ID)..." 
                        className="pl-10 h-10 border-border/50 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest h-10">
                        Pending KYC
                      </Button>
                      <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest h-10">
                        Dispute Cases
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="border-border/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black">Directory Services</CardTitle>
                <CardDescription>Manage user roles, statuses, and authentication.</CardDescription>
              </div>
              <div className="flex gap-2">
                 <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Find by name/email..." 
                    className="pl-9 h-9 w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button size="sm">
                   <Plus className="mr-2 h-4 w-4" /> Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest">Identity</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest">Role</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest">Joined</TableHead>
                      <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest">Control</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                              {user.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-sm leading-none">{user.name}</p>
                              <p className="text-[10px] text-muted-foreground font-medium mt-1">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <div className={`h-1.5 w-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${user.isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
                              {user.isActive ? 'Active' : 'Offline'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate('profile', { id: user.id })}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction(user.id, 'user', 'toggle-status')}>
                                {user.isActive ? <Lock className="mr-2 h-4 w-4" /> : <Unlock className="mr-2 h-4 w-4" />}
                                {user.isActive ? 'Suspend User' : 'Restore User'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => handleAction(user.id, 'user', 'delete')}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card className="border-border/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black">Global Listings Manager</CardTitle>
                <CardDescription>Property moderation and featured slot allocation.</CardDescription>
              </div>
               <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Filter properties..." 
                  className="pl-9 h-9 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest">Asset</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest">Location</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest">Pricing</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest">Exposure</TableHead>
                      <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest">Control</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property) => (
                      <TableRow key={property.id} className="hover:bg-muted/20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-14 rounded-md overflow-hidden bg-muted border shrink-0">
                               <img 
                                src={property.images[0]} 
                                alt={property.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                               <p className="font-bold text-sm leading-tight max-w-[180px] truncate">{property.title}</p>
                               <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-tighter">Owner ID: {property.landlordId.substring(0, 8)}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-bold">{property.location}</TableCell>
                        <TableCell className="text-xs font-black text-primary">{formatCurrency(property.price)}</TableCell>
                        <TableCell>
                           <Badge 
                            variant={property.isFeatured ? "default" : "outline"}
                            className="text-[9px] font-black uppercase tracking-tighter"
                           >
                            {property.isFeatured ? 'HOT LISTING' : 'STANDARD'}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('tenant-property', { id: property.id })}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleAction(property.id, 'property', 'toggle-featured')}>
                                  <TrendingUp className="mr-2 h-4 w-4" /> Toggle Featured
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => handleAction(property.id, 'property', 'delete')}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete Listing
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="border-border/30">
            <CardHeader>
              <CardTitle className="text-xl font-black">Moderation Stream</CardTitle>
              <CardDescription>User reported content and system flags.</CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                   <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-20" />
                   <p className="font-bold">System is clean. No active reports.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => {
                    const reporter = users.find(u => u.id === report.userId);
                    const property = properties.find(p => p.id === report.propertyId);
                    
                    return (
                      <div key={report.id} className={`p-5 rounded-2xl border flex flex-col md:flex-row gap-5 transition-all ${report.status === 'pending' ? 'bg-destructive/5 border-destructive/20 shadow-sm' : 'bg-muted/30 opacity-70 border-border/50'}`}>
                         <div className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                            <Flag className="h-6 w-6" />
                         </div>
                         <div className="flex-1 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                               <div>
                                 <p className="text-sm font-black text-destructive uppercase tracking-widest">{report.reason}</p>
                                 <p className="text-xs text-muted-foreground font-medium mt-1">
                                   Reported by <span className="text-foreground font-bold">{reporter?.name || 'Unknown User'}</span>
                                 </p>
                               </div>
                               <Badge variant={report.status === 'pending' ? 'destructive' : 'default'} className="w-fit text-[10px] font-black uppercase tracking-tighter">
                                 {report.status}
                               </Badge>
                            </div>

                            <div className="p-3 bg-background rounded-lg border text-xs leading-relaxed font-bold italic shadow-inner">
                              &quot;{report.description}&quot;
                            </div>

                            {property && (
                              <div className="flex items-center gap-3 p-2 bg-muted/40 rounded-lg border border-border/50">
                                <img src={property.images[0]} alt="" className="h-10 w-10 rounded-md object-cover" />
                                <div>
                                   <p className="text-xs font-black truncate max-w-[200px]">{property.title}</p>
                                   <p className="text-[10px] text-muted-foreground font-bold">{property.location}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto" onClick={() => navigate('tenant-property', { id: property.id })}>
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            )}

                            {report.status === 'pending' && (
                              <div className="flex gap-2 pt-2">
                                <Button size="sm" className="h-8 text-[10px] font-black uppercase" onClick={() => handleAction(report.id, 'report', 'resolve')}>
                                  Mark Resolved
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase" onClick={() => handleAction(report.id, 'report', 'dismiss')}>
                                  Dismiss
                                </Button>
                                <Button variant="destructive" size="sm" className="h-8 text-[10px] font-black uppercase ml-auto" onClick={() => handleAction(property?.id || '', 'property', 'delete')}>
                                  Nuclear Opt: Delete Listing
                                </Button>
                              </div>
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

        <TabsContent value="audit">
           <Card className="border-border/30">
            <CardHeader>
              <CardTitle className="text-xl font-black">System Audit Log</CardTitle>
              <CardDescription>Comprehensive ledger of all platform interactions.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest">Timestamp</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest">Event Type</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest">User Descriptor</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest">Description</TableHead>
                      <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest">Hash Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id} className="font-mono text-[11px] hover:bg-muted/20">
                        <TableCell className="font-bold">{new Date(activity.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[9px] font-black tracking-tighter">
                            {activity.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-bold">{activity.userId.substring(0, 12)}...</TableCell>
                        <TableCell className="font-bold text-foreground/80">{activity.description}</TableCell>
                        <TableCell className="text-right text-muted-foreground opacity-50">#RX-{activity.id.substring(0, 6)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black">CRITICAL ACTION REQUIRED</AlertDialogTitle>
            <AlertDialogDescription className="font-bold">
              You are about to permanently delete this {itemToDelete?.type} from the database.
              This action creates an irreversible change in the system ledger. Are you absolutely sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold">Abstain</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90 font-black" onClick={confirmDelete}>
              CONFIRM DELETION
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
