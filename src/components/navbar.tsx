'use client';

import { useRouter, View } from '@/lib/router';
import { useAuthStore, useNotificationStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, LogOut, LayoutDashboard, Building2, Moon, Sun, Bell, MessageSquare } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useCallback, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';

const roleDashboardRoutes: Record<string, View> = {
  tenant: 'tenant-dashboard',
  landlord: 'landlord-dashboard',
  solicitor: 'solicitor-dashboard',
  admin: 'admin-dashboard',
};

// Theme Toggle Button - reads from DOM class directly
function ThemeToggleButton() {
  // Get initial state from DOM on mount
  const initialIsDark = useMemo(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  }, []);

  const [isDark, setIsDark] = useState(initialIsDark);

  const toggleTheme = useCallback(() => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('oyalandlord-theme', newIsDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newIsDark);
  }, [isDark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <Sun className={`h-5 w-5 transition-all ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'} absolute`} />
      <Moon className={`h-5 w-5 transition-all ${isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'} absolute`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function NavLinks({ 
  currentUser, 
  currentView, 
  onNavigate 
}: { 
  currentUser: ReturnType<typeof useAuthStore.getState>['currentUser'];
  currentView: View;
  onNavigate: (view: View) => void;
}) {
  return (
    <>
      <button 
        onClick={() => onNavigate('home')}
        className={`text-muted-foreground hover:text-foreground transition-colors ${currentView === 'home' ? 'text-foreground font-medium' : ''}`}
      >
        Home
      </button>
      {currentUser && (
        <button
          onClick={() => onNavigate(roleDashboardRoutes[currentUser.role])}
          className={`text-muted-foreground hover:text-foreground transition-colors ${currentView.includes('dashboard') ? 'text-foreground font-medium' : ''}`}
        >
          Dashboard
        </button>
      )}
    </>
  );
}

export function Navbar() {
  const { currentUser, logout } = useAuthStore();
  const { navigate, currentView } = useRouter();
  const { getUnreadCount } = useNotificationStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = currentUser ? getUnreadCount(currentUser.id) : 0;

  const handleLogout = () => {
    logout();
    navigate('home');
    setMobileMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavClick = (view: View) => {
    navigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Building2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Oyalandlord</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks 
            currentUser={currentUser} 
            currentView={currentView} 
            onNavigate={handleNavClick} 
          />
        </nav>

        {/* User Menu / Auth Buttons */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggleButton />

          {/* Notifications (only for logged in users) */}
          {currentUser && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => handleNavClick('tenant-notifications')}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          )}

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    <p className="text-xs capitalize text-primary font-medium">{currentUser.role}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleNavClick(roleDashboardRoutes[currentUser.role])}
                  className="cursor-pointer"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" onClick={() => handleNavClick('login')}>
                Login
              </Button>
              <Button onClick={() => handleNavClick('register')}>
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <button 
                  onClick={() => handleNavClick('home')}
                  className="text-lg font-medium hover:text-primary transition-colors text-left"
                >
                  Home
                </button>
                {currentUser && (
                  <button
                    onClick={() => handleNavClick(roleDashboardRoutes[currentUser.role])}
                    className="text-lg font-medium hover:text-primary transition-colors text-left"
                  >
                    Dashboard
                  </button>
                )}
                
                {/* Theme Toggle in Mobile Menu */}
                <div className="flex items-center justify-between py-2 border-t border-b">
                  <span className="text-muted-foreground">Theme</span>
                  <ThemeToggleButton />
                </div>

                {currentUser ? (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(currentUser.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{currentUser.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{currentUser.role}</p>
                      </div>
                    </div>
                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => handleNavClick('login')}
                      className="text-lg font-medium hover:text-primary transition-colors text-left"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => handleNavClick('register')}
                      className="text-lg font-medium hover:text-primary transition-colors text-left"
                    >
                      Register
                    </button>
                    <Button className="mt-4" onClick={() => handleNavClick('register')}>
                      Get Started
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
