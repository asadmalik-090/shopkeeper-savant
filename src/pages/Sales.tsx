
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { sales } from '@/lib/data';

const formatCurrency = (value: number) => {
  return `Rs. ${value.toLocaleString()}`;
};

const Sales = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Sales</h1>
        <p className="text-muted-foreground">Manage your sales and transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={sales}
            columns={[
              {
                header: "Product",
                accessorKey: "productName",
              },
              {
                header: "Customer",
                accessorKey: "customerName",
                cell: (row) => row.customerName || "Walk-in Customer",
              },
              {
                header: "Quantity",
                accessorKey: "quantity",
              },
              {
                header: "Amount",
                accessorKey: "price",
                cell: (row) => formatCurrency(row.price),
              },
              {
                header: "Profit",
                accessorKey: "profit",
                cell: (row) => formatCurrency(row.profit),
              },
              {
                header: "Payment",
                accessorKey: "paymentMethod",
                cell: (row) => row.paymentMethod.charAt(0).toUpperCase() + row.paymentMethod.slice(1),
              },
              {
                header: "Status",
                accessorKey: "status",
                cell: (row) => (
                  <span className={row.status === 'completed' ? 'text-green-500' : 'text-amber-500'}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                  </span>
                ),
              },
              {
                header: "Date",
                accessorKey: "date",
                cell: (row) => row.date.toLocaleDateString(),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
