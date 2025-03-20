
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CheckCircle, XCircle, Pencil, Trash } from 'lucide-react';
import { PURCHASE_STATUS } from '@/types/purchases';

// Status badge colors
const statusColors = {
  "Pending": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  "Completed": "bg-green-100 text-green-800 hover:bg-green-200",
  "Cancelled": "bg-red-100 text-red-800 hover:bg-red-200"
};

export const PurchaseList = ({ 
  purchases, 
  onUpdateStatus,
  onEditPurchase,
  onDeletePurchase,
  searchTerm
}) => {
  return (
    <Card>
      <CardHeader className="px-4 py-3 md:px-6 md:py-4">
        <CardTitle className="text-lg md:text-xl">Purchase Orders {searchTerm && `(${purchases.length} results)`}</CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-2 md:px-6 md:py-4">
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
              // Hide on smaller screens
              cell: ({ getValue }) => (
                <span className="hidden sm:inline">{getValue() || "—"}</span>
              ),
            },
            {
              header: "Qty",
              accessorKey: "quantity",
            },
            {
              header: "Cost",
              accessorKey: "cost",
              cell: (info) => `Rs. ${(info.getValue()).toLocaleString()}`,
            },
            {
              header: "Date",
              accessorKey: "date",
              cell: (info) => new Date(info.getValue()).toLocaleDateString(),
            },
            {
              header: "Status",
              accessorKey: "status",
              cell: (info) => (
                <Badge className={statusColors[info.getValue()]}>
                  {info.getValue()}
                </Badge>
              ),
            },
            {
              header: "",
              accessorKey: (row) => row.id,
              cell: ({ row }) => {
                const purchase = row;
                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8">
                        <MoreHorizontal className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuGroup>
                        {purchase.status === PURCHASE_STATUS.PENDING && (
                          <>
                            <DropdownMenuItem onClick={() => onUpdateStatus(purchase.id, PURCHASE_STATUS.COMPLETED)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              <span>Mark Completed</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateStatus(purchase.id, PURCHASE_STATUS.CANCELLED)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              <span>Cancel Order</span>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => onEditPurchase(purchase)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeletePurchase(purchase.id)}>
                          <Trash className="mr-2 h-4 w-4 text-destructive" />
                          <span className="text-destructive">Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              },
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};
