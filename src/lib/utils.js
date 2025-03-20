
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and applies Tailwind's merge strategy
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
