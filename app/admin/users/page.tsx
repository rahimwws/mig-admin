'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RiEyeLine,
  RiLockLine,
  RiLockUnlockLine,
  RiCheckLine,
  RiFilterLine,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import {
  AdminHeader,
  DataTable,
  UserStatusBadge,
  UserRoleBadge,
  ConfirmModal,
  type Column,
} from '../components';
import * as Button from '@/components/ui/button';
import * as Select from '@/components/ui/select';
import * as Avatar from '@/components/ui/avatar';
import * as Dropdown from '@/components/ui/dropdown';

import { users } from '../mocks/users';
import type { User, UserRole, UserStatus } from '../types/admin.types';
import { formatDate, getInitials } from '../utils/formatters';

export default function UsersPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortField, setSortField] = React.useState<string>('createdAt');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  // Modal states
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [modalAction, setModalAction] = React.useState<
    'block' | 'unblock' | 'verify' | null
  >(null);

  const pageSize = 20;

  // Filter and sort data
  const filteredUsers = React.useMemo(() => {
    let result = [...users];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower),
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((user) => user.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sortField as keyof User];
      const bValue = b[sortField as keyof User];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });

    return result;
  }, [search, roleFilter, statusFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAction = (user: User, action: 'block' | 'unblock' | 'verify') => {
    setSelectedUser(user);
    setModalAction(action);
  };

  const handleConfirmAction = () => {
    // In a real app, this would call an API
    console.log(`Action: ${modalAction} for user: ${selectedUser?.id}`);
    setSelectedUser(null);
    setModalAction(null);
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Пользователь',
      sortable: true,
      render: (user) => (
        <div className='flex items-center gap-3'>
          <Avatar.Root size='40'>
            {user.avatar ? (
              <Avatar.Image src={user.avatar} alt={user.name} />
            ) : (
              <span className='flex size-full items-center justify-center bg-primary-alpha-10 text-label-sm text-primary-base'>
                {getInitials(user.name)}
              </span>
            )}
          </Avatar.Root>
          <div>
            <div className='text-label-sm text-text-strong-950'>{user.name}</div>
            <div className='text-paragraph-xs text-text-sub-600'>{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Роль',
      render: (user) => <UserRoleBadge role={user.role} />,
    },
    {
      key: 'status',
      header: 'Статус',
      render: (user) => <UserStatusBadge status={user.status} />,
    },
    {
      key: 'createdAt',
      header: 'Дата регистрации',
      sortable: true,
      render: (user) => (
        <span className='text-paragraph-sm text-text-sub-600'>
          {formatDate(user.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Действия',
      width: '120px',
      render: (user) => (
        <div className='flex items-center gap-1'>
          <Link href={`/admin/users/${user.id}`}>
            <Button.Root variant='neutral' mode='ghost' size='xxsmall'>
              <Button.Icon as={RiEyeLine} />
            </Button.Root>
          </Link>
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <Button.Root variant='neutral' mode='ghost' size='xxsmall'>
                •••
              </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align='end'>
              <Dropdown.Group>
                {user.status === 'pending_verification' && (
                  <Dropdown.Item onClick={() => handleAction(user, 'verify')}>
                    <Dropdown.ItemIcon as={RiCheckLine} />
                    Подтвердить
                  </Dropdown.Item>
                )}
                {user.status === 'active' && (
                  <Dropdown.Item onClick={() => handleAction(user, 'block')}>
                    <Dropdown.ItemIcon as={RiLockLine} />
                    Заблокировать
                  </Dropdown.Item>
                )}
                {user.status === 'suspended' && (
                  <Dropdown.Item onClick={() => handleAction(user, 'unblock')}>
                    <Dropdown.ItemIcon as={RiLockUnlockLine} />
                    Разблокировать
                  </Dropdown.Item>
                )}
              </Dropdown.Group>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
      ),
    },
  ];

  const modalConfig = {
    block: {
      title: 'Заблокировать пользователя?',
      description: `Пользователь "${selectedUser?.name}" будет заблокирован и не сможет пользоваться платформой.`,
      confirmLabel: 'Заблокировать',
      variant: 'danger' as const,
    },
    unblock: {
      title: 'Разблокировать пользователя?',
      description: `Пользователь "${selectedUser?.name}" снова получит доступ к платформе.`,
      confirmLabel: 'Разблокировать',
      variant: 'success' as const,
    },
    verify: {
      title: 'Подтвердить верификацию?',
      description: `Подтвердить верификацию пользователя "${selectedUser?.name}"?`,
      confirmLabel: 'Подтвердить',
      variant: 'success' as const,
    },
  };

  return (
    <div className='flex flex-col'>
      <AdminHeader
        title='Пользователи'
        description={`Всего: ${users.length} пользователей`}
      />

      <div className='flex flex-col gap-4 p-6'>
        {/* Filters */}
        <div className='flex flex-wrap items-center gap-3'>
          <Select.Root value={roleFilter} onValueChange={setRoleFilter} size='small'>
            <Select.Trigger className='w-[160px]'>
              <Select.Value placeholder='Все роли' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>Все роли</Select.Item>
              <Select.Item value='broker'>Брокеры</Select.Item>
              <Select.Item value='developer'>Девелоперы</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root
            value={statusFilter}
            onValueChange={setStatusFilter}
            size='small'
          >
            <Select.Trigger className='w-[200px]'>
              <Select.Value placeholder='Все статусы' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>Все статусы</Select.Item>
              <Select.Item value='active'>Активные</Select.Item>
              <Select.Item value='suspended'>Заблокированные</Select.Item>
              <Select.Item value='pending_verification'>
                Ожидают верификации
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Data table */}
        <DataTable
          data={paginatedUsers}
          columns={columns}
          keyField='id'
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder='Поиск по имени или email...'
          emptyMessage='Пользователи не найдены'
          onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
        />
      </div>

      {/* Confirm modal */}
      {modalAction && selectedUser && (
        <ConfirmModal
          open={!!modalAction}
          onOpenChange={() => {
            setModalAction(null);
            setSelectedUser(null);
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
