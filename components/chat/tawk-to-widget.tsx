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
    script.src = 'https://embed.tawk.to/68bcb5e1f58c911925a72d90/1j4gicuud';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Add script to document
    document.head.appendChild(script);

    // Customize Tawk.to appearance and behavior
    window.Tawk_API.onLoad = function() {
      // Customize the widget appearance and branding with user data if available
      const attributes = {
        name: user?.email ? user.email.split('@')[0] : 'User',
        email: user?.email || 'user@example.com',
      };
      
      window.Tawk_API.setAttributes(attributes);
    };

    // Handle chat events
    window.Tawk_API.onChatStarted = function() {
      console.log('Chat started');
    };

    window.Tawk_API.onChatEnded = function() {
      console.log('Chat ended');
    };
    
    // Handle widget minimization/maximization
    window.Tawk_API.onChatMinimized = function() {
      console.log('Chat minimized');
    };
    
    window.Tawk_API.onChatMaximized = function() {
      console.log('Chat maximized');
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