'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
<<<<<<< HEAD
import { 
  useAuthStore, 
  useInspectionStore,
  useNotificationStore,
  useActivityStore,
  usePropertyStore
} from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Calendar, 
  MapPin, 
  User, 
  CheckCircle, 
  XCircle,
  Clock,
  MessageSquare,
  Search,
  Filter,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
=======
import { useAuthStore, usePropertyStore, useInspectionStore, useSolicitorCommentStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  ShieldCheck,
  MapPin,
  ArrowRight,
  History,
  TrendingUp,
  AlertTriangle,
  FileText,
  Send,
  CheckSquare,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ChatWindow } from '@/components/chat-window';
import { MessageSquare } from 'lucide-react';
import {
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
<<<<<<< HEAD
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ChatWindow } from '@/components/chat-window';

// Format date
function formatDate(dateString: string): string {
=======

// Format date
function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

<<<<<<< HEAD
function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function SolicitorDashboard() {
  const { navigate } = useRouter();
  const { currentUser, getUserById } = useAuthStore();
  const { properties, getPropertyById } = usePropertyStore();
  const { 
    getInspectionsBySolicitor, 
    approveInspection, 
    rejectInspection 
  } = useInspectionStore();
  const { addNotification } = useNotificationStore();
  const { addActivity } = useActivityStore();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeChat, setActiveChat] = useState<{ userId: string; propertyId?: string } | null>(null);
  const [solicitorNote, setSolicitorNote] = useState('');

  const inspections = getInspectionsBySolicitor(currentUser?.id || '');
  
  // Filter search
  const filteredInspections = inspections.filter(i => {
    const property = getPropertyById(i.propertyId);
    const tenant = getUserById(i.tenantId);
    return (
      property?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property?.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const pendingCount = inspections.filter(i => i.status === 'pending').length;

  const handleApprove = async () => {
    if (!selectedInspection) return;
    
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate legal verification delay
    
    approveInspection(selectedInspection.id);
    
    const property = getPropertyById(selectedInspection.propertyId);
    
    // Notify tenant
    addNotification(
      selectedInspection.tenantId,
      'inspection_request',
      `Solicitor ${currentUser?.name} has verified your legal standing. Your inspection for ${property?.title} is approved.`,
      selectedInspection.id
    );

    // Notify landlord
    if (property) {
      addNotification(
        property.landlordId,
        'inspection_request',
        `Solicitor ${currentUser?.name} has approved the inspection request for ${property.title}.`,
        selectedInspection.id
      );
    }

    addActivity(currentUser?.id || '', 'solicitor_approval', `Verified inspection for ${property?.title}`);
    
    setIsVerifying(false);
    setSelectedInspection(null);
    setSolicitorNote('');
    toast({
      title: 'Legal Clearance Granted',
      description: 'The inspection has been approved and parties notified.',
    });
  };

  const handleReject = async () => {
    if (!selectedInspection) return;
    
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    rejectInspection(selectedInspection.id);
    const property = getPropertyById(selectedInspection.propertyId);

    addNotification(
      selectedInspection.tenantId,
      'inspection_request',
      `Legal verification failed for your request at ${property?.title}.`,
      selectedInspection.id
    );

    addActivity(currentUser?.id || '', 'solicitor_rejection', `Declined verification for ${property?.title}`);
    
    setIsVerifying(false);
    setSelectedInspection(null);
    setSolicitorNote('');
    toast({
      title: 'Legal Clearance Denied',
      variant: 'destructive',
    });
  };

  return (
    <div className="container px-4 py-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Solicitor Console</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Legal Partner</Badge>
          </div>
          <p className="text-muted-foreground">
            Review and provide legal clearance for property inspections.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary shadow-lg border-none text-white overflow-hidden relative">
          {/* Decorative shield icon in background */}
          <Shield className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10 rotate-12" />
          <CardHeader className="p-6">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">Pending Verification</p>
            <h3 className="text-4xl font-extrabold">{pendingCount}</h3>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-sm font-medium opacity-90">Requests awaiting legal clearance</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="p-6 pb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Verified This Month</p>
            <h3 className="text-2xl font-bold">{inspections.filter(i => i.status === 'approved').length}</h3>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-sm text-muted-foreground font-medium">Clearance rate: 94%</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="p-6 pb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Managed Properties</p>
            <h3 className="text-2xl font-bold">{properties.filter(p => p.solicitorId === currentUser?.id).length}</h3>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
              <Shield className="h-3 w-3 text-primary" /> Active legal oversight
            </p>
=======
export default function SolicitorDashboard() {
  const { currentUser, getUserById } = useAuthStore();
  const { getPropertyById, properties } = usePropertyStore();
  const { getPendingInspectionsBySolicitor, getInspectionsBySolicitor, updateInspectionStatus } = useInspectionStore();
  const { navigate } = useRouter();
  const { toast } = useToast();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedInspectionId, setSelectedInspectionId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<{ userId: string; propertyId?: string } | null>(null);
  
  // Bulk Actions State
  const [selectedInspections, setSelectedInspections] = useState<string[]>([]);

  // Document Review State
  const { addComment, getCommentsByInspection } = useSolicitorCommentStore();
  const [docReviewInspectionId, setDocReviewInspectionId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const pendingVerifications = getPendingInspectionsBySolicitor(currentUser?.id || '');
  const allInspections = getInspectionsBySolicitor(currentUser?.id || '');
  const completedVerifications = allInspections.filter(i => i.status !== 'pending');
  const supervisedProperties = properties.filter(p => p.solicitorId === currentUser?.id);

  const handleVerificationAction = (inspectionId: string, status: 'approved' | 'rejected') => {
    updateInspectionStatus(inspectionId, status);
    toast({
      title: `Verification ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      description: `The property asset has been ${status}.`,
    });
    setRejectDialogOpen(false);
    setSelectedInspectionId(null);
  };

  const confirmReject = (inspectionId: string) => {
    setSelectedInspectionId(inspectionId);
    setRejectDialogOpen(true);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInspections(pendingVerifications.map(v => v.id));
    } else {
      setSelectedInspections([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedInspections(prev => [...prev, id]);
    } else {
      setSelectedInspections(prev => prev.filter(i => i !== id));
    }
  };

  const handleBulkAction = (status: 'approved' | 'rejected') => {
    selectedInspections.forEach(id => {
      updateInspectionStatus(id, status);
    });
    toast({
      title: 'Bulk Action Completed',
      description: `${selectedInspections.length} assets have been ${status}.`,
    });
    setSelectedInspections([]);
  };

  const handleAddComment = () => {
    if (!docReviewInspectionId || !currentUser || !newComment.trim()) return;
    addComment(docReviewInspectionId, currentUser.id, newComment);
    setNewComment('');
  };

  const docComments = docReviewInspectionId ? getCommentsByInspection(docReviewInspectionId) : [];

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in slide-in-from-top-4 duration-700">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Legal Oversight Dashboard 👋
          </h1>
          <p className="text-lg font-bold text-muted-foreground max-w-2xl opacity-90">
            Welcome, Solicitor {currentUser?.name?.split(' ')[0]}. Manage asset verifications and maintain platform integrity.
          </p>
        </div>
        <div className="flex gap-3">
           <Badge variant="outline" className="h-10 px-4 font-extrabold border-primary/30 text-primary bg-primary/5 uppercase tracking-tighter flex items-center">
             <ShieldCheck className="h-4 w-4 mr-2 stroke-[2.5px]" />
             ACCREDITED OFFICER
           </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-700 delay-100">
        <Card className="dark:bg-white/5 dark:border-white/10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-amber-500/5 rounded-full group-hover:bg-amber-500/10 transition-colors" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Verification Backlog</CardDescription>
            <CardTitle className="text-4xl font-extrabold mt-1">{pendingVerifications.length}</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
               <Clock className="h-4 w-4 text-amber-500" />
               Awaiting legal review
             </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-white/5 dark:border-white/10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-emerald-500/5 rounded-full group-hover:bg-emerald-500/10 transition-colors" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Total Verified</CardDescription>
            <CardTitle className="text-4xl font-extrabold mt-1">{completedVerifications.length}</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
               <CheckCircle className="h-4 w-4 text-emerald-500" />
               Processed assets
             </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-white/5 dark:border-white/10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-blue-500/5 rounded-full group-hover:bg-blue-500/10 transition-colors" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Managed Assets</CardDescription>
            <CardTitle className="text-4xl font-extrabold mt-1">{supervisedProperties.length}</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
               <Building2 className="h-4 w-4 text-blue-500" />
               Under your supervision
             </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-white/5 dark:border-white/10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-rose-500/5 rounded-full group-hover:bg-rose-500/10 transition-colors" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Rejections</CardDescription>
            <CardTitle className="text-4xl font-extrabold mt-1">{completedVerifications.filter(v => v.status === 'rejected').length}</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
               <XCircle className="h-4 w-4 text-rose-500" />
               Assets declined
             </p>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
          </CardContent>
        </Card>
      </div>

<<<<<<< HEAD
      {/* Inspection List */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b p-4">
          <CardTitle className="text-lg">Recent Verification Requests</CardTitle>
          <CardDescription>Legal standing reviews for prospective tenants.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredInspections.length === 0 ? (
            <div className="p-12 text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-medium">No pending requests found</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredInspections.map((inspection) => {
                const property = getPropertyById(inspection.propertyId);
                const tenant = getUserById(inspection.tenantId);
                const landlord = property ? getUserById(property.landlordId) : null;
                
                if (!property || !tenant) return null;

                return (
                  <div key={inspection.id} className="p-4 md:p-6 hover:bg-muted/20 transition-colors flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground border shrink-0">
                        {tenant.name[0]}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-lg">{tenant.name}</p>
                          <Badge variant="outline" className="text-[10px] font-bold py-0 h-4">Prospective Tenant</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                          Requesting inspection for <span className="text-foreground font-bold">{property.title}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {property.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {formatDate(inspection.createdAt)}
                          </span>
                           {landlord && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" /> Owner: {landlord.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {inspection.status === 'pending' ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-10 px-4 font-bold border-border/50"
                            onClick={() => setSelectedInspection(inspection)}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Review File
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-10 w-10 border"
                            onClick={() => setActiveChat({ userId: tenant.id, propertyId: property.id })}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/50">
                          {inspection.status === 'approved' ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-xs font-black text-green-700 uppercase tracking-widest">Legally Cleared</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-destructive" />
                              <span className="text-xs font-black text-destructive uppercase tracking-widest">Flagged / Rejected</span>
                            </>
                          )}
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

      {/* Verification Dialog */}
      <Dialog open={!!selectedInspection} onOpenChange={() => setSelectedInspection(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Legal Case Review
            </DialogTitle>
            <DialogDescription className="font-medium">
              Review prospect documentations and confirm legal standing.
            </DialogDescription>
          </DialogHeader>
          
          {selectedInspection && (() => {
            const property = getPropertyById(selectedInspection.propertyId);
            const tenant = getUserById(selectedInspection.tenantId);
            
            return (
              <div className="py-4 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl border bg-muted/30">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5">Tenant Profile</p>
                    <p className="font-extrabold text-sm">{tenant?.name}</p>
                    <p className="text-xs text-muted-foreground">{tenant?.email}</p>
                  </div>
                  <div className="p-3 rounded-xl border bg-muted/30">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5">Property File</p>
                    <p className="font-extrabold text-sm truncate">{property?.title}</p>
                    <p className="text-xs text-muted-foreground">{property?.location}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <p className="text-sm font-bold">Verification Checklist</p>
                  </div>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50/50 dark:bg-green-950/10 border-green-200/50">
                      <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                      <p className="text-xs font-bold leading-tight">Identity document (NIN/International Passport) verified</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50/50 dark:bg-green-950/10 border-green-200/50">
                      <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                      <p className="text-xs font-bold leading-tight">Employment and income verification confirmed</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-blue-50/50 dark:bg-blue-950/10 border-blue-200/50">
                      <AlertCircle className="h-4 w-4 text-blue-600 shrink-0" />
                      <p className="text-xs font-bold leading-tight">Property ownership documents cleared for inspection</p>
                    </div>
                  </div>
                </div>
                
                {/* Screening Answers (if any) */}
                {selectedInspection.screeningAnswers && selectedInspection.screeningAnswers.length > 0 && (
                  <div className="space-y-3 p-4 bg-muted/30 rounded-xl border border-dashed">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      <p className="text-sm font-bold">Screening Responses</p>
                    </div>
                    <div className="space-y-4">
                      {selectedInspection.screeningAnswers.map((answer: any, idx: number) => {
                         const property = getPropertyById(selectedInspection.propertyId);
                         const question = property?.screeningQuestions?.find(q => q.id === answer.questionId);
                         return (
                           <div key={idx} className="space-y-1">
                             <p className="text-xs font-bold text-muted-foreground">Q: {question?.question || 'Question'}</p>
                             <p className="text-xs font-extrabold">A: <span className="text-primary italic">"{answer.answer}"</span></p>
                           </div>
                         );
                      })}
                    </div>
                  </div>
                )}

                {/* Inspection Note */}
                {selectedInspection.note && (
                  <div className="p-3 bg-muted/50 rounded-xl border group">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5">
                      <MessageSquare className="h-3 w-3" /> Tenant&apos;s Request Note
                    </p>
                    <p className="text-[11px] font-bold italic leading-relaxed">
                      &quot;{selectedInspection.note}&quot;
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest px-1">Solicitor Certification Note (Optional)</Label>
                  <Textarea
                    placeholder="Provide legal reasoning for this decision..."
                    className="min-h-[100px] font-bold text-sm bg-muted/20"
                    value={solicitorNote}
                    onChange={(e) => setSolicitorNote(e.target.value)}
                  />
                </div>
              </div>
            );
          })()}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              className="flex-1 font-bold h-11 border-destructive text-destructive hover:bg-destructive hover:text-white"
              onClick={handleReject}
              disabled={isVerifying}
            >
              {isVerifying ? <Clock className="animate-spin h-4 w-4" /> : <XCircle className="h-4 w-4 mr-2" />}
              Deny Clearance
            </Button>
            <Button 
              className="flex-1 font-extrabold h-11 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20"
              onClick={handleApprove}
              disabled={isVerifying}
            >
              {isVerifying ? <Clock className="animate-spin h-4 w-4" /> : <CheckCircle className="h-4 w-4 mr-2" />}
              Issue Clearance
=======
      <Tabs defaultValue="pending" className="space-y-6 animate-in fade-in duration-700 delay-200">
        <TabsList className="bg-white/5 border border-white/10 p-1.5 h-14 rounded-2xl">
          <TabsTrigger value="pending" className="px-6 h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-extrabold transition-all">
            <Clock className="h-4 w-4 mr-2" />
            Active Queue
            {pendingVerifications.length > 0 && (
              <Badge className="ml-2 bg-amber-500 text-white font-black border-none animate-pulse">
                {pendingVerifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="supervised" className="px-6 h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-extrabold transition-all">
            <Building2 className="h-4 w-4 mr-2" />
            Supervised Portfolio
          </TabsTrigger>
          <TabsTrigger value="history" className="px-6 h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-extrabold transition-all">
            <History className="h-4 w-4 mr-2" />
            Verification History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          <Card className="dark:bg-white/5 dark:border-white/10 backdrop-blur-sm overflow-hidden border border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div>
                <CardTitle className="text-2xl font-extrabold">Property Verification Queue</CardTitle>
                <CardDescription className="text-sm font-bold opacity-80 mt-1">
                  High-priority legal review for property assets.
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-extrabold border-amber-500/30 text-amber-600 bg-amber-500/5 uppercase tracking-tighter">
                {pendingVerifications.length} REQUIRED
              </Badge>
            </CardHeader>
            <CardContent>
              {pendingVerifications.length === 0 ? (
                <div className="text-center py-16">
                  <CheckCircle className="h-16 w-16 mx-auto text-emerald-500/30 mb-4" />
                  <h3 className="text-xl font-extrabold mb-1">Queue Clear</h3>
                  <p className="text-muted-foreground font-bold opacity-70">No property assets currently require legal verification.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedInspections.length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-xl animate-in slide-in-from-top-2">
                      <span className="text-sm font-extrabold text-primary">{selectedInspections.length} Assets Selected</span>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleBulkAction('approved')} className="bg-emerald-600 hover:bg-emerald-700 font-extrabold">
                          <CheckSquare className="h-4 w-4 mr-2" /> Verify Selected
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBulkAction('rejected')} className="font-extrabold">
                          <XCircle className="h-4 w-4 mr-2" /> Decline Selected
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-white/5 hover:bg-transparent border-white/10">
                          <TableHead className="w-12 px-6">
                            <Checkbox 
                              checked={pendingVerifications.length > 0 && selectedInspections.length === pendingVerifications.length}
                              onCheckedChange={handleSelectAll}
                              className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          </TableHead>
                          <TableHead className="font-black text-xs uppercase tracking-widest py-4 px-6">Property Asset</TableHead>
                          <TableHead className="font-black text-xs uppercase tracking-widest py-4 px-6">Owner</TableHead>
                          <TableHead className="font-black text-xs uppercase tracking-widest py-4 px-6">Requested</TableHead>
                          <TableHead className="text-right font-black text-xs uppercase tracking-widest py-4 px-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                    <TableBody>
                      {pendingVerifications.map((verification) => {
                        const property = getPropertyById(verification.propertyId);
                        const landlord = getUserById(property?.landlordId || '');
                        
                        if (!property) return null;
                        
                        return (
                          <TableRow key={verification.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                            <TableCell className="px-6 py-4">
                              <Checkbox 
                                checked={selectedInspections.includes(verification.id)}
                                onCheckedChange={(checked) => handleSelectOne(verification.id, !!checked)}
                                className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                   <Building2 className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-extrabold text-base leading-tight">{property.title}</p>
                                    <Badge className="font-black h-5 text-[10px] bg-primary text-primary-foreground border-none">
                                      {property.propertyCode}
                                    </Badge>
                                  </div>
                                  <p className="text-xs font-bold text-muted-foreground flex items-center gap-1 mt-0.5 uppercase tracking-tighter">
                                    <MapPin className="h-3 w-3" />
                                    {property.location}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4 font-bold">{landlord?.name}</TableCell>
                            <TableCell className="px-6 py-4 font-bold text-muted-foreground">{formatDate(verification.createdAt)}</TableCell>
                            <TableCell className="text-right px-6 py-4">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="font-extrabold"
                                  onClick={() => toast({ title: 'Information Requested', description: 'Landlord notified to provide more details.' })}
                                >
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Request Info
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  className="font-extrabold"
                                  onClick={() => setDocReviewInspectionId(verification.id)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Docs
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="bg-emerald-600 hover:bg-emerald-700 font-extrabold"
                                  onClick={() => handleVerificationAction(verification.id, 'approved')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Verify
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  className="font-extrabold"
                                  onClick={() => confirmReject(verification.id)}
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
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="supervised" className="mt-0">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {supervisedProperties.length === 0 ? (
              <Card className="sm:col-span-2 lg:col-span-3 py-16 text-center dark:bg-white/5 dark:border-white/10">
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-extrabold mb-1">Portfolio Empty</h3>
                <p className="text-muted-foreground font-bold opacity-70">You aren't currently supervising any property assets.</p>
              </Card>
            ) : (
              supervisedProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden dark:bg-white/5 dark:border-white/10 group hover:border-primary transition-all duration-300">
                  <div className="aspect-video relative overflow-hidden">
                    {property.images[0] ? (
                      <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center"><Building2 className="h-10 w-10 opacity-20" /></div>
                    )}
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-black border-none uppercase tracking-tighter" variant="default">
                      {property.propertyCode}
                    </Badge>
                    <Badge className="absolute top-3 right-3 bg-emerald-600 text-white font-black border-none uppercase tracking-tighter" variant="default">
                      <ShieldCheck className="h-3 w-3 mr-1.5" />
                      Legal Shield Active
                    </Badge>
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-extrabold group-hover:text-primary transition-colors line-clamp-1">{property.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 font-bold">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {property.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Button variant="outline" className="w-full font-extrabold border-white/10 hover:bg-primary hover:text-primary-foreground transition-all">
                       View Case File <ArrowRight className="ml-2 h-4 w-4" />
                     </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <Card className="dark:bg-white/5 dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-extrabold">Activity Log</CardTitle>
              <CardDescription className="font-bold opacity-70">Historical record of all property asset verifications.</CardDescription>
            </CardHeader>
            <CardContent>
              {completedVerifications.length === 0 ? (
                <div className="text-center py-16 opacity-50">No verified assets in history.</div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-white/5 hover:bg-transparent">
                        <TableHead className="font-black text-xs uppercase tracking-widest p-4">Asset</TableHead>
                        <TableHead className="font-black text-xs uppercase tracking-widest p-4">Outcome</TableHead>
                        <TableHead className="font-black text-xs uppercase tracking-widest p-4">Processed Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedVerifications.map((v) => {
                        const property = getPropertyById(v.propertyId);
                        return (
                          <TableRow key={v.id} className="border-white/5">
                            <TableCell className="p-4">
                               <p className="font-extrabold">{property?.title || 'Unknown Asset'}</p>
                               <p className="text-xs font-bold text-muted-foreground opacity-70 uppercase tracking-tighter">{property?.location}</p>
                            </TableCell>
                            <TableCell className="p-4">
                               <Badge 
                                 className={cn("font-black uppercase tracking-tighter", v.status === 'approved' ? "bg-emerald-600" : "bg-rose-600")}
                               >
                                 {v.status === 'approved' ? 'Verified' : 'Declined'}
                               </Badge>
                            </TableCell>
                            <TableCell className="p-4 font-bold opacity-80">
                               {formatDate(v.approvedAt || v.rejectedAt || '')}
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

      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="dark:bg-[#121212] dark:border-white/10 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-500 font-extrabold text-2xl">
              <AlertTriangle className="h-6 w-6" />
              Confirm Decline
            </DialogTitle>
            <DialogDescription className="font-bold text-base pt-2">
              Are you sure you want to decline this property asset verification? This action will require the landlord to resubmit legal documentation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-6">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="font-extrabold h-11 px-6 rounded-xl border-white/10">
              Go Back
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedInspectionId && handleVerificationAction(selectedInspectionId, 'rejected')}
              className="font-extrabold h-11 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-900/20"
            >
              Decline Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Review Dialog */}
      <Dialog open={!!docReviewInspectionId} onOpenChange={(open) => !open && setDocReviewInspectionId(null)}>
        <DialogContent className="max-w-2xl dark:bg-[#121212] dark:border-white/10 rounded-2xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-extrabold text-2xl">
              <Layers className="h-6 w-6 text-primary" />
              Document Review
            </DialogTitle>
            <DialogDescription className="font-bold text-base pt-2">
              Review landlord documentation and leave required comments before verification.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 my-4">
            {/* Property/Inspection Details */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="font-extrabold text-sm text-primary mb-2 uppercase tracking-wider">Inspection Details & Notes</h4>
              {docReviewInspectionId && useInspectionStore.getState().getInspectionById(docReviewInspectionId)?.notes ? (
                <div className="text-sm bg-black/20 p-3 rounded-lg whitespace-pre-wrap border border-white/5">
                  {useInspectionStore.getState().getInspectionById(docReviewInspectionId)?.notes}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No additional notes or screening answers provided.</p>
              )}
            </div>

            {/* Mock Document Viewer */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center min-h-[150px] text-muted-foreground">
              <FileText className="h-16 w-16 mb-4 opacity-30" />
              <p className="font-bold">Landlord Proof of Ownership.pdf</p>
              <p className="text-xs opacity-70">Secured Document View</p>
              <Button variant="secondary" size="sm" className="mt-4 font-extrabold">Open Full Screen</Button>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> 
                Solicitor Notes & Comments
              </h4>
              <div className="space-y-3">
                {docComments.length === 0 ? (
                  <p className="text-sm font-bold text-muted-foreground opacity-70 italic">No notes added yet.</p>
                ) : (
                  docComments.map(comment => (
                    <div key={comment.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-extrabold text-sm text-primary">Solicitor {getUserById(comment.solicitorId)?.name || 'Unknown'}</span>
                        <span className="text-xs opacity-60 font-bold">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-start">
            <Textarea 
              placeholder="Add your legal notes or verification findings here..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="resize-none dark:bg-black/40 border-white/10 font-bold"
              rows={2}
            />
            <Button onClick={handleAddComment} className="h-auto font-extrabold">
              <Send className="h-4 w-4" />
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
