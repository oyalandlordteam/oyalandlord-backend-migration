'use client';

<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { useAuthStore, usePropertyStore, useActivityStore, useNotificationStore } from '@/lib/store';
import { Property, PropertyType, PropertyFeature, BreakdownItem, ScreeningQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Loader2,
  Building2,
  MapPin,
  Bed,
  Bath,
  Shield,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function LandlordPropertyForm() {
  const { navigate, goBack, params } = useRouter();
  const { currentUser, getUsers } = useAuthStore();
  const { getPropertyById, addProperty, updateProperty } = usePropertyStore();
  const { addActivity } = useActivityStore();
  const { addNotification } = useNotificationStore();
  const { toast } = useToast();

  const propertyId = params.id as string;
  const isEditing = !!propertyId;
  const existingProperty = isEditing ? getPropertyById(propertyId) : null;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    location: '',
    price: 0,
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    images: [],
    features: ['Electricity', 'Water', 'Security'],
    available: true,
    inspectionFee: 5000,
    whatsappEnabled: true,
    whatsappNumber: '',
    landlordId: currentUser?.id || '',
    solicitorId: '',
    allowNegotiation: true,
    screeningQuestions: [
      { id: '1', question: 'What is your current occupation?' },
      { id: '2', question: 'How many people will be living in the property?' }
    ],
    breakdownItems: [
      { name: 'Annual Rent', amount: 0 },
      { name: 'Caution Fee (Refundable)', amount: 50000 },
      { name: 'Legal & Agreement', amount: 30000 },
    ],
  });

  // Load existing property data
  useEffect(() => {
    if (existingProperty) {
      setFormData(existingProperty);
    }
  }, [existingProperty]);

  // Solicitors for the dropdown
  const solicitors = getUsers().filter(u => u.role === 'solicitor');

  const handleInputChange = (field: keyof Property, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-update Breakdown Annual Rent if Price changes
    if (field === 'price') {
      const newBreakdown = [...(formData.breakdownItems || [])];
      const rentIdx = newBreakdown.findIndex(i => i.name === 'Annual Rent');
      if (rentIdx > -1) {
        newBreakdown[rentIdx].amount = Number(value);
        setFormData(prev => ({ ...prev, breakdownItems: newBreakdown }));
      }
    }
  };

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = [...(formData.features || [])];
    if (currentFeatures.includes(feature)) {
      setFormData(prev => ({ 
        ...prev, 
        features: currentFeatures.filter(f => f !== feature) 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        features: [...currentFeatures, feature] 
      }));
    }
  };

  const handleAddFeature = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = e.currentTarget.value.trim();
      if (val && !formData.features?.includes(val)) {
        setFormData(prev => ({ 
          ...prev, 
          features: [...(prev.features || []), val] 
        }));
        e.currentTarget.value = '';
      }
    }
  };

  const handleAddImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData(prev => ({ 
        ...prev, 
        images: [...(prev.images || []), url] 
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images?.filter((_, i) => i !== index) 
    }));
  };

  const handleAddQuestion = () => {
    const question = prompt('Enter your screening question:');
    if (question) {
      const newQuestion: ScreeningQuestion = {
        id: Math.random().toString(36).substr(2, 9),
        question
      };
      setFormData(prev => ({
        ...prev,
        screeningQuestions: [...(prev.screeningQuestions || []), newQuestion]
      }));
    }
  };

  const handleRemoveQuestion = (id: string) => {
    setFormData(prev => ({
      ...prev,
      screeningQuestions: prev.screeningQuestions?.filter(q => q.id !== id)
    }));
  };

  const handleBreakdownChange = (index: number, field: keyof BreakdownItem, value: string | number) => {
    const newItems = [...(formData.breakdownItems || [])];
    newItems[index] = { ...newItems[index], [field]: field === 'amount' ? Number(value) : value };
    setFormData(prev => ({ ...prev, breakdownItems: newItems }));
  };

  const handleAddBreakdownItem = () => {
    setFormData(prev => ({
      ...prev,
      breakdownItems: [
        ...(prev.breakdownItems || []),
        { name: 'New Item', amount: 0 }
      ]
    }));
  };

  const handleRemoveBreakdownItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      breakdownItems: prev.breakdownItems?.filter((_, i) => i !== index)
    }));
