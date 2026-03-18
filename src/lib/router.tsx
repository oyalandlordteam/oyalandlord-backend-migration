'use client';

<<<<<<< HEAD
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Unified View Type
=======
import { useState, createContext, useContext, ReactNode } from 'react';

>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
export type View = 
  | 'home'
  | 'login'
  | 'register'
  | 'tenant-dashboard'
<<<<<<< HEAD
  | 'landlord-dashboard'
  | 'solicitor-dashboard'
  | 'admin-dashboard'
  | 'property-detail'
  | 'search'
  | 'about'
  | 'terms';

interface RouterContextType {
  currentView: View;
  params: Record<string, string | number | boolean>;
  navigate: (view: View, params?: Record<string, any>) => void;
=======
  | 'tenant-property'
  | 'tenant-inspections'
  | 'tenant-rentals'
  | 'tenant-notifications'
  | 'tenant-favorites'
  | 'landlord-dashboard'
  | 'landlord-add-property'
  | 'landlord-edit-property'
  | 'solicitor-dashboard'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-properties'
  | 'admin-inspections'
  | 'admin-reports'
  | 'admin-announcements';

interface RouterState {
  view: View;
  params: Record<string, string>;
}

interface RouterContextType {
  currentView: View;
  params: Record<string, string>;
  navigate: (view: View, params?: Record<string, string>) => void;
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

<<<<<<< HEAD
export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<View>('home');
  const [params, setParams] = useState<Record<string, any>>({});
  const [history, setHistory] = useState<{ view: View; params: any }[]>([]);

  // Initialize from URL if needed or stay at home
  useEffect(() => {
    // Basic hash-based routing emulation could go here
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        try {
          const { view, params } = JSON.parse(atob(hash));
          setCurrentView(view);
          setParams(params || {});
        } catch (e) {
          // Fallback to home
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view: View, newParams: Record<string, any> = {}) => {
    setHistory(prev => [...prev, { view: currentView, params }]);
    setCurrentView(view);
    setParams(newParams);
    
    // Smooth scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update hash for basic bookmarking/refresh support
    try {
      // window.location.hash = btoa(JSON.stringify({ view, params: newParams }));
    } catch (e) {}
  };

  const goBack = () => {
    if (history.length > 0) {
      const last = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentView(last.view);
      setParams(last.params || {});
    } else {
      setCurrentView('home');
      setParams({});
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ currentView, params, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
}

=======
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
<<<<<<< HEAD
=======

interface RouterProviderProps {
  children: ReactNode;
}

const DEFAULT_VIEW: View = 'home';

export function RouterProvider({ children }: RouterProviderProps) {
  const [currentView, setCurrentView] = useState<View>(DEFAULT_VIEW);
  const [params, setParams] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<RouterState[]>([{ view: DEFAULT_VIEW, params: {} }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = (view: View, newParams: Record<string, string> = {}) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ view, params: newParams });
      return newHistory;
    });
    setCurrentIndex(prev => prev + 1);
    setCurrentView(view);
    setParams(newParams);
    // Scroll to top on navigation
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentView(history[newIndex].view);
      setParams(history[newIndex].params);
    }
  };

  return (
    <RouterContext.Provider value={{ currentView, params, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
}
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
