'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SearchInput } from './SearchInput';
import { Pagination } from './Pagination';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Column<T = any> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  hideHeader?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyMessage?: string;
  page?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  headerExtra?: ReactNode;
  keyExtractor: (item: T) => string;
  hideSearch?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  onEdit,
  onDelete,
  emptyMessage = 'No items found.',
  page,
  totalPages,
  totalItems,
  onPageChange,
  headerExtra,
  keyExtractor,
  hideSearch,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#C8A97E]" />
        </CardContent>
      </Card>
    );
  }

  const hasPagination = page !== undefined && totalPages !== undefined && onPageChange;
  const showSearch = !hideSearch && onSearchChange !== undefined;

  return (
    <Card>
      {(showSearch || headerExtra) && (
        <CardHeader>
          <div className="flex items-center gap-4">
            {showSearch && (
              <div className="flex-1">
                <SearchInput
                  value={searchValue || ''}
                  onChange={onSearchChange}
                  placeholder={searchPlaceholder}
                />
              </div>
            )}
            {headerExtra && <div className="shrink-0">{headerExtra}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{emptyMessage}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`text-left py-3 px-4 text-sm font-medium text-gray-500 ${col.className || ''}`}
                    >
                      {col.hideHeader ? '' : col.header}
                    </th>
                  ))}
                  {(onEdit || onDelete) && (
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <motion.tr
                    key={keyExtractor(item)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={`py-3 px-4 ${col.className || ''}`}>
                        {col.render ? col.render(item) : ((item as Record<string, unknown>)[col.key] as ReactNode) ?? '-'}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4 text-gray-500" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {hasPagination && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems || data.length}
            onPageChange={onPageChange}
          />
        )}
      </CardContent>
    </Card>
  );
}
