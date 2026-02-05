'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RiArrowRightSLine,
  RiBarChartBoxLine,
  RiBuildingLine,
  RiFileListLine,
  RiGroupLine,
  RiHandCoinLine,
  RiLayoutGridLine,
  RiNotification3Line,
  RiSettings4Line,
  RiAuctionLine,
  RiHistoryLine,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Divider from '@/components/ui/divider';

type NavigationLink = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  disabled?: boolean;
};

const navigationLinks: NavigationLink[] = [
  { icon: RiLayoutGridLine, label: 'Дашборд', href: '/admin' },
  { icon: RiGroupLine, label: 'Пользователи', href: '/admin/users' },
  { icon: RiAuctionLine, label: 'Аукционы', href: '/admin/auctions' },
  { icon: RiHandCoinLine, label: 'Сделки', href: '/admin/deals' },
  { icon: RiBuildingLine, label: 'Выплаты', href: '/admin/payouts' },
  { icon: RiHistoryLine, label: 'Логи', href: '/admin/logs' },
  { icon: RiNotification3Line, label: 'Уведомления', href: '/admin/notifications' },
];

const settingsLinks: NavigationLink[] = [
  { icon: RiSettings4Line, label: 'Настройки', href: '/admin/settings' },
];

function NavigationMenu({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className='space-y-2'>
      <div
        className={cn('p-1 text-subheading-xs uppercase text-text-soft-400', {
          '-mx-2.5 w-14 px-0 text-center': collapsed,
        })}
      >
        Меню
      </div>
      <div className='space-y-1'>
        {navigationLinks.map(({ icon: Icon, label, href, disabled }, i) => {
          const active = isActive(href);
          return (
            <Link
              key={i}
              href={href}
              aria-current={active ? 'page' : undefined}
              aria-disabled={disabled}
              className={cn(
                'group relative flex items-center gap-2 whitespace-nowrap rounded-lg py-2 text-text-sub-600 hover:bg-bg-weak-50',
                'transition duration-200 ease-out',
                'aria-[current=page]:bg-bg-weak-50',
                'aria-disabled:pointer-events-none aria-disabled:opacity-50',
                {
                  'w-9 px-2': collapsed,
                  'w-full px-3': !collapsed,
                },
              )}
            >
              <div
                className={cn(
                  'absolute top-1/2 h-5 w-1 origin-left -translate-y-1/2 rounded-r-full bg-primary-base transition duration-200 ease-out',
                  {
                    '-left-[22px]': collapsed,
                    '-left-5': !collapsed,
                    'scale-100': active,
                    'scale-0': !active,
                  },
                )}
              />
              <Icon
                className={cn(
                  'size-5 shrink-0 text-text-sub-600 transition duration-200 ease-out',
                  'group-aria-[current=page]:text-primary-base',
                )}
              />

              {!collapsed && (
                <div className='flex w-[180px] shrink-0 items-center gap-2'>
                  <div className='flex-1 text-label-sm'>{label}</div>
                  {active && (
                    <RiArrowRightSLine className='size-5 text-text-sub-600' />
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SettingsAndOthers({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <div className='space-y-2'>
      <div
        className={cn('p-1 text-subheading-xs uppercase text-text-soft-400', {
          '-mx-2.5 w-14 px-0 text-center': collapsed,
        })}
      >
        Другое
      </div>
      <div className='space-y-1'>
        {settingsLinks.map(({ icon: Icon, label, href, disabled }, i) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={i}
              href={href}
              aria-current={active ? 'page' : undefined}
              aria-disabled={disabled}
              className={cn(
                'group relative flex items-center gap-2 whitespace-nowrap rounded-lg py-2 text-text-sub-600 hover:bg-bg-weak-50',
                'transition duration-200 ease-out',
                'aria-[current=page]:bg-bg-weak-50',
                'aria-disabled:pointer-events-none aria-disabled:opacity-50',
                {
                  'w-9 px-2': collapsed,
                  'w-full px-3': !collapsed,
                },
              )}
            >
              <div
                className={cn(
                  'absolute top-1/2 h-5 w-1 origin-left -translate-y-1/2 rounded-r-full bg-primary-base transition duration-200 ease-out',
                  {
                    '-left-[22px]': collapsed,
                    '-left-5': !collapsed,
                    'scale-100': active,
                    'scale-0': !active,
                  },
                )}
              />
              <Icon
                className={cn(
                  'size-5 shrink-0 text-text-sub-600 transition duration-200 ease-out',
                  'group-aria-[current=page]:text-primary-base',
                )}
              />

              {!collapsed && (
                <div className='flex w-[180px] shrink-0 items-center gap-2'>
                  <div className='flex-1 text-label-sm'>{label}</div>
                  {active && (
                    <RiArrowRightSLine className='size-5 text-text-sub-600' />
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SidebarHeader({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn('p-4', {
        'px-3': collapsed,
      })}
    >
      <Link href='/admin' className='flex items-center gap-3'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-base'>
          <RiAuctionLine className='size-5 text-static-white' />
        </div>
        {!collapsed && (
          <div className='flex flex-col'>
            <span className='text-label-md text-text-strong-950'>MIG Tender</span>
            <span className='text-paragraph-xs text-text-sub-600'>Admin Panel</span>
          </div>
        )}
      </Link>
    </div>
  );
}

function SidebarDivider({ collapsed }: { collapsed: boolean }) {
  return (
    <div className='px-5'>
      <Divider.Root
        className={cn('transition-all duration-200', {
          'w-10': collapsed,
        })}
      />
    </div>
  );
}

export default function AdminSidebar({
  defaultCollapsed = false,
}: {
  defaultCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <>
      <div
        className={cn(
          'fixed left-0 top-0 z-40 hidden h-full overflow-hidden border-r border-stroke-soft-200 bg-bg-white-0 transition-all duration-300 lg:block',
          {
            'w-20': collapsed,
            'w-[272px]': !collapsed,
          },
        )}
      >
        <div
          className='flex h-full w-[272px] min-w-[272px] flex-col overflow-auto'
        >
          <SidebarHeader collapsed={collapsed} />

          <SidebarDivider collapsed={collapsed} />

          <div
            className={cn('flex flex-1 flex-col gap-5 pb-4 pt-5', {
              'px-[22px]': collapsed,
              'px-5': !collapsed,
            })}
          >
            <NavigationMenu collapsed={collapsed} />
            <SettingsAndOthers collapsed={collapsed} />
          </div>

          <SidebarDivider collapsed={collapsed} />

          {/* Collapse toggle */}
          <div className='p-4'>
            <button
              type='button'
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-lg py-2 text-text-sub-600 hover:bg-bg-weak-50',
                'transition duration-200 ease-out',
              )}
            >
              <RiArrowRightSLine
                className={cn('size-5 transition-transform duration-200', {
                  'rotate-180': !collapsed,
                })}
              />
              {!collapsed && (
                <span className='text-label-sm'>Свернуть</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Placeholder for fixed sidebar */}
      <div
        className={cn('hidden shrink-0 lg:block', {
          'w-[272px]': !collapsed,
          'w-20': collapsed,
        })}
      />
    </>
  );
}
