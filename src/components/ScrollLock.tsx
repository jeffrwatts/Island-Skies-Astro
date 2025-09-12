'use client';

import { useEffect } from 'react';

export default function ScrollLock() {
  useEffect(() => {
    // Lock body scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPosition = window.getComputedStyle(document.body).position;
    const originalWidth = window.getComputedStyle(document.body).width;
    const originalHeight = window.getComputedStyle(document.body).height;
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Cleanup function to restore scroll
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
      document.body.style.height = originalHeight;
    };
  }, []);

  return null;
}
