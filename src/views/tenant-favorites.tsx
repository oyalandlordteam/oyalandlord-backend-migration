'use client';

import { useRouter } from '@/lib/router';
import { useAuthStore, usePropertyStore, useFavoriteStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Home,
  MapPin,
  ArrowLeft,
  Trash2,
  Eye,
  Bed,
  Bath,
} from 'lucide-react';
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

export default function TenantFavorites() {
  const { navigate, goBack } = useRouter();
  const { currentUser } = useAuthStore();
  const { getPropertyById } = usePropertyStore();
  const { getFavoritesByUser, removeFavorite } = useFavoriteStore();
  const { toast } = useToast();

  const favorites = getFavoritesByUser(currentUser?.id || '');

  const handleRemoveFavorite = (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser) {
      removeFavorite(currentUser.id, propertyId);
      toast({
        title: 'Removed from Favorites',
        description: 'Property has been removed from your saved list.',
      });
    }
  };

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={goBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">My Saved Properties</h1>
        <p className="text-muted-foreground">
          View and manage the properties you&apos;ve favorited
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Saved Properties</h2>
          <p className="text-muted-foreground mb-6">
            Explore properties and click the heart icon to save them here
          </p>
          <Button onClick={() => navigate('tenant-dashboard')}>
            Explore Properties
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => {
            const property = getPropertyById(favorite.propertyId);
            if (!property) return null;

            return (
              <Card 
                key={property.id} 
                className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group"
                onClick={() => navigate('tenant-property', { id: property.id })}
              >
                <div className="aspect-video relative overflow-hidden">
                  {property.images[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Home className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    {property.type}
                  </Badge>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleRemoveFavorite(property.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardHeader className="p-4">
                  <CardTitle className="text-lg truncate">{property.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {property.location}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {property.bedrooms} Bed
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {property.bathrooms} Bath
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(property.price)}
                      <span className="text-xs font-normal text-muted-foreground ml-1">/year</span>
                    </p>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
