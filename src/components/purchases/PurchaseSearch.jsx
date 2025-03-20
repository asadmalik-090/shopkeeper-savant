
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const PurchaseSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by product or supplier..."
        className="pl-9 pr-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
