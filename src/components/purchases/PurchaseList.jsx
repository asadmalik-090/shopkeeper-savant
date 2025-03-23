
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

// Status badge colors with enhanced styling
const statusColors = {
  "Pending": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 font-medium border border-yellow-300",
  "Completed": "bg-green-100 text-green-800 hover:bg-green-200 font-medium border border-green-300",
  "Cancelled": "bg-red-100 text-red-800 hover:bg-red-200 font-medium border border-red-300"
};

/**
 * PurchaseList component displays a table of purchase orders with actions
 * 
 * @param {Object} props - Component props
 * @param {Array} props.purchases - Array of purchase objects
 * @param {Function} props.onUpdateStatus - Function to update purchase status
 * @param {Function} props.onEditPurchase - Function to edit a purchase
 * @param {Function} props.onDeletePurchase - Function to delete a purchase
 * @param {string} [props.searchTerm] - Current search term
 * @returns {JSX.Element} Table of purchases with actions
 */
export const PurchaseList = ({ 
  purchases, 
  onUpdateStatus,
  onEditPurchase,
  onDeletePurchase,
  searchTerm
}) => {
  return (
    <Card className="shadow-lg border-muted-foreground/10">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-xl font-semibold">
          Purchase Orders {searchTerm && `(${purchases.length} results)`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        <DataTable
          data={purchases}
          columns={[
            {
              header: "Product",
              accessorKey: "productName",
              cell: (info) => (
                <div className="font-medium">{info.getValue()}</div>
              ),
            },
            {
              header: "Supplier",
              accessorKey: "supplierName",
              cell: (info) => info.getValue() || "—",
            },
            {
              header: "Quantity",
              accessorKey: "quantity",
              cell: (info) => (
                <span className="font-mono">{info.getValue()}</span>
              ),
            },
            {
              header: "Total Cost",
              accessorKey: "cost",
              cell: (info) => (
                <span className="font-mono font-medium">
                  Rs. {(info.getValue()).toLocaleString()}
                </span>
              ),
            },
            {
              header: "Date",
              accessorKey: "date",
              cell: (info) => (
                <span className="text-muted-foreground">
                  {new Date(info.getValue()).toLocaleDateString()}
                </span>
              ),
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
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuGroup>
                        {purchase.status === "Pending" && (
                          <>
                            <DropdownMenuItem onClick={() => onUpdateStatus(purchase.id, "Completed")} className="cursor-pointer">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span>Mark Completed</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateStatus(purchase.id, "Cancelled")} className="cursor-pointer">
                              <XCircle className="mr-2 h-4 w-4 text-red-500" />
                              <span>Cancel Order</span>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => onEditPurchase(purchase)} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeletePurchase(purchase.id)} className="cursor-pointer text-red-500 focus:text-red-500">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              },
            },
          ]}
          searchPlaceholder="Search purchases..."
          searchKeys={["productName", "supplierName"]}
        />
      </CardContent>
    </Card>
  );
};

export default PurchaseList;
