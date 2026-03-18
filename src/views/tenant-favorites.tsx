'use client';

<<<<<<< HEAD
import { useRouter } from '@/lib/router';
import { useAuthStore, usePropertyStore, useFavoriteStore } from '@/lib/store';
=======
import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { useAuthStore, usePropertyStore, useFavoriteStore } from '@/lib/store';
import { Property, PropertyType } from '@/lib/types';
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Home,
  MapPin,
<<<<<<< HEAD
  ArrowLeft,
  Trash2,
  Eye,
  Bed,
  Bath,
=======
  Bed,
  Bath,
  ArrowLeft,
  Trash2,
  Building2,
  Shield,
  Loader2,
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
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

<<<<<<< HEAD
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
=======
// Property type labels
const propertyTypeLabels: Record<PropertyType, string> = {
  flat: 'Flat',
  house: 'House',
  duplex: 'Duplex',
  room: 'Room',
  studio: 'Studio',
  maisonette: 'Maisonette',
};

export default function TenantFavorites() {
  const { navigate, goBack } = useRouter();
  const { currentUser } = useAuthStore();
  const { properties, getPropertyById } = usePropertyStore();
  const { getFavoritesByUser, removeFavorite } = useFavoriteStore();
  const { toast } = useToast();
  
  const [removing, setRemoving] = useState<string | null>(null);
  
  const favorites = getFavoritesByUser(currentUser?.id || '');
  
  // Get favorited properties with details
  const favoriteProperties = favorites
    .map(fav => {
      const property = getPropertyById(fav.propertyId);
      return property ? { ...property, createdAt: fav.createdAt } : null;
    })
    .filter((p): p is Property & { createdAt: string } => p !== null);

  const handleRemoveFavorite = async (propertyId: string) => {
    if (!currentUser) return;
    
    setRemoving(propertyId);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    removeFavorite(currentUser.id, propertyId);
    
    toast({
      title: 'Removed from Favorites',
      description: 'Property has been removed from your favorites.',
    });
    
    setRemoving(null);
  };

  const handleViewProperty = (propertyId: string) => {
    navigate('tenant-property', { id: propertyId });
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
  };

  return (
    <div className="container px-4 py-8">
      {/* Header */}
<<<<<<< HEAD
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
=======
      <Button variant="ghost" onClick={goBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Favorites</h1>
        </div>
        <p className="text-muted-foreground">
          Properties you&apos;ve saved for later
        </p>
      </div>

      {/* Favorites List */}
      {favoriteProperties.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start browsing properties and save your favorites by clicking the heart icon
            </p>
            <Button onClick={() => navigate('tenant-dashboard')}>
              <Building2 className="mr-2 h-4 w-4" />
              Browse Properties
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {favoriteProperties.length} saved {favoriteProperties.length === 1 ? 'property' : 'properties'}
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <Card key={property.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Image */}
                <div className="aspect-[4/3] relative overflow-hidden">
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                  {property.images[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
<<<<<<< HEAD
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
=======
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Home className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    {propertyTypeLabels[property.type]}
                  </Badge>
                  <Badge className="absolute top-3 right-3 bg-green-600 text-white" variant="default">
                    No Agent Fee
                  </Badge>
                  {property.solicitorId && (
                    <Badge className="absolute bottom-3 left-3" variant="default">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {/* Availability Badge */}
                  {!property.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-base px-4 py-1">
                        No Longer Available
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {property.location}
                  </CardDescription>
                </CardHeader>
                
<<<<<<< HEAD
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
=======
                <CardContent className="space-y-4">
                  {/* Property Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(property.price)}
                      <span className="text-sm font-normal text-muted-foreground">/yr</span>
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleViewProperty(property.id)}
                      disabled={!property.available}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveFavorite(property.id)}
                      disabled={removing === property.id}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      {removing === property.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Saved Date */}
                  <p className="text-xs text-muted-foreground text-center">
                    Saved on {new Date((property as Property & { createdAt: string }).createdAt).toLocaleDateString('en-NG')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
        </div>
      )}
    </div>
  );
}
