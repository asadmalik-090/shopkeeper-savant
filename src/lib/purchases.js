
/**
 * @fileoverview Purchase-related types and utilities
 */

/**
 * Purchase status enum
 * @typedef {'Pending' | 'Completed' | 'Cancelled'} PurchaseStatus
 */

/**
 * Purchase object
 * @typedef {Object} Purchase
 * @property {string} id - Unique identifier
 * @property {string} productId - Product identifier
 * @property {string} productName - Product name
 * @property {string} [supplierName] - Supplier name (optional)
 * @property {string} [supplierId] - Supplier identifier (optional)
 * @property {number} quantity - Quantity ordered
 * @property {number} cost - Total cost
 * @property {PurchaseStatus} status - Purchase status
 * @property {Date} date - Purchase date
 */

/**
 * Create a new purchase object
 * 
 * @param {Object} purchaseData - Purchase data
 * @returns {Purchase} New purchase object
 */
export function createPurchase(purchaseData) {
  return {
    id: purchaseData.id || `purchase_${Date.now()}`,
    productId: purchaseData.productId,
    productName: purchaseData.productName,
    supplierName: purchaseData.supplierName,
    supplierId: purchaseData.supplierId,
    quantity: purchaseData.quantity || 1,
    cost: purchaseData.cost || 0,
    status: purchaseData.status || 'Pending',
    date: purchaseData.date || new Date(),
  };
}

/**
 * Calculate total purchase cost
 * 
 * @param {Purchase[]} purchases - Array of purchases
 * @returns {number} Total cost
 */
export function calculateTotalPurchaseCost(purchases) {
  return purchases.reduce((sum, purchase) => sum + purchase.cost, 0);
}

/**
 * Get purchase status display properties
 * 
 * @param {PurchaseStatus} status - Purchase status
 * @returns {Object} Status display properties
 */
export function getPurchaseStatusDetails(status) {
  const statusMap = {
    'Pending': {
      label: 'Pending',
      color: 'yellow',
      icon: 'clock',
      description: 'Order has been placed but not yet received'
    },
    'Completed': {
      label: 'Completed',
      color: 'green',
      icon: 'check-circle',
      description: 'Order has been received and processed'
    },
    'Cancelled': {
      label: 'Cancelled',
      color: 'red',
      icon: 'x-circle',
      description: 'Order has been cancelled'
    }
  };
  
  return statusMap[status] || statusMap['Pending'];
}
