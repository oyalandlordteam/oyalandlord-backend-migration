'use client';

import { useState, useMemo } from 'react';
import { useRouter } from '@/lib/router';
import { useAuthStore, usePropertyStore, useFavoriteStore } from '@/lib/store';
import { Property, PropertyType } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Heart, 
  Filter, 
  ArrowRight,
  Home,
  Building,
  Building2,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

export default function TenantDashboard() {
  const { navigate } = useRouter();
  const { currentUser } = useAuthStore();
  const { properties } = usePropertyStore();
  const { favorites, toggleFavorite, isFavorite } = useFavoriteStore();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PropertyType | 'all'>('all');
  const [activeChat, setActiveChat] = useState<{ userId: string; propertyId?: string } | null>(null);

  // Filter properties based on search and type
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || p.type === selectedType;
      return matchesSearch && matchesType && p.available;
    });
  }, [properties, searchQuery, selectedType]);

  const handleToggleFavorite = (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser) {
      toggleFavorite(currentUser.id, propertyId);
      const currentlyFavorite = isFavorite(currentUser.id, propertyId);
      toast({
        title: currentlyFavorite ? 'Removed from Favorites' : 'Added to Favorites',
        description: currentlyFavorite 
          ? 'Property has been removed from your saved list.' 
          : 'Property has been added to your saved list.',
      });
    }
  };

  const propertyTypes: { value: PropertyType | 'all'; label: string; icon: any }[] = [
    { value: 'all', label: 'All', icon: Home },
    { value: 'apartment', label: 'Apartments', icon: Building2 },
    { value: 'house', label: 'Houses', icon: Home },
    { value: 'studio', label: 'Studios', icon: Building },
  ];

  return (
    <div className="container px-4 py-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find Your Next Home</h1>
          <p className="text-muted-foreground mt-1">
            Browse through thousands of verified properties across Nigeria.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location or property name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {propertyTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Button
              key={type.value}
              variant={selectedType === type.value ? 'default' : 'outline'}
              className="rounded-full px-6"
              onClick={() => setSelectedType(type.value)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {type.label}
            </Button>
          );
        })}
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <Card 
              key={property.id} 
              className="overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => navigate('tenant-property', { id: property.id })}
            >
              <div className="aspect-[16/10] relative overflow-hidden">
                <img
                  src={property.images[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800'}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-3 left-3 bg-black/50 backdrop-blur-md border-none text-white">
                  {property.type}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-3 right-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 border-none transition-colors ${
                    currentUser && isFavorite(currentUser.id, property.id) ? 'text-red-500 hover:text-red-600' : 'text-white'
                  }`}
                  onClick={(e) => handleToggleFavorite(property.id, e)}
                >
                  <Heart className={`h-5 w-5 ${currentUser && isFavorite(currentUser.id, property.id) ? 'fill-current' : ''}`} />
                </Button>

                {/* Agent Tag if available */}
                {property.solicitorId && (
                  <Badge className="absolute bottom-3 left-3 bg-blue-600 border-none text-white flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    Verified Solicitor
                  </Badge>
                )}
              </div>
              
              <CardHeader className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors truncate">
                    {property.title}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setActiveChat({ userId: property.landlordId, propertyId: property.id })}>
                        Message Landlord
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleFavorite(property.id, new MouseEvent('click') as any)}>
                        {currentUser && isFavorite(currentUser.id, property.id) ? 'Remove from Saved' : 'Save Property'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {property.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    {property.bedrooms} Bed
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    {property.bathrooms} Bath
                  </span>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(property.price)}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Per Year</p>
                </div>
                <Button size="sm" className="group-hover:bg-primary/90">
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No properties found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn&apos;t find any properties matching your current search criteria. Try a different location or property type.
            </p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

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
