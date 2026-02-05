'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiCheckLine,
  RiRefreshLine,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import {
  AdminHeader,
  StatCard,
  DataTable,
  PayoutStatusBadge,
  ConfirmModal,
  type Column,
} from '../components';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Select from '@/components/ui/select';

import { payouts, getPayoutStats } from '../mocks/payouts';
import { getDealById } from '../mocks/deals';
import { getUserById } from '../mocks/users';
import type { Payout } from '../types/admin.types';
import { formatDate, formatDateTime, formatCurrency } from '../utils/formatters';

type EnrichedPayout = Payout & {
  brokerName: string;
  dealAmount: number;
};

export default function PayoutsPage() {
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState(1);

  // Modal state
  const [selectedPayout, setSelectedPayout] = React.useState<Payout | null>(null);
  const [modalAction, setModalAction] = React.useState<'processing' | 'paid' | null>(
    null,
  );

  const pageSize = 20;
  const stats = getPayoutStats();

  // Enrich payouts with broker and deal data
  const enrichedPayouts = React.useMemo(() => {
    return payouts.map((payout) => {
      const broker = getUserById(payout.brokerId);
      const deal = getDealById(payout.dealId);
      return {
        ...payout,
        brokerName: broker?.name || 'Неизвестный',
        dealAmount: deal?.amount || 0,
      };
    });
  }, []);

  // Filter
  const filteredPayouts = React.useMemo(() => {
    let result = [...enrichedPayouts];

    if (statusFilter !== 'all') {
      result = result.filter((payout) => payout.status === statusFilter);
    }

    // Sort by createdAt descending
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return result;
  }, [enrichedPayouts, statusFilter]);

  const totalPages = Math.ceil(filteredPayouts.length / pageSize);
  const paginatedPayouts = filteredPayouts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleAction = (payout: Payout, action: 'processing' | 'paid') => {
    setSelectedPayout(payout);
    setModalAction(action);
  };

  const handleConfirmAction = () => {
    console.log(`Action: ${modalAction} for payout: ${selectedPayout?.id}`);
    setSelectedPayout(null);
    setModalAction(null);
  };

  const columns: Column<EnrichedPayout>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '100px',
      render: (payout) => (
        <span className='font-mono text-paragraph-sm text-text-sub-600'>
          {payout.id}
        </span>
      ),
    },
    {
      key: 'dealId',
      header: 'Сделка',
      render: (payout) => (
        <Link
          href={`/admin/deals/${payout.dealId}`}
          className='text-primary-base hover:underline'
        >
          {payout.dealId}
        </Link>
      ),
    },
    {
      key: 'brokerName',
      header: 'Брокер',
      render: (payout) => (
        <Link
          href={`/admin/users/${payout.brokerId}`}
          className='text-text-strong-950 hover:text-primary-base'
        >
          {payout.brokerName}
        </Link>
      ),
    },
    {
      key: 'amount',
      header: 'Сумма',
      render: (payout) => (
        <span className='font-medium'>{formatCurrency(payout.amount)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Статус',
      render: (payout) => <PayoutStatusBadge status={payout.status} />,
    },
    {
      key: 'createdAt',
      header: 'Дата создания',
      render: (payout) => (
        <span className='text-text-sub-600'>{formatDate(payout.createdAt)}</span>
      ),
    },
    {
      key: 'paidAt',
      header: 'Дата выплаты',
      render: (payout) =>
        payout.paidAt ? (
          <span className='text-text-sub-600'>{formatDate(payout.paidAt)}</span>
        ) : (
          <span className='text-text-soft-400'>—</span>
        ),
    },
    {
      key: 'actions',
      header: 'Действия',
      width: '140px',
      render: (payout) => (
        <div className='flex items-center gap-1'>
          {payout.status === 'pending' && (
            <FancyButton.Root
              variant='primary'
              size='xxsmall'
              onClick={(e) => {
                e.stopPropagation();
                handleAction(payout, 'processing');
              }}
            >
              <FancyButton.Icon as={RiRefreshLine} />
              В обработку
            </FancyButton.Root>
          )}
          {payout.status === 'processing' && (
            <FancyButton.Root
              variant='primary'
              size='xxsmall'
              onClick={(e) => {
                e.stopPropagation();
                handleAction(payout, 'paid');
              }}
            >
              <FancyButton.Icon as={RiCheckLine} />
              Выплачено
            </FancyButton.Root>
          )}
        </div>
      ),
    },
  ];

  const modalConfig = {
    processing: {
      title: 'Перевести в обработку?',
      description: `Выплата ${selectedPayout?.id} на сумму ${selectedPayout ? formatCurrency(selectedPayout.amount) : ''} будет переведена в статус "В обработке".`,
      confirmLabel: 'В обработку',
      variant: 'warning' as const,
    },
    paid: {
      title: 'Отметить как выплаченную?',
      description: `Подтвердить выплату ${selectedPayout?.id} на сумму ${selectedPayout ? formatCurrency(selectedPayout.amount) : ''}?`,
      confirmLabel: 'Подтвердить выплату',
      variant: 'success' as const,
    },
  };

  return (
    <div className='flex flex-col'>
      <AdminHeader
        title='Выплаты'
        description={`Всего: ${payouts.length} выплат`}
      />

      <div className='flex flex-col gap-6 p-6'>
        {/* Stats */}
        <div className='grid gap-4 sm:grid-cols-3'>
          <StatCard
            title='Ожидает выплаты'
            value={formatCurrency(stats.pending.amount)}
            icon={RiTimeLine}
            iconColor='text-warning-base'
            subtitle={`${stats.pending.count} выплат`}
          />
          <StatCard
            title='В обработке'
            value={formatCurrency(stats.processing.amount)}
            icon={RiRefreshLine}
            iconColor='text-information-base'
            subtitle={`${stats.processing.count} выплат`}
          />
          <StatCard
            title='Выплачено за месяц'
            value={formatCurrency(stats.paidThisMonth.amount)}
            icon={RiCheckLine}
            iconColor='text-success-base'
            subtitle={`${stats.paidThisMonth.count} выплат`}
          />
        </div>

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
              <Select.Item value='pending'>Ожидает</Select.Item>
              <Select.Item value='processing'>В обработке</Select.Item>
              <Select.Item value='paid'>Выплачено</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Data table */}
        <DataTable
          data={paginatedPayouts}
          columns={columns}
          keyField='id'
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          emptyMessage='Выплаты не найдены'
        />
      </div>

      {/* Confirm modal */}
      {modalAction && selectedPayout && (
        <ConfirmModal
          open={!!modalAction}
          onOpenChange={() => {
            setModalAction(null);
            setSelectedPayout(null);
          }}
          title={modalConfig[modalAction].title}
          description={modalConfig[modalAction].description}
          confirmLabel={modalConfig[modalAction].confirmLabel}
          variant={modalConfig[modalAction].variant}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
}
