'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RiEyeLine,
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import {
  AdminHeader,
  AuctionStatusBadge,
  AuctionModeBadge,
  DateRangePicker,
  QuickDateRange,
  ConfirmModal,
} from '../components';
import * as Button from '@/components/ui/button';
import * as Select from '@/components/ui/select';
import * as Dropdown from '@/components/ui/dropdown';
import * as Input from '@/components/ui/input';
import * as Pagination from '@/components/ui/pagination';

import { auctions, getAuctionById } from '../mocks/auctions';
import { getPropertyById, properties } from '../mocks/properties';
import { getUserById } from '../mocks/users';
import type { Auction } from '../types/admin.types';
import { formatDate, formatDateTime, formatCurrency } from '../utils/formatters';

export default function AuctionsPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [modeFilter, setModeFilter] = React.useState<string>('all');
  const [dateFrom, setDateFrom] = React.useState<string>('');
  const [dateTo, setDateTo] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortField, setSortField] = React.useState<string>('startDate');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  // Modal state
  const [cancelAuction, setCancelAuction] = React.useState<Auction | null>(null);

  const pageSize = 20;

  // Enrich auctions with property and developer data
  const enrichedAuctions = React.useMemo(() => {
    return auctions.map((auction) => {
      const property = getPropertyById(auction.propertyId);
      const developer = getUserById(auction.developerId);
      return {
        ...auction,
        propertyTitle: property?.title || 'Неизвестный объект',
        developerName: developer?.name || 'Неизвестный девелопер',
      };
    });
  }, []);

  // Filter and sort
  const filteredAuctions = React.useMemo(() => {
    let result = [...enrichedAuctions];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (auction) =>
          auction.propertyTitle.toLowerCase().includes(searchLower) ||
          auction.developerName.toLowerCase().includes(searchLower) ||
          auction.id.toLowerCase().includes(searchLower),
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((auction) => auction.status === statusFilter);
    }

    // Mode filter
    if (modeFilter !== 'all') {
      result = result.filter((auction) => auction.mode === modeFilter);
    }

    // Date range filter
    if (dateFrom) {
      result = result.filter(
        (auction) => new Date(auction.startDate) >= new Date(dateFrom),
      );
    }
    if (dateTo) {
      result = result.filter(
        (auction) => new Date(auction.startDate) <= new Date(dateTo),
      );
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    return result;
  }, [
    enrichedAuctions,
    search,
    statusFilter,
    modeFilter,
    dateFrom,
    dateTo,
    sortField,
    sortDirection,
  ]);

  const totalPages = Math.ceil(filteredAuctions.length / pageSize);
  const paginatedAuctions = filteredAuctions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCancelAuction = () => {
    console.log(`Cancel auction: ${cancelAuction?.id}`);
    setCancelAuction(null);
  };

  return (
    <div className='flex flex-col'>
      <AdminHeader
        title='Аукционы'
        description={`Всего: ${auctions.length} аукционов`}
      />

      <div className='flex flex-col gap-4 p-6'>
        {/* Filters */}
        <div className='flex flex-wrap items-center gap-3'>
          <Select.Root
            value={statusFilter}
            onValueChange={setStatusFilter}
            size='small'
          >
            <Select.Trigger className='w-[180px]'>
              <Select.Value placeholder='Все статусы' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>Все статусы</Select.Item>
              <Select.Item value='draft'>Черновик</Select.Item>
              <Select.Item value='scheduled'>Запланирован</Select.Item>
              <Select.Item value='active'>Активен</Select.Item>
              <Select.Item value='selecting_winner'>Выбор победителя</Select.Item>
              <Select.Item value='completed'>Завершён</Select.Item>
              <Select.Item value='cancelled'>Отменён</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root value={modeFilter} onValueChange={setModeFilter} size='small'>
            <Select.Trigger className='w-[150px]'>
              <Select.Value placeholder='Все режимы' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>Все режимы</Select.Item>
              <Select.Item value='open'>Открытый</Select.Item>
              <Select.Item value='closed'>Закрытый</Select.Item>
            </Select.Content>
          </Select.Root>

          <Input.Root size='small' className='w-[280px]'>
            <Input.Wrapper>
              <Input.Input
                placeholder='Поиск по объекту или ID...'
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </Input.Wrapper>
          </Input.Root>

          <Select.Root
            value={sortField}
            onValueChange={(value) => {
              setSortField(value);
              setSortDirection('asc');
            }}
            size='small'
          >
            <Select.Trigger className='w-[190px]'>
              <Select.Value placeholder='Сортировка' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='startDate'>По дате старта</Select.Item>
              <Select.Item value='minPrice'>По мин. цене</Select.Item>
              <Select.Item value='currentMaxBid'>По макс. ставке</Select.Item>
              <Select.Item value='bidsCount'>По ставкам</Select.Item>
            </Select.Content>
          </Select.Root>

          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={() =>
              setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
            }
          >
            {sortDirection === 'asc' ? 'По возрастанию' : 'По убыванию'}
          </Button.Root>

          <DateRangePicker
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
          />
        </div>

        <QuickDateRange
          onSelect={(from, to) => {
            setDateFrom(from);
            setDateTo(to);
          }}
        />

        {/* Cards */}
        {paginatedAuctions.length === 0 ? (
          <div className='rounded-2xl bg-bg-white-0 p-6 text-center text-paragraph-sm text-text-sub-600 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            Аукционы не найдены
          </div>
        ) : (
          <div className='grid gap-4'>
            {paginatedAuctions.map((auction) => (
              <div
                key={auction.id}
                className='rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'
              >
                <div className='flex flex-wrap items-start justify-between gap-4'>
                  <div className='space-y-1'>
                    <div className='flex flex-wrap items-center gap-3'>
                      <span className='font-mono text-paragraph-sm text-text-sub-600'>
                        {auction.id}
                      </span>
                      <AuctionModeBadge mode={auction.mode} />
                      <AuctionStatusBadge status={auction.status} />
                    </div>
                    <div className='text-label-md text-text-strong-950'>
                      {auction.propertyTitle}
                    </div>
                    <div className='text-paragraph-xs text-text-sub-600'>
                      {auction.developerName}
                    </div>
                  </div>

                  <div className='flex items-center gap-1'>
                    <Link href={`/admin/auctions/${auction.id}`}>
                      <Button.Root variant='neutral' mode='ghost' size='xxsmall'>
                        <Button.Icon as={RiEyeLine} />
                      </Button.Root>
                    </Link>
                    {(auction.status === 'active' ||
                      auction.status === 'scheduled') && (
                      <Button.Root
                        variant='error'
                        mode='ghost'
                        size='xxsmall'
                        onClick={(e) => {
                          e.stopPropagation();
                          setCancelAuction(auction);
                        }}
                      >
                        <Button.Icon as={RiCloseLine} />
                      </Button.Root>
                    )}
                  </div>
                </div>

                <div className='mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                  <div className='rounded-lg bg-bg-weak-50 p-3'>
                    <div className='text-paragraph-xs text-text-sub-600'>
                      Мин. цена
                    </div>
                    <div className='text-label-sm text-text-strong-950'>
                      {formatCurrency(auction.minPrice)}
                    </div>
                  </div>
                  <div className='rounded-lg bg-bg-weak-50 p-3'>
                    <div className='text-paragraph-xs text-text-sub-600'>
                      Макс. ставка
                    </div>
                    <div className='text-label-sm text-text-strong-950'>
                      {auction.currentMaxBid ? (
                        <span className='font-medium text-success-base'>
                          {formatCurrency(auction.currentMaxBid)}
                        </span>
                      ) : (
                        <span className='text-text-soft-400'>—</span>
                      )}
                    </div>
                  </div>
                  <div className='rounded-lg bg-bg-weak-50 p-3'>
                    <div className='text-paragraph-xs text-text-sub-600'>
                      Начало
                    </div>
                    <div className='text-label-sm text-text-strong-950'>
                      {formatDateTime(auction.startDate)}
                    </div>
                  </div>
                  <div className='rounded-lg bg-bg-weak-50 p-3'>
                    <div className='text-paragraph-xs text-text-sub-600'>
                      Ставок
                    </div>
                    <div className='text-label-sm text-text-strong-950'>
                      {auction.bidsCount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className='flex items-center justify-between'>
            <div className='text-paragraph-xs text-text-sub-600'>
              Страница {currentPage} из {totalPages}
            </div>
            <Pagination.Root variant='basic'>
              <Pagination.NavButton
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <Pagination.NavIcon as={RiArrowLeftSLine} />
              </Pagination.NavButton>
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <Pagination.Item
                    key={page}
                    current={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                );
              })}
              <Pagination.NavButton
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                <Pagination.NavIcon as={RiArrowRightSLine} />
              </Pagination.NavButton>
            </Pagination.Root>
          </div>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {cancelAuction && (
        <ConfirmModal
          open={!!cancelAuction}
          onOpenChange={() => setCancelAuction(null)}
          title='Отменить аукцион?'
          description={`Аукцион "${cancelAuction.id}" будет отменён. Это действие нельзя отменить.`}
          confirmLabel='Отменить аукцион'
          variant='danger'
          onConfirm={handleCancelAuction}
        />
      )}
    </div>
  );
}
