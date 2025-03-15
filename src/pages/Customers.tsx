
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { customers } from '@/lib/data';

const Customers = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage your customer relationships</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={customers}
            columns={[
              {
                header: "Name",
                accessorKey: "name",
              },
              {
                header: "Phone",
                accessorKey: "phone",
              },
              {
                header: "CNIC",
                accessorKey: "cnic",
                cell: (row) => row.cnic || "—",
              },
              {
                header: "Email",
                accessorKey: "email",
                cell: (row) => row.email || "—",
              },
              {
                header: "Address",
                accessorKey: "address",
                cell: (row) => row.address || "—",
              },
              {
                header: "Customer Since",
                accessorKey: "createdAt",
                cell: (row) => row.createdAt.toLocaleDateString(),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
