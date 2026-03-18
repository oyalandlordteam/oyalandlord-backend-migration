'use client';

<<<<<<< HEAD
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
=======
import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { useAuthStore, usePropertyStore, useFavoriteStore } from '@/lib/store';
import { Property, PropertyType, SearchFilters } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Home,
  MapPin,
  Bed,
  Bath,
  Calendar,
  Shield,
  ArrowRight,
  SlidersHorizontal,
  X,
  Heart,
  Zap,
  Droplets,
  Building,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
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

<<<<<<< HEAD
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
=======
// Property type labels
const propertyTypeLabels: Record<PropertyType | 'all', string> = {
  all: 'All Types',
  flat: 'Flat',
  house: 'House',
  duplex: 'Duplex',
  room: 'Room',
  studio: 'Studio',
  maisonette: 'Maisonette',
};

// Amenity options
const amenityOptions = [
  { id: 'market', label: 'Market' },
  { id: 'hospital', label: 'Hospital' },
  { id: 'school', label: 'School' },
  { id: 'police', label: 'Police Station' },
];

// Power supply options
const powerOptions = [
  { id: '24/7', label: '24/7 Light' },
  { id: 'generator', label: 'Generator Included' },
  { id: 'solar', label: 'Solar' },
];

// Water supply options
const waterOptions = [
  { id: 'pipe-borne', label: 'Pipe-borne Water' },
  { id: 'borehole', label: 'Borehole' },
  { id: 'well', label: 'Well' },
];

export default function TenantDashboard() {
  const { currentUser } = useAuthStore();
  const { getFilteredProperties, filters, setFilters } = usePropertyStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const { navigate } = useRouter();
  const { toast } = useToast();
  
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters & {
    amenities: string[];
    powerSupply: string[];
    waterSupply: string[];
  }>({
    ...filters,
    amenities: [],
    powerSupply: [],
    waterSupply: [],
  });

  const [activeChat, setActiveChat] = useState<{ userId: string; propertyId?: string } | null>(null);

  const filteredProperties = getFilteredProperties();

  const handleApplyFilters = () => {
    // Check if the location input looks like a property code
    const potentialCode = localFilters.location?.trim().toUpperCase() || '';
    if (potentialCode.startsWith('OYA-') || (potentialCode.length === 4 && !potentialCode.includes(' '))) {
      const property = usePropertyStore.getState().getPropertyByCode(potentialCode);
      if (property) {
        navigate('tenant-property', { id: property.id });
        return;
      }
    }

    setFilters({
      location: localFilters.location,
      minPrice: localFilters.minPrice,
      maxPrice: localFilters.maxPrice,
      type: localFilters.type,
      bedrooms: localFilters.bedrooms,
    });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: SearchFilters & { amenities: string[]; powerSupply: string[]; waterSupply: string[] } = {
      location: '',
      minPrice: undefined,
      maxPrice: undefined,
      type: 'all',
      bedrooms: 'all',
      amenities: [],
      powerSupply: [],
      waterSupply: [],
    };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
  };

  const hasActiveFilters = filters.location || filters.minPrice !== undefined || filters.maxPrice !== undefined || 
    filters.type !== 'all' || filters.bedrooms !== 'all';

  const toggleFavorite = (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      toast({
        title: 'Login Required',
        description: 'Please login to save favorites',
        variant: 'destructive',
      });
      navigate('login');
      return;
    }
    
    if (isFavorite(currentUser.id, propertyId)) {
      removeFavorite(currentUser.id, propertyId);
    } else {
      addFavorite(currentUser.id, propertyId);
    }
  };

  const isPropertyFavorite = (propertyId: string) => {
    return currentUser ? isFavorite(currentUser.id, propertyId) : false;
  };

  return (
    <div className="min-h-screen bg-secondary/5 px-4 py-8 max-w-full mx-auto space-y-10">
      <div className="container max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in slide-in-from-top-4 duration-700">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            {currentUser ? `Welcome back, ${currentUser.name?.split(' ')[0]}! 👋` : 'Secure Your Next Home 🏠'}
          </h1>
          <p className="text-lg font-bold text-muted-foreground max-w-2xl opacity-90">
            {currentUser 
              ? 'Find and book verified properties with direct landlord contact.'
              : 'The only platform with 100% agent-free listings. Create an account to start your journey.'}
          </p>
        </div>
        {currentUser && (
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('tenant-inspections')} 
              variant="outline"
              className="h-11 font-extrabold border-primary/20 bg-primary/5 hover:bg-primary/10"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Manage Inspections
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
            </Button>
          </div>
        )}
      </div>

