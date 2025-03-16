
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: keyof T | ((row: T) => any);
    cell?: (info: { row: T; getValue: () => any }) => React.ReactNode;
  }[];
  onRowClick?: (row: T) => void;
  actions?: {
    label: string;
    onClick: (row: T) => void;
    icon?: React.ReactNode;
    showWhen?: (row: T) => boolean;
  }[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  actions,
  searchPlaceholder = "Search...",
  searchKeys,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filter data based on search query
  const filteredData = searchQuery && searchKeys
    ? data.filter(item => 
        searchKeys.some(key => 
          String(item[key]).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data;

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Helper function to get value from row using accessorKey
  const getValue = (row: T, accessorKey: keyof T | ((row: T) => any)) => {
    if (typeof accessorKey === 'function') {
      return accessorKey(row);
    }
    return row[accessorKey];
  };

  return (
    <div className="space-y-4">
      {searchKeys && (
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            placeholder={searchPlaceholder}
            className="pl-9 pr-4"
          />
        </div>
      )}

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b transition-colors hover:bg-muted/80">
                {columns.map((column, i) => (
                  <th key={i} className="p-4 text-left font-medium text-muted-foreground">
                    {column.header}
                  </th>
                ))}
                {actions && <th className="p-4"></th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr className="border-b">
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="p-4 text-center text-muted-foreground">
                    No results found
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`border-b transition-colors hover:bg-muted/50 ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="p-4">
                        {column.cell
                          ? column.cell({ 
                              row, 
                              getValue: () => getValue(row, column.accessorKey) 
                            })
                          : getValue(row, column.accessorKey)}
                      </td>
                    ))}
                    {actions && (
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions
                              .filter(action => !action.showWhen || action.showWhen(row))
                              .map((action, i, filteredActions) => (
                                <React.Fragment key={i}>
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      action.onClick(row);
                                    }}
                                  >
                                    {action.icon && (
                                      <span className="mr-2">{action.icon}</span>
                                    )}
                                    {action.label}
                                  </DropdownMenuItem>
                                  {i < filteredActions.length - 1 && <DropdownMenuSeparator />}
                                </React.Fragment>
                              ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredData.length)} of {filteredData.length}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export { DataTable };
