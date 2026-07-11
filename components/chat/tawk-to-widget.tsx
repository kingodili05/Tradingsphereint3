'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export function TawkToWidget() {
  const { user } = useAuth();
  useEffect(() => {
    // Tawk.to configuration
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/6a523160a6558f1d451fec26/1jt8h1onu';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Add script to document
    document.head.appendChild(script);

    // Tag the visitor with their account details when signed in
    window.Tawk_API.onLoad = function() {
      if (user?.email) {
        window.Tawk_API.setAttributes({
          name: user.email.split('@')[0],
          email: user.email,
        });
      }
    };

    // Cleanup function
    return () => {
      // Remove script when component unmounts
      const existingScript = document.querySelector('script[src*="tawk.to"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Clean up Tawk_API if it exists
      if (window.Tawk_API) {
        window.Tawk_API = undefined;
      }
    };
  }, []);

  return null; // Tawk.to widget is injected via script
}