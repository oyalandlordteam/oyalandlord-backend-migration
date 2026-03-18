'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Unified View Type
export type View = 
  | 'home'
  | 'login'
  | 'register'
  | 'tenant-dashboard'
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
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

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

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
