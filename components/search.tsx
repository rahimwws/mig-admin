'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiCloseLine,
  RiCornerDownLeftLine,
  RiFileList3Line,
  RiSearch2Line,
  RiShieldCheckLine,
  RiMoneyDollarCircleLine,
  RiUser3Line,
} from '@remixicon/react';
import { atom, useAtom, useSetAtom } from 'jotai';

import { cn } from '@/utils/cn';
import * as CommandMenu from '@/components/ui/command-menu';
import * as CompactButton from '@/components/ui/compact-button';
import * as Kbd from '@/components/ui/kbd';
import * as LinkButton from '@/components/ui/link-button';
import * as Tag from '@/components/ui/tag';
import * as TopbarItemButton from '@/components/topbar-item-button';

import IconCmd from '~/icons/icon-cmd.svg';

export const commandMenuOpenAtom = atom(false);

export function SearchMenuButton({
  ...rest
}: React.ComponentPropsWithoutRef<typeof TopbarItemButton.Root>) {
  const setOpen = useSetAtom(commandMenuOpenAtom);

  return (
    <>
      <TopbarItemButton.Root onClick={() => setOpen(true)} {...rest}>
        <TopbarItemButton.Icon as={RiSearch2Line} />
      </TopbarItemButton.Root>
    </>
  );
}

