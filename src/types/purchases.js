
/**
 * @fileoverview Purchase-related type definitions and constants
 * This file uses JSDoc comments to define types for better code documentation
 * and development experience in JavaScript.
 */

/**
 * Purchase status constants
 * @readonly
 * @enum {string}
 */
export const PurchaseStatus = {
  /** Purchase is awaiting approval or processing */
  PENDING: "Pending",
  /** Purchase has been received and processed */
  COMPLETED: "Completed",
  /** Purchase has been cancelled */
  CANCELLED: "Cancelled"
};

/**
 * @typedef {Object} Purchase
 * @property {string} id - Unique identifier for the purchase
 * @property {string} productId - Reference to the product being purchased
 * @property {string} productName - Name of the product
 * @property {string} [supplierName] - Name of the supplier (optional)
 * @property {string} [supplierId] - Supplier identifier (optional)
 * @property {number} quantity - Quantity of products ordered
 * @property {number} cost - Total cost of the purchase
 * @property {string} status - Current status of the purchase (use PurchaseStatus constants)
 * @property {Date} date - Date when the purchase was made
 */

/**
 * @typedef {Object} PurchaseFilter
 * @property {string} [search] - Search term to filter purchases
 * @property {string} [status] - Filter by purchase status
 * @property {string} [supplierId] - Filter by supplier
 * @property {Date} [startDate] - Filter purchases after this date
 * @property {Date} [endDate] - Filter purchases before this date
 */

/**
 * @typedef {Object} PurchaseSort
 * @property {string} field - Field to sort by (e.g., 'date', 'cost')
 * @property {('asc'|'desc')} direction - Sort direction
 */

/**
 * @typedef {Object} PurchaseSummary
 * @property {number} totalCost - Total cost of all purchases
 * @property {number} totalItems - Total number of items purchased
 * @property {Object.<string, number>} byStatus - Count of purchases by status
 * @property {Object.<string, number>} bySupplier - Count of purchases by supplier
 */
