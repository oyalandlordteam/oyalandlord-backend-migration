'use client';

import { useState } from 'react';
import { useRouter, View } from '@/lib/router';
import { useAuthStore, useNotificationStore, useAnnouncementStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Bell,
  User,
  LogOut,
  Home,
  Building2,
  Calendar,
  MessageSquare,
  Heart,
  Settings,
  Menu,
  X,
  ChevronDown,
  Shield,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Search as SearchIcon,
  Globe,
  Gavel,
  Coins,
  MessageCircle,
  LayoutDashboard,
  Users,
  BadgeCheck,
  Flag,
  Megaphone,
  Trash2,
} from 'lucide-react';

// Format date for notifications
function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
}

interface SharedLayoutProps {
  children: React.ReactNode;
}

export function SharedLayout({ children }: SharedLayoutProps) {
  const { currentUser, logout } = useAuthStore();
  const { getNotificationsByUser, getUnreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const { getActiveAnnouncements } = useAnnouncementStore();
  const { currentView, params, navigate } = useRouter();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(true);
  
  const notifications = currentUser ? getNotificationsByUser(currentUser.id) : [];
  const unreadCount = currentUser ? getUnreadCount(currentUser.id) : 0;
  const activeAnnouncements = getActiveAnnouncements();

  const handleLogout = () => {
    logout();
    navigate('home');
    setMobileMenuOpen(false);
  };

  const handleNotificationClick = (notification: { id: string; read: boolean; actionUrl?: string }) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl as View);
    }
  };

  const getRoleDashboard = () => {
    switch (currentUser?.role) {
      case 'tenant':
        return 'tenant-dashboard';
      case 'landlord':
        return 'landlord-dashboard';
      case 'solicitor':
        return 'solicitor-dashboard';
      case 'admin':
        return 'admin-dashboard';
      default:
        return 'home';
    }
  };

  const getNavItems = () => {
    if (!currentUser) return [];
    
    switch (currentUser.role) {
      case 'tenant':
        return [
          { label: 'Dashboard', view: 'tenant-dashboard' as View, icon: LayoutDashboard }, // Renamed 'Properties' to 'Dashboard' and changed icon
          { label: 'Inspections', view: 'tenant-inspections' as View, icon: Calendar },
          { label: 'Rentals', view: 'tenant-rentals' as View, icon: FileText },
          { label: 'Favorites', view: 'tenant-favorites' as View, icon: Heart },
          { label: 'Messages', view: 'tenant-notifications' as View, icon: MessageSquare },
        ];
      case 'landlord':
        return [
          { label: 'Dashboard', view: 'landlord-dashboard' as View, icon: Home },
          { label: 'Add Property', view: 'landlord-add-property' as View, icon: Building2 },
        ];
      case 'solicitor':
        return [
          { label: 'Dashboard', view: 'solicitor-dashboard' as View, icon: Home },
        ];
      case 'admin':
        return [
          { label: 'Dashboard', view: 'admin-dashboard' as View, icon: LayoutDashboard, params: { tab: 'overview' } },
          { label: 'Users', view: 'admin-dashboard' as View, icon: Users, params: { tab: 'users' } },
          { label: 'Verify', view: 'admin-dashboard' as View, icon: BadgeCheck, params: { tab: 'verification' } },
          { label: 'Properties', view: 'admin-dashboard' as View, icon: Building2, params: { tab: 'properties' } },
          { label: 'Inspections', view: 'admin-dashboard' as View, icon: Calendar, params: { tab: 'inspections' } },
          { label: 'Reports', view: 'admin-dashboard' as View, icon: Flag, params: { tab: 'reports' } },
          { label: 'Announce', view: 'admin-dashboard' as View, icon: Megaphone, params: { tab: 'announcements' } },
          { label: 'CMS', view: 'admin-dashboard' as View, icon: FileText, params: { tab: 'content' } },
          { label: 'Trash', view: 'admin-dashboard' as View, icon: Trash2, params: { tab: 'trash' } },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const publicNavLinks = [
    { label: 'Home', view: 'home' as View, action: () => navigate('home') },
    { label: 'Browse Properties', view: 'home' as View, action: () => {
      navigate('home');
      setTimeout(() => {
        const element = document.getElementById('featured-properties');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }},
    { label: 'FAQ / Help', view: 'home' as View, action: () => {
      navigate('home');
      setTimeout(() => {
        const element = document.getElementById('faq');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }},
  ];

  const brandNameClasses = "text-[#008751] font-extrabold tracking-tighter text-2xl";
  const navLinkClasses = "text-base font-extrabold transition-all hover:text-[#008751] hover:scale-105";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Announcement Banner */}
      {activeAnnouncements.length > 0 && announcementDialogOpen && (
        <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm z-50">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span className="truncate">{activeAnnouncements[0].message}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20 shrink-0"
              onClick={() => setAnnouncementDialogOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 md:px-8 w-full">
          {/* Logo & Sidebar Toggle for Mobile */}
          <div className="flex items-center gap-4">
            {currentUser && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-lg bg-[#008751] flex items-center justify-center shadow-lg shadow-[#008751]/20">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className={brandNameClasses}>Oyalandlord</span>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            {publicNavLinks.filter(link => currentUser ? link.label !== 'Browse Properties' : true).map((link: any) => (
              <button
                key={link.label}
                onClick={() => link.action ? link.action() : navigate(link.view, link.params)}
                className={`${navLinkClasses} ${
                  currentView === link.view && (!('params' in link) || !link.params) ? 'text-[#008751]' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Section: Notifications & Profile or Auth */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="w-px h-6 bg-border mx-2 hidden sm:block" />
            {currentUser ? (
              <>
                <DropdownMenu>
                  {/* ... Notifications Trigger ... */}
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
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
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-primary"
                          onClick={() => markAllAsRead(currentUser.id)}
                        >
                          Mark all read
                        </Button>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-4 text-center text-muted-foreground text-sm">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            className="flex items-start gap-3 p-3 cursor-pointer"
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className={`p-2 rounded-full shrink-0 ${
                              notification.type === 'inspection' ? 'bg-blue-100 text-blue-600' :
                              notification.type === 'rental' ? 'bg-green-100 text-green-600' :
                              notification.type === 'message' ? 'bg-purple-100 text-purple-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {notification.type === 'inspection' && <Calendar className="h-4 w-4" />}
                              {notification.type === 'rental' && <Home className="h-4 w-4" />}
                              {notification.type === 'message' && <MessageSquare className="h-4 w-4" />}
                              {notification.type === 'payment' && <Building2 className="h-4 w-4" />}
                              {notification.type === 'system' && <Bell className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatRelativeDate(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                            )}
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 p-1 pl-2">
                      <div className="w-8 h-8 rounded-full bg-[#008751] text-white flex items-center justify-center text-xs font-bold">
                        {currentUser.name.charAt(0)}
                      </div>
                      <span className="hidden sm:inline text-sm font-medium">{currentUser.name.split(' ')[0]}</span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <p className="font-medium">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(getRoleDashboard())}>
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('login')}
                  className="hidden sm:flex border-[#008751] text-[#008751] hover:bg-[#008751] hover:text-white"
                >
                  Login
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate('register')}
                  className="bg-[#008751] hover:bg-[#007043] text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 w-full">
        {/* Navigation Sidebar (Desktop) */}
        {currentUser && (
          <aside className="hidden md:flex flex-col w-64 border-r bg-muted/10 p-4 sticky top-16 h-[calc(100vh-4rem)]">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground mb-4 px-2 uppercase tracking-wider">
                Menu
              </p>
              {navItems.map((item) => {
                const isActive = currentView === item.view && (!(item as any).params || params.tab === (item as any).params.tab);
                return (
                  <Button
                    key={item.label}
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`w-full justify-start gap-3 mb-1 ${isActive ? 'font-medium' : ''}`}
                    onClick={() => navigate(item.view, (item as any).params)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
            
            <div className="mt-auto pt-4 border-t">
              <div className="bg-primary/5 rounded-lg p-3 mb-4">
                <p className="text-xs font-medium text-primary mb-1 capitalize">Role: {currentUser.role}</p>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{currentUser.email}</p>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </aside>
        )}

        {/* Mobile Navigation Sidebar (Overlays) */}
        {currentUser && mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <aside className="fixed inset-y-0 left-0 w-64 bg-background border-r p-4 shadow-lg animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Home className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span>Oyalandlord</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = currentView === item.view && (!(item as any).params || params.tab === (item as any).params.tab);
                  return (
                    <Button
                      key={item.label}
                      variant={isActive ? 'secondary' : 'ghost'}
                      className="w-full justify-start gap-3"
                      onClick={() => {
                        navigate(item.view, (item as any).params);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
                <DropdownMenuSeparator className="my-4" />
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="p-3 md:p-4 lg:p-6 flex-1">
            {children}
          </div>

          {/* Footer */}
          <footer className="border-t border-white/5 bg-[#1a1a1a] dark:bg-black text-white pt-10 pb-6 w-full mt-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 w-full px-4 md:px-8">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2 font-extrabold text-2xl tracking-tighter mb-4 text-[#008751]">
                  <div className="w-8 h-8 rounded-lg bg-[#008751] flex items-center justify-center">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  Oyalandlord
                </div>
                <p className="text-sm text-gray-400 leading-relaxed font-bold mb-6">
                  Nigeria&quot;s #1 agent-free rental platform. Rent directly. No agents. Fast, secure, and transparent.
                </p>
                <div className="flex items-center gap-4">
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Facebook className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Instagram className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className={`font-black mb-6 uppercase text-xs tracking-widest px-3 py-1.5 rounded-lg inline-block ${currentUser?.role === 'tenant' ? 'bg-[#008751] text-white' : 'text-gray-500 bg-white/5 opacity-50'}`}>For Tenants</h4>
                <ul className="space-y-4 text-sm">
                  <li>
                    <button 
                      className={`transition-all flex items-center gap-2 group ${currentUser?.role === 'tenant' ? 'text-white font-extrabold hover:translate-x-1' : 'text-gray-600 cursor-not-allowed'}`}
                      disabled={currentUser?.role !== 'tenant'}
                      onClick={() => navigate('tenant-dashboard')}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${currentUser?.role === 'tenant' ? 'bg-[#008751]' : 'bg-transparent'}`} />
                      Browse Properties
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`transition-all flex items-center gap-2 group ${currentUser?.role === 'tenant' ? 'text-white font-extrabold hover:translate-x-1' : 'text-gray-600 cursor-not-allowed'}`}
                      disabled={currentUser?.role !== 'tenant'}
                      onClick={() => {
                        navigate('home');
                        setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${currentUser?.role === 'tenant' ? 'bg-[#008751]' : 'bg-transparent'}`} />
                      How It Works
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`transition-all flex items-center gap-2 group ${currentUser?.role === 'tenant' ? 'text-white font-extrabold hover:translate-x-1' : 'text-gray-600 cursor-not-allowed'}`}
                      disabled={currentUser?.role !== 'tenant'}
                      onClick={() => {
                        navigate('home');
                        setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${currentUser?.role === 'tenant' ? 'bg-[#008751]' : 'bg-transparent'}`} />
                      Inspection FAQ
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className={`font-black mb-6 uppercase text-xs tracking-widest px-3 py-1.5 rounded-lg inline-block ${currentUser?.role === 'landlord' ? 'bg-[#008751] text-white' : 'text-gray-500 bg-white/5 opacity-50'}`}>For Landlords</h4>
                <ul className="space-y-4 text-sm">
                  <li>
                    <button 
                      className={`transition-all flex items-center gap-2 group ${currentUser?.role === 'landlord' ? 'text-white font-extrabold hover:translate-x-1' : 'text-gray-600 cursor-not-allowed'}`}
                      disabled={currentUser?.role !== 'landlord'}
                      onClick={() => navigate('landlord-add-property')}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${currentUser?.role === 'landlord' ? 'bg-[#008751]' : 'bg-transparent'}`} />
                      List a Property
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`transition-all flex items-center gap-2 group ${currentUser?.role === 'landlord' ? 'text-white font-extrabold hover:translate-x-1' : 'text-gray-600 cursor-not-allowed'}`}
                      disabled={currentUser?.role !== 'landlord'}
                      onClick={() => navigate('landlord-dashboard')}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${currentUser?.role === 'landlord' ? 'bg-[#008751]' : 'bg-transparent'}`} />
                      Landlord Dashboard
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`transition-all flex items-center gap-2 group ${currentUser?.role === 'landlord' ? 'text-white font-extrabold hover:translate-x-1' : 'text-gray-600 cursor-not-allowed'}`}
                      disabled={currentUser?.role !== 'landlord'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${currentUser?.role === 'landlord' ? 'bg-[#008751]' : 'bg-transparent'}`} />
                      Pricing Plans
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className={`font-black mb-6 uppercase text-xs tracking-widest px-3 py-1.5 rounded-lg inline-block ${currentUser?.role === 'solicitor' ? 'bg-[#008751] text-white' : 'text-gray-500 bg-white/5 opacity-50'}`}>For Solicitors</h4>
                <ul className="space-y-4 text-sm">
                  <li>
                    <button 
                      className={`transition-all flex items-center gap-2 group ${currentUser?.role === 'solicitor' ? 'text-white font-extrabold hover:translate-x-1' : 'text-gray-600 cursor-not-allowed'}`}
                      disabled={currentUser?.role !== 'solicitor'}
                      onClick={() => navigate('solicitor-dashboard')}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${currentUser?.role === 'solicitor' ? 'bg-[#008751]' : 'bg-transparent'}`} />
                      Solicitor Dashboard
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`transition-all flex items-center gap-2 group ${currentUser?.role === 'solicitor' ? 'text-white font-extrabold hover:translate-x-1' : 'text-gray-600 cursor-not-allowed'}`}
                      disabled={currentUser?.role !== 'solicitor'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${currentUser?.role === 'solicitor' ? 'bg-[#008751]' : 'bg-transparent'}`} />
                      Accreditation
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`transition-all flex items-center gap-2 group ${currentUser?.role === 'solicitor' ? 'text-white font-extrabold hover:translate-x-1' : 'text-gray-600 cursor-not-allowed'}`}
                      disabled={currentUser?.role !== 'solicitor'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${currentUser?.role === 'solicitor' ? 'bg-[#008751]' : 'bg-transparent'}`} />
                      Legal Terms
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-wider">Company</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><button className="hover:text-[#008751] transition-colors font-bold text-white">About Us</button></li>
                  <li><button className="hover:text-[#008751] transition-colors font-bold text-white">Blog</button></li>
                  <li><button className="hover:text-[#008751] transition-colors font-bold text-white">Contact Us</button></li>
                  <li><button className="hover:text-[#008751] transition-colors font-bold text-white">Privacy Policy</button></li>
                </ul>
              </div>
            </div>

            <div className="w-full border-t border-white/5 mt-10 pt-6 px-4 md:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-gray-500 font-bold">
                  &copy; {new Date().getFullYear()} Oyalandlord Rental Marketplace. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-white transition-colors font-bold">
                    <Globe className="h-4 w-4" />
                    <span>English (NG)</span>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                  <button className="text-xs text-gray-500 hover:text-white transition-colors font-bold">Help Centre</button>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/2348012345678?text=Hello%2C%20I%20need%20help%20with%20Oyalandlord"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
