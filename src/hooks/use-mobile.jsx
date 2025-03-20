
/**
 * @fileoverview Hook for detecting mobile viewport size
 * This hook helps components adapt to mobile and desktop viewports.
 */

import { useState, useEffect } from "react";

/**
 * Mobile breakpoint in pixels
 * Screens smaller than this are considered mobile devices
 * @constant {number}
 */
const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if the current viewport is mobile-sized
 * 
 * @returns {boolean} True if the viewport is smaller than the mobile breakpoint
 * 
 * @example
 * // In a component:
 * const isMobile = useIsMobile();
 * 
 * return (
 *   <div>
 *     {isMobile ? (
 *       <MobileView />
 *     ) : (
 *       <DesktopView />
 *     )}
 *   </div>
 * );
 */
export function useIsMobile() {
  // Initialize state as undefined to prevent hydration issues
  const [isMobile, setIsMobile] = useState(undefined);

  useEffect(() => {
    // Function to check if viewport is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Create media query list for mobile breakpoint
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Add listener for viewport changes
    mediaQuery.addEventListener("change", checkMobile);
    
    // Check initial state
    checkMobile();
    
    // Clean up listener when component unmounts
    return () => mediaQuery.removeEventListener("change", checkMobile);
  }, []);

  // Return boolean state (default to false until determined)
  return !!isMobile;
}

/**
 * Hook to get current viewport dimensions
 * 
 * @returns {{width: number, height: number}} Current viewport dimensions
 * 
 * @example
 * const { width, height } = useViewportSize();
 * console.log(`Viewport is ${width}px × ${height}px`);
 */
export function useViewportSize() {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}
