'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  RiUserLine,
  RiAuctionLine,
  RiHandCoinLine,
  RiBuildingLine,
  RiFileList3Line,
  RiMoneyDollarCircleLine,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import {
  AdminHeader,
  DataTable,
  DateRangePicker,
  QuickDateRange,
  type Column,
} from '../components';
import * as Select from '@/components/ui/select';
import * as Badge from '@/components/ui/badge';

import { logs } from '../mocks/logs';
import { getUserById, users } from '../mocks/users';
import type { Log, LogAction, LogEntityType } from '../types/admin.types';
import { formatDateTime, formatRelativeTime } from '../utils/formatters';

// Action labels in Russian
const actionLabels: Record<LogAction, string> = {
  'user.login': 'Вход в систему',
  'user.register': 'Регистрация',
  'user.update': 'Обновление профиля',
  'property.create': 'Создание объекта',
  'property.update': 'Обновление объекта',
  'property.delete': 'Удаление объекта',
  'auction.create': 'Создание аукциона',
  'auction.start': 'Запуск аукциона',
  'auction.complete': 'Завершение аукциона',
  'auction.cancel': 'Отмена аукциона',
  'bid.create': 'Новая ставка',
  'deal.create': 'Создание сделки',
  'deal.update': 'Обновление сделки',
  'deal.complete': 'Завершение сделки',
  'payout.create': 'Создание выплаты',
  'payout.complete': 'Выплата выполнена',
};

// Entity type labels
const entityTypeLabels: Record<LogEntityType, string> = {
  user: 'Пользователь',
  property: 'Объект',
  auction: 'Аукцион',
  bid: 'Ставка',
  deal: 'Сделка',
  payout: 'Выплата',
};

// Entity type colors
const entityTypeColors: Record<LogEntityType, 'blue' | 'green' | 'orange' | 'purple' | 'teal' | 'gray'> = {
  user: 'blue',
  property: 'orange',
  auction: 'purple',
  bid: 'green',
  deal: 'teal',
  payout: 'gray',
};

// Get icon for action type
function getActionIcon(action: string) {
  if (action.startsWith('user')) return RiUserLine;
  if (action.startsWith('property')) return RiBuildingLine;
  if (action.startsWith('auction')) return RiAuctionLine;
  if (action.startsWith('bid')) return RiHandCoinLine;
  if (action.startsWith('deal')) return RiFileList3Line;
  if (action.startsWith('payout')) return RiMoneyDollarCircleLine;
  return RiFileList3Line;
}

// Get entity link
function getEntityLink(entityType: LogEntityType, entityId: string): string {
  switch (entityType) {
    case 'user':
      return `/admin/users/${entityId}`;
    case 'auction':
      return `/admin/auctions/${entityId}`;
    case 'deal':
      return `/admin/deals/${entityId}`;
    default:
      return '#';
  }
}

type EnrichedLog = Log & {
  userName: string;
};

