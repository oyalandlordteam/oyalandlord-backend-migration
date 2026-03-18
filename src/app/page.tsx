'use client';

<<<<<<< HEAD
import { useContentStore } from '@/lib/store';
import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import SearchFilters from '@/components/SearchFilters';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
=======
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
<<<<<<< HEAD
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function Home() {
  const { content } = useContentStore();
  const faqs = content.faq;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      <div id="search" className="container py-12">
        <div className="flex flex-col items-center text-center mb-10 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Find Your Next Home</h2>
          <p className="text-muted-foreground max-w-[600px]">
            Direct connection with verified landlords. No agent fees. No stress.
          </p>
        </div>
        <SearchFilters />
        <FeaturedProperties />
      </div>

      <CTASection />

      {/* FAQ Section */}
      <section className="container py-24 bg-muted/30 rounded-[3rem] my-12" id="faq">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={faq.id} 
                value={`item-${index}`}
                className="bg-white dark:bg-white/5 border rounded-2xl px-6 py-1 shadow-sm data-[state=open]:border-primary/20 transition-all"
              >
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </main>
  );
}
=======
} from '@/components/ui/accordion';
import { useRouter, View } from '@/lib/router';
import { useAuthStore, usePropertyStore, useInspectionStore, initializeStores, getDashboardStats } from '@/lib/store';
import {
  Users,
  Building2,
  Scale,
  Search,
  Shield,
  Coins,
  ArrowRight,
  Home,
  CheckCircle2,
  Sparkles,
  Loader2,
  Settings,
  Key,
  Gavel,
  MessageCircle,
  Clock,
  MapPin,
  CheckCircle,
  FileText,
  Heart,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Search as SearchIcon,
} from 'lucide-react';
import { Property, PropertyType } from '@/lib/types';

// Import page components
import LoginPage from '@/views/login-page';
import RegisterPage from '@/views/register-page';
import TenantDashboard from '@/views/tenant-dashboard';
import TenantPropertyDetail from '@/views/tenant-property-detail';
import TenantInspections from '@/views/tenant-inspections';
import TenantFavorites from '@/views/tenant-favorites';
import TenantRentals from '@/views/tenant-rentals';
import NotificationPanel from '@/views/notification-panel';
import LandlordDashboard from '@/views/landlord-dashboard';
import LandlordPropertyForm from '@/views/landlord-property-form';
import SolicitorDashboard from '@/views/solicitor-dashboard';
import AdminDashboard from '@/views/admin-dashboard';
import { SharedLayout } from '@/components/shared-layout';

// Format price in Nigerian Naira
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Property type labels
const propertyTypeLabels: Record<PropertyType, string> = {
  flat: 'Flat',
  house: 'House',
  duplex: 'Duplex',
  room: 'Room',
  studio: 'Studio',
  maisonette: 'Maisonette',
};

// Main App Router Component
function AppRouter() {
  const { currentView } = useRouter();
  const { currentUser, isInitialized } = useAuthStore();

  useEffect(() => {
    initializeStores();
  }, []);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Routes that should NOT have the shared layout (auth pages)
  const isAuthPage = currentView === 'login' || currentView === 'register';

  // Render the content
  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      
      case 'login':
        return <LoginPage />;
      
      case 'register':
        return <RegisterPage />;
      
      // Tenant routes - allow guest browsing for dashboard and property pages
      case 'tenant-dashboard':
        return <TenantDashboard />;
      
      case 'tenant-property':
        return <TenantPropertyDetail />;
      
      case 'tenant-inspections':
        if (!currentUser) {
          return <LoginPage />;
        }
        return <TenantInspections />;
      
      case 'tenant-favorites':
        if (!currentUser) {
          return <LoginPage />;
        }
        return <TenantFavorites />;
      
      case 'tenant-rentals':
        if (!currentUser) {
          return <LoginPage />;
        }
        return <TenantRentals />;
      
      case 'tenant-notifications':
        if (!currentUser) {
          return <LoginPage />;
        }
        return <NotificationPanel />;
      
      // Landlord routes (require authentication and landlord role)
      case 'landlord-dashboard':
        if (!currentUser) {
          return <LoginPage />;
        }
        return <LandlordDashboard />;
      
      case 'landlord-add-property':
        if (!currentUser) {
          return <LoginPage />;
        }
        return <LandlordPropertyForm />;
      
      case 'landlord-edit-property':
        if (!currentUser) {
          return <LoginPage />;
        }
        return <LandlordPropertyForm />;
      
      // Solicitor routes (require authentication and solicitor role)
      case 'solicitor-dashboard':
        if (!currentUser) {
          return <LoginPage />;
        }
        return <SolicitorDashboard />;
      
      // Admin routes (require authentication and admin role)
      case 'admin-dashboard':
        if (!currentUser) {
          return <LoginPage />;
        }
        return <AdminDashboard />;
      
      // Default to home page
      default:
        return <HomePage />;
    }
  };

  // Auth pages don't have the shared layout
  if (isAuthPage) {
    return renderContent();
  }

  // All other pages have the shared layout
  return <SharedLayout>{renderContent()}</SharedLayout>;
}

