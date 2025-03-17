
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Purchase } from '@/types/purchases';

// Status badge colors
const statusColors = {
  "Pending": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  "Completed": "bg-green-100 text-green-800 hover:bg-green-200",
  "Cancelled": "bg-red-100 text-red-800 hover:bg-red-200"
};

interface PurchaseListProps {
  purchases: Purchase[];
  onUpdateStatus: (id: string, status: "Pending" | "Completed" | "Cancelled") => void;
  searchTerm?: string;
}

export const PurchaseList: React.FC<PurchaseListProps> = ({ 
  purchases, 
  onUpdateStatus,
  searchTerm
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Orders {searchTerm && `(${purchases.length} results)`}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={purchases}
          columns={[
            {
              header: "Product",
              accessorKey: "productName",
            },
            {
              header: "Supplier",
              accessorKey: "supplierName",
            },
            {
              header: "Quantity",
              accessorKey: "quantity",
            },
            {
              header: "Total Cost",
              accessorKey: "cost",
              cell: (info) => `Rs. ${(info.getValue() as number).toLocaleString()}`,
            },
            {
              header: "Date",
              accessorKey: "date",
              cell: (info) => new Date(info.getValue() as Date).toLocaleDateString(),
            },
            {
              header: "Status",
              accessorKey: "status",
              cell: (info) => (
                <Badge className={statusColors[info.getValue() as keyof typeof statusColors]}>
                  {info.getValue() as string}
                </Badge>
              ),
            },
          ]}
          actions={[
            {
              label: "Mark Completed",
              onClick: (purchase) => onUpdateStatus(purchase.id, "Completed"),
              showWhen: (purchase) => purchase.status === "Pending",
            },
            {
              label: "Cancel Order",
              onClick: (purchase) => onUpdateStatus(purchase.id, "Cancelled"),
              showWhen: (purchase) => purchase.status === "Pending",
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};
