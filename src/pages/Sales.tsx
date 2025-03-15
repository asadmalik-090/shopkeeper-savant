
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { sales } from '@/lib/data';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const formatCurrency = (value: number) => {
  return `Rs. ${value.toLocaleString()}`;
};

// Format date for display
const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};

const Sales = () => {
  // Process sales data for chart
  const salesData = React.useMemo(() => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const salesByDay: Record<string, { date: string; sales: number; count: number }> = {};
    
    sales.forEach(sale => {
      if (sale.date >= last30Days) {
        const dateStr = formatDate(sale.date);
        if (salesByDay[dateStr]) {
          salesByDay[dateStr].sales += sale.price;
          salesByDay[dateStr].count += 1;
        } else {
          salesByDay[dateStr] = { date: dateStr, sales: sale.price, count: 1 };
        }
      }
    });
    
    return Object.values(salesByDay).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Sales Management</h1>
        <p className="text-muted-foreground">Track and manage your sales transactions</p>
      </div>

      {/* Sales Overview Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'sales') return [`${formatCurrency(value)}`, 'Revenue'];
                    return [`${value}`, 'Units Sold'];
                  }}
                  labelStyle={{ color: '#111' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  name="Revenue" 
                  stroke="hsl(var(--primary))" 
                  yAxisId="left"
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Units Sold" 
                  stroke="#82ca9d" 
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sales Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Records</CardTitle>
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
                header: "Payment Method",
                accessorKey: "paymentMethod",
              },
              {
                header: "Date",
                accessorKey: "date",
                cell: (row) => formatDate(row.date),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
