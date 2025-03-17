
export type PurchaseStatus = "Pending" | "Completed" | "Cancelled";

export interface Purchase {
  id: string;
  productId: string;
  productName: string;
  supplierName: string;
  quantity: number;
  cost: number;
  status: PurchaseStatus;
  date: Date;
}
