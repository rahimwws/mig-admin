import type { Payout } from '../types/admin.types';

export const payouts: Payout[] = [
  {
    id: 'pay_001',
    dealId: 'deal_001',
    brokerId: 'usr_001',
    amount: 6138000,
    status: 'paid',
    createdAt: '2026-01-25T15:00:00Z',
    paidAt: '2026-01-27T12:00:00Z',
  },
  {
    id: 'pay_002',
    dealId: 'deal_002',
    brokerId: 'usr_004',
    amount: 14652000,
    status: 'paid',
    createdAt: '2025-11-05T12:00:00Z',
    paidAt: '2025-11-08T10:00:00Z',
  },
  {
    id: 'pay_003',
    dealId: 'deal_003',
    brokerId: 'usr_001',
    amount: 9405000,
    status: 'processing',
    createdAt: '2026-02-03T10:00:00Z',
    paidAt: null,
  },
  {
    id: 'pay_004',
    dealId: 'deal_004',
    brokerId: 'usr_008',
    amount: 24255000,
    status: 'pending',
    createdAt: '2026-02-05T14:00:00Z',
    paidAt: null,
  },
];

export function getPayoutById(id: string): Payout | undefined {
  return payouts.find((payout) => payout.id === id);
}

export function getPayoutsByBroker(brokerId: string): Payout[] {
  return payouts.filter((payout) => payout.brokerId === brokerId);
}

export function getPayoutsByStatus(status: Payout['status']): Payout[] {
  return payouts.filter((payout) => payout.status === status);
}

export function getPayoutStats() {
  const pending = payouts.filter((p) => p.status === 'pending');
  const processing = payouts.filter((p) => p.status === 'processing');
  const paidThisMonth = payouts.filter((p) => {
    if (!p.paidAt) return false;
    const paidDate = new Date(p.paidAt);
    const now = new Date();
    return (
      paidDate.getMonth() === now.getMonth() &&
      paidDate.getFullYear() === now.getFullYear()
    );
  });

  return {
    pending: {
      count: pending.length,
      amount: pending.reduce((sum, p) => sum + p.amount, 0),
    },
    processing: {
      count: processing.length,
      amount: processing.reduce((sum, p) => sum + p.amount, 0),
    },
    paidThisMonth: {
      count: paidThisMonth.length,
      amount: paidThisMonth.reduce((sum, p) => sum + p.amount, 0),
    },
  };
}
