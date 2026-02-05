'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  RiGroupLine,
  RiAuctionLine,
  RiHandCoinLine,
  RiBuildingLine,
  RiArrowRightUpLine,
  RiTimeLine,
  RiUserLine,
  RiFileList3Line,
} from '@remixicon/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { cn } from '@/utils/cn';
import { AdminHeader, StatCard, LargeStatCard } from './components';
import * as Button from '@/components/ui/button';
import * as Table from '@/components/ui/table';

import { stats, getStats } from './mocks/stats';
import { getRecentLogs, logs } from './mocks/logs';
import { users, getUserById } from './mocks/users';
import { formatCurrency, formatDateTime, formatRelativeTime } from './utils/formatters';

const CHART_COLORS = [
  'hsl(var(--primary-base))',
  'hsl(var(--feature-base))',
  'hsl(var(--success-base))',
  'hsl(var(--warning-base))',
];

// Action type labels in Russian
const actionLabels: Record<string, string> = {
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

export default function AdminDashboard() {
  const dashboardStats = getStats();
  const recentLogs = getRecentLogs(10);

  return (
    <div className='flex flex-col'>
      <AdminHeader
        title='Дашборд'
        description='Обзор платформы MIG Tender'
      />

      <div className='flex flex-col gap-6 p-6'>
        {/* Stats cards */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            title='Всего пользователей'
            value={dashboardStats.totalUsers}
            icon={RiGroupLine}
            iconColor='text-primary-base'
            subtitle={`${dashboardStats.brokers} брокеров / ${dashboardStats.developers} девелоперов`}
          />
          <StatCard
            title='Активных аукционов'
            value={dashboardStats.activeAuctions}
            icon={RiAuctionLine}
            iconColor='text-feature-base'
            change={{ value: 12, period: 'за неделю' }}
          />
          <StatCard
            title='Завершённых сделок'
            value={dashboardStats.completedDeals.month}
            icon={RiHandCoinLine}
            iconColor='text-success-base'
            subtitle={`${dashboardStats.completedDeals.week} за неделю`}
          />
          <StatCard
            title='Сумма выплат'
            value={formatCurrency(dashboardStats.totalPayouts.month)}
            icon={RiBuildingLine}
            iconColor='text-warning-base'
            subtitle={`${formatCurrency(dashboardStats.totalPayouts.week)} за неделю`}
          />
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
                <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
                  Все аукционы
                  <Button.Icon as={RiArrowRightUpLine} />
                </Button.Root>
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
                <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
                  Все сделки
                  <Button.Icon as={RiArrowRightUpLine} />
                </Button.Root>
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

          {/* Pie chart - Users by role */}
          <div className='rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <div className='mb-4'>
              <div className='text-label-md text-text-strong-950'>
                Пользователи по ролям
              </div>
              <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                Распределение
              </div>
            </div>
            <div className='flex items-center gap-6'>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={dashboardStats.charts.usersByRole}
                    cx='50%'
                    cy='50%'
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey='count'
                    nameKey='role'
                  >
                    {dashboardStats.charts.usersByRole.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className='flex flex-col gap-3'>
                {dashboardStats.charts.usersByRole.map((item, index) => (
                  <div key={item.role} className='flex items-center gap-2'>
                    <div
                      className='size-3 rounded-full'
                      style={{
                        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                      }}
                    />
                    <span className='text-label-sm text-text-strong-950'>
                      {item.role}
                    </span>
                    <span className='text-paragraph-sm text-text-sub-600'>
                      ({item.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent activities */}
          <div className='rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <div className='mb-4 flex items-center justify-between'>
              <div>
                <div className='text-label-md text-text-strong-950'>
                  Последние события
                </div>
                <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                  10 последних действий
                </div>
              </div>
              <Link href='/admin/logs'>
                <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
                  Все логи
                  <Button.Icon as={RiArrowRightUpLine} />
                </Button.Root>
              </Link>
            </div>
            <div className='flex max-h-[260px] flex-col gap-3 overflow-y-auto'>
              {recentLogs.map((log) => {
                const user = getUserById(log.userId);
                return (
                  <div
                    key={log.id}
                    className='flex items-start gap-3 rounded-lg p-2 transition hover:bg-bg-weak-50'
                  >
                    <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-weak-50'>
                      {log.action.startsWith('user') && (
                        <RiUserLine className='size-4 text-text-sub-600' />
                      )}
                      {log.action.startsWith('auction') && (
                        <RiAuctionLine className='size-4 text-feature-base' />
                      )}
                      {log.action.startsWith('bid') && (
                        <RiHandCoinLine className='size-4 text-success-base' />
                      )}
                      {log.action.startsWith('deal') && (
                        <RiFileList3Line className='size-4 text-information-base' />
                      )}
                      {log.action.startsWith('property') && (
                        <RiBuildingLine className='size-4 text-warning-base' />
                      )}
                      {log.action.startsWith('payout') && (
                        <RiBuildingLine className='size-4 text-teal-500' />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between gap-2'>
                        <span className='text-label-sm text-text-strong-950 truncate'>
                          {actionLabels[log.action] || log.action}
                        </span>
                        <span className='text-paragraph-xs text-text-soft-400 whitespace-nowrap'>
                          {formatRelativeTime(log.createdAt)}
                        </span>
                      </div>
                      <div className='mt-0.5 text-paragraph-xs text-text-sub-600 truncate'>
                        {user?.name || 'Неизвестный пользователь'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
