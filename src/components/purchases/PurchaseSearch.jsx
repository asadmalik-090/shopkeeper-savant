
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const PurchaseSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-2 md:left-3 top-1/2 h-3 w-3 md:h-4 md:w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search products or suppliers..."
        className="pl-7 md:pl-9 pr-2 md:pr-4 text-sm h-8 md:h-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