// Home Page Component
export function HomePage() {
  const { navigate } = useRouter();
  const { currentUser } = useAuthStore();
  const { properties, isInitialized: propsInitialized } = usePropertyStore();
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState<PropertyType | 'all'>('all');

  // Get featured properties
  const displayProperties = properties
    .filter(p => p.available)
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 4);

  const handleSearch = () => {
    // Navigate to tenant dashboard with search params
    navigate('tenant-dashboard');
  };

  if (!propsInitialized) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#008751]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 2.2 Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-home.png" 
            alt="Modern Nigerian Home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
        </div>

        <div className="relative z-10 w-full px-4 md:px-8 text-white">
          <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
            <Badge className="mb-6 bg-[#008751] text-white hover:bg-[#007043] border-none px-5 py-2 text-sm font-extrabold tracking-widest uppercase shadow-lg shadow-[#008751]/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Nigeria&apos;s #1 Marketplace
            </Badge>
            <h1 className="text-5xl md:text-8xl font-extrabold mb-6 tracking-tighter leading-none max-w-4xl">
              Rent Without <span className="text-[#00C875]">Agent Fees.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-extrabold mb-10 max-w-3xl leading-snug drop-shadow-lg">
              Connect directly with verified landlords and save thousands. Nigeria&apos;s most trusted agent-free rental platform.
            </p>

            {/* Search Bar */}
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20 shadow-2xl max-w-4xl animate-in zoom-in-95 duration-700 delay-300 fill-mode-both">
              <div className="bg-white rounded-xl p-2 grid grid-cols-1 md:grid-cols-12 gap-2">
                <div className="md:col-span-12 lg:col-span-5 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter area, landmark or bus stop..."
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
                <div className="md:col-span-12 lg:col-span-4 relative border-t lg:border-t-0 lg:border-l border-gray-100">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <select
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 focus:outline-none appearance-none cursor-pointer"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as any)}
                  >
                    <option value="all">Property Type</option>
                    <option value="flat">Flat</option>
                    <option value="house">House</option>
                    <option value="duplex">Duplex</option>
                    <option value="room">Room</option>
                  </select>
                </div>
                <div className="md:col-span-12 lg:col-span-3">
                  <Button 
                    className="w-full h-full bg-[#008751] hover:bg-[#007043] text-white rounded-lg py-3 flex items-center justify-center gap-2"
                    onClick={handleSearch}
                  >
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-300">
              <span className="text-white font-medium">Popular:</span>
              <button 
                onClick={() => setSearchLocation('Ikeja')} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                Ikeja
              </button>
              <button 
                onClick={() => setSearchLocation('Yaba')} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                Yaba
              </button>
              <button 
                onClick={() => setSearchLocation('Lekki')} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                Lekki
              </button>
              <button 
                onClick={() => setSearchLocation('Abuja')} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                Abuja
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2.3 How It Works */}
      <section id="how-it-works" className="py-20 px-4 md:px-8 bg-secondary/30 dark:bg-white/5 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-[#1a1a1a] dark:text-white tracking-tighter leading-none">
              How It <span className="text-[#008751]">Works</span>
            </h2>
            <p className="text-muted-foreground text-xl font-bold opacity-80">A simple, transparent process for Nigeria&apos;s rental ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tenant Column */}
            <div className="bg-[#f0f9f4] dark:bg-white/5 p-10 rounded-3xl border border-[#d1eeda] dark:border-white/10 transition-all hover:shadow-2xl hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#008751]/5 rounded-full -mr-16 -mt-16 group-hover:bg-[#008751]/10 transition-colors" />
              <div className="w-20 h-20 bg-[#008751] rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-xl shadow-[#008751]/30">
                <Search className="h-10 w-10 text-white stroke-[2.5px]" />
              </div>
              <h3 className="text-3xl font-extrabold mb-8 text-[#1a1a1a] dark:text-white tracking-tight">For Tenants</h3>
              <div className="space-y-8 mb-4">
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-xl bg-[#008751]/10 text-[#008751] flex items-center justify-center shrink-0 font-black text-xl border border-[#008751]/20">1</div>
                  <div>
                    <h4 className="font-extrabold text-xl mb-1 dark:text-white/90">Search & Filter</h4>
                    <p className="text-muted-foreground font-bold leading-relaxed">Find properties by location, price, and essential amenities.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-xl bg-[#008751]/10 text-[#008751] flex items-center justify-center shrink-0 font-black text-xl border border-[#008751]/20">2</div>
                  <div>
                    <h4 className="font-extrabold text-xl mb-1 dark:text-white/90">Book Inspection</h4>
                    <p className="text-muted-foreground font-bold leading-relaxed">Secure your slot with a small transparency fee.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-xl bg-[#008751]/10 text-[#008751] flex items-center justify-center shrink-0 font-black text-xl border border-[#008751]/20">3</div>
                  <div>
                    <h4 className="font-extrabold text-xl mb-1 dark:text-white/90">Move In</h4>
                    <p className="text-muted-foreground font-bold leading-relaxed">Connect directly with the owner and finalize your contract.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Landlord Column */}
            <div className="bg-[#f9f5f0] dark:bg-white/5 p-10 rounded-3xl border border-[#eedfd1] dark:border-white/10 transition-all hover:shadow-2xl hover:-translate-y-2 group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors" />
              <div className="w-20 h-20 bg-amber-600 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-xl shadow-amber-600/30">
                <Key className="h-10 w-10 text-white stroke-[2.5px]" />
              </div>
              <h3 className="text-3xl font-extrabold mb-8 text-[#1a1a1a] dark:text-white tracking-tight">For Landlords</h3>
              <div className="space-y-8 mb-4">
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 font-black text-xl border border-amber-500/20">1</div>
                  <div>
                    <h4 className="font-extrabold text-xl mb-1 dark:text-white/90">List Property</h4>
                    <p className="text-muted-foreground font-bold leading-relaxed">Upload high-quality photos and detailed price breakdowns.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 font-black text-xl border border-amber-500/20">2</div>
                  <div>
                    <h4 className="font-extrabold text-xl mb-1 dark:text-white/90">Manage Requests</h4>
                    <p className="text-muted-foreground font-bold leading-relaxed">Vet inspection requests and chat with serious prospects.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 font-black text-xl border border-amber-500/20">3</div>
                  <div>
                    <h4 className="font-extrabold text-xl mb-1 dark:text-white/90">100% Rental Income</h4>
                    <p className="text-muted-foreground font-bold leading-relaxed">No commissions. Keep every naira of your rent.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solicitor Column */}
            <div className="bg-[#f5f5f5] dark:bg-white/5 p-10 rounded-3xl border border-[#e5e5e5] dark:border-white/10 transition-all hover:shadow-2xl hover:-translate-y-2 group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              <div className="w-20 h-20 bg-[#333333] dark:bg-primary rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-xl">
                <Gavel className="h-10 w-10 text-white stroke-[2.5px]" />
              </div>
              <h3 className="text-3xl font-extrabold mb-8 text-[#1a1a1a] dark:text-white tracking-tight">For Solicitors</h3>
              <div className="space-y-8 mb-4">
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-black text-xl border border-primary/20">1</div>
                  <div>
                    <h4 className="font-extrabold text-xl mb-1 dark:text-white/90">Accreditation</h4>
                    <p className="text-muted-foreground font-bold leading-relaxed">Join as a verified legal officer for asset protection.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-black text-xl border border-primary/20">2</div>
                  <div>
                    <h4 className="font-extrabold text-xl mb-1 dark:text-white/90">Legal Oversight</h4>
                    <p className="text-muted-foreground font-bold leading-relaxed">Verify property documents and maintain platform trust.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-black text-xl border border-primary/20">3</div>
                  <div>
                    <h4 className="font-extrabold text-xl mb-1 dark:text-white/90">Scale Operations</h4>
                    <p className="text-muted-foreground font-bold leading-relaxed">Manage multiple portfolios and facilitate secure deals.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.4 Featured Properties */}
      <section id="featured-properties" className="py-10 px-4 md:px-8 bg-accent/20 dark:bg-[#0a0a0a] w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <div className="w-full">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-2 text-[#1a1a1a] dark:text-white tracking-tighter">Featured Properties</h2>
              <p className="text-muted-foreground text-lg font-bold">Handpicked homes just for you.</p>
            </div>
            <Button 
                variant="link" 
                className="text-[#008751] font-semibold"
                onClick={() => navigate('tenant-dashboard')}
            >
              See All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 Why Choose Oyalandlord */}
      <section className="py-24 px-4 md:px-8 bg-white dark:bg-[#0c0c0c] w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-[#1a1a1a] dark:text-white tracking-tighter leading-none">
              Why <span className="text-[#008751]">Oyalandlord?</span>
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-xl font-bold opacity-80">The most transparent way to find your next home in Nigeria.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="flex gap-6 p-6 rounded-2xl dark:bg-white/5 dark:border-white/10 dark:border group hover:bg-white/50 transition-colors">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 text-[#008751] border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Coins className="h-8 w-8 stroke-[2.5px]" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold mb-3 dark:text-white/90">Zero Agent Fees</h3>
                <p className="text-muted-foreground font-bold leading-relaxed italic">Pay exactly what the landlord lists. No hidden commissions.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 rounded-2xl dark:bg-white/5 dark:border-white/10 dark:border group hover:bg-white/50 transition-colors">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0 text-blue-600 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-8 w-8 stroke-[2.5px]" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold mb-3 dark:text-white/90">Direct Chat</h3>
                <p className="text-muted-foreground font-bold leading-relaxed italic">Talk directly with property owners via integrated WhatsApp.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 rounded-2xl dark:bg-white/5 dark:border-white/10 dark:border group hover:bg-white/50 transition-colors">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center shrink-0 text-purple-600 border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Scale className="h-8 w-8 stroke-[2.5px]" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold mb-3 dark:text-white/90">Legal Shield</h3>
                <p className="text-muted-foreground font-bold leading-relaxed italic">Professional solicitors verify every asset for 100% peace of mind.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 rounded-2xl dark:bg-white/5 dark:border-white/10 dark:border group hover:bg-white/50 transition-colors">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center shrink-0 text-amber-600 border border-amber-500/20 group-hover:scale-110 transition-transform">
                <SearchIcon className="h-8 w-8 stroke-[2.5px]" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold mb-3 dark:text-white/90">Total Transparency</h3>
                <p className="text-muted-foreground font-bold leading-relaxed italic">Full cost breakdowns including service charges and agreements.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 rounded-2xl dark:bg-white/5 dark:border-white/10 dark:border group hover:bg-white/50 transition-colors">
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center shrink-0 text-rose-600 border border-rose-500/20 group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 stroke-[2.5px]" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold mb-3 dark:text-white/90">Local Insights</h3>
                <p className="text-muted-foreground font-bold leading-relaxed italic">Filter by power supply stability, water quality, and security.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 rounded-2xl dark:bg-white/5 dark:border-white/10 dark:border group hover:bg-white/50 transition-colors">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center shrink-0 text-cyan-600 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 stroke-[2.5px]" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold mb-3 dark:text-white/90">Verified Owners</h3>
                <p className="text-muted-foreground font-bold leading-relaxed italic">Avoid scams with our rigorous landlord verification system.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.6 Description of Roles */}
      <section className="py-24 px-4 md:px-8 bg-muted/30 dark:bg-[#080808] w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-450 fill-mode-both">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Tenant Card */}
            <div className="bg-[#e7f5ed] dark:bg-[#008751]/10 p-12 rounded-[2.5rem] border border-[#d1eeda] dark:border-[#008751]/30 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] group">
              <Users className="h-12 w-12 text-[#008751] mb-6 animate-pulse" />
              <h3 className="text-3xl font-black mb-6 text-[#008751] tracking-tight">Direct Tenant Access</h3>
              <p className="text-muted-foreground text-xl leading-relaxed font-bold italic opacity-90">
                Browse listings, filter by specific Nigerian needs, and book inspections without intermediaries. Connect directly with owners.
              </p>
            </div>

            {/* Landlord Card */}
            <div className="bg-[#f5efe7] dark:bg-amber-500/10 p-12 rounded-[2.5rem] border border-[#eedfd1] dark:border-amber-500/30 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] group">
              <Building2 className="h-12 w-12 text-amber-600 mb-6 animate-pulse" />
              <h3 className="text-3xl font-black mb-6 text-amber-700 dark:text-amber-500 tracking-tight">Landlord Autonomy</h3>
              <p className="text-muted-foreground text-xl leading-relaxed font-bold italic opacity-90">
                Reach genuine tenants. No commissions, keep 100% of your rent income. Simple management tools for your entire portfolio.
              </p>
            </div>

            {/* Solicitor Card */}
            <div className="bg-[#f0f0f0] dark:bg-primary/10 p-12 rounded-[2.5rem] border border-[#e5e5e5] dark:border-primary/30 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] group">
              <Scale className="h-12 w-12 text-[#333333] dark:text-primary mb-6 animate-pulse" />
              <h3 className="text-3xl font-black mb-6 text-[#333333] dark:text-white tracking-tight">Legal Integrity</h3>
              <p className="text-muted-foreground text-xl leading-relaxed font-bold italic opacity-90">
                Certified solicitors verify properties and facilitate secure agreements, ensuring peace of mind for both tenants and landlords.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 md:px-8 bg-white dark:bg-[#0a0a0a] w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-[#1a1a1a] dark:text-white tracking-tighter leading-none">
              Questions & <span className="text-primary italic">Answers</span>
            </h2>
            <p className="text-muted-foreground text-xl font-bold opacity-80">Everything you need to know about Nigeria&apos;s direct rental platform.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-[2rem] px-8 bg-muted/20 dark:bg-white/5 border-none shadow-sm overflow-hidden dark:border dark:border-white/10 group transition-all hover:dark:bg-white/10">
              <AccordionTrigger className="text-xl font-black hover:no-underline py-8 text-left">What is Oyalandlord?</AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-bold pb-8">
                Oyalandlord is Nigeria&apos;s first agent-free rental marketplace that connects tenants directly with landlords. We eliminate agent fees by providing a transparent platform for listing and discovering properties.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-[2rem] px-8 bg-muted/20 dark:bg-white/5 border-none shadow-sm overflow-hidden dark:border dark:border-white/10 group transition-all hover:dark:bg-white/10">
              <AccordionTrigger className="text-xl font-black hover:no-underline py-8 text-left">How do I book an inspection?</AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-bold pb-8">
                Simply find a property you like, click on &quot;Book Inspection&quot;, and pay the small transparency fee. This fee ensures only serious tenants visit and helps maintain platform security.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-[2rem] px-8 bg-muted/20 dark:bg-white/5 border-none shadow-sm overflow-hidden dark:border dark:border-white/10 group transition-all hover:dark:bg-white/10">
              <AccordionTrigger className="text-xl font-black hover:no-underline py-8 text-left">Are the properties verified?</AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-bold pb-8">
                Yes, we encourage landlords to attach certified solicitors to their listings. These solicitors verify the property documents and oversee the inspection process.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-[2rem] px-8 bg-muted/20 dark:bg-white/5 border-none shadow-sm overflow-hidden dark:border dark:border-white/10 group transition-all hover:dark:bg-white/10">
              <AccordionTrigger className="text-xl font-black hover:no-underline py-8 text-left">Is there any commission or agent fee?</AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-bold pb-8">
                No. We strictly prohibit agent commissions. Tenants pay only the rent and related charges specified by the landlord.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-[2rem] px-8 bg-muted/20 dark:bg-white/5 border-none shadow-sm overflow-hidden dark:border dark:border-white/10 group transition-all hover:dark:bg-white/10">
              <AccordionTrigger className="text-xl font-black hover:no-underline py-8 text-left">How can I contact the landlord?</AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-bold pb-8">
                Once your inspection is booked and approved, you can chat directly with the landlord via our integrated WhatsApp feature.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}

