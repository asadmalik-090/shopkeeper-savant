
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { 
  dashboardMetrics, 
  topSellingProducts, 
  salesByMonth, 
  products, 
  sales 
} from '@/lib/data';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/data-table';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const formatCurrency = (value: number) => {
  return `Rs. ${value.toLocaleString()}`;
};

const Index = () => {
  // Data for brand distribution pie chart
  const brandData = React.useMemo(() => {
    const brands: Record<string, number> = {};
    
    products.forEach(product => {
      if (brands[product.brand]) {
        brands[product.brand] += product.stock;
      } else {
        brands[product.brand] = product.stock;
      }
    });
    
    return Object.entries(brands).map(([name, value]) => ({ name, value }));
  }, []);

  // Recent sales for table
  const recentSales = React.useMemo(() => {
    return [...sales]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your mobile shop business</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardMetrics.map((metric, index) => (
          <DashboardCard 
            key={index} 
            metric={metric} 
            className="animate-in fade-in slide-in" 
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sales Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `${value / 1000}k`}
                    width={50}
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
                  <Bar 
                    dataKey="sales" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Product Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Inventory by Brand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-80 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={brandData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationDuration={1000}
                  >
                    {brandData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} units`, 'Stock']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products and Recent Sales */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.sales} units sold</div>
                  </div>
                  <div className="text-right font-medium">{product.revenue}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={recentSales}
              columns={[
                {
                  header: "Product",
                  accessorKey: "productName",
                },
                {
                  header: "Customer",
                  accessorKey: "customerName",
                  cell: ({ getValue }) => getValue() || "Walk-in Customer",
                },
                {
                  header: "Amount",
                  accessorKey: "price",
                  cell: ({ getValue }) => formatCurrency(getValue() as number),
                },
                {
                  header: "Date",
                  accessorKey: "date",
                  cell: ({ getValue }) => {
                    const date = getValue() as Date;
                    return date.toLocaleDateString();
                  },
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
