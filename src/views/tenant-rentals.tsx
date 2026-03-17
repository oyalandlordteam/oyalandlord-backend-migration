'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { useAuthStore, useRentalStore, usePropertyStore } from '@/lib/store';
import { Rental } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText,
  Printer,
  Calendar,
  Home,
  ArrowLeft,
  MapPin,
  CheckCircle,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatWindow } from '@/components/chat-window';

// Format price in Nigerian Naira
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
    month: 'long',
    day: 'numeric',
  });
}

export default function TenantRentals() {
  const { navigate, goBack } = useRouter();
  const { currentUser } = useAuthStore();
  const { getRentalsByTenant } = useRentalStore();
  const { getPropertyById } = usePropertyStore();
  const { toast } = useToast();

  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [activeChat, setActiveChat] = useState<{ userId: string; propertyId?: string } | null>(null);

  const rentals = getRentalsByTenant(currentUser?.id || '');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={goBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">My Rentals & History</h1>
        <p className="text-muted-foreground">
          View your active rentals and payment history
        </p>
      </div>

      {rentals.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Rental History</h2>
          <p className="text-muted-foreground mb-6">
            You haven't rented any properties yet
          </p>
          <Button onClick={() => navigate('tenant-dashboard')}>
            Browse Properties
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {rentals.map((rental) => {
            const property = getPropertyById(rental.propertyId);
            if (!property) return null;

            return (
              <Card key={rental.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Property Info */}
                  <div className="md:w-64 h-48 md:h-auto shrink-0 relative">
                    {property.images[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Home className="h-10 w-10 text-muted-foreground/50" />
                      </div>
                    )}
                    <Badge 
                      className="absolute top-2 left-2"
                      variant={rental.status === 'active' ? 'default' : 'secondary'}
                    >
                      {rental.status === 'active' ? 'Active Rental' : 'Expired'}
                    </Badge>
                  </div>
                  
                  {/* Rental Details */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{property.title}</h3>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{formatPrice(rental.totalAmount)}</p>
                        <p className="text-xs text-muted-foreground capitalize">Paid for {rental.type}</p>
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Start Date
                        </p>
                        <p className="font-medium text-sm">{formatDate(rental.startDate)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Expiry Date
                        </p>
                        <p className="font-medium text-sm">{formatDate(rental.endDate)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase flex items-center gap-1">
                          <FileText className="h-3 w-3" /> Receipt No.
                        </p>
                        <p className="font-medium text-sm font-mono">{rental.receiptNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedRental(rental);
                          setShowReceipt(true);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Receipt
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setActiveChat({ userId: rental.landlordId, propertyId: rental.propertyId })}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message Landlord
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigate('tenant-property', { id: property.id })}
                      >
                        Property Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Official Rental Receipt</DialogTitle>
            <DialogDescription>
              Receipt for your property rental payment
            </DialogDescription>
          </DialogHeader>
          
          {selectedRental && (() => {
            const property = getPropertyById(selectedRental.propertyId);
            return (
              <div className="py-4 space-y-6">
                <div className="text-center border-b-2 border-primary/10 pb-4">
                  <h2 className="text-2xl font-bold text-primary">Oyalandlord</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">No Agent Fees • Verified Properties</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground uppercase font-semibold">Receipt Number</p>
                    <p className="font-bold text-sm font-mono">{selectedRental.receiptNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground uppercase font-semibold">Date Paid</p>
                    <p className="font-bold text-sm">{formatDate(selectedRental.startDate)}</p>
                  </div>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Property</p>
                  <p className="font-bold">{property?.title}</p>
                  <p className="text-xs text-muted-foreground">{property?.location}</p>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs uppercase">Description</TableHead>
                      <TableHead className="text-right text-xs uppercase">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRental.breakdownItems.map((item, index) => (
                      <TableRow key={index} className="border-none">
                        <TableCell className="py-2 text-sm">{item.name}</TableCell>
                        <TableCell className="py-2 text-right text-sm">{formatPrice(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 border-primary/20">
                      <TableCell className="font-bold">Total Paid</TableCell>
                      <TableCell className="text-right font-bold text-primary text-lg">
                        {formatPrice(selectedRental.totalAmount)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <div className="grid grid-cols-2 gap-4 text-xs pt-4">
                  <div className="p-2 border rounded">
                    <p className="text-muted-foreground uppercase font-semibold mb-1">Status</p>
                    <div className="flex items-center gap-1 text-green-600 font-bold">
                      <CheckCircle className="h-3 w-3" />
                      PAYMENT VERIFIED
                    </div>
                  </div>
                  <div className="p-2 border rounded">
                    <p className="text-muted-foreground uppercase font-semibold mb-1">Type</p>
                    <p className="font-bold uppercase">{selectedRental.type}</p>
                  </div>
                </div>
                
                <div className="text-center text-[10px] text-muted-foreground space-y-1">
                  <p>Oyalandlord Nigeria • 15 Admiralty Way, Lekki, Lagos</p>
                  <p>Certified Digital Receipt • All Rights Reserved</p>
                </div>
              </div>
            );
          })()}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowReceipt(false)} className="w-full sm:w-auto">
              Close
            </Button>
            <Button onClick={handlePrint} className="w-full sm:w-auto">
              <Printer className="mr-2 h-4 w-4" />
              Print / Save PDF
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