=======
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from '@/lib/router';
import { useAuthStore, usePropertyStore } from '@/lib/store';
import { PropertyType, PropertyFormData, BreakdownItem, ScreeningQuestion } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Loader2,
  Banknote,
  Building2,
  Coins,
  Phone,
  MessageCircle,
  Gavel,
  HelpCircle,
  Shield,
  Car,
  PawPrint,
  TreeDeciduous,
  Calendar,
  MapPin,
  TreePalm,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Property type options
const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'flat', label: 'Flat' },
  { value: 'house', label: 'House' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'room', label: 'Room' },
  { value: 'studio', label: 'Studio' },
  { value: 'maisonette', label: 'Maisonette' },
];

// Default breakdown items template
const defaultBreakdownItems: BreakdownItem[] = [
  { name: 'Rent', amount: 0 },
];

const defaultFormData: PropertyFormData = {
  title: '',
  description: '',
  price: 0,
  location: '',
  type: 'flat',
  bedrooms: 1,
  bathrooms: 1,
  images: [''],
  available: true,
  solicitorId: null,
  inspectionFee: 0,
  whatsappEnabled: false,
  whatsappNumber: '',
  breakdownItems: defaultBreakdownItems,
  allowNegotiation: false,
  screeningQuestions: [],
  security: [],
  parking: [],
  furnishing: 'unfurnished',
  petPolicy: 'not-allowed',
  outdoorSpace: [],
  earliestMoveIn: '',
  landmark: '',
  address: '',
};

