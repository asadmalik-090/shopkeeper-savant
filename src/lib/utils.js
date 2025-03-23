
/**
 * Combines multiple class names into a single string
 * Uses clsx and tailwind-merge to handle class conflicts properly
 * 
 * @param  {...string} inputs - Class names to be combined
 * @returns {string} - Combined class names
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 * 
 * @param {number} value - Number to format
 * @param {string} currency - Currency symbol (default: Rs.)
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(value, currency = "Rs.") {
  return `${currency} ${value.toLocaleString()}`;
}

/**
 * Format a date to a readable string
 * 
 * @param {Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = {}) {
  const defaultOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  return new Date(date).toLocaleDateString(undefined, { ...defaultOptions, ...options });
}

/**
 * Truncate text to a specified length
 * 
 * @param {string} text - Text to truncate 
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text with ellipsis if needed
 */
export function truncateText(text, length = 50) {
  if (!text || text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Get initials from a name
 * 
 * @param {string} name - Full name
 * @param {number} count - Number of initials to return
 * @returns {string} - Initials
 */
export function getInitials(name, count = 2) {
  if (!name) return '';
  
  return name
    .split(' ')
    .slice(0, count)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}
