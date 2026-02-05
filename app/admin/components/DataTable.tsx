'use client';

import * as React from 'react';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiSearchLine,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Table from '@/components/ui/table';
import * as Pagination from '@/components/ui/pagination';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  // Sorting
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  // Loading & Empty
  isLoading?: boolean;
  emptyMessage?: string;
  // Actions
  onRowClick?: (item: T) => void;
  // Styling
  className?: string;
}

export function DataTable<T extends object>({
  data,
  columns,
  keyField,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  pageSize = 20,
  onPageSizeChange,
  sortField,
  sortDirection,
  onSort,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Поиск...',
  isLoading = false,
  emptyMessage = 'Данные не найдены',
  onRowClick,
  className,
}: DataTableProps<T>) {
  const handleSort = (field: string, sortable?: boolean) => {
    if (sortable && onSort) {
      onSort(field);
    }
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Search and controls */}
      {(onSearchChange || onPageSizeChange) && (
        <div className='flex flex-wrap items-center justify-between gap-4'>
          {onSearchChange && (
            <div className='w-full max-w-[320px]'>
              <Input.Root size='small'>
                <Input.Wrapper>
                  <Input.Icon as={RiSearchLine} />
                  <Input.Input
                    placeholder={searchPlaceholder}
                    value={searchValue || ''}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
          )}

          {onPageSizeChange && (
            <div className='flex items-center gap-2'>
              <span className='text-paragraph-sm text-text-sub-600'>Показать:</span>
              <Select.Root
                value={String(pageSize)}
                onValueChange={(v) => onPageSizeChange(Number(v))}
                size='small'
              >
                <Select.Trigger className='w-[80px]'>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value='10'>10</Select.Item>
                  <Select.Item value='20'>20</Select.Item>
                  <Select.Item value='50'>50</Select.Item>
                  <Select.Item value='100'>100</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className='overflow-hidden rounded-xl bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              {columns.map((column) => (
                <Table.Head
                  key={column.key}
                  className={cn(
                    column.sortable && 'cursor-pointer select-none',
                    column.className,
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key, column.sortable)}
                >
                  <div className='flex items-center gap-1'>
                    <span>{column.header}</span>
                    {column.sortable && (
                      <div className='flex flex-col'>
                        <RiArrowUpSLine
                          className={cn('size-3 -mb-1', {
                            'text-text-strong-950':
                              sortField === column.key && sortDirection === 'asc',
                            'text-text-disabled-300':
                              sortField !== column.key || sortDirection !== 'asc',
                          })}
                        />
                        <RiArrowDownSLine
                          className={cn('size-3 -mt-1', {
                            'text-text-strong-950':
                              sortField === column.key && sortDirection === 'desc',
                            'text-text-disabled-300':
                              sortField !== column.key || sortDirection !== 'desc',
                          })}
                        />
                      </div>
                    )}
                  </div>
                </Table.Head>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <Table.Row key={i}>
                  {columns.map((column) => (
                    <Table.Cell key={column.key}>
                      <div className='h-4 w-full animate-pulse rounded bg-bg-weak-50' />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <Table.Row>
                <Table.Cell
                  colSpan={columns.length}
                  className='h-32 text-center'
                >
                  <div className='text-paragraph-sm text-text-sub-600'>
                    {emptyMessage}
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : (
              // Data rows
              data.map((item, index) => (
                <Table.Row
                  key={String(item[keyField])}
                  className={cn({
                    'cursor-pointer': !!onRowClick,
                  })}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <Table.Cell key={column.key} className={column.className}>
                      {column.render
                        ? column.render(item, index)
                        : String((item as Record<string, unknown>)[column.key] ?? '')}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className='flex items-center justify-between'>
          <div className='text-paragraph-sm text-text-sub-600'>
            Страница {currentPage} из {totalPages}
          </div>

          <Pagination.Root variant='basic'>
            <Pagination.NavButton
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <Pagination.NavIcon as={RiArrowLeftSLine} />
            </Pagination.NavButton>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Pagination.Item
                  key={pageNum}
                  current={pageNum === currentPage}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}

            <Pagination.NavButton
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <Pagination.NavIcon as={RiArrowRightSLine} />
            </Pagination.NavButton>
          </Pagination.Root>
        </div>
      )}
    </div>
  );
}
