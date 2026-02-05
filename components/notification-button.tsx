'use client';

import Link from 'next/link';
import { RiNotification3Line, RiSettings2Line } from '@remixicon/react';

import * as LinkButton from '@/components/ui/link-button';
import * as Popover from '@/components/ui/popover';
import * as TopbarItemButton from '@/components/topbar-item-button';
import { NotificationsList } from '@/components/notifications-list';
import { notificationStats } from '@/lib/notifications';

export default function NotificationButton({
  ...rest
}: React.ComponentPropsWithoutRef<typeof TopbarItemButton.Root>) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <TopbarItemButton.Root
          notificationCount={notificationStats.total}
          {...rest}
        >
          <TopbarItemButton.Icon as={RiNotification3Line} />
        </TopbarItemButton.Root>
      </Popover.Trigger>
      <Popover.Content
        showArrow={false}
        className='w-screen max-w-[calc(100%-36px)] rounded-20 p-0 shadow-none min-[480px]:max-w-[520px]'
      >
        <div className='flex h-14 items-center justify-between px-5'>
          <span className='text-label-md text-text-strong-950'>
            Notifications
          </span>
          <LinkButton.Root variant='primary' size='medium' asChild>
            <Link href='/notifications'>Все уведомления</Link>
          </LinkButton.Root>
        </div>

        <div className='grid grid-cols-2 gap-3 border-y border-stroke-soft-200 px-5 py-4 sm:grid-cols-4'>
          <div className='rounded-lg bg-bg-weak-50 p-3 text-center'>
            <div className='text-label-lg text-text-strong-950'>
              {notificationStats.total}
            </div>
            <div className='text-paragraph-xs text-text-sub-600'>Всего</div>
          </div>
          <div className='rounded-lg bg-bg-weak-50 p-3 text-center'>
            <div className='text-label-lg text-text-strong-950'>
              {notificationStats.userVerification}
            </div>
            <div className='text-paragraph-xs text-text-sub-600'>
              Верификации
            </div>
          </div>
          <div className='rounded-lg bg-bg-weak-50 p-3 text-center'>
            <div className='text-label-lg text-text-strong-950'>
              {notificationStats.auctions}
            </div>
            <div className='text-paragraph-xs text-text-sub-600'>Аукционы</div>
          </div>
          <div className='rounded-lg bg-bg-weak-50 p-3 text-center'>
            <div className='text-label-lg text-text-strong-950'>
              {notificationStats.payouts}
            </div>
            <div className='text-paragraph-xs text-text-sub-600'>Выплаты</div>
          </div>
        </div>

        <div className='max-h-[420px] overflow-auto p-2'>
          <NotificationsList />
        </div>

        <div className='flex h-12 items-center justify-between border-t border-stroke-soft-200 px-5'>
          <div className='text-paragraph-xs text-text-sub-600'>
            Последние действия по фактам
          </div>
          <LinkButton.Root size='small' variant='gray'>
            <LinkButton.Icon as={RiSettings2Line} />
            Настроить
          </LinkButton.Root>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
