'use client';

import { useState, createContext, useContext, ReactNode } from 'react';

export type View = 
  | 'home'
  | 'login'
  | 'register'
  | 'tenant-dashboard'
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
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

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
