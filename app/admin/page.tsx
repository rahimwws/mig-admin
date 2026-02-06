'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  RiArrowRightUpLine,
  RiUserLine,
  RiMoneyDollarCircleLine,
  RiFileList3Line,
  RiAuctionLine,
  RiMoreLine,
  RiUploadLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from '@remixicon/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import { cn } from '@/utils/cn';
import { AdminHeader, FinancialStatCard } from './components';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Table from '@/components/ui/table';
import * as Badge from '@/components/ui/badge';
import * as CompactButton from '@/components/ui/compact-button';
import * as Select from '@/components/ui/select';

import { getStats } from './mocks/stats';
import { users, getUserById } from './mocks/users';
import { payouts } from './mocks/payouts';
import { deals } from './mocks/deals';
import { auctions } from './mocks/auctions';
import { formatCurrency, formatRelativeTime } from './utils/formatters';

// Financial overview cards (Income, Expenses, Savings, Investment)
const financialStats = [
  {
    title: 'Доходы',
    value: '$101,800',
    changePercent: 7.8,
    changeVariant: 'positive' as const,
    segments: [
      { color: 'hsl(var(--teal-700))', label: 'Доходы', share: 0.35 },
      { color: 'hsl(var(--teal-500))', label: 'Депозиты', share: 0.3 },
      { color: 'hsl(var(--teal-300))', label: 'Инвестиции', share: 0.25 },
      { color: 'hsl(var(--gray-300))', label: 'Прочее', share: 0.1 },
    ],
  },
  {
    title: 'Расходы',
    value: '$9,000',
    changePercent: 8.8,
    changeVariant: 'warning' as const,
    segments: [
      { color: 'hsl(var(--orange-400))', label: 'Покупки', share: 0.3 },
      { color: 'hsl(var(--orange-500))', label: 'Еда', share: 0.28 },
      { color: 'hsl(var(--orange-600))', label: 'Транспорт', share: 0.27 },
      { color: 'hsl(var(--gray-300))', label: 'Прочее', share: 0.15 },
    ],
  },
  {
    title: 'Накопления',
    value: '$1,832',
    changePercent: -7.8,
    segments: [
      { color: 'hsl(var(--purple-300))', label: 'Аренда', share: 0.4 },
      { color: 'hsl(var(--purple-500))', label: 'Рабочее место', share: 0.3 },
      { color: 'hsl(var(--purple-600))', label: 'День рождения', share: 0.2 },
      { color: 'hsl(var(--gray-300))', label: 'Прочее', share: 0.1 },
    ],
  },
  {
    title: 'Инвестиции',
    value: '$300,829',
    changePercent: 7.8,
    changeVariant: 'positive' as const,
    segments: [
      { color: 'hsl(var(--blue-300))', label: 'Акции', share: 0.4 },
      { color: 'hsl(var(--blue-500))', label: 'Крипто', share: 0.35 },
      { color: 'hsl(var(--blue-600))', label: 'Облигации', share: 0.2 },
      { color: 'hsl(var(--gray-200))', label: 'Прочее', share: 0.05 },
    ],
  },
];

type ActionType = 'user_verification' | 'payout' | 'deal' | 'auction';

type UrgentAction = {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  amount?: number;
  status: string;
  date: string;
  href: string;
  priority: 'urgent' | 'high' | 'normal';
};

