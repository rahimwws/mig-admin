'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RiEyeLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import {
  AdminHeader,
  DataTable,
  DealStatusBadge,
  DateRangePicker,
  type Column,
} from '../components';
import * as Button from '@/components/ui/button';
import * as Select from '@/components/ui/select';

import { deals } from '../mocks/deals';
import { getUserById } from '../mocks/users';
import { getAuctionById } from '../mocks/auctions';
import type { Deal } from '../types/admin.types';
import { formatDate, formatCurrency } from '../utils/formatters';

type EnrichedDeal = Deal & {
  brokerName: string;
  developerName: string;
  auctionTitle: string;
};

export default function DealsPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [dateFrom, setDateFrom] = React.useState<string>('');
  const [dateTo, setDateTo] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortField, setSortField] = React.useState<string>('createdAt');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  const pageSize = 20;

  // Enrich deals with user and auction data
  const enrichedDeals = React.useMemo(() => {
    return deals.map((deal) => {
      const broker = getUserById(deal.brokerId);
      const developer = getUserById(deal.developerId);
      const auction = getAuctionById(deal.auctionId);
      return {
        ...deal,
        brokerName: broker?.name || 'Неизвестный',
        developerName: developer?.name || 'Неизвестный',
        auctionTitle: auction?.id || 'Неизвестный',
      };
    });
  }, []);

  // Filter and sort
  const filteredDeals = React.useMemo(() => {
    let result = [...enrichedDeals];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (deal) =>
          deal.brokerName.toLowerCase().includes(searchLower) ||
          deal.developerName.toLowerCase().includes(searchLower) ||
          deal.id.toLowerCase().includes(searchLower),
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((deal) => deal.status === statusFilter);
    }

    // Date range filter
    if (dateFrom) {
      result = result.filter(
        (deal) => new Date(deal.createdAt) >= new Date(dateFrom),
      );
    }
    if (dateTo) {
      result = result.filter(
        (deal) => new Date(deal.createdAt) <= new Date(dateTo),
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
  }, [enrichedDeals, search, statusFilter, dateFrom, dateTo, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredDeals.length / pageSize);
  const paginatedDeals = filteredDeals.slice(
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

  const columns: Column<EnrichedDeal>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '100px',
      render: (deal) => (
        <span className='font-mono text-paragraph-sm text-text-sub-600'>
          {deal.id}
        </span>
      ),
    },
    {
      key: 'auctionId',
      header: 'Аукцион',
      render: (deal) => (
        <Link
          href={`/admin/auctions/${deal.auctionId}`}
          className='text-primary-base hover:underline'
          onClick={(e) => e.stopPropagation()}
        >
          {deal.auctionId}
        </Link>
      ),
    },
    {
      key: 'brokerName',
      header: 'Брокер',
      render: (deal) => (
        <Link
          href={`/admin/users/${deal.brokerId}`}
          className='text-text-strong-950 hover:text-primary-base'
          onClick={(e) => e.stopPropagation()}
        >
          {deal.brokerName}
        </Link>
      ),
    },
    {
      key: 'developerName',
      header: 'Девелопер',
      render: (deal) => (
        <Link
          href={`/admin/users/${deal.developerId}`}
          className='text-text-strong-950 hover:text-primary-base'
          onClick={(e) => e.stopPropagation()}
        >
          {deal.developerName}
        </Link>
      ),
    },
    {
      key: 'amount',
      header: 'Сумма',
      sortable: true,
      render: (deal) => (
        <span className='font-medium'>{formatCurrency(deal.amount)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Статус',
      render: (deal) => <DealStatusBadge status={deal.status} />,
    },
    {
      key: 'createdAt',
      header: 'Создана',
      sortable: true,
      render: (deal) => (
        <span className='text-text-sub-600'>{formatDate(deal.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Действия',
      width: '80px',
      render: (deal) => (
        <Link href={`/admin/deals/${deal.id}`}>
          <Button.Root variant='neutral' mode='ghost' size='xxsmall'>
            <Button.Icon as={RiEyeLine} />
          </Button.Root>
        </Link>
      ),
    },
  ];

  return (
    <div className='flex flex-col'>
      <AdminHeader
        title='Сделки'
        description={`Всего: ${deals.length} сделок`}
      />

      <div className='flex flex-col gap-4 p-6'>
        {/* Filters */}
        <div className='flex flex-wrap items-center gap-3'>
          <Select.Root
            value={statusFilter}
            onValueChange={setStatusFilter}
            size='small'
          >
            <Select.Trigger className='w-[220px]'>
              <Select.Value placeholder='Все статусы' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>Все статусы</Select.Item>
              <Select.Item value='obligation_sent'>Обязательство отправлено</Select.Item>
              <Select.Item value='obligation_accepted'>Обязательство принято</Select.Item>
              <Select.Item value='in_progress'>В процессе</Select.Item>
              <Select.Item value='payment_confirmed'>Оплата подтверждена</Select.Item>
              <Select.Item value='completed'>Завершена</Select.Item>
              <Select.Item value='cancelled'>Отменена</Select.Item>
            </Select.Content>
          </Select.Root>

          <DateRangePicker
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
          />
        </div>

        {/* Data table */}
        <DataTable
          data={paginatedDeals}
          columns={columns}
          keyField='id'
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder='Поиск по участникам...'
          emptyMessage='Сделки не найдены'
          onRowClick={(deal) => router.push(`/admin/deals/${deal.id}`)}
        />
      </div>
    </div>
  );
}
