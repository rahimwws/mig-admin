'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { useTheme } from 'next-themes';
import {
  CreditCard,
  Folder,
  LayoutDashboard,
  NotebookText,
  Sparkles,
  Users,
  Gavel,
  Settings,
  HelpCircle,
  Search,
  Bell,
  PanelLeft,
  Headset,
  Plus,
} from 'lucide-react';

import { cn } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Switch from '@/components/ui/switch';
import { commandMenuOpenAtom } from '@/components/search';
import * as FancyButton from '@/components/ui/fancy-button';
import { useSidebar } from './sidebar-context';

type NavigationLink = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  disabled?: boolean;
  badge?: string | number;
};

const navigationLinks: NavigationLink[] = [
  { icon: LayoutDashboard, label: 'Дашборд', href: '/admin' },
  { icon: Users, label: 'Пользователи', href: '/admin/users' },
  { icon: Gavel, label: 'Аукционы', href: '/admin/auctions', badge: 4 },
  { icon: CreditCard, label: 'Сделки', href: '/admin/deals' },
  { icon: Folder, label: 'Выплаты', href: '/admin/payouts', badge: 32 },
];

const serviceLinks: NavigationLink[] = [
  { icon: NotebookText, label: 'Логи', href: '/admin/logs' },
  {
    icon: Bell,
    label: 'Уведомления',
    href: '/admin/notifications',
    badge: 'НОВОЕ',
  },
];

