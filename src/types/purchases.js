
/**
 * @typedef {"Pending" | "Completed" | "Cancelled"} PurchaseStatus
 * Status of a purchase order
 */

/**
 * @typedef {Object} Purchase
 * Purchase order information
 * 
 * @property {string} id - Unique identifier
 * @property {string} productId - Product identifier
 * @property {string} productName - Name of the product
 * @property {string} supplierName - Name of the supplier
 * @property {number} quantity - Number of units ordered
 * @property {number} cost - Total cost of the purchase
 * @property {PurchaseStatus} status - Current status of the purchase
 * @property {Date} date - Date the purchase was made
 */

// This file provides JSDoc type definitions for purchase-related entities
// These types are used for documentation and development assistance
