'use client';

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
          </div>

          {/* Quick Links */}
          <div>
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
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('about')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('terms')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
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
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Oyalandlord. All rights reserved.</p>
          <p className="mt-2">
            Connecting tenants and landlords directly across Nigeria.
          </p>
        </div>
      </div>
    </footer>
  );
}
