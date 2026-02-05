'use client';

import { RiNotification3Line } from '@remixicon/react';

import Header from '@/components/header';
import { NotificationsList } from '@/components/notifications-list';
import { notificationStats } from '@/lib/notifications';

export default function PageNotifications() {
  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiNotification3Line className='size-6 text-text-sub-600' />
          </div>
        }
        title='Notifications'
        description='Все уведомления по фактам и задачам'
        contentClassName='hidden lg:flex'
      />

      <div className='flex flex-1 flex-col gap-5 px-4 pb-6 lg:px-8'>
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
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
    </>
  );
}
