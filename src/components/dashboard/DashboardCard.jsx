
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

/**
 * Map of icon names to Lucide React components
 */
const iconMap = {
  'trending-up': <TrendingUp className="h-5 w-5" />,
  'trending-down': <TrendingDown className="h-5 w-5" />,
  'bar-chart': <BarChart2 className="h-5 w-5" />,
  'alert-triangle': <AlertTriangle className="h-5 w-5" />,
  'users': <Users className="h-5 w-5" />,
  'package': <Package className="h-5 w-5" />,
  'shopping-cart': <ShoppingCart className="h-5 w-5" />,
  'dollar-sign': <DollarSign className="h-5 w-5" />,
};

/**
 * DashboardCard component displays metric information in a card format
 * 
 * @param {Object} props - Component props
 * @param {Object} props.metric - Metric data to display
 * @param {string} props.metric.title - Title of the metric
 * @param {string} props.metric.value - Value of the metric
 * @param {string} props.metric.icon - Icon to display (key from iconMap)
 * @param {Object} [props.metric.change] - Change information (optional)
 * @param {string} props.metric.change.type - Type of change ('increase' or 'decrease')
 * @param {string} props.metric.change.value - Value of change
 * @param {string} [props.metric.description] - Description of the metric (optional)
 * @param {string} [props.className] - Additional CSS class names
 * @param {Object} [props.style] - Additional inline styles
 * @returns {JSX.Element} Dashboard metric card
 */
const DashboardCard = ({ metric, className, style }) => {
  return (
    <div 
      className={cn(
        "rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]", 
        className
      )}
      style={style}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          {iconMap[metric.icon] || <Package className="h-5 w-5" />}
        </div>
      </div>
      <div className="mt-3 flex items-baseline">
        <h3 className="text-2xl font-bold">{metric.value}</h3>
        {metric.change && (
          <span 
            className={cn(
              "ml-2 text-xs font-medium flex items-center",
              metric.change.type === 'increase' ? "text-green-500" : "text-red-500"
            )}
          >
            {metric.change.type === 'increase' ? (
              <>
                <TrendingUp className="h-3 w-3 mr-1" />
                +{metric.change.value}%
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 mr-1" />
                -{metric.change.value}%
              </>
            )}
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