export default function LogsPage() {
  const [search, setSearch] = React.useState('');
  const [actionFilter, setActionFilter] = React.useState<string>('all');
  const [userFilter, setUserFilter] = React.useState<string>('all');
  const [dateFrom, setDateFrom] = React.useState<string>('');
  const [dateTo, setDateTo] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState(1);

  const pageSize = 50;

  // Enrich logs with user names
  const enrichedLogs = React.useMemo(() => {
    return logs.map((log) => {
      const user = getUserById(log.userId);
      return {
        ...log,
        userName: user?.name || 'Неизвестный',
      };
    });
  }, []);

  // Filter logs
  const filteredLogs = React.useMemo(() => {
    let result = [...enrichedLogs];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (log) =>
          log.userName.toLowerCase().includes(searchLower) ||
          log.action.toLowerCase().includes(searchLower) ||
          log.entityId.toLowerCase().includes(searchLower),
      );
    }

    // Action filter
    if (actionFilter !== 'all') {
      result = result.filter((log) => log.action === actionFilter);
    }

    // User filter
    if (userFilter !== 'all') {
      result = result.filter((log) => log.userId === userFilter);
    }

    // Date range filter
    if (dateFrom) {
      result = result.filter(
        (log) => new Date(log.createdAt) >= new Date(dateFrom),
      );
    }
    if (dateTo) {
      result = result.filter(
        (log) => new Date(log.createdAt) <= new Date(dateTo),
      );
    }

    // Sort by date descending
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return result;
  }, [enrichedLogs, search, actionFilter, userFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Get unique actions for filter
  const uniqueActions = Array.from(new Set(logs.map((log) => log.action))).sort();

  const columns: Column<EnrichedLog>[] = [
    {
      key: 'createdAt',
      header: 'Время',
      width: '180px',
      render: (log) => (
        <div>
          <div className='text-label-sm text-text-strong-950'>
            {formatDateTime(log.createdAt)}
          </div>
          <div className='text-paragraph-xs text-text-soft-400'>
            {formatRelativeTime(log.createdAt)}
          </div>
        </div>
      ),
    },
    {
      key: 'userId',
      header: 'Пользователь',
      render: (log) => (
        <Link
          href={`/admin/users/${log.userId}`}
          className='text-text-strong-950 hover:text-primary-base'
        >
          {log.userName}
        </Link>
      ),
    },
    {
      key: 'action',
      header: 'Действие',
      render: (log) => {
        const Icon = getActionIcon(log.action);
        return (
          <div className='flex items-center gap-2'>
            <Icon className='size-4 text-text-sub-600' />
            <span className='text-label-sm text-text-strong-950'>
              {actionLabels[log.action as LogAction] || log.action}
            </span>
          </div>
        );
      },
    },
    {
      key: 'entityType',
      header: 'Сущность',
      render: (log) => (
        <Badge.Root
          variant='lighter'
          color={entityTypeColors[log.entityType]}
          size='small'
        >
          {entityTypeLabels[log.entityType]}
        </Badge.Root>
      ),
    },
    {
      key: 'entityId',
      header: 'ID сущности',
      render: (log) => {
        const link = getEntityLink(log.entityType, log.entityId);
        return link !== '#' ? (
          <Link
            href={link}
            className='font-mono text-paragraph-sm text-primary-base hover:underline'
          >
            {log.entityId}
          </Link>
        ) : (
          <span className='font-mono text-paragraph-sm text-text-sub-600'>
            {log.entityId}
          </span>
        );
      },
    },
    {
      key: 'ip',
      header: 'IP',
      render: (log) => (
        <span className='font-mono text-paragraph-sm text-text-sub-600'>
          {log.ip}
        </span>
      ),
    },
  ];

  return (
    <div className='flex flex-col'>
      <AdminHeader
        title='Логи действий'
        description={`Всего: ${logs.length} записей`}
      />

      <div className='flex flex-col gap-4 p-6'>
        {/* Filters */}
        <div className='flex flex-wrap items-center gap-3'>
          <Select.Root
            value={actionFilter}
            onValueChange={setActionFilter}
            size='small'
          >
            <Select.Trigger className='w-[200px]'>
              <Select.Value placeholder='Все действия' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>Все действия</Select.Item>
              {uniqueActions.map((action) => (
                <Select.Item key={action} value={action}>
                  {actionLabels[action as LogAction] || action}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          <Select.Root
            value={userFilter}
            onValueChange={setUserFilter}
            size='small'
          >
            <Select.Trigger className='w-[200px]'>
              <Select.Value placeholder='Все пользователи' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>Все пользователи</Select.Item>
              {users.map((user) => (
                <Select.Item key={user.id} value={user.id}>
                  {user.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

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

        {/* Data table */}
        <DataTable
          data={paginatedLogs}
          columns={columns}
          keyField='id'
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder='Поиск по тексту...'
          emptyMessage='Записи не найдены'
        />
      </div>
    </div>
  );
}