export function SearchMenu() {
  const [open, setOpen] = useAtom(commandMenuOpenAtom);
  const router = useRouter();
  const [activeFilter, setActiveFilter] = React.useState<string>('all');

  const filters = [
    { id: 'all', label: 'Все' },
    { id: 'auctions', label: 'Аукционные сделки' },
    { id: 'payouts', label: 'Выплаты пользователей' },
    { id: 'users', label: 'Пользователи' },
    { id: 'deals', label: 'Сделки' },
  ];

  const items = [
    {
      id: 'auction-1042',
      group: 'Аукционные сделки',
      filter: 'auctions',
      icon: RiFileList3Line,
      title: 'Аукцион A-1042',
      meta: 'Ожидает проверки · 2 участника',
      right: '450 000 ₽ · Сегодня',
      href: '/admin/auctions/1042',
    },
    {
      id: 'auction-0987',
      group: 'Аукционные сделки',
      filter: 'auctions',
      icon: RiFileList3Line,
      title: 'Аукцион A-0987',
      meta: 'Переверификация документов',
      right: 'Вчера',
      href: '/admin/auctions/0987',
    },
    {
      id: 'payout-2041',
      group: 'Выплаты пользователей',
      filter: 'payouts',
      icon: RiMoneyDollarCircleLine,
      title: 'Выплата PAY-2041',
      meta: 'Алина Соколова · USER-2784',
      right: '120 000 ₽ · В работе',
      href: '/admin/payouts/2041',
    },
    {
      id: 'payout-1998',
      group: 'Выплаты пользователей',
      filter: 'payouts',
      icon: RiMoneyDollarCircleLine,
      title: 'Выплата PAY-1998',
      meta: 'Иван Петров · USER-3321',
      right: '75 500 ₽ · В очереди',
      href: '/admin/payouts/1998',
    },
    {
      id: 'user-3321',
      group: 'Пользователи',
      filter: 'users',
      icon: RiUser3Line,
      title: 'Иван Петров · USER-3321',
      meta: 'Проверить документы пользователя',
      right: 'Срочно',
      href: '/admin/users/3321',
    },
    {
      id: 'user-2784',
      group: 'Пользователи',
      filter: 'users',
      icon: RiUser3Line,
      title: 'Алина Соколова · USER-2784',
      meta: 'Заявка на верификацию',
      right: 'Сегодня',
      href: '/admin/users/2784',
    },
    {
      id: 'deal-8893',
      group: 'Сделки',
      filter: 'deals',
      icon: RiFileList3Line,
      title: 'Сделка D-8893',
      meta: 'Проверьте аукционную сделку',
      right: '450 000 ₽ · На проверке',
      href: '/admin/deals/8893',
    },
    {
      id: 'deal-8741',
      group: 'Сделки',
      filter: 'deals',
      icon: RiFileList3Line,
      title: 'Сделка D-8741',
      meta: 'Подтвердить финальные условия',
      right: '320 000 ₽ · В работе',
      href: '/admin/deals/8741',
    },
  ];

  const filteredItems =
    activeFilter === 'all'
      ? items
      : items.filter((item) => item.filter === activeFilter);

  const groupedItems = filteredItems.reduce<Record<string, typeof items>>(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    },
    {},
  );

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'q' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandMenu.Dialog
      open={open}
      onOpenChange={setOpen}
      className='max-w-[920px]'
      overlayClassName='items-start justify-start pt-10 lg:pl-[272px]'
    >
      <CommandMenu.DialogTitle className='sr-only'>
        Search Menu
      </CommandMenu.DialogTitle>
      <CommandMenu.DialogDescription className='sr-only'>
        This command menu allows you to quickly access features and navigate
        through different sections by typing relevant commands.
      </CommandMenu.DialogDescription>
      {/* Input wrapper */}
      <div className='group/cmd-input flex h-14 w-full items-center gap-2 bg-bg-white-0 px-5'>
        <RiSearch2Line
          className={cn(
            'size-5 shrink-0 text-text-soft-400',
            'transition duration-200 ease-out',
            // focus within
            'group-focus-within/cmd-input:text-primary-base',
          )}
        />
        <CommandMenu.Input placeholder='Search or jump to' />
        <Kbd.Root>
          <IconCmd className='size-2.5' />Q
        </Kbd.Root>
        <CompactButton.Root
          size='medium'
          variant='ghost'
          onClick={() => setOpen(false)}
        >
          <CompactButton.Icon as={RiCloseLine} />
        </CompactButton.Root>
      </div>

      {/* Searching for */}
      <div className='px-5 py-4'>
        <div className='mb-3 text-label-xs text-text-sub-600'>
          Фильтры
        </div>
        <div className='flex flex-wrap gap-2'>
          {filters.map((filter) => (
            <button
              key={filter.id}
              type='button'
              onClick={() => setActiveFilter(filter.id)}
            >
              <Tag.Root
                variant='gray'
                className={cn(
                  activeFilter === filter.id &&
                    'bg-primary-alpha-10 text-primary-base ring-1 ring-inset ring-primary-alpha-10',
                )}
              >
                {filter.label}
              </Tag.Root>
            </button>
          ))}
        </div>
      </div>

      {/* Smart Prompt Examples */}
      <CommandMenu.List className='max-h-[520px]'>
        <CommandMenu.Group heading={`Результаты (${filteredItems.length})`}>
          <LinkButton.Root
            size='small'
            variant='gray'
            className='absolute right-4 top-5'
          >
            Показать все
          </LinkButton.Root>
        </CommandMenu.Group>
        {filteredItems.length === 0 ? (
          <CommandMenu.Group heading='Результаты'>
            <div className='px-3 py-2 text-paragraph-sm text-text-sub-600'>
              Ничего не найдено по выбранному фильтру.
            </div>
          </CommandMenu.Group>
        ) : (
          Object.entries(groupedItems).map(([group, groupItems]) => (
            <CommandMenu.Group key={group} heading={group}>
              {groupItems.map((item) => (
                <CommandMenu.Item
                  key={item.id}
                  value={`${item.title} ${item.meta}`}
                  onSelect={() => {
                    setOpen(false);
                    router.push(item.href);
                  }}
                >
                  <CommandMenu.ItemIcon as={item.icon} />
                  <div className='flex w-full items-center justify-between gap-4'>
                    <div className='space-y-0.5'>
                      <div className='text-paragraph-sm text-text-strong-950'>
                        {item.title}
                      </div>
                      <div className='text-paragraph-xs text-text-sub-600'>
                        {item.meta}
                      </div>
                    </div>
                    <div className='text-paragraph-xs text-text-sub-600'>
                      {item.right}
                    </div>
                  </div>
                </CommandMenu.Item>
              ))}
            </CommandMenu.Group>
          ))
        )}
        <CommandMenu.Group heading='Быстрые действия'>
          <CommandMenu.Item>
            <CommandMenu.ItemIcon as={RiShieldCheckLine} />
            Проверить документы пользователя
          </CommandMenu.Item>
          <CommandMenu.Item>
            <CommandMenu.ItemIcon as={RiFileList3Line} />
            Переверифицировать аукцион
          </CommandMenu.Item>
          <CommandMenu.Item>
            <CommandMenu.ItemIcon as={RiMoneyDollarCircleLine} />
            Создать выплату
          </CommandMenu.Item>
        </CommandMenu.Group>
      </CommandMenu.List>

      {/* Footer */}
      <CommandMenu.Footer>
        <div className='hidden gap-3 md:flex'>
          <div className='flex items-center gap-2'>
            <CommandMenu.FooterKeyBox>
              <RiArrowUpLine className='size-4' />
            </CommandMenu.FooterKeyBox>
            <CommandMenu.FooterKeyBox>
              <RiArrowDownLine className='size-4' />
            </CommandMenu.FooterKeyBox>
            <span className='text-paragraph-xs text-text-sub-600'>
              Navigate
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <CommandMenu.FooterKeyBox>
              <RiCornerDownLeftLine className='size-4' />
            </CommandMenu.FooterKeyBox>
            <span className='text-paragraph-xs text-text-sub-600'>Select</span>
          </div>
        </div>

        <div className='text-right text-paragraph-xs text-text-sub-600'>
          Not what you’re looking for? Try the{' '}
          <LinkButton.Root size='small' variant='primary' underline>
            Help Center
          </LinkButton.Root>
        </div>
      </CommandMenu.Footer>
    </CommandMenu.Dialog>
  );
}
