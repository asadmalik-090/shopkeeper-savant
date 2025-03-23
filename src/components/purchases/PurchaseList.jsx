
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

/**
 * Status badge color map
 */
const statusColors = {
  "Pending": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  "Completed": "bg-green-100 text-green-800 hover:bg-green-200",
  "Cancelled": "bg-red-100 text-red-800 hover:bg-red-200"
};

/**
 * Purchase list component with data table and actions
 * 
 * @param {Object} props - Component props
 * @param {Array} props.purchases - List of purchase objects
 * @param {Function} props.onUpdateStatus - Function to update purchase status
 * @param {Function} props.onEditPurchase - Function to edit a purchase
 * @param {Function} props.onDeletePurchase - Function to delete a purchase
 * @param {string} [props.searchTerm] - Current search term for filtering
 * @returns {JSX.Element} Purchase list with actions
 */
export const PurchaseList = ({ 
  purchases, 
  onUpdateStatus,
  onEditPurchase,
  onDeletePurchase,
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
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        {purchase.status === "Pending" && (
                          <>
                            <DropdownMenuItem onClick={() => onUpdateStatus(purchase.id, "Completed")}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              <span>Mark Completed</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateStatus(purchase.id, "Cancelled")}>
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

export default PurchaseList;
