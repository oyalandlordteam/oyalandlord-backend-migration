'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ChatWindow } from '@/components/chat-window';

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

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
          </CardContent>
        </Card>
      </div>

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
