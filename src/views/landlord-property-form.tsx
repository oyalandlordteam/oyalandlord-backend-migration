'use client';

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }

    setIsLoading(false);
    navigate('landlord-dashboard');
  };

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
                  </p>
                </div>
              </div>
            </div>

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
    </div>
  );
}