// Property Card Component
function PropertyCard({ property }: { property: Property }) {
  const { navigate } = useRouter();
  
  return (
    <Card 
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-none shadow-sm"
      onClick={() => navigate('tenant-property', { id: property.id })}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        {property.images[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Home className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-white/90 text-gray-900 border-none shadow-sm backdrop-blur-sm">
            {propertyTypeLabels[property.type]}
          </Badge>
          {property.featured && (
            <Badge className="bg-[#008751] text-white border-none shadow-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        <Badge className="absolute bottom-3 right-3 bg-[#008751] text-white border-none shadow-md py-1 px-3">
          No Agent Fee
        </Badge>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-extrabold text-[#1a1a1a] dark:text-white line-clamp-1">{property.title}</h3>
        </div>
        <div className="flex items-center text-gray-500 text-sm gap-1">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1">{property.location}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Key className="h-4 w-4" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Scale className="h-4 w-4" />
            <span>{property.bathrooms} Bath</span>
          </div>
        </div>
        <div className="border-t pt-4 flex justify-between items-center">
          <div className="text-xl font-extrabold text-[#008751]">
            {formatPrice(property.price)}
            <span className="text-xs font-normal text-gray-500 ml-1">/year</span>
          </div>
          <Button variant="ghost" size="sm" className="text-[#008751] p-0 hover:bg-transparent hover:underline">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Export the main app router as default
export default AppRouter;
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