function SupportWidget({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <Link
        href='#'
        className='shadow-sm flex flex-col items-center gap-1 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-3'
        title='Нужна поддержка?'
      >
        <Headset className='size-5 text-text-sub-600' />
        <span className='text-[10px] font-medium text-text-sub-600'>Чат</span>
      </Link>
    );
  }
  return (
    <div className='shadow-sm rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4'>
      <div className='mb-3 flex items-start justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg-weak-50'>
            <Headset className='size-5 text-text-strong-950' />
          </div>
          <h3 className='text-label-sm font-semibold text-text-strong-950'>
            Нужна поддержка?
          </h3>
        </div>
        <span className='bg-emerald-500 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white'>
          Новое
        </span>
      </div>
      <p className='mb-4 text-paragraph-xs text-text-sub-600'>
        Свяжитесь с одним из наших экспертов, чтобы получить профессиональную
        поддержку.
      </p>
      <FancyButton.Root asChild variant='neutral' size='small' className='w-full'>
        <Link href='#' className='flex items-center justify-center gap-2'>
          <FancyButton.Icon as={Plus} className='size-4' />
          Начать чат
        </Link>
      </FancyButton.Root>
    </div>
  );
}

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
      {!collapsed && (
        <div className='flex items-center justify-between px-2 text-subheading-xs uppercase text-text-soft-400'>
          Главное меню
          <div className='text-text-soft-400'>•••</div>
        </div>
      )}
      <div className='space-y-1'>
        {navigationLinks.map(({ icon: Icon, label, href, disabled, badge }, i) => {
          const active = isActive(href);
          return (
            <Link
              key={i}
              href={href}
              aria-current={active ? 'page' : undefined}
              aria-disabled={disabled}
              className={cn(
                'group relative flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-text-sub-600 hover:bg-bg-weak-50',
                'transition duration-200 ease-out',
                'aria-[current=page]:bg-bg-weak-50 aria-[current=page]:text-text-strong-950',
                'aria-disabled:pointer-events-none aria-disabled:opacity-50',
              )}
            >
              <Icon
                className={cn(
                  'size-4 shrink-0 text-text-sub-600 transition duration-200 ease-out',
                  'group-aria-[current=page]:text-text-strong-950',
                )}
              />

              {!collapsed && (
                <div className='flex flex-1 items-center justify-between gap-2'>
                  <div className='text-label-sm'>{label}</div>
                  {badge !== undefined && (
                    <span
                      className={cn(
                        'min-w-6 rounded-md px-2 py-0.5 text-center text-[10px] font-semibold',
                        badge === 'NEW'
                          ? 'bg-primary-alpha-10 text-primary-base'
                          : 'bg-bg-weak-50 text-text-sub-600',
                      )}
                    >
                      {badge}
                    </span>
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

export default function AdminSidebar() {
  const setCommandOpen = useSetAtom(commandMenuOpenAtom);
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebar();
  const { theme, setTheme } = useTheme();

  const pathname = usePathname();

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-[280px] overflow-hidden border-r border-stroke-soft-200 bg-bg-white-0 transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className='flex h-full min-w-0 flex-col overflow-auto p-5'>
          <div className='mb-4 flex items-center gap-3 rounded-xl bg-bg-weak-50 p-3'>
            <Avatar.Root size='40'>
              <Avatar.Image src='/avatars/admin.jpg' alt='Admin' />
              <Avatar.Indicator>
                <Avatar.Status status='online' />
              </Avatar.Indicator>
            </Avatar.Root>
            <div className='min-w-0'>
              <div className='text-label-sm text-text-strong-950'>
                Администратор
              </div>
              <div className='text-paragraph-xs text-text-sub-600'>
                admin@migtender.ru
              </div>
            </div>
          </div>

          <Input.Root size='small'>
            <Input.Wrapper>
              <Input.Icon as={Search} />
              <Input.Input
                placeholder='Поиск (⌘/Ctrl + K)'
                readOnly
                onClick={() => {
                  setCommandOpen(true);
                  setMobileOpen(false);
                }}
              />
            </Input.Wrapper>
          </Input.Root>

          <div className='mt-5 flex flex-1 flex-col gap-5'>
            <NavigationMenu collapsed={false} />

            <div className='space-y-2'>
              <div className='flex items-center justify-between px-2 text-subheading-xs uppercase text-text-soft-400'>
                Сервис
                <div className='text-text-soft-400'>•••</div>
              </div>
              <div className='space-y-1'>
                {serviceLinks.map(({ icon: Icon, label, href, badge }, i) => (
                  <Link
                    key={i}
                    href={href}
                    className='flex items-center gap-2 rounded-lg px-3 py-2 text-text-sub-600 hover:bg-bg-weak-50'
                  >
                    <Icon className='size-4 text-text-sub-600' />
                    <div className='flex flex-1 items-center justify-between'>
                      <span className='text-label-sm'>{label}</span>
                      {badge && (
                        <span className='rounded-md bg-primary-alpha-10 px-2 py-0.5 text-[10px] font-semibold text-primary-base'>
                          {badge}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <SupportWidget collapsed={false} />
          </div>

          <Divider.Root className='my-4' />

          <div className='space-y-2'>
            <div className='flex items-center justify-between px-3'>
              <div className='flex items-center gap-2 text-text-sub-600'>
                <Sparkles className='size-4' />
                <span className='text-label-sm'>Темная тема</span>
              </div>
              <Switch.Root
                checked={theme === 'dark'}
                onCheckedChange={(checked) =>
                  setTheme(checked ? 'dark' : 'light')
                }
              />
            </div>
            <Link
              href='/admin/settings'
              className='flex items-center gap-2 rounded-lg px-3 py-2 text-text-sub-600 hover:bg-bg-weak-50'
            >
              <Settings className='size-4' />
              <span className='text-label-sm'>Настройки</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-40 hidden h-full overflow-hidden border-r border-stroke-soft-200 bg-bg-white-0 lg:block',
          collapsed ? 'w-[80px]' : 'w-[280px]',
        )}
      >
        <div
          className={cn(
            'flex h-full min-w-0 flex-col overflow-auto p-5',
            collapsed ? 'w-[80px]' : 'w-[280px]',
          )}
        >
          <div className='mb-3 flex items-center justify-start'>
            <button
              type='button'
              onClick={toggle}
              className='flex size-5 items-center justify-center rounded-lg text-text-sub-600 '
              aria-label={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
            >
              <PanelLeft className='size-4' />
            </button>
          </div>
          <div
            className={cn(
              'mb-4 flex items-center gap-3 rounded-xl bg-bg-weak-50 p-3',
              collapsed && 'justify-center',
            )}
          >
            <Avatar.Root size='40'>
              <Avatar.Image src='/avatars/admin.jpg' alt='Admin' />
              <Avatar.Indicator>
                <Avatar.Status status='online' />
              </Avatar.Indicator>
            </Avatar.Root>
            {!collapsed && (
              <div className='min-w-0'>
                <div className='text-label-sm text-text-strong-950'>
                  Администратор
                </div>
                <div className='text-paragraph-xs text-text-sub-600'>
                  admin@migtender.ru
                </div>
              </div>
            )}
          </div>
          {collapsed ? (
            <button
              type='button'
              onClick={() => setCommandOpen(true)}
              className='mb-4 flex w-full items-center justify-center rounded-lg border border-stroke-soft-200 bg-bg-white-0 py-2 text-text-sub-600 hover:bg-bg-weak-50'
            >
              <Search className='size-4' />
            </button>
          ) : (
            <Input.Root size='small'>
              <Input.Wrapper>
                <Input.Icon as={Search} />
                <Input.Input
                  placeholder='Поиск (⌘/Ctrl + K)'
                  readOnly
                  onClick={() => setCommandOpen(true)}
                  onFocus={() => setCommandOpen(true)}
                />
              </Input.Wrapper>
            </Input.Root>
          )}

          <div className='mt-5 flex flex-1 flex-col gap-5'>
            <NavigationMenu collapsed={collapsed} />

            {!collapsed && (
              <div className='space-y-2'>
                <div className='flex items-center justify-between px-2 text-subheading-xs uppercase text-text-soft-400'>
                  Сервис
                  <div className='text-text-soft-400'>•••</div>
                </div>
                <div className='space-y-1'>
                  {serviceLinks.map(({ icon: Icon, label, href, badge }, i) => (
                    <Link
                      key={i}
                      href={href}
                      className='flex items-center gap-2 rounded-lg px-3 py-2 text-text-sub-600 hover:bg-bg-weak-50'
                    >
                      <Icon className='size-4 text-text-sub-600' />
                      <div className='flex flex-1 items-center justify-between'>
                        <span className='text-label-sm'>{label}</span>
                        {badge && (
                          <span className='rounded-md bg-primary-alpha-10 px-2 py-0.5 text-[10px] font-semibold text-primary-base'>
                            {badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <SupportWidget collapsed={collapsed} />
          </div>

          <Divider.Root className={cn('my-4', collapsed && 'hidden')} />

          <div className='space-y-2'>
            <div className='flex items-center justify-between px-3'>
              <div className='flex items-center gap-2 text-text-sub-600'>
                <Sparkles className='size-4' />
                {!collapsed && <span className='text-label-sm'>Темная тема</span>}
              </div>
              <Switch.Root
                checked={theme === 'dark'}
                onCheckedChange={(checked) =>
                  setTheme(checked ? 'dark' : 'light')
                }
              />
            </div>
            <Link
              href='/admin/settings'
              className='flex items-center gap-2 rounded-lg px-3 py-2 text-text-sub-600 hover:bg-bg-weak-50'
            >
              <Settings className='size-4' />
              {!collapsed && <span className='text-label-sm'>Настройки</span>}
            </Link>

          </div>
        </div>
      </div>

      {/* Placeholder for fixed sidebar */}
      <div
        className={cn(
          'hidden shrink-0 lg:block',
          collapsed ? 'w-[80px]' : 'w-[280px]',
        )}
      />
    </>
  );
}
