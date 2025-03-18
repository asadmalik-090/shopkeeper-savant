
export type PurchaseStatus = "Pending" | "Completed" | "Cancelled";

export interface Purchase {
  id: string;
  productId: string;
  productName: string;
  supplierName: string;  // Making this required to match the usage in components
  quantity: number;
  cost: number;
  status: PurchaseStatus;
  date: Date;
}
