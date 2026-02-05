import type { Auction } from '../types/admin.types';

export const auctions: Auction[] = [
  {
    id: 'auc_001',
    propertyId: 'prop_001',
    developerId: 'usr_002',
    mode: 'open',
    status: 'active',
    minPrice: 15000000,
    currentMaxBid: 17500000,
    startDate: '2026-02-01T10:00:00Z',
    endDate: '2026-02-10T18:00:00Z',
    bidsCount: 8,
    createdAt: '2026-01-25T09:00:00Z',
  },
  {
    id: 'auc_002',
    propertyId: 'prop_002',
    developerId: 'usr_005',
    mode: 'closed',
    status: 'selecting_winner',
    minPrice: 8000000,
    currentMaxBid: null,
    startDate: '2026-01-20T10:00:00Z',
    endDate: '2026-02-01T18:00:00Z',
    bidsCount: 12,
    createdAt: '2026-01-15T11:00:00Z',
  },
  {
    id: 'auc_003',
    propertyId: 'prop_003',
    developerId: 'usr_002',
    mode: 'open',
    status: 'completed',
    minPrice: 5000000,
    currentMaxBid: 6200000,
    startDate: '2026-01-01T10:00:00Z',
    endDate: '2026-01-15T18:00:00Z',
    bidsCount: 5,
    winnerId: 'usr_001',
    createdAt: '2025-12-20T08:00:00Z',
  },
  {
    id: 'auc_004',
    propertyId: 'prop_005',
    developerId: 'usr_009',
    mode: 'open',
    status: 'active',
    minPrice: 22000000,
    currentMaxBid: 24500000,
    startDate: '2026-02-03T10:00:00Z',
    endDate: '2026-02-15T18:00:00Z',
    bidsCount: 6,
    createdAt: '2026-01-28T10:00:00Z',
  },
  {
    id: 'auc_005',
    propertyId: 'prop_008',
    developerId: 'usr_002',
    mode: 'closed',
    status: 'completed',
    minPrice: 12000000,
    currentMaxBid: 14800000,
    startDate: '2025-10-01T10:00:00Z',
    endDate: '2025-10-20T18:00:00Z',
    bidsCount: 9,
    winnerId: 'usr_004',
    createdAt: '2025-09-25T09:00:00Z',
  },
  {
    id: 'auc_006',
    propertyId: 'prop_004',
    developerId: 'usr_005',
    mode: 'open',
    status: 'scheduled',
    minPrice: 35000000,
    currentMaxBid: null,
    startDate: '2026-02-20T10:00:00Z',
    endDate: '2026-03-05T18:00:00Z',
    bidsCount: 0,
    createdAt: '2026-02-01T14:00:00Z',
  },
];

export function getAuctionById(id: string): Auction | undefined {
  return auctions.find((auction) => auction.id === id);
}

export function getAuctionsByDeveloper(developerId: string): Auction[] {
  return auctions.filter((auction) => auction.developerId === developerId);
}

export function getActiveAuctions(): Auction[] {
  return auctions.filter((auction) => auction.status === 'active');
}
