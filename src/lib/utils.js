
/**
 * Utility functions for the application
 */

/**
 * Combines multiple class names into a single string
 * Useful for conditionally applying classes
 * 
 * @param  {...any} inputs - Class names to combine
 * @returns {string} Combined class names
 * 
 * @example
 * // Basic usage
 * cn('text-red-500', 'bg-blue-500')
 * // => 'text-red-500 bg-blue-500'
 * 
 * @example
 * // With conditional classes
 * cn('text-red-500', isActive && 'bg-blue-500')
 * // => 'text-red-500 bg-blue-500' or 'text-red-500' if isActive is false
 */
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Formats a date to a string
 * 
 * @param {Date} date - Date to format
 * @param {string} format - Format string
 * @returns {string} Formatted date string
 */
function formatDate(date, format = 'yyyy-MM-dd') {
  if (!date) return '';
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day);
}

/**
 * Formats a currency value
 * 
 * @param {number} value - Value to format
 * @param {string} currency - Currency symbol
 * @returns {string} Formatted currency string
 */
function formatCurrency(value, currency = 'Rs.') {
  return `${currency} ${value.toLocaleString()}`;
}

/**
 * Truncates a string to a specific length and adds ellipsis
 * 
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string
 */
function truncateString(str, length = 50) {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

/**
 * Generates a unique ID
 * 
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

export { cn, formatDate, formatCurrency, truncateString, generateId };
