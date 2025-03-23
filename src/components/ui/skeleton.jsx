
import React from "react";
import { cn } from "@/lib/utils";

/**
 * Skeleton component for loading state
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.children] - Child elements
 * @returns {JSX.Element} Skeleton loading component
 * 
 * @example
 * <Skeleton className="h-12 w-12 rounded-full" />
 */
const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
};

export { Skeleton };
