'use client';

<<<<<<< HEAD
import { useRouter } from '@/lib/router';
import { Building2, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="bg-white dark:bg-black border-t dark:border-white/10 pt-16 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Building2 className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tighter">OYALANDLORD</span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              Nigeria&apos;s leading platform for direct landlord-to-tenant connections. No agents, no extra fees, more transparency.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
=======
import { useRouter, View } from '@/lib/router';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const { navigate } = useRouter();

  const handleNavClick = (view: View, params?: Record<string, string>) => {
    navigate(view, params);
  };

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 mb-4 cursor-pointer"
            >
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Oyalandlord</span>
            </button>
            <p className="text-muted-foreground mb-4 max-w-md">
              Nigeria&apos;s premier agent-free rental marketplace. Connect directly with landlords,
              find your perfect home, and rent with confidence.
            </p>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
          </div>

          {/* Quick Links */}
          <div>
<<<<<<< HEAD
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-primary transition-colors">Find a Property</button>
              </li>
              <li>
                <button onClick={() => navigate('search')} className="hover:text-primary transition-colors">Advanced Search</button>
              </li>
              <li>
                <button onClick={() => navigate('home')} className="hover:text-primary transition-colors">Featured Listings</button>
              </li>
              <li>
                <button onClick={() => navigate('login')} className="hover:text-primary transition-colors">List Your Property</button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <button onClick={() => navigate('about')} className="hover:text-primary transition-colors">About Us</button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="hover:text-primary transition-colors">Terms of Service</button>
              </li>
              <li>
                <button onClick={() => navigate('home')} className="hover:text-primary transition-colors">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => navigate('home')} className="hover:text-primary transition-colors">Contact Support</button>
=======
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavClick('home')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('register', { role: 'tenant' })}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Find a Property
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('register', { role: 'landlord' })}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  List Your Property
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('register', { role: 'solicitor' })}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Join as Solicitor
                </button>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
<<<<<<< HEAD
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>123 Victoria Island, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+234 800 OYALANDLORD</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>hello@oyalandlord.com</span>
=======
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@oyalandlord.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+234 800 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Lagos, Nigeria</span>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
              </li>
            </ul>
          </div>
        </div>

<<<<<<< HEAD
        <div className="pt-8 border-t dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} OYALANDLORD. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <button onClick={() => navigate('home')} className="hover:text-primary transition-colors">Documentation</button>
            <button onClick={() => navigate('home')} className="hover:text-primary transition-colors">System Status</button>
          </div>
=======
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Oyalandlord. All rights reserved.</p>
          <p className="mt-2">
            Connecting tenants and landlords directly across Nigeria.
          </p>
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
        </div>
      </div>
    </footer>
  );
}
