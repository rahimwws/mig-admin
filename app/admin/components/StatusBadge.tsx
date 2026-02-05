'use client';

import * as React from 'react';
import * as Badge from '@/components/ui/badge';

type BadgeColor =
  | 'gray'
  | 'blue'
  | 'orange'
  | 'red'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'sky'
  | 'pink'
  | 'teal';

// User status
const userStatusConfig: Record<string, { label: string; color: BadgeColor }> = {
  active: { label: 'Активен', color: 'green' },
  suspended: { label: 'Заблокирован', color: 'red' },
  pending_verification: { label: 'Ожидает верификации', color: 'orange' },
};

// User role
const userRoleConfig: Record<string, { label: string; color: BadgeColor }> = {
  broker: { label: 'Брокер', color: 'blue' },
  developer: { label: 'Девелопер', color: 'purple' },
};

// Auction status
const auctionStatusConfig: Record<string, { label: string; color: BadgeColor }> = {
  draft: { label: 'Черновик', color: 'gray' },
  scheduled: { label: 'Запланирован', color: 'blue' },
  active: { label: 'Активен', color: 'green' },
  selecting_winner: { label: 'Выбор победителя', color: 'orange' },
  completed: { label: 'Завершён', color: 'teal' },
  cancelled: { label: 'Отменён', color: 'red' },
};

// Auction mode
const auctionModeConfig: Record<string, { label: string; color: BadgeColor }> = {
  open: { label: 'Открытый', color: 'sky' },
  closed: { label: 'Закрытый', color: 'purple' },
};

// Bid status
const bidStatusConfig: Record<string, { label: string; color: BadgeColor }> = {
  pending: { label: 'Активная', color: 'blue' },
  won: { label: 'Выиграла', color: 'green' },
  lost: { label: 'Проиграла', color: 'red' },
  outbid: { label: 'Перебита', color: 'orange' },
};

// Deal status
const dealStatusConfig: Record<string, { label: string; color: BadgeColor }> = {
  obligation_sent: { label: 'Обязательство отправлено', color: 'blue' },
  obligation_accepted: { label: 'Обязательство принято', color: 'sky' },
  in_progress: { label: 'В процессе', color: 'orange' },
  payment_confirmed: { label: 'Оплата подтверждена', color: 'teal' },
  completed: { label: 'Завершена', color: 'green' },
  cancelled: { label: 'Отменена', color: 'red' },
};

// Payout status
const payoutStatusConfig: Record<string, { label: string; color: BadgeColor }> = {
  pending: { label: 'Ожидает', color: 'orange' },
  processing: { label: 'В обработке', color: 'blue' },
  paid: { label: 'Выплачено', color: 'green' },
};

// Property status
const propertyStatusConfig: Record<string, { label: string; color: BadgeColor }> = {
  draft: { label: 'Черновик', color: 'gray' },
  active: { label: 'Активен', color: 'green' },
  in_auction: { label: 'На аукционе', color: 'blue' },
  sold: { label: 'Продан', color: 'teal' },
};

// Property type
const propertyTypeConfig: Record<string, { label: string; color: BadgeColor }> = {
  residential: { label: 'Жилая', color: 'blue' },
  commercial: { label: 'Коммерческая', color: 'purple' },
  land: { label: 'Земля', color: 'green' },
  industrial: { label: 'Промышленная', color: 'orange' },
};

interface StatusBadgeProps {
  type:
    | 'userStatus'
    | 'userRole'
    | 'auctionStatus'
    | 'auctionMode'
    | 'bidStatus'
    | 'dealStatus'
    | 'payoutStatus'
    | 'propertyStatus'
    | 'propertyType';
  value: string;
  variant?: 'filled' | 'light' | 'lighter' | 'stroke';
  size?: 'small' | 'medium';
}

export function StatusBadge({
  type,
  value,
  variant = 'light',
  size = 'small',
}: StatusBadgeProps) {
  const configs: Record<string, Record<string, { label: string; color: BadgeColor }>> = {
    userStatus: userStatusConfig,
    userRole: userRoleConfig,
    auctionStatus: auctionStatusConfig,
    auctionMode: auctionModeConfig,
    bidStatus: bidStatusConfig,
    dealStatus: dealStatusConfig,
    payoutStatus: payoutStatusConfig,
    propertyStatus: propertyStatusConfig,
    propertyType: propertyTypeConfig,
  };

  const config = configs[type]?.[value];

  if (!config) {
    return (
      <Badge.Root variant={variant} color='gray' size={size}>
        {value}
      </Badge.Root>
    );
  }

  return (
    <Badge.Root variant={variant} color={config.color} size={size}>
      {config.label}
    </Badge.Root>
  );
}

// Quick helpers for common badges
export function UserStatusBadge({ status }: { status: string }) {
  return <StatusBadge type='userStatus' value={status} />;
}

export function UserRoleBadge({ role }: { role: string }) {
  return <StatusBadge type='userRole' value={role} />;
}

export function AuctionStatusBadge({ status }: { status: string }) {
  return <StatusBadge type='auctionStatus' value={status} />;
}

export function AuctionModeBadge({ mode }: { mode: string }) {
  return <StatusBadge type='auctionMode' value={mode} />;
}

export function BidStatusBadge({ status }: { status: string }) {
  return <StatusBadge type='bidStatus' value={status} />;
}

export function DealStatusBadge({ status }: { status: string }) {
  return <StatusBadge type='dealStatus' value={status} />;
}

export function PayoutStatusBadge({ status }: { status: string }) {
  return <StatusBadge type='payoutStatus' value={status} />;
}

export function PropertyStatusBadge({ status }: { status: string }) {
  return <StatusBadge type='propertyStatus' value={status} />;
}

export function PropertyTypeBadge({ type }: { type: string }) {
  return <StatusBadge type='propertyType' value={type} />;
}
