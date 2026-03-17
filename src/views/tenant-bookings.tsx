'use client';

import { useRouter } from '@/lib/router';
import { useAuthStore, usePropertyStore, useBookingStore } from '@/lib/store';
import { Booking } from '@/lib/types';
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
  Loader2,
  Eye,
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

// Status badge component
function StatusBadge({ status }: { status: Booking['status'] }) {
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

export default function TenantBookings() {
  const { navigate, goBack } = useRouter();
  const { currentUser } = useAuthStore();
  const { getPropertyById } = usePropertyStore();
  const { getInspectionsByTenant } = useBookingStore();

  const bookings = getInspectionsByTenant(currentUser?.id || '');
  
  // Sort by date (most recent first)
  const sortedBookings = [...bookings].sort(
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
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">
          Track and manage your property booking requests
        </p>
      </div>

      {sortedBookings.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Bookings Yet</h2>
          <p className="text-muted-foreground mb-6">
            Start exploring properties and submit your first booking request
          </p>
          <Button onClick={() => navigate('tenant-dashboard')}>
            Browse Properties
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBookings.map((booking) => {
            const property = getPropertyById(booking.propertyId);
            
            if (!property) return null;
            
            return (
              <Card key={booking.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="md:w-48 h-40 md:h-auto shrink-0">
                    {property.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
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
                  
                  {/* Booking Details */}
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
                      <StatusBadge status={booking.status} />
                    </div>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Requested: {formatDate(booking.createdAt)}
                      </span>
                      {booking.approvedAt && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Approved: {formatDate(booking.approvedAt)}
                        </span>
                      )}
                      {booking.rejectedAt && (
                        <span className="flex items-center gap-1 text-destructive">
                          <XCircle className="h-4 w-4" />
                          Rejected: {formatDate(booking.rejectedAt)}
                        </span>
                      )}
                    </div>

                    {booking.status === 'approved' && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <p className="text-sm text-green-700 dark:text-green-400">
                          🎉 Congratulations! Your booking has been approved. The landlord will contact you shortly.
                        </p>
                      </div>
                    )}

                    {booking.status === 'rejected' && (
                      <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
                        <p className="text-sm text-destructive">
                          Unfortunately, your booking request was not approved. You may want to explore other properties.
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