<<<<<<< HEAD
=======
      {/* Search & Filter Bar */}
      <div className="mb-6 space-y-4 animate-in fade-in duration-700 delay-100">
        <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white dark:bg-white/5 rounded-2xl border border-border dark:border-white/10 shadow-xl backdrop-blur-md">
          <div className="relative flex-1 group">
            <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by Location or Property Code (e.g. OYA-7721)..."
              value={localFilters.location}
              onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              className="pl-12 h-12 text-base font-bold bg-transparent border-none focus-visible:ring-0"
            />
          </div>
          <div className="h-12 w-px bg-border dark:bg-white/10 hidden sm:block mx-1" />
          <Button 
            variant="ghost" 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
               "h-12 px-6 font-extrabold text-base rounded-xl transition-all",
               showFilters ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
            )}
          >
            <SlidersHorizontal className="h-5 w-5 mr-3" />
            Deep Filters
            {hasActiveFilters && (
              <Badge variant="default" className="ml-3 bg-primary text-primary-foreground font-black px-2 py-0.5 text-[10px]">
                ACTIVE
              </Badge>
            )}
          </Button>
          <Button 
            className="h-12 px-8 rounded-xl font-extrabold shadow-lg shadow-primary/20"
            onClick={handleApplyFilters}
          >
            <Search className="h-5 w-5 mr-2 stroke-[3px]" />
            Search
          </Button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <Card className="animate-in slide-in-from-top-4 duration-500 dark:bg-white/5 dark:border-white/10 backdrop-blur-md overflow-hidden border-t-4 border-t-primary/50">
            <CardContent className="pt-8">
              <div className="space-y-6">
                {/* Basic Filters */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min Price (₦)</label>
                    <Input
                      type="number"
                      placeholder="No min"
                      value={localFilters.minPrice ?? ''}
                      onChange={(e) => setLocalFilters({ 
                        ...localFilters, 
                        minPrice: e.target.value ? Number(e.target.value) : undefined 
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Price (₦)</label>
                    <Input
                      type="number"
                      placeholder="No max"
                      value={localFilters.maxPrice ?? ''}
                      onChange={(e) => setLocalFilters({ 
                        ...localFilters, 
                        maxPrice: e.target.value ? Number(e.target.value) : undefined 
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Property Type</label>
                    <Select 
                      value={localFilters.type} 
                      onValueChange={(value) => setLocalFilters({ 
                        ...localFilters, 
                        type: value as PropertyType | 'all' 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(propertyTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bedrooms</label>
                    <Select 
                      value={localFilters.bedrooms?.toString() ?? 'all'} 
                      onValueChange={(value) => setLocalFilters({ 
                        ...localFilters, 
                        bedrooms: value === 'all' ? 'all' : Number(value) 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                        <SelectItem value="4">4 Bedrooms</SelectItem>
                        <SelectItem value="5">5+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Nearby Amenities */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Nearby Amenities
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {amenityOptions.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity.id}`}
                          checked={localFilters.amenities.includes(amenity.id)}
                          onCheckedChange={(checked) => {
                            setLocalFilters({
                              ...localFilters,
                              amenities: checked
                                ? [...localFilters.amenities, amenity.id]
                                : localFilters.amenities.filter(a => a !== amenity.id)
                            });
                          }}
                        />
                        <Label htmlFor={`amenity-${amenity.id}`} className="text-sm cursor-pointer">
                          {amenity.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Power Supply */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Power Supply
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {powerOptions.map((power) => (
                      <div key={power.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`power-${power.id}`}
                          checked={localFilters.powerSupply.includes(power.id)}
                          onCheckedChange={(checked) => {
                            setLocalFilters({
                              ...localFilters,
                              powerSupply: checked
                                ? [...localFilters.powerSupply, power.id]
                                : localFilters.powerSupply.filter(p => p !== power.id)
                            });
                          }}
                        />
                        <Label htmlFor={`power-${power.id}`} className="text-sm cursor-pointer">
                          {power.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Water Supply */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    Water Supply
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {waterOptions.map((water) => (
                      <div key={water.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`water-${water.id}`}
                          checked={localFilters.waterSupply.includes(water.id)}
                          onCheckedChange={(checked) => {
                            setLocalFilters({
                              ...localFilters,
                              waterSupply: checked
                                ? [...localFilters.waterSupply, water.id]
                                : localFilters.waterSupply.filter(w => w !== water.id)
                            });
                          }}
                        />
                        <Label htmlFor={`water-${water.id}`} className="text-sm cursor-pointer">
                          {water.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={handleClearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
                <Button onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Found <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties
        </p>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Property Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-16">
          <Home className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No properties found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search filters
          </p>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              isFavorite={isPropertyFavorite(property.id)}
              onToggleFavorite={(e) => toggleFavorite(property.id, e)}
              onClick={() => navigate('tenant-property', { id: property.id })}
              onChat={(e) => {
                e.stopPropagation();
                setActiveChat({ userId: property.landlordId, propertyId: property.id });
              }}
            />
          ))}
        </div>
      )}

>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
      {activeChat && (
        <ChatWindow 
          otherUserId={activeChat.userId}
          propertyId={activeChat.propertyId}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
<<<<<<< HEAD
=======
  </div>
  );
}

// Property Card Component
function PropertyCard({ 
  property, 
  isFavorite,
  onToggleFavorite,
  onClick,
  onChat
}: { 
  property: Property; 
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
  onChat: (e: React.MouseEvent) => void;
}) {
  return (
    <Card 
      className="group overflow-hidden cursor-pointer dark:bg-white/5 dark:border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-primary/5 border border-transparent"
      onClick={onClick}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        {property.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-muted dark:bg-white/5 flex items-center justify-center">
            <Home className="h-12 w-12 text-muted-foreground opacity-30" />
          </div>
        )}
        
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           <Badge className="w-fit font-extrabold bg-[#121212]/80 backdrop-blur-md text-white border-white/10 uppercase tracking-tighter" variant="outline">
             {propertyTypeLabels[property.type]}
           </Badge>
           <Badge className="w-fit font-black bg-primary text-primary-foreground border-none uppercase tracking-tighter" variant="default">
             {property.propertyCode}
           </Badge>
           {property.allowNegotiation && (
             <Badge className="w-fit bg-amber-600 text-white font-black border-none shadow-lg shadow-amber-900/40 uppercase tracking-tighter" variant="default">
               Negotiable
             </Badge>
           )}
        </div>

        <Badge className="absolute top-4 right-4 bg-[#008751] text-white font-black border-none shadow-lg shadow-emerald-900/40 uppercase tracking-tighter" variant="default">
          Verified Asset
        </Badge>

        <div className="absolute bottom-4 left-4 flex gap-2">
           {property.solicitorId && (
             <Badge className="bg-blue-600/80 backdrop-blur-md text-white font-bold border-none" variant="default">
               <Shield className="h-3 w-3 mr-1.5" />
               Solicitor Inspected
             </Badge>
           )}
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-4 right-4 h-10 w-10 rounded-full transition-all duration-300 backdrop-blur-md border border-white/10",
            isFavorite ? "bg-rose-500 text-white" : "bg-black/20 text-white hover:bg-rose-500/50"
          )}
          style={{ top: 'unset', bottom: '1rem', right: '1rem' }} // Repositioned
          onClick={onToggleFavorite}
        >
          <Heart className={cn("h-5 w-5 transition-transform duration-300", isFavorite ? "fill-current scale-110" : "group-hover:scale-110")} />
        </Button>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-extrabold tracking-tight group-hover:text-primary transition-colors line-clamp-1">{property.title}</CardTitle>
        <CardDescription className="flex items-center gap-1.5 font-bold opacity-80">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {property.location}
          {property.landmark && (
            <span className="text-xs truncate italic ml-1">
              • {property.landmark}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-6 text-sm font-bold text-muted-foreground mb-4">
          <span className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-primary" />
            {property.bedrooms} Bed
          </span>
          <span className="flex items-center gap-2">
            <Bath className="h-4 w-4 text-primary" />
            {property.bathrooms} Bath
          </span>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-border dark:border-white/10">
          <div>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest leading-none mb-1">Total Fee</p>
            <p className="text-2xl font-black text-[#008751]">{formatPrice(property.price)}<span className="text-[10px] font-bold text-muted-foreground ml-1">/YR</span></p>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-10 w-10 p-0 rounded-xl border-white/10 bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onChat(e);
              }}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button size="sm" variant="outline" className="h-10 px-4 font-extrabold border-white/10 bg-white/5 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              Inspect Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
  );
}
