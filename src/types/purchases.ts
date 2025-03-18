
export type PurchaseStatus = "Pending" | "Completed" | "Cancelled";

export interface Purchase {
  id: string;
  productId: string;
  productName: string;
  supplierName?: string;  // Making this optional to match the data.ts definition
  supplierId?: string;    // Adding this to match the data.ts definition
  quantity: number;
  cost: number;
  status: PurchaseStatus;
  date: Date;
}
