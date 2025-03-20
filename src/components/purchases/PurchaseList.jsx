
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CheckCircle, XCircle, Pencil, Trash } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  // Responsive column configuration
  const getColumns = () => {
    const baseColumns = [
      {
        header: "Product",
        accessorKey: "productName",
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
        accessorKey: "id",
        cell: ({ row }) => {
          const purchase = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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
      }
    ];

    // Add more columns for desktop view
    if (!isMobile) {
      // Insert these columns after "Product" but before "Status"
      baseColumns.splice(1, 0, 
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
        }
      );
    }

    return baseColumns;
  };

  // Mobile card view for purchase items
  const renderMobileCards = () => {
    return (
      <div className="space-y-4">
        {purchases.map(purchase => (
          <Card key={purchase.id} className="overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">{purchase.productName}</h3>
                <p className="text-sm text-muted-foreground">
                  {purchase.supplierName || 'No supplier'} • {new Date(purchase.date).toLocaleDateString()}
                </p>
              </div>
              <Badge className={statusColors[purchase.status]}>
                {purchase.status}
              </Badge>
            </div>
            <div className="border-t px-4 py-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Quantity</p>
                <p className="font-medium">{purchase.quantity}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Cost</p>
                <p className="font-medium">Rs. {purchase.cost.toLocaleString()}</p>
              </div>
            </div>
            <div className="border-t p-2 flex justify-end gap-2">
              {purchase.status === "Pending" && (
                <>
                  <Button variant="outline" size="sm" onClick={() => onUpdateStatus(purchase.id, "Completed")}>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Complete
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onUpdateStatus(purchase.id, "Cancelled")}>
                    <XCircle className="mr-1 h-3 w-3" />
                    Cancel
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={() => onEditPurchase(purchase)}>
                <Pencil className="mr-1 h-3 w-3" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDeletePurchase(purchase.id)}>
                <Trash className="mr-1 h-3 w-3" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // DataTable component that adapts to mobile and desktop
  const DataTable = ({ data, columns }) => {
    if (isMobile) {
      return renderMobileCards();
    }

    return (
      <div className="rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              {columns.map((column, index) => (
                <th key={index} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b transition-colors hover:bg-muted/50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="p-4 align-middle">
                    {column.cell 
                      ? column.cell({ 
                          getValue: () => row[column.accessorKey], 
                          row: { original: row }
                        }) 
                      : row[column.accessorKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Orders {searchTerm && `(${purchases.length} results)`}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={purchases}
          columns={getColumns()}
        />
      </CardContent>
    </Card>
  );
};
