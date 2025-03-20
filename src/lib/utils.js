
/**
 * Utility functions for the MobileShop Management System
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and applies Tailwind's merge strategy
 * This utility helps avoid class conflicts when combining conditional classes
 * 
 * @param {...string} inputs - Class names to combine
 * @returns {string} - Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency
 * 
 * @param {number} value - The number to format
 * @param {string} [currency='USD'] - Currency code
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Formats a date to a readable string
 * 
 * @param {Date|string|number} date - Date to format
 * @param {boolean} [includeTime=false] - Whether to include time
 * @returns {string} - Formatted date string
 */
export function formatDate(date, includeTime = false) {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
  };
  
  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Truncates a string if it exceeds the maximum length
 * 
 * @param {string} text - Text to truncate
 * @param {number} [maxLength=50] - Maximum length before truncation
 * @returns {string} - Truncated text with ellipsis if needed
 */
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Generates a unique ID
 * 
 * @returns {string} - Unique ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Debounces a function call
 * 
 * @param {Function} func - Function to debounce
 * @param {number} [wait=300] - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
