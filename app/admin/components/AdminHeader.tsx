'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  RiLogoutBoxRLine,
  RiSearch2Line,
  RiMenuLine,
  RiAuctionLine,
} from '@remixicon/react';
import { useSetAtom } from 'jotai';

import { cn } from '@/utils/cn';
import * as Input from '@/components/ui/input';
import * as Avatar from '@/components/ui/avatar';
import * as CompactButton from '@/components/ui/compact-button';
import * as Dropdown from '@/components/ui/dropdown';
import { commandMenuOpenAtom } from '@/components/search';
import AdminNotificationButton from '@/app/admin/components/AdminNotificationButton';

interface AdminHeaderProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function AdminHeader({
  title,
  description,
  children,
}: AdminHeaderProps) {
  const setCommandOpen = useSetAtom(commandMenuOpenAtom);

  return (
    <header className='sticky top-0 z-30 border-b border-stroke-soft-200 bg-bg-white-0/80 backdrop-blur-xl'>
      {/* Mobile header */}
      <div className='flex items-center justify-between gap-4 p-4 lg:hidden'>
        <Link href='/admin' className='flex items-center gap-2'>
          <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-base'>
            <RiAuctionLine className='size-4 text-static-white' />
          </div>
          <span className='text-label-md text-text-strong-950'>MIG Admin</span>
        </Link>

        <div className='flex items-center gap-2'>
          <CompactButton.Root
            variant='ghost'
            size='medium'
            onClick={() => setCommandOpen(true)}
          >
            <CompactButton.Icon as={RiSearch2Line} />
          </CompactButton.Root>
          <CompactButton.Root variant='ghost' size='medium'>
            <CompactButton.Icon as={RiMenuLine} />
          </CompactButton.Root>
        </div>
      </div>

      {/* Desktop header */}
      <div className='hidden items-center justify-between gap-6 px-6 py-4 lg:flex'>
        <div className='flex flex-1 items-center gap-6'>
          {(title || description) && (
            <div className='flex flex-col'>
              {title && (
                <h1 className='text-title-h5 text-text-strong-950'>{title}</h1>
              )}
              {description && (
                <p className='text-paragraph-sm text-text-sub-600'>
                  {description}
                </p>
              )}
            </div>
          )}

          <div className='ml-auto max-w-[320px] flex-1'>
            <Input.Root size='small'>
              <Input.Wrapper>
                <Input.Icon as={RiSearch2Line} />
                <Input.Input
                  placeholder='Поиск (⌘/Ctrl + Q)'
                  readOnly
                  onFocus={() => setCommandOpen(true)}
                  onClick={() => setCommandOpen(true)}
                />
              </Input.Wrapper>
            </Input.Root>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <AdminNotificationButton />

          {/* User dropdown */}
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <button
                type='button'
                className='flex items-center gap-2 rounded-lg p-1.5 hover:bg-bg-weak-50 focus:outline-none'
              >
                <Avatar.Root size='40'>
                  <Avatar.Image src='/avatars/admin.jpg' alt='Admin' />
                  <Avatar.Indicator>
                    <Avatar.Status status='online' />
                  </Avatar.Indicator>
                </Avatar.Root>
                <div className='hidden flex-col items-start xl:flex'>
                  <span className='text-label-sm text-text-strong-950'>
                    Администратор
                  </span>
                  <span className='text-paragraph-xs text-text-sub-600'>
                    admin@migtender.ru
                  </span>
                </div>
              </button>
            </Dropdown.Trigger>
            <Dropdown.Content align='end' sideOffset={8}>
              <Dropdown.Group>
                <Dropdown.Item>
                  <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
                  Выйти
                </Dropdown.Item>
              </Dropdown.Group>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
      </div>

      {/* Page-specific actions */}
      {children && (
        <div className='border-t border-stroke-soft-200 px-6 py-3'>
          {children}
        </div>
      )}
    </header>
  );
}
