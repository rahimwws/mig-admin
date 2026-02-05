import type { Deal } from '../types/admin.types';

export const deals: Deal[] = [
  {
    id: 'deal_001',
    auctionId: 'auc_003',
    brokerId: 'usr_001',
    developerId: 'usr_002',
    amount: 6200000,
    platformFee: 62000,
    brokerPayout: 6138000,
    status: 'completed',
    createdAt: '2026-01-16T10:00:00Z',
    completedAt: '2026-01-25T15:00:00Z',
    documents: [
      {
        name: 'Подтверждение оплаты.pdf',
        url: '#',
        uploadedAt: '2026-01-20T11:00:00Z',
      },
      {
        name: 'Акт приема-передачи.pdf',
        url: '#',
        uploadedAt: '2026-01-24T14:00:00Z',
      },
    ],
    timeline: [
      { status: 'obligation_sent', date: '2026-01-16T10:00:00Z' },
      { status: 'obligation_accepted', date: '2026-01-16T14:00:00Z' },
      { status: 'in_progress', date: '2026-01-17T09:00:00Z' },
      { status: 'payment_confirmed', date: '2026-01-24T16:00:00Z' },
      { status: 'completed', date: '2026-01-25T15:00:00Z' },
    ],
  },
  {
    id: 'deal_002',
    auctionId: 'auc_005',
    brokerId: 'usr_004',
    developerId: 'usr_002',
    amount: 14800000,
    platformFee: 148000,
    brokerPayout: 14652000,
    status: 'completed',
    createdAt: '2025-10-21T10:00:00Z',
    completedAt: '2025-11-05T12:00:00Z',
    documents: [
      {
        name: 'Договор купли-продажи.pdf',
        url: '#',
        uploadedAt: '2025-10-25T10:00:00Z',
      },
      {
        name: 'Квитанция об оплате.pdf',
        url: '#',
        uploadedAt: '2025-11-02T16:00:00Z',
      },
    ],
    timeline: [
      { status: 'obligation_sent', date: '2025-10-21T10:00:00Z' },
      { status: 'obligation_accepted', date: '2025-10-21T15:00:00Z' },
      { status: 'in_progress', date: '2025-10-22T09:00:00Z' },
      { status: 'payment_confirmed', date: '2025-11-03T14:00:00Z' },
      { status: 'completed', date: '2025-11-05T12:00:00Z' },
    ],
  },
  {
    id: 'deal_003',
    auctionId: 'auc_002',
    brokerId: 'usr_001',
    developerId: 'usr_005',
    amount: 9500000,
    platformFee: 95000,
    brokerPayout: 9405000,
    status: 'in_progress',
    createdAt: '2026-02-02T10:00:00Z',
    documents: [
      {
        name: 'Обязательство.pdf',
        url: '#',
        uploadedAt: '2026-02-02T10:00:00Z',
      },
    ],
    timeline: [
      { status: 'obligation_sent', date: '2026-02-02T10:00:00Z' },
      { status: 'obligation_accepted', date: '2026-02-02T16:00:00Z' },
      { status: 'in_progress', date: '2026-02-03T09:00:00Z' },
    ],
  },
  {
    id: 'deal_004',
    auctionId: 'auc_004',
    brokerId: 'usr_008',
    developerId: 'usr_009',
    amount: 24500000,
    platformFee: 245000,
    brokerPayout: 24255000,
    status: 'obligation_sent',
    createdAt: '2026-02-05T12:00:00Z',
    documents: [],
    timeline: [{ status: 'obligation_sent', date: '2026-02-05T12:00:00Z' }],
  },
];

export function getDealById(id: string): Deal | undefined {
  return deals.find((deal) => deal.id === id);
}

export function getDealsByBroker(brokerId: string): Deal[] {
  return deals.filter((deal) => deal.brokerId === brokerId);
}

export function getDealsByDeveloper(developerId: string): Deal[] {
  return deals.filter((deal) => deal.developerId === developerId);
}
