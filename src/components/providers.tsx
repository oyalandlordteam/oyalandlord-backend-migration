'use client';

import { useState, useEffect } from 'react';
import { initializeStores } from '@/lib/store';
import { ThemeProvider } from 'next-themes';
import { RouterProvider } from '@/lib/router';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize stores asynchronusly
    const init = async () => {
      await initializeStores();
      setInitialized(true);
    };
    
    init();
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      <RouterProvider>{children}</RouterProvider>
    </ThemeProvider>
  );
}
