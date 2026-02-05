'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  RiArrowLeftLine,
  RiMailLine,
  RiPhoneLine,
  RiCalendarLine,
  RiLockLine,
  RiLockUnlockLine,
  RiCheckLine,
  RiAuctionLine,
  RiHandCoinLine,
  RiBuildingLine,
  RiTrophyLine,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import {
  AdminHeader,
  StatCard,
  UserStatusBadge,
  UserRoleBadge,
  DataTable,
  ConfirmModal,
  type Column,
} from '../../components';
import * as Button from '@/components/ui/button';
import * as Avatar from '@/components/ui/avatar';
import * as Divider from '@/components/ui/divider';

import { getUserById, users } from '../../mocks/users';
import { getBidsByBroker, bids } from '../../mocks/bids';
import { getPropertiesByDeveloper, properties } from '../../mocks/properties';
import { getLogsByUser, logs } from '../../mocks/logs';
import type { User, Bid, Property, Log } from '../../types/admin.types';
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatArea,
  getInitials,
  formatRelativeTime,
} from '../../utils/formatters';
import { BidStatusBadge, PropertyStatusBadge } from '../../components/StatusBadge';

// Action type labels
const actionLabels: Record<string, string> = {
  'user.login': 'Вход в систему',
  'user.register': 'Регистрация',
  'user.update': 'Обновление профиля',
  'bid.create': 'Новая ставка',
  'property.create': 'Создание объекта',
  'property.update': 'Обновление объекта',
  'auction.create': 'Создание аукциона',
  'deal.create': 'Создание сделки',
  'deal.update': 'Обновление сделки',
};

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [modalAction, setModalAction] = React.useState<
    'block' | 'unblock' | 'verify' | null
  >(null);

  const user = getUserById(userId);
  const userBids = user?.role === 'broker' ? getBidsByBroker(userId) : [];
  const userProperties =
    user?.role === 'developer' ? getPropertiesByDeveloper(userId) : [];
  const userLogs = getLogsByUser(userId).slice(0, 20);

  if (!user) {
    return (
      <div className='flex flex-col'>
        <AdminHeader title='Пользователь не найден' />
        <div className='p-6'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={() => router.back()}
          >
            <Button.Icon as={RiArrowLeftLine} />
            Назад
          </Button.Root>
        </div>
      </div>
    );
  }

  const handleConfirmAction = () => {
    console.log(`Action: ${modalAction} for user: ${user.id}`);
    setModalAction(null);
  };

  const bidColumns: Column<Bid>[] = [
    {
      key: 'auctionId',
      header: 'Аукцион',
      render: (bid) => (
        <Link
          href={`/admin/auctions/${bid.auctionId}`}
          className='text-primary-base hover:underline'
        >
          {bid.auctionId}
        </Link>
      ),
    },
    {
      key: 'amount',
      header: 'Сумма',
      render: (bid) => (
        <span className='font-medium'>{formatCurrency(bid.amount)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Статус',
      render: (bid) => <BidStatusBadge status={bid.status} />,
    },
    {
      key: 'createdAt',
      header: 'Дата',
      render: (bid) => (
        <span className='text-text-sub-600'>{formatDateTime(bid.createdAt)}</span>
      ),
    },
  ];

  const propertyColumns: Column<Property>[] = [
    {
      key: 'title',
      header: 'Объект',
      render: (property) => (
        <div>
          <div className='text-label-sm text-text-strong-950'>
            {property.title}
          </div>
          <div className='text-paragraph-xs text-text-sub-600'>
            {property.address}
          </div>
        </div>
      ),
    },
    {
      key: 'area',
      header: 'Площадь',
      render: (property) => formatArea(property.area),
    },
    {
      key: 'status',
      header: 'Статус',
      render: (property) => <PropertyStatusBadge status={property.status} />,
    },
    {
      key: 'createdAt',
      header: 'Создан',
      render: (property) => formatDate(property.createdAt),
    },
  ];

  const modalConfig = {
    block: {
      title: 'Заблокировать пользователя?',
      description: `Пользователь "${user.name}" будет заблокирован и не сможет пользоваться платформой.`,
      confirmLabel: 'Заблокировать',
      variant: 'danger' as const,
    },
    unblock: {
      title: 'Разблокировать пользователя?',
      description: `Пользователь "${user.name}" снова получит доступ к платформе.`,
      confirmLabel: 'Разблокировать',
      variant: 'success' as const,
    },
    verify: {
      title: 'Подтвердить верификацию?',
      description: `Подтвердить верификацию пользователя "${user.name}"?`,
      confirmLabel: 'Подтвердить',
      variant: 'success' as const,
    },
  };

  return (
    <div className='flex flex-col'>
      <AdminHeader title='Детали пользователя'>
        <div className='flex items-center gap-3'>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='small'
            onClick={() => router.back()}
          >
            <Button.Icon as={RiArrowLeftLine} />
            Назад
          </Button.Root>

          {user.status === 'pending_verification' && (
            <Button.Root
              variant='primary'
              mode='filled'
              size='small'
              onClick={() => setModalAction('verify')}
            >
              <Button.Icon as={RiCheckLine} />
              Подтвердить верификацию
            </Button.Root>
          )}

          {user.status === 'active' && (
            <Button.Root
              variant='error'
              mode='stroke'
              size='small'
              onClick={() => setModalAction('block')}
            >
              <Button.Icon as={RiLockLine} />
              Заблокировать
            </Button.Root>
          )}

          {user.status === 'suspended' && (
            <Button.Root
              variant='primary'
              mode='filled'
              size='small'
              onClick={() => setModalAction('unblock')}
            >
              <Button.Icon as={RiLockUnlockLine} />
              Разблокировать
            </Button.Root>
          )}
        </div>
      </AdminHeader>

      <div className='flex flex-col gap-6 p-6'>
        {/* User info card */}
        <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-start'>
            {/* Avatar and basic info */}
            <div className='flex items-start gap-4'>
              <Avatar.Root size='80' className='shrink-0'>
                {user.avatar ? (
                  <Avatar.Image src={user.avatar} alt={user.name} />
                ) : (
                  <span className='flex size-full items-center justify-center bg-primary-alpha-10 text-title-h4 text-primary-base'>
                    {getInitials(user.name)}
                  </span>
                )}
              </Avatar.Root>

              <div className='flex flex-col gap-2'>
                <div>
                  <h2 className='text-title-h5 text-text-strong-950'>
                    {user.name}
                  </h2>
                  <div className='mt-1 flex flex-wrap items-center gap-2'>
                    <UserRoleBadge role={user.role} />
                    <UserStatusBadge status={user.status} />
                  </div>
                </div>

                <div className='flex flex-col gap-1.5 text-paragraph-sm text-text-sub-600'>
                  <div className='flex items-center gap-2'>
                    <RiMailLine className='size-4' />
                    <span>{user.email}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <RiPhoneLine className='size-4' />
                    <span>{user.phone}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <RiCalendarLine className='size-4' />
                    <span>Зарегистрирован: {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className='flex flex-1 flex-wrap gap-4 lg:justify-end'>
              {user.role === 'broker' && (
                <>
                  <StatCard
                    title='Ставок'
                    value={user.stats.bids || 0}
                    icon={RiAuctionLine}
                    iconColor='text-feature-base'
                    className='min-w-[140px] flex-1 lg:max-w-[180px]'
                  />
                  <StatCard
                    title='Побед'
                    value={user.stats.wins || 0}
                    icon={RiTrophyLine}
                    iconColor='text-success-base'
                    className='min-w-[140px] flex-1 lg:max-w-[180px]'
                  />
                  <StatCard
                    title='Активных сделок'
                    value={user.stats.activeDeals || 0}
                    icon={RiHandCoinLine}
                    iconColor='text-information-base'
                    className='min-w-[140px] flex-1 lg:max-w-[180px]'
                  />
                </>
              )}

              {user.role === 'developer' && (
                <>
                  <StatCard
                    title='Объектов'
                    value={user.stats.properties || 0}
                    icon={RiBuildingLine}
                    iconColor='text-feature-base'
                    className='min-w-[140px] flex-1 lg:max-w-[180px]'
                  />
                  <StatCard
                    title='Аукционов'
                    value={user.stats.auctions || 0}
                    icon={RiAuctionLine}
                    iconColor='text-warning-base'
                    className='min-w-[140px] flex-1 lg:max-w-[180px]'
                  />
                  <StatCard
                    title='Сделок'
                    value={user.stats.completedDeals || 0}
                    icon={RiHandCoinLine}
                    iconColor='text-success-base'
                    className='min-w-[140px] flex-1 lg:max-w-[180px]'
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Broker: Bids table */}
        {user.role === 'broker' && userBids.length > 0 && (
          <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <h3 className='mb-4 text-label-md text-text-strong-950'>
              Последние ставки
            </h3>
            <DataTable
              data={userBids.slice(0, 10)}
              columns={bidColumns}
              keyField='id'
              emptyMessage='Нет ставок'
            />
          </div>
        )}

        {/* Developer: Properties table */}
        {user.role === 'developer' && userProperties.length > 0 && (
          <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <h3 className='mb-4 text-label-md text-text-strong-950'>
              Объекты недвижимости
            </h3>
            <DataTable
              data={userProperties}
              columns={propertyColumns}
              keyField='id'
              emptyMessage='Нет объектов'
            />
          </div>
        )}

        {/* User logs */}
        <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <h3 className='mb-4 text-label-md text-text-strong-950'>
            История действий
          </h3>
          <div className='flex flex-col gap-3'>
            {userLogs.length === 0 ? (
              <p className='text-paragraph-sm text-text-sub-600'>
                Нет записей в логах
              </p>
            ) : (
              userLogs.map((log) => (
                <div
                  key={log.id}
                  className='flex items-center justify-between gap-4 rounded-lg border border-stroke-soft-200 p-3'
                >
                  <div className='flex flex-col'>
                    <span className='text-label-sm text-text-strong-950'>
                      {actionLabels[log.action] || log.action}
                    </span>
                    <span className='text-paragraph-xs text-text-sub-600'>
                      IP: {log.ip}
                    </span>
                  </div>
                  <span className='text-paragraph-xs text-text-soft-400'>
                    {formatRelativeTime(log.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {modalAction && (
        <ConfirmModal
          open={!!modalAction}
          onOpenChange={() => setModalAction(null)}
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
