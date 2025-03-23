
import * as React from "react";

/**
 * Mobile breakpoint in pixels
 */
const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if the current viewport is mobile
 * 
 * @returns {boolean} True if viewport is mobile size
 * 
 * @example
 * function Component() {
 *   const isMobile = useIsMobile();
 *   
 *   return (
 *     <div>
 *       {isMobile ? 'Mobile View' : 'Desktop View'}
 *     </div>
 *   );
 * }
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Initial check
    onChange();
    
    // Add listener for viewport changes
    mql.addEventListener("change", onChange);
    
    // Clean up
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

/**
 * Component to conditionally render content based on mobile viewport
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.mobile - Content to show on mobile
 * @param {React.ReactNode} props.desktop - Content to show on desktop
 * @returns {React.ReactNode} Appropriate content for viewport size
 * 
 * @example
 * <MobileSwitch
 *   mobile={<SimpleMenu />}
 *   desktop={<ExpandedMenu />}
 * />
 */
export function MobileSwitch({ mobile, desktop }) {
  const isMobile = useIsMobile();
  
  // Return null until we know the viewport size
  if (isMobile === undefined) return null;
  
  return isMobile ? mobile : desktop;
}
