'use client';

import AdminHeader from '../components/AdminHeader';
import { NotificationsList } from '@/components/notifications-list';
import { notificationStats } from '@/lib/notifications';

export default function AdminNotificationsPage() {
  return (
    <div className='flex flex-col'>
      <AdminHeader
        title='Уведомления'
        description='Задачи и факты по проверкам, аукционам и выплатам'
      />

      <div className='flex flex-col gap-6 p-6'>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <div className='text-label-lg text-text-strong-950'>
              {notificationStats.total}
            </div>
            <div className='text-paragraph-xs text-text-sub-600'>Всего</div>
          </div>
          <div className='rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <div className='text-label-lg text-text-strong-950'>
              {notificationStats.userVerification}
            </div>
            <div className='text-paragraph-xs text-text-sub-600'>
              Верификации
            </div>
          </div>
          <div className='rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <div className='text-label-lg text-text-strong-950'>
              {notificationStats.auctions}
            </div>
            <div className='text-paragraph-xs text-text-sub-600'>Аукционы</div>
          </div>
          <div className='rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <div className='text-label-lg text-text-strong-950'>
              {notificationStats.payouts}
            </div>
            <div className='text-paragraph-xs text-text-sub-600'>Выплаты</div>
          </div>
        </div>

        <div className='rounded-2xl bg-bg-white-0 p-2 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <NotificationsList />
        </div>
      </div>
    </div>
  );
}