// Format price
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function LandlordPropertyForm() {
  const { params, navigate, goBack } = useRouter();
  const { currentUser, getSolicitors } = useAuthStore();
  const { addProperty, updateProperty, getPropertyById } = usePropertyStore();
  const { toast } = useToast();

  const isEditing = params.id !== undefined;
  const existingProperty = useMemo(() => {
    return isEditing ? getPropertyById(params.id) : null;
  }, [isEditing, params.id, getPropertyById]);

  const [formData, setFormData] = useState<PropertyFormData>(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PropertyFormData, string>>>({});
  const [newScreeningQuestion, setNewScreeningQuestion] = useState('');

  const solicitors = getSolicitors();

  // Load existing property data for editing
  useEffect(() => {
    if (existingProperty) {
      const newData: PropertyFormData = {
        title: existingProperty.title,
        description: existingProperty.description,
        price: existingProperty.price,
        location: existingProperty.location,
        address: existingProperty.address || '',
        landmark: existingProperty.landmark || '',
        type: existingProperty.type,
        bedrooms: existingProperty.bedrooms,
        bathrooms: existingProperty.bathrooms,
        images: existingProperty.images.length > 0 ? [...existingProperty.images] : [''],
        available: existingProperty.available,
        solicitorId: existingProperty.solicitorId || null,
        inspectionFee: existingProperty.inspectionFee || 0,
        whatsappEnabled: existingProperty.whatsappEnabled || false,
        whatsappNumber: existingProperty.whatsappNumber || '',
        breakdownItems: existingProperty.breakdownItems && existingProperty.breakdownItems.length > 0 
          ? [...existingProperty.breakdownItems] 
          : defaultBreakdownItems,
        allowNegotiation: existingProperty.allowNegotiation || false,
        screeningQuestions: existingProperty.screeningQuestions || [],
        security: existingProperty.security || [],
        parking: existingProperty.parking || [],
        furnishing: existingProperty.furnishing || 'unfurnished',
        petPolicy: existingProperty.petPolicy || 'not-allowed',
        outdoorSpace: existingProperty.outdoorSpace || [],
        earliestMoveIn: existingProperty.earliestMoveIn || '',
      };
      queueMicrotask(() => {
        setFormData(newData);
      });
    }
  }, [existingProperty]);

  // Redirect if editing a property that doesn't belong to the landlord
  useEffect(() => {
    if (isEditing && existingProperty && existingProperty.landlordId !== currentUser?.id) {
      toast({
        title: 'Unauthorized',
        description: 'You can only edit your own properties.',
        variant: 'destructive',
      });
      navigate('landlord-dashboard');
    }
  }, [isEditing, existingProperty, currentUser, navigate, toast]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PropertyFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (formData.bedrooms <= 0) {
      newErrors.bedrooms = 'Bedrooms must be at least 1';
    }
    if (formData.bathrooms <= 0) {
      newErrors.bathrooms = 'Bathrooms must be at least 1';
    }

    // Filter out empty image URLs
    const validImages = formData.images.filter(img => img.trim() !== '');
    if (validImages.length === 0) {
      newErrors.images = 'At least one image URL is required';
    }

    // WhatsApp validation
    if (formData.whatsappEnabled && !formData.whatsappNumber?.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required when enabled';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    if (!currentUser) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save

    const finalData = {
      ...formData,
      landlordId: currentUser.id,
      propertyCode: existingProperty?.propertyCode || `PROP-${Math.floor(1000 + Math.random() * 9000)}`,
    } as Property;

    if (isEditing) {
      updateProperty(finalData);
      toast({ title: 'Property Updated', description: 'Your changes have been saved successfully.' });
      addActivity(currentUser.id, 'property_updated', `Updated property: ${finalData.title}`, finalData.id);
    } else {
      addProperty(finalData);
      toast({ title: 'Property Listed', description: 'Your property is now live on Oyalandlord!' });
      addActivity(currentUser.id, 'property_listed', `Listed new property: ${finalData.title}`, finalData.id);
      
      // Notify solicitor if one was assigned
      if (finalData.solicitorId) {
        addNotification(
          finalData.solicitorId,
          'inspection_request',
          `Landlord ${currentUser.name} assigned you to manage ${finalData.title}.`,
          finalData.id
        );
      }
=======
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filter out empty image URLs
    const validImages = formData.images.filter(img => img.trim() !== '');
    
    // Filter breakdown items with valid names
    const validBreakdownItems = formData.breakdownItems.filter(item => item.name.trim() !== '');

    if (isEditing && params.id) {
      updateProperty(params.id, {
        ...formData,
        solicitorId: formData.solicitorId ?? undefined, // Use undefined instead of null
        images: validImages,
        breakdownItems: validBreakdownItems,
        updatedAt: new Date().toISOString()
      });
      toast({
        title: 'Property updated',
        description: 'Your property has been updated successfully.',
      });
    } else {
      const { ...propertyData } = formData;
      addProperty({
        ...propertyData,
        images: validImages,
        breakdownItems: validBreakdownItems,
        viewCount: 0,
        featured: false,
      } as any, currentUser?.id || '');
      
      toast({
        title: 'Property added',
        description: 'Your property has been listed successfully.',
      });
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
    }

    setIsLoading(false);
    navigate('landlord-dashboard');
  };

<<<<<<< HEAD
  const totalPackage = (formData.breakdownItems || []).reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="container max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isEditing ? 'Edit Property' : 'List New Property'}
          </h1>
          <p className="text-muted-foreground font-medium">
            Fill in the details below to reach thousands of verified tenants.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-bold">Property Title</Label>
              <Input
                id="title"
                placeholder="e.g. Luxury 3 Bedroom Apartment in Lekki Phase 1"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="h-11 font-medium"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="font-bold">Property Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(v) => handleInputChange('type', v)}
                >
                  <SelectTrigger className="h-11 font-medium">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="font-bold">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Lekki, Lagos"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-10 h-11 font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your property in detail..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[120px] font-medium leading-relaxed"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Breakdown */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Pricing & Total Package
            </CardTitle>
            <CardDescription className="font-medium text-primary/80">
              Provide a clear breakdown for prospective tenants. No hidden fees.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="font-bold">Annual Rent (₦)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground font-bold">₦</span>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="pl-8 h-11 font-extrabold text-lg"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inspectionFee" className="font-bold">Inspection Fee (₦)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground font-bold">₦</span>
                  <Input
                    id="inspectionFee"
                    type="number"
                    value={formData.inspectionFee}
                    onChange={(e) => handleInputChange('inspectionFee', e.target.value)}
                    className="pl-8 h-11 font-extrabold text-lg"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest pl-1">Paid after viewing approval</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <Label className="font-black uppercase tracking-widest text-xs text-muted-foreground">Detailed Cost Breakdown</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddBreakdownItem}>
                  <Plus className="h-3 w-3 mr-1" /> Add Item
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.breakdownItems?.map((item, index) => (
                  <div key={index} className="flex gap-3 items-end group animate-in slide-in-from-right-2 duration-300">
                    <div className="flex-1 space-y-1.5">
                      <Input
                        value={item.name}
                        onChange={(e) => handleBreakdownChange(index, 'name', e.target.value)}
                        placeholder="Item name"
                        className="h-9 text-sm font-bold"
                      />
                    </div>
                    <div className="w-32 sm:w-48 space-y-1.5">
                      <div className="relative">
                        <span className="absolute left-2.5 top-2.5 text-[10px] font-bold text-muted-foreground">₦</span>
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleBreakdownChange(index, 'amount', e.target.value)}
                          className="h-9 pl-6 text-sm font-extrabold text-right"
                        />
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => handleRemoveBreakdownItem(index)}
                      disabled={index === 0} // Can't remove annual rent
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex justify-between items-center mt-6">
                <p className="font-extrabold text-primary uppercase tracking-widest text-xs font-black">Total Move-in Package</p>
                <p className="text-2xl font-black text-primary">
                  ₦{totalPackage.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details & Features */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Property Images
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {formData.images?.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border group">
                    <img src={url} alt="Property" className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(idx)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-primary hover:border-primary/50"
                >
                  <Plus className="h-6 w-6" />
                  <span className="text-xs font-bold">Add URL</span>
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground italic font-medium leading-relaxed">
                Tip: High-quality images of the interior and exterior increase booking rates by up to 80%.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bedrooms</Label>
                  <div className="flex items-center gap-3">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="number" 
                      value={formData.bedrooms} 
                      onChange={(e) => handleInputChange('bedrooms', Number(e.target.value))}
                      className="h-10 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bathrooms</Label>
                   <div className="flex items-center gap-3">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="number" 
                      value={formData.bathrooms} 
                      onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
                      className="h-10 font-bold"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amenities</Label>
                <div className="flex flex-wrap gap-2">
                  {['Electricity', 'Water', 'Security', 'Parking', 'Gated', 'Newly Built', 'Furnished'].map(feature => (
                    <Badge
                      key={feature}
                      variant={formData.features?.includes(feature) ? 'default' : 'outline'}
                      className={`cursor-pointer px-3 py-1 font-bold ${formData.features?.includes(feature) ? '' : 'text-muted-foreground'}`}
                      onClick={() => handleFeatureToggle(feature)}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Input 
                  placeholder="Type extra amenity and hit Enter..."
                  onKeyDown={handleAddFeature}
                  className="h-9 text-xs font-medium italic"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Features - WhatsApp & Solicitor */}
        <Card className="border-primary/20 shadow-lg shadow-primary/5 overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Smart Management & Verification
            </CardTitle>
            <CardDescription className="font-semibold text-primary/80">
              Automate your work and build trust with legal verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="grid sm:grid-cols-2 gap-8">
              {/* WhatsApp Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                    <Label className="font-extrabold flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      Direct WhatsApp Contact
                    </Label>
                    <p className="text-[10px] text-muted-foreground font-medium">Allow tenants to chat with you via WhatsApp</p>
                  </div>
                  <Switch 
                    checked={formData.whatsappEnabled} 
                    onCheckedChange={(v) => handleInputChange('whatsappEnabled', v)}
                  />
                </div>
                
                {formData.whatsappEnabled && (
                  <div className="space-y-2 animate-in slide-in-from-left-2 duration-300">
                    <Label className="text-xs font-bold">WhatsApp Number</Label>
                    <div className="relative">
                       <Phone className="absolute left-3 top-3.4 h-4 w-4 text-muted-foreground" />
                       <Input 
                        placeholder="+234 812 345 6789"
                        value={formData.whatsappNumber}
                        onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                        className="pl-10 h-11 font-bold tracking-wider"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Solicitor Column */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="font-extrabold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Assign Platform Solicitor
                  </Label>
                  <p className="text-[10px] text-muted-foreground font-medium">Verified solicitor will review inspection requests</p>
                </div>
                
                <Select 
                  value={formData.solicitorId} 
                  onValueChange={(v) => handleInputChange('solicitorId', v)}
                >
                  <SelectTrigger className="h-11 font-bold">
                    <SelectValue placeholder="Select a solicitor (Recommended)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Solicitor (Manage myself)</SelectItem>
                    {solicitors.map(s => (
                      <SelectItem key={s.id} value={s.id}>Barrister {s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50">
                  <p className="text-[10px] text-blue-700 dark:text-blue-400 font-bold leading-relaxed">
                    <AlertCircle className="h-3 w-3 inline-block mr-1" />
                    Properties with solicitors have a 35% higher trust rating and attract more serious tenants.
=======
  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const updateImageField = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  // Breakdown items management
  const addBreakdownItem = () => {
    setFormData(prev => ({ 
      ...prev, 
      breakdownItems: [...prev.breakdownItems, { name: '', amount: 0 }] 
    }));
  };

  const removeBreakdownItem = (index: number) => {
    if (formData.breakdownItems.length > 1) {
      const newItems = formData.breakdownItems.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, breakdownItems: newItems }));
    }
  };

  const updateBreakdownItem = (index: number, field: 'name' | 'amount', value: string | number) => {
    const newItems = [...formData.breakdownItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, breakdownItems: newItems }));
  };

  // Calculate total
  const breakdownTotal = formData.breakdownItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  // Screening questions management
  const addScreeningQuestion = () => {
    if (!newScreeningQuestion.trim()) return;
    setFormData(prev => ({
      ...prev,
      screeningQuestions: [
        ...prev.screeningQuestions,
        { id: `q-${Date.now()}`, question: newScreeningQuestion.trim() }
      ]
    }));
    setNewScreeningQuestion('');
  };

  const removeScreeningQuestion = (id: string) => {
    setFormData(prev => ({
      ...prev,
      screeningQuestions: prev.screeningQuestions.filter(q => q.id !== id)
    }));
  };

  // Toggle array item (for security, parking, outdoorSpace)
  const toggleArrayItem = (field: 'security' | 'parking' | 'outdoorSpace', item: string) => {
    setFormData(prev => {
      const arr = prev[field] || [];
      const exists = arr.includes(item);
      return {
        ...prev,
        [field]: exists ? arr.filter(i => i !== item) : [...arr, item]
      };
    });
  };

  return (
    <div className="container px-4 py-8 max-w-4xl">
      {/* Header */}
      <Button variant="ghost" onClick={goBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isEditing ? 'Edit Property' : 'Add New Property'}
          </CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Update your property listing details' 
              : 'Fill in the details to list your property for rent'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5">
              <h3 className="text-xl font-extrabold text-[#1a1a1a] dark:text-white flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                Basic Information
              </h3>
              
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Modern 3-Bedroom Flat in Lekki"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property in detail..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              {/* Price and Location */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Annual Rent (₦) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 2000000"
                    value={formData.price || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className={errors.price ? 'border-destructive' : ''}
                  />
                  {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Lekki Phase 1, Lagos"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className={errors.location ? 'border-destructive' : ''}
                  />
                  {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Property Type *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as PropertyType }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms and Bathrooms */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="1"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
                    className={errors.bedrooms ? 'border-destructive' : ''}
                  />
                  {errors.bedrooms && <p className="text-sm text-destructive">{errors.bedrooms}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="1"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
                    className={errors.bathrooms ? 'border-destructive' : ''}
                  />
                  {errors.bathrooms && <p className="text-sm text-destructive">{errors.bathrooms}</p>}
                </div>
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label>Image URLs *</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Enter URLs for property images (e.g., from Unsplash, Cloudinary, etc.)
                </p>
                {formData.images.map((img, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={img}
                      onChange={(e) => updateImageField(index, e.target.value)}
                      className={errors.images && index === 0 ? 'border-destructive' : ''}
                    />
                    {formData.images.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeImageField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addImageField}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Another Image
                </Button>
                {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}
              </div>
            </div>

            {/* Cost Breakdown Section */}
            <div className="space-y-6 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5">
              <div>
                <h3 className="text-xl font-extrabold text-[#1a1a1a] dark:text-white flex items-center gap-2">
                  <Banknote className="h-6 w-6 text-primary" />
                  Cost Breakdown
                </h3>
                <p className="text-sm text-muted-foreground font-bold">
                  Define the full payment package for transparency.
                </p>
              </div>

              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Amount (₦)</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.breakdownItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            placeholder="e.g., Rent, Service Charge, Legal Fee"
                            value={item.name}
                            onChange={(e) => updateBreakdownItem(index, 'name', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="0"
                            value={item.amount || ''}
                            onChange={(e) => updateBreakdownItem(index, 'amount', Number(e.target.value))}
                          />
                        </TableCell>
                        <TableCell>
                          {formData.breakdownItems.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBreakdownItem(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* No Agent Fee Row */}
                    <TableRow className="bg-green-50 dark:bg-[#008751]/10 border-green-200 dark:border-[#008751]/20">
                      <TableCell className="font-extrabold text-[#008751] dark:text-[#00C875]">
                        Agent Fee
                      </TableCell>
                      <TableCell className="text-[#008751] dark:text-[#00C875] font-extrabold">
                        FREE (No Agent Fee)
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    {/* Total Row */}
                    <TableRow className="bg-primary/5 dark:bg-primary/10 border-t-2 border-primary/20">
                      <TableCell className="font-extrabold text-lg">Total Package</TableCell>
                      <TableCell className="font-extrabold text-xl text-primary dark:text-[#00C875]">
                        {formatPrice(breakdownTotal)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBreakdownItem}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Breakdown Item
              </Button>
            </div>

            {/* Inspection Fee Section */}
            <div className="space-y-4 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5">
              <div>
                <h3 className="text-xl font-extrabold text-[#1a1a1a] dark:text-white flex items-center gap-2">
                  <Coins className="h-6 w-6 text-primary" />
                  Inspection Fee
                </h3>
                <p className="text-sm text-muted-foreground font-bold">
                  Set a transparent fee for property visits.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inspectionFee">Inspection Fee (₦)</Label>
                  <Input
                    id="inspectionFee"
                    type="number"
                    min="0"
                    placeholder="e.g., 10000"
                    value={formData.inspectionFee || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, inspectionFee: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    This fee is shown to tenants before they request an inspection
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
                  </p>
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <div className="pt-6 border-t flex items-center justify-between">
               <div className="space-y-0.5">
                  <Label className="font-extrabold flex items-center gap-2">
                    <Gavel className="h-4 w-4 text-orange-600" />
                    Price Negotiation
                  </Label>
                  <p className="text-[10px] text-muted-foreground font-medium">Allow tenants to make lower price offers (bids)</p>
                </div>
                <Switch 
                  checked={formData.allowNegotiation} 
                  onCheckedChange={(v) => handleInputChange('allowNegotiation', v)}
                />
            </div>
          </CardContent>
        </Card>

        {/* Screening Questions */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Tenant Screening Questions
            </CardTitle>
            <CardDescription className="font-medium">
              Save time by pre-screening tenants before they request an inspection.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              {formData.screeningQuestions?.map((q, idx) => (
                <div key={q.id} className="flex gap-2 animate-in fade-in duration-300">
                  <div className="flex-1 p-3 bg-muted/40 rounded-lg border flex justify-between items-center">
                    <span className="text-sm font-bold truncate pr-4">
                       <span className="text-primary mr-1">{idx+1}.</span> {q.question}
                    </span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveQuestion(q.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-11 border-dashed border-2 font-extrabold hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all"
              onClick={handleAddQuestion}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Screening Question
            </Button>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4 pt-4 sticky bottom-8 bg-background/80 backdrop-blur-md p-4 rounded-2xl border shadow-xl z-50">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 h-12 font-bold"
            onClick={goBack}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 h-12 font-black text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              isEditing ? 'Save Changes' : 'Launch Property Listing'
            )}
          </Button>
        </div>
      </form>
      <div className="h-20" /> {/* Extra spacing for bottom bar */}
=======
            {/* WhatsApp Contact Section */}
            <div className="space-y-4 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5">
              <div>
                <h3 className="text-xl font-extrabold text-[#1a1a1a] dark:text-white flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  WhatsApp Contact
                </h3>
                <p className="text-sm text-muted-foreground font-bold">
                  Direct connection with tenants via WhatsApp.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-black/40 rounded-xl border border-border dark:border-white/10 shadow-sm">
                  <Switch
                    id="whatsappEnabled"
                    checked={formData.whatsappEnabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, whatsappEnabled: checked }))}
                  />
                  <Label htmlFor="whatsappEnabled" className="cursor-pointer font-extrabold text-sm">
                    Enable WhatsApp contact for this property
                  </Label>
                </div>

                {formData.whatsappEnabled && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="whatsappNumber" className="font-extrabold">WhatsApp Number *</Label>
                    <div className="flex gap-2">
                      <div className="bg-gray-100 dark:bg-white/10 p-2.5 rounded-lg border border-border dark:border-white/20">
                        <Phone className="h-5 w-5 text-[#008751]" />
                      </div>
                      <Input
                        id="whatsappNumber"
                        type="tel"
                        placeholder="e.g., +2348012345678"
                        value={formData.whatsappNumber || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                        className={cn("bg-white dark:bg-black", errors.whatsappNumber ? 'border-destructive' : 'dark:border-white/20')}
                      />
                    </div>
                    {errors.whatsappNumber && <p className="text-sm text-destructive">{errors.whatsappNumber}</p>}
                    <p className="text-xs text-muted-foreground font-bold">
                      Enter number with country code (e.g., +234 for Nigeria)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Solicitor Section */}
            <div className="space-y-4 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5">
              <div>
                <h3 className="text-xl font-extrabold text-[#1a1a1a] dark:text-white flex items-center gap-2">
                  <Gavel className="h-6 w-6 text-primary" />
                  Legal Verification
                </h3>
                <p className="text-sm text-muted-foreground font-bold">
                  Attach a certified solicitor for document verification.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="font-extrabold mb-1 block">Attach Solicitor (Optional)</Label>
                <Select 
                  value={formData.solicitorId || 'none'} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    solicitorId: value === 'none' ? null : value 
                  }))}
                >
                  <SelectTrigger className="dark:bg-black dark:border-white/20 font-bold">
                    <SelectValue placeholder="Select a solicitor" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#121212] dark:border-white/10">
                    <SelectItem value="none" className="font-bold">No Solicitor (Direct approval)</SelectItem>
                    {solicitors.map((solicitor) => (
                      <SelectItem key={solicitor.id} value={solicitor.id} className="font-bold">
                        {solicitor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Negotiation Toggle Section */}
            <div className="space-y-4 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5">
              <div>
                <h3 className="text-xl font-extrabold text-[#1a1a1a] dark:text-white flex items-center gap-2">
                  <Coins className="h-6 w-6 text-primary" />
                  Price Negotiation
                </h3>
                <p className="text-sm text-muted-foreground font-bold">
                  Decide if you want to allow price offers from tenants.
                </p>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white dark:bg-black/40 rounded-xl border border-border dark:border-white/10 shadow-sm">
                <Switch
                  id="allowNegotiation"
                  checked={formData.allowNegotiation}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowNegotiation: checked }))}
                />
                <Label htmlFor="allowNegotiation" className="cursor-pointer font-extrabold text-sm">
                  Allow tenants to make offers (Negotiation enabled)
                </Label>
              </div>
              {formData.allowNegotiation && (
                <p className="text-xs text-muted-foreground font-bold animate-in fade-in duration-300">
                  Tenants will see a &quot;Make Offer&quot; button and can submit their proposed price. You can accept or reject offers.
                </p>
              )}
            </div>

            {/* Screening Questions Section */}
            <div className="space-y-4 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5">
              <div>
                <h3 className="text-xl font-extrabold text-[#1a1a1a] dark:text-white flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  Tenant Screening
                </h3>
                <p className="text-sm text-muted-foreground font-bold">
                  Ask questions to filter for your ideal tenant.
                </p>
              </div>

              {/* Existing Questions */}
              {formData.screeningQuestions && formData.screeningQuestions.length > 0 && (
                <div className="space-y-3">
                  {formData.screeningQuestions.map((q, index) => (
                    <div key={q.id} className="flex items-center gap-3 p-4 bg-white dark:bg-black/40 rounded-xl border border-border dark:border-white/10 shadow-sm animate-in slide-in-from-left-2 duration-300">
                      <span className="text-sm font-extrabold text-primary">{index + 1}.</span>
                      <span className="flex-1 text-sm font-bold">{q.question}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeScreeningQuestion(q.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Question */}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., What is your preferred move-in date?"
                  value={newScreeningQuestion}
                  onChange={(e) => setNewScreeningQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addScreeningQuestion();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addScreeningQuestion}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Property Features Section */}
            <div className="space-y-8 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5">
              <div>
                <h3 className="text-xl font-extrabold text-[#1a1a1a] dark:text-white flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Property Features
                </h3>
                <p className="text-sm text-muted-foreground font-bold">
                  Highlight amenities and security features.
                </p>
              </div>

              {/* Security */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Features
                </Label>
                <div className="flex flex-wrap gap-2">
                  {['Gated Estate', 'Security Guard', 'CCTV', 'Electric Fence', 'Intercom'].map((item) => (
                    <Button
                      key={item}
                      type="button"
                      variant={formData.security?.includes(item) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayItem('security', item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Parking */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Parking
                </Label>
                <div className="flex flex-wrap gap-2">
                  {['Car Park', 'Garage', 'covered Parking', 'Street Parking'].map((item) => (
                    <Button
                      key={item}
                      type="button"
                      variant={formData.parking?.includes(item) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayItem('parking', item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Furnishing */}
              <div className="space-y-3">
                <Label>Furnishing Status</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'unfurnished', label: 'Unfurnished' },
                    { value: 'semi-furnished', label: 'Semi-Furnished' },
                    { value: 'furnished', label: 'Fully Furnished' },
                  ].map((item) => (
                    <Button
                      key={item.value}
                      type="button"
                      variant={formData.furnishing === item.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, furnishing: item.value as 'furnished' | 'semi-furnished' | 'unfurnished' }))}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Pet Policy */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <PawPrint className="h-4 w-4" />
                  Pet Policy
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.petPolicy === 'allowed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, petPolicy: 'allowed' }))}
                  >
                    Pets Allowed
                  </Button>
                  <Button
                    type="button"
                    variant={formData.petPolicy === 'not-allowed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, petPolicy: 'not-allowed' }))}
                  >
                    No Pets
                  </Button>
                </div>
              </div>

              {/* Outdoor Space */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <TreeDeciduous className="h-4 w-4" />
                  Outdoor Space
                </Label>
                <div className="flex flex-wrap gap-2">
                  {['Balcony', 'Garden', 'Roof Terrace', 'Patio', 'Pool'].map((item) => (
                    <Button
                      key={item}
                      type="button"
                      variant={formData.outdoorSpace?.includes(item) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayItem('outdoorSpace', item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Earliest Move-In */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Earliest Move-In Date
                </Label>
                <Input
                  type="date"
                  value={formData.earliestMoveIn || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, earliestMoveIn: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="max-w-xs"
                />
              </div>
            </div>

            {/* Address Details Section */}
            <div className="space-y-4 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5">
              <div>
                <h3 className="text-xl font-extrabold text-[#1a1a1a] dark:text-white flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary" />
                  Address Details
                </h3>
                <p className="text-sm text-muted-foreground font-bold">
                  Provide precise location for the listing.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address" className="font-extrabold">Full Address *</Label>
                  <Input
                    id="address"
                    placeholder="e.g., 15 Admiralty Way, Lekki Phase 1"
                    value={formData.address || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="dark:bg-black dark:border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landmark" className="font-extrabold">Nearby Landmark</Label>
                  <Input
                    id="landmark"
                    placeholder="e.g., Near Shoprite Lekki Mall"
                    value={formData.landmark || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                    className="dark:bg-black dark:border-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Availability & Submit */}
            <div className="p-6 rounded-2xl bg-gray-100 dark:bg-[#1a1a1a] border border-border dark:border-white/10 space-y-6">
              <div className="flex items-center space-x-3 p-4 bg-white dark:bg-black/40 rounded-xl border border-border dark:border-white/10 shadow-sm">
                <Checkbox
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: !!checked }))}
                />
                <Label htmlFor="available" className="cursor-pointer font-extrabold text-sm">
                  Property is available for rent immediately
                </Label>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={goBack} className="flex-1 h-12 font-extrabold text-lg dark:border-white/10 dark:hover:bg-white/5">
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1 h-12 font-extrabold text-lg shadow-lg shadow-primary/20">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {isEditing ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      {isEditing ? 'Update Property' : 'Publish Listing'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
    </div>
  );
}
