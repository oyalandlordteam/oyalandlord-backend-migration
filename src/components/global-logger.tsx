'use client';
import { useEffect } from 'react';

export function GlobalLogger() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleError = (event: ErrorEvent) => {
      const { message, filename, lineno, colno, error } = event;
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'ERROR',
          message: `Uncaught Error: ${message}`,
          meta: { filename, lineno, colno, stack: error?.stack }
        }),
      }).catch(console.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'ERROR',
          message: `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`,
          meta: { stack: event.reason?.stack }
        }),
      }).catch(console.error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
