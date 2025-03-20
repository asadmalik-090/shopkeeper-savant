
// Purchase status constants
export const PURCHASE_STATUS = {
  PENDING: "Pending",
  COMPLETED: "Completed", 
  CANCELLED: "Cancelled"
};

// Purchase object structure for reference (no types in JS)
// {
//   id: string
//   productId: string
//   productName: string
//   supplierName: string (optional)
//   supplierId: string (optional)
//   quantity: number
//   cost: number
//   status: string (one of the PURCHASE_STATUS values)
//   date: Date
// }
