
/**
 * @fileoverview Search component for purchases
 * This component provides a search input for filtering purchases.
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

/**
 * Purchase search component with responsive design
 * 
 * @param {Object} props - Component props
 * @param {string} props.searchTerm - Current search term
 * @param {Function} props.setSearchTerm - Function to update search term
 * @param {string} [props.placeholder] - Custom placeholder text
 * @returns {JSX.Element} Search input with icon
 * 
 * @example
 * const [search, setSearch] = useState('');
 * 
 * <PurchaseSearch 
 *   searchTerm={search} 
 *   setSearchTerm={setSearch} 
 * />
 */
export const PurchaseSearch = ({ 
  searchTerm, 
  setSearchTerm,
  placeholder = "Search products or suppliers..."
}) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-2 md:left-3 top-1/2 h-3 w-3 md:h-4 md:w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-7 md:pl-9 pr-2 md:pr-4 text-sm h-8 md:h-10 rounded-lg border-muted-foreground/20 focus:border-primary focus:ring-1 focus:ring-primary"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search purchases"
      />
    </div>
  );
};

export default PurchaseSearch;
