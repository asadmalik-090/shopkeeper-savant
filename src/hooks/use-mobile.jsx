
import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current device is mobile
 * based on screen width
 * 
 * @param {number} breakpoint - Width threshold in pixels (default: 768)
 * @returns {boolean} - True if screen width is less than breakpoint
 * 
 * @example
 * const isMobile = useIsMobile();
 * 
 * return (
 *   <div className={isMobile ? "mobile-layout" : "desktop-layout"}>
 *     {isMobile ? <MobileNav /> : <DesktopNav />}
 *   </div>
 * );
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Set the initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;
