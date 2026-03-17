'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { useAuthStore, useInspectionStore, usePropertyStore } from '@/lib/store';
import { InspectionRequest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Home,
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Phone,
  MessageCircle,
  Timer,
} from 'lucide-react';

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

// Countdown timer component
function CountdownTimer({ targetDate, status }: { targetDate?: string; status: string }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!targetDate || status !== 'approved') return;

    const calculateTimeLeft = () => {
      const target = new Date(targetDate);
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, status]);

  if (!timeLeft || status !== 'approved') return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-950/40 rounded-lg border border-green-200 dark:border-green-800">
      <Timer className="h-5 w-5 text-green-600 dark:text-green-400" />
      <div className="flex-1">
        <p className="text-xs text-green-700 dark:text-green-300 font-medium">Inspection scheduled in</p>
        <div className="flex gap-3 text-sm font-bold text-green-800 dark:text-green-200">
          {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
          <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
          <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
          <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>
      </div>
    </div>
  );
}

// Status badge component
function StatusBadge({ status }: { status: InspectionRequest['status'] }) {
  const config = {
    pending: {
      variant: 'secondary' as const,
      icon: Clock,
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    },
    approved: {
      variant: 'default' as const,
      icon: CheckCircle,
      label: 'Approved',
      className: 'bg-green-600',
    },
    rejected: {
      variant: 'destructive' as const,
      icon: XCircle,
      label: 'Rejected',
      className: '',
    },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <Badge className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
}

export default function TenantInspections() {
  const { navigate, goBack, params } = useRouter();
  const { currentUser, getUserById } = useAuthStore();
  const { getInspectionsByTenant } = useInspectionStore();
  const { getPropertyById } = usePropertyStore();

  const inspections = getInspectionsByTenant(currentUser?.id || '');
  
  // Sort by date (most recent first)
  const sortedInspections = [...inspections].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={goBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">My Inspection Requests</h1>
        <p className="text-muted-foreground">
          Track and manage your property inspection requests
        </p>
      </div>

      {sortedInspections.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Inspection Requests Yet</h2>
          <p className="text-muted-foreground mb-6">
            Start exploring properties and submit your first inspection request
          </p>
          <Button onClick={() => navigate('tenant-dashboard')}>
            Browse Properties
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedInspections.map((inspection) => {
            const property = getPropertyById(inspection.propertyId);
            const landlord = property ? getUserById(property.landlordId) : null;
            
            if (!property) return null;
            
            return (
              <Card key={inspection.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="md:w-48 h-40 md:h-auto shrink-0">
                    {property.images[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Home className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  {/* Inspection Details */}
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </p>
                        <p className="text-primary font-bold mt-2">
                          {formatPrice(property.price)}/year
                        </p>
                      </div>
                      <StatusBadge status={inspection.status} />
                    </div>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Requested: {formatDate(inspection.createdAt)}
                      </span>
                      {inspection.date && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Preferred: {formatDate(inspection.date)}
                        </span>
                      )}
                      {inspection.approvedAt && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Approved: {formatDate(inspection.approvedAt)}
                        </span>
                      )}
                      {inspection.rejectedAt && (
                        <span className="flex items-center gap-1 text-destructive">
                          <XCircle className="h-4 w-4" />
                          Rejected: {formatDate(inspection.rejectedAt)}
                        </span>
                      )}
                    </div>

                    {inspection.status === 'approved' && (
                      <div className="mt-4 space-y-3">
                        <CountdownTimer 
                          targetDate={inspection.date} 
                          status={inspection.status} 
                        />
                        <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                          <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-2">
                            🎉 Your inspection has been approved!
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {property.whatsappEnabled && property.whatsappNumber && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  const msgText = encodeURIComponent(`Hello, I'm interested in inspecting ${property.title}. My inspection request has been approved.`);
                                  const num = property.whatsappNumber || '';
                                  window.open(`https://wa.me/${num.replace(/[^0-9]/g, '')}?text=${msgText}`, '_blank');
                                }}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Contact on WhatsApp
                              </Button>
                            )}
                            {landlord && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  // Copy landlord contact
                                  navigator.clipboard?.writeText(landlord.email);
                                }}
                              >
                                <Phone className="h-4 w-4 mr-1" />
                                Landlord: {landlord.name}
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Payment Guidance */}
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                          <p className="text-sm font-bold text-primary mb-3">
                            Payment Guidance & Instructions
                          </p>
                          <div className="space-y-3 text-sm">
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                              <li>Only make payments through the provided official channels below.</li>
                              <li>Do not transfer money to unverified personal accounts.</li>
                              <li>Reference your Property Code (<b>{property.propertyCode}</b>) when making payment.</li>
                            </ul>
                            
                            <div className="grid sm:grid-cols-2 gap-4 mt-3">
                              <div className="bg-white dark:bg-black/20 p-3 rounded border">
                                <p className="text-xs text-muted-foreground font-semibold mb-1">Direct Bank Transfer</p>
                                <p className="font-bold">Bank: OyaBank PLC</p>
                                <p className="font-bold">Account: 1029384756</p>
                                <p className="font-bold">Name: OyaLandlord Escrow</p>
                              </div>
                              <div className="bg-white dark:bg-black/20 p-3 rounded border">
                                <p className="text-xs text-muted-foreground font-semibold mb-1">USSD Payment</p>
                                <p className="font-mono text-lg font-bold text-primary text-center">*737*000*1029384756#</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {inspection.status === 'rejected' && (
                      <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
                        <p className="text-sm text-destructive">
                          Unfortunately, your inspection request was not approved. You may want to explore other properties.
                        </p>
                      </div>
                    )}

                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('tenant-property', { id: property.id })}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Property
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
