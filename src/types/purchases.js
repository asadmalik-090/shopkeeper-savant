
// Purchase status constants
export const PurchaseStatus = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
};

// This file defines the structure of purchase-related data
// Now using JSDoc comments for documentation instead of TypeScript types

/**
 * @typedef {Object} Purchase
 * @property {string} id - Unique identifier
 * @property {string} productId - Product identifier
 * @property {string} productName - Name of the product
 * @property {string} [supplierName] - Name of the supplier (optional)
 * @property {string} [supplierId] - Supplier identifier (optional)
 * @property {number} quantity - Quantity ordered
 * @property {number} cost - Total cost of the purchase
 * @property {string} status - Current status of the purchase
 * @property {Date} date - Date of the purchase
 */
