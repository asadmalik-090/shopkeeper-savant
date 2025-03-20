
/**
 * @fileoverview Skeleton component for loading states
 * This component displays a pulsing placeholder while content is loading.
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Skeleton component that displays a loading placeholder
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.HTMLAttributes<HTMLDivElement>} props.rest - Other div attributes
 * @returns {JSX.Element} Skeleton component
 * 
 * @example
 * // Basic usage
 * <Skeleton className="h-10 w-full" />
 * 
 * @example
 * // Card skeleton
 * <div className="space-y-3">
 *   <Skeleton className="h-[125px] w-full rounded-xl" />
 *   <div className="space-y-2">
 *     <Skeleton className="h-4 w-[250px]" />
 *     <Skeleton className="h-4 w-[200px]" />
 *   </div>
 * </div>
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
      aria-hidden="true" // Hide from screen readers
    />
  );
}

export { Skeleton };
