import type { Bid } from '../types/admin.types';

export const bids: Bid[] = [
  {
    id: 'bid_001',
    auctionId: 'auc_001',
    brokerId: 'usr_001',
    amount: 17500000,
    status: 'pending',
    createdAt: '2026-02-05T14:32:00Z',
  },
  {
    id: 'bid_002',
    auctionId: 'auc_001',
    brokerId: 'usr_004',
    amount: 17000000,
    status: 'outbid',
    createdAt: '2026-02-05T12:15:00Z',
  },
  {
    id: 'bid_003',
    auctionId: 'auc_001',
    brokerId: 'usr_006',
    amount: 16500000,
    status: 'outbid',
    createdAt: '2026-02-04T18:45:00Z',
  },
  {
    id: 'bid_004',
    auctionId: 'auc_001',
    brokerId: 'usr_008',
    amount: 16000000,
    status: 'outbid',
    createdAt: '2026-02-04T11:20:00Z',
  },
  {
    id: 'bid_005',
    auctionId: 'auc_001',
    brokerId: 'usr_010',
    amount: 15500000,
    status: 'outbid',
    createdAt: '2026-02-03T16:00:00Z',
  },
  {
    id: 'bid_006',
    auctionId: 'auc_001',
    brokerId: 'usr_001',
    amount: 15200000,
    status: 'outbid',
    createdAt: '2026-02-02T14:30:00Z',
  },
  {
    id: 'bid_007',
    auctionId: 'auc_001',
    brokerId: 'usr_006',
    amount: 15100000,
    status: 'outbid',
    createdAt: '2026-02-02T10:00:00Z',
  },
  {
    id: 'bid_008',
    auctionId: 'auc_001',
    brokerId: 'usr_008',
    amount: 15000000,
    status: 'outbid',
    createdAt: '2026-02-01T12:00:00Z',
  },
  {
    id: 'bid_009',
    auctionId: 'auc_002',
    brokerId: 'usr_001',
    amount: 9500000,
    status: 'pending',
    createdAt: '2026-01-30T15:00:00Z',
  },
  {
    id: 'bid_010',
    auctionId: 'auc_002',
    brokerId: 'usr_004',
    amount: 9200000,
    status: 'pending',
    createdAt: '2026-01-29T14:00:00Z',
  },
  {
    id: 'bid_011',
    auctionId: 'auc_002',
    brokerId: 'usr_006',
    amount: 8800000,
    status: 'pending',
    createdAt: '2026-01-28T12:00:00Z',
  },
  {
    id: 'bid_012',
    auctionId: 'auc_003',
    brokerId: 'usr_001',
    amount: 6200000,
    status: 'won',
    createdAt: '2026-01-14T16:00:00Z',
  },
  {
    id: 'bid_013',
    auctionId: 'auc_003',
    brokerId: 'usr_006',
    amount: 5800000,
    status: 'lost',
    createdAt: '2026-01-12T14:00:00Z',
  },
  {
    id: 'bid_014',
    auctionId: 'auc_003',
    brokerId: 'usr_008',
    amount: 5500000,
    status: 'lost',
    createdAt: '2026-01-10T11:00:00Z',
  },
  {
    id: 'bid_015',
    auctionId: 'auc_004',
    brokerId: 'usr_008',
    amount: 24500000,
    status: 'pending',
    createdAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 'bid_016',
    auctionId: 'auc_004',
    brokerId: 'usr_001',
    amount: 24000000,
    status: 'outbid',
    createdAt: '2026-02-04T17:00:00Z',
  },
  {
    id: 'bid_017',
    auctionId: 'auc_004',
    brokerId: 'usr_006',
    amount: 23500000,
    status: 'outbid',
    createdAt: '2026-02-04T14:00:00Z',
  },
  {
    id: 'bid_018',
    auctionId: 'auc_005',
    brokerId: 'usr_004',
    amount: 14800000,
    status: 'won',
    createdAt: '2025-10-19T15:00:00Z',
  },
  {
    id: 'bid_019',
    auctionId: 'auc_005',
    brokerId: 'usr_001',
    amount: 14200000,
    status: 'lost',
    createdAt: '2025-10-18T12:00:00Z',
  },
  {
    id: 'bid_020',
    auctionId: 'auc_005',
    brokerId: 'usr_008',
    amount: 13500000,
    status: 'lost',
    createdAt: '2025-10-15T10:00:00Z',
  },
];

export function getBidById(id: string): Bid | undefined {
  return bids.find((bid) => bid.id === id);
}

export function getBidsByAuction(auctionId: string): Bid[] {
  return bids.filter((bid) => bid.auctionId === auctionId);
}

export function getBidsByBroker(brokerId: string): Bid[] {
  return bids.filter((bid) => bid.brokerId === brokerId);
}