function getUrgentActions(): UrgentAction[] {
  const actions: UrgentAction[] = [];

  // Users pending verification
  users
    .filter((u) => u.status === 'pending_verification')
    .forEach((user) => {
      actions.push({
        id: user.id,
        type: 'user_verification',
        title: user.name,
        description: 'Верификация пользователя',
        status: 'pending_verification',
        date: user.createdAt,
        href: `/admin/users/${user.id}`,
        priority: 'urgent',
      });
    });

  // Pending payouts
  payouts
    .filter((p) => p.status === 'pending')
    .forEach((payout) => {
      const broker = getUserById(payout.brokerId);
      actions.push({
        id: payout.id,
        type: 'payout',
        title: `Выплата ${payout.id.toUpperCase()}`,
        description: broker?.name || 'Неизвестный брокер',
        amount: payout.amount,
        status: 'pending',
        date: payout.createdAt,
        href: '/admin/payouts',
        priority: 'high',
      });
    });

  // Processing payouts
  payouts
    .filter((p) => p.status === 'processing')
    .forEach((payout) => {
      const broker = getUserById(payout.brokerId);
      actions.push({
        id: payout.id,
        type: 'payout',
        title: `Выплата ${payout.id.toUpperCase()}`,
        description: broker?.name || 'Неизвестный брокер',
        amount: payout.amount,
        status: 'processing',
        date: payout.createdAt,
        href: '/admin/payouts',
        priority: 'normal',
      });
    });

  // Deals needing attention (obligation_sent)
  deals
    .filter((d) => d.status === 'obligation_sent')
    .forEach((deal) => {
      const broker = getUserById(deal.brokerId);
      actions.push({
        id: deal.id,
        type: 'deal',
        title: `Сделка ${deal.id.toUpperCase()}`,
        description: broker?.name || 'Проверить обязательство',
        amount: deal.amount,
        status: 'obligation_sent',
        date: deal.createdAt,
        href: `/admin/deals/${deal.id}`,
        priority: 'high',
      });
    });

  // Auctions selecting winner
  auctions
    .filter((a) => a.status === 'selecting_winner')
    .forEach((auction) => {
      actions.push({
        id: auction.id,
        type: 'auction',
        title: `Аукцион ${auction.id.toUpperCase()}`,
        description: 'Выбор победителя',
        amount: auction.currentMaxBid || auction.minPrice,
        status: 'selecting_winner',
        date: auction.endDate,
        href: `/admin/auctions/${auction.id}`,
        priority: 'urgent',
      });
    });

  // Sort by priority
  const priorityOrder = { urgent: 0, high: 1, normal: 2 };
  return actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

function ActionIcon({ type }: { type: UrgentAction['type'] }) {
  const icons = {
    user_verification: RiUserLine,
    payout: RiMoneyDollarCircleLine,
    deal: RiFileList3Line,
    auction: RiAuctionLine,
  };
  const colors = {
    user_verification: 'bg-purple-100 text-purple-600',
    payout: 'bg-green-100 text-green-600',
    deal: 'bg-blue-100 text-blue-600',
    auction: 'bg-orange-100 text-orange-600',
  };
  const Icon = icons[type];
  return (
    <div className={cn('flex size-10 items-center justify-center rounded-full', colors[type])}>
      <Icon className='size-5' />
    </div>
  );
}

function PriorityBadge({ priority }: { priority: UrgentAction['priority'] }) {
  const config = {
    urgent: { label: 'Срочно', color: 'red' as const },
    high: { label: 'Важно', color: 'orange' as const },
    normal: { label: 'Обычный', color: 'gray' as const },
  };
  return (
    <Badge.Root variant='light' color={config[priority].color} size='small'>
      {config[priority].label}
    </Badge.Root>
  );
}

const ITEMS_PER_PAGE = 5;

const filterOptions = [
  { value: 'all', label: 'Все категории' },
  { value: 'user_verification', label: 'Верификация' },
  { value: 'payout', label: 'Выплаты' },
  { value: 'deal', label: 'Сделки' },
  { value: 'auction', label: 'Аукционы' },
];

export default function AdminDashboard() {
  const dashboardStats = getStats();
  const allActions = getUrgentActions();

  // Filter state
  const [filter, setFilter] = React.useState<string>('all');
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);

  // Filter actions
  const filteredActions = React.useMemo(() => {
    if (filter === 'all') return allActions;
    return allActions.filter((action) => action.type === filter);
  }, [allActions, filter]);

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Pagination
  const totalPages = Math.ceil(filteredActions.length / ITEMS_PER_PAGE);
  const paginatedActions = filteredActions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className='flex flex-col'>
      <AdminHeader
        title='Дашборд'
        description='Обзор платформы MIG Tender'
      />

      <div className='flex flex-col gap-6 p-6'>

        {/* Financial overview cards */}
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {financialStats.map((card) => (
            <FinancialStatCard
              key={card.title}
              title={card.title}
              value={card.value}
              changePercent={card.changePercent}
              changeVariant={card.changeVariant}
              segments={card.segments}
            />
          ))}
        </div>

        {/* Charts */}
        <div className='grid gap-6 lg:grid-cols-2'>
          {/* Line chart - Auctions by day */}
          <div className='rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <div className='mb-4 flex items-center justify-between'>
              <div>
                <div className='text-label-md text-text-strong-950'>
                  Аукционы по дням
                </div>
                <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                  Последние 30 дней
                </div>
              </div>
              <Link href='/admin/auctions'>
                <FancyButton.Root variant='basic' size='xxsmall'>
                  Все аукционы
                  <FancyButton.Icon as={RiArrowRightUpLine} />
                </FancyButton.Root>
              </Link>
            </div>
            <ResponsiveContainer width='100%' height={200}>
              <LineChart
                data={dashboardStats.charts.auctionsByDay}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray='4 4'
                  className='stroke-stroke-soft-200'
                />
                <XAxis
                  dataKey='date'
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}.${date.getMonth() + 1}`;
                  }}
                  className='text-paragraph-xs text-text-soft-400'
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  className='text-paragraph-xs text-text-soft-400'
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--bg-white-0))',
                    border: '1px solid hsl(var(--stroke-soft-200))',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-regular-sm)',
                  }}
                  labelFormatter={(value) => `Дата: ${value}`}
                />
                <Line
                  type='monotone'
                  dataKey='count'
                  stroke='hsl(var(--primary-base))'
                  strokeWidth={2}
                  dot={false}
                  name='Аукционы'
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart - Deals by week */}
          <div className='rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <div className='mb-4 flex items-center justify-between'>
              <div>
                <div className='text-label-md text-text-strong-950'>
                  Сделки по неделям
                </div>
                <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                  Январь - Февраль 2026
                </div>
              </div>
              <Link href='/admin/deals'>
                <FancyButton.Root variant='basic' size='xxsmall'>
                  Все сделки
                  <FancyButton.Icon as={RiArrowRightUpLine} />
                </FancyButton.Root>
              </Link>
            </div>
            <ResponsiveContainer width='100%' height={200}>
              <BarChart
                data={dashboardStats.charts.dealsByWeek}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray='4 4'
                  className='stroke-stroke-soft-200'
                  vertical={false}
                />
                <XAxis
                  dataKey='week'
                  className='text-paragraph-xs text-text-soft-400'
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  className='text-paragraph-xs text-text-soft-400'
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--bg-white-0))',
                    border: '1px solid hsl(var(--stroke-soft-200))',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-regular-sm)',
                  }}
                />
                <Bar
                  dataKey='count'
                  fill='hsl(var(--success-base))'
                  radius={[4, 4, 0, 0]}
                  name='Сделки'
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Urgent Actions Table */}
        <div className='rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='text-label-md text-text-strong-950'>
              Срочные действия
            </div>
            <div className='flex items-center gap-2'>
              <FancyButton.Root variant='neutral' size='xxsmall'>
                <FancyButton.Icon as={RiUploadLine} />
                Экспорт
              </FancyButton.Root>
              <Select.Root value={filter} onValueChange={setFilter} size='small'>
                <Select.Trigger className='w-[160px]'>
                  <Select.Value placeholder='Фильтр' />
                </Select.Trigger>
                <Select.Content>
                  {filterOptions.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </div>

          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head className='w-12'></Table.Head>
                <Table.Head>Название</Table.Head>
                <Table.Head>Категория</Table.Head>
                <Table.Head>Сумма</Table.Head>
                <Table.Head>Дата</Table.Head>
                <Table.Head>Статус</Table.Head>
                <Table.Head className='w-12'></Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedActions.map((action) => (
                <Table.Row key={`${action.type}-${action.id}`}>
                  <Table.Cell>
                    <ActionIcon type={action.type} />
                  </Table.Cell>
                  <Table.Cell>
                    <Link href={action.href} className='block'>
                      <div className='text-label-sm text-text-strong-950 hover:text-primary-base'>
                        {action.title}
                      </div>
                      <div className='text-paragraph-xs text-text-sub-600'>
                        {action.description}
                      </div>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <span className='text-paragraph-sm text-text-sub-600'>
                      {action.type === 'user_verification' && 'Верификация'}
                      {action.type === 'payout' && 'Выплата'}
                      {action.type === 'deal' && 'Сделка'}
                      {action.type === 'auction' && 'Аукцион'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {action.amount ? (
                      <span className='font-medium text-text-strong-950'>
                        {formatCurrency(action.amount)}
                      </span>
                    ) : (
                      <span className='text-text-soft-400'>—</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span className='text-paragraph-sm text-text-sub-600'>
                      {formatRelativeTime(action.date)}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <PriorityBadge priority={action.priority} />
                  </Table.Cell>
                  <Table.Cell>
                    <CompactButton.Root variant='ghost' size='medium' asChild>
                      <Link href={action.href}>
                        <CompactButton.Icon as={RiMoreLine} />
                      </Link>
                    </CompactButton.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
              {paginatedActions.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={7} className='py-8 text-center'>
                    <span className='text-text-sub-600'>Нет срочных действий</span>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>

          {/* Pagination */}
          <div className='mt-4 flex items-center justify-between border-t border-stroke-soft-200 pt-4'>
            <div className='text-paragraph-sm text-text-sub-600'>
              Показано {paginatedActions.length} из {filteredActions.length} записей
            </div>
            <div className='flex items-center gap-1'>
              <CompactButton.Root
                variant='ghost'
                size='medium'
                disabled={currentPage === 1}
                onClick={handlePrevPage}
              >
                <CompactButton.Icon as={RiArrowLeftSLine} />
              </CompactButton.Root>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <CompactButton.Root
                  key={page}
                  variant={currentPage === page ? 'white' : 'ghost'}
                  size='medium'
                  className='min-w-9'
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </CompactButton.Root>
              ))}
              <CompactButton.Root
                variant='ghost'
                size='medium'
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={handleNextPage}
              >
                <CompactButton.Icon as={RiArrowRightSLine} />
              </CompactButton.Root>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
