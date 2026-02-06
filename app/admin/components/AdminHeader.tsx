'use client';

import * as React from 'react';
import Link from 'next/link';
import { RiMenuLine, RiAuctionLine } from '@remixicon/react';
import { usePathname } from 'next/navigation';

import * as CompactButton from '@/components/ui/compact-button';
import AdminNotificationButton from '@/app/admin/components/AdminNotificationButton';
import { useSidebar } from './sidebar-context';

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
  const pathname = usePathname();
  const { toggleMobile } = useSidebar();

  const breadcrumbLabels: Record<string, string> = {
    admin: 'Дашборд',
    users: 'Пользователи',
    auctions: 'Аукционы',
    deals: 'Сделки',
    payouts: 'Выплаты',
    logs: 'Логи',
    notifications: 'Уведомления',
    settings: 'Настройки',
  };

  const breadcrumbs = React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] !== 'admin') return [];

    const items = [{ label: 'Дашборд', href: '/admin' }];
    let href = '/admin';
    segments.slice(1).forEach((segment) => {
      href += `/${segment}`;
      items.push({
        label: breadcrumbLabels[segment] || segment,
        href,
      });
    });
    return items;
  }, [pathname]);

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
          <CompactButton.Root variant='ghost' size='medium' onClick={toggleMobile}>
            <CompactButton.Icon as={RiMenuLine} />
          </CompactButton.Root>
        </div>
      </div>

      {/* Desktop header */}
      <div className='hidden items-center justify-between gap-6 px-6 py-4 lg:flex'>
        <div className='flex flex-1 items-center gap-6'>
          {(title || description) && (
            <div className='flex flex-col'>
              {breadcrumbs.length > 0 && (
                <nav className='mb-1 flex flex-wrap items-center gap-2 text-paragraph-xs text-text-sub-600'>
                  {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                      <React.Fragment key={crumb.href}>
                        {isLast ? (
                          <span className='text-text-strong-950'>
                            {crumb.label}
                          </span>
                        ) : (
                          <Link
                            href={crumb.href}
                            className='hover:text-text-strong-950'
                          >
                            {crumb.label}
                          </Link>
                        )}
                        {!isLast && <span className='text-text-soft-400'>›</span>}
                      </React.Fragment>
                    );
                  })}
                </nav>
              )}
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
        </div>

        <div className='flex items-center gap-3'>
          <AdminNotificationButton />
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
