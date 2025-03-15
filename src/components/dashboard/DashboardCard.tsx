
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  AlertTriangle, 
  Users, 
  Package, 
  ShoppingCart,
  DollarSign
} from 'lucide-react';
import { MetricCard } from '@/lib/data';

const iconMap: Record<string, React.ReactNode> = {
  'trending-up': <TrendingUp className="h-5 w-5" />,
  'trending-down': <TrendingDown className="h-5 w-5" />,
  'bar-chart': <BarChart2 className="h-5 w-5" />,
  'alert-triangle': <AlertTriangle className="h-5 w-5" />,
  'users': <Users className="h-5 w-5" />,
  'package': <Package className="h-5 w-5" />,
  'shopping-cart': <ShoppingCart className="h-5 w-5" />,
  'dollar-sign': <DollarSign className="h-5 w-5" />,
};

interface DashboardCardProps {
  metric: MetricCard;
  className?: string;
  style?: React.CSSProperties;  // Add this line to accept style prop
}

const DashboardCard: React.FC<DashboardCardProps> = ({ metric, className, style }) => {
  return (
    <div 
      className={cn(
        "rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md", 
        className
      )}
      style={style} // Add this line to use the style prop
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          {iconMap[metric.icon] || <Package className="h-5 w-5" />}
        </div>
      </div>
      <div className="mt-3 flex items-baseline">
        <h3 className="text-2xl font-bold">{metric.value}</h3>
        {metric.change && (
          <span 
            className={cn(
              "ml-2 text-xs font-medium",
              metric.change.type === 'increase' ? "text-green-500" : "text-red-500"
            )}
          >
            {metric.change.type === 'increase' ? '+' : '-'}{metric.change.value}%
          </span>
        )}
      </div>
      {metric.description && (
        <p className="mt-1 text-xs text-muted-foreground">{metric.description}</p>
      )}
    </div>
  );
};

export default DashboardCard;
