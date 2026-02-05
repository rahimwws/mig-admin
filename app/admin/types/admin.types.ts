// Admin Types for MIG Tender

// User Types
export type UserRole = 'broker' | 'developer';
export type UserStatus = 'active' | 'suspended' | 'pending_verification';

export interface UserStats {
  bids?: number;
  wins?: number;
  activeDeals?: number;
  properties?: number;
  auctions?: number;
  completedDeals?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  stats: UserStats;
  avatar?: string;
}

// Property Types
export type PropertyType = 'residential' | 'commercial' | 'land' | 'industrial';
export type PropertyStatus = 'draft' | 'active' | 'in_auction' | 'sold';

export interface PropertyDocument {
  name: string;
  url: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  area: number;
  type: PropertyType;
  status: PropertyStatus;
  developerId: string;
  images: string[];
  documents: PropertyDocument[];
  createdAt: string;
}

// Auction Types
export type AuctionMode = 'open' | 'closed';
export type AuctionStatus = 'draft' | 'scheduled' | 'active' | 'selecting_winner' | 'completed' | 'cancelled';

export interface Auction {
  id: string;
  propertyId: string;
  developerId: string;
  mode: AuctionMode;
  status: AuctionStatus;
  minPrice: number;
  currentMaxBid: number | null;
  startDate: string;
  endDate: string;
  bidsCount: number;
  winnerId?: string;
  createdAt: string;
}

// Bid Types
export type BidStatus = 'pending' | 'won' | 'lost' | 'outbid';

export interface Bid {
  id: string;
  auctionId: string;
  brokerId: string;
  amount: number;
  status: BidStatus;
  createdAt: string;
}

// Deal Types
export type DealStatus =
  | 'obligation_sent'
  | 'obligation_accepted'
  | 'in_progress'
  | 'payment_confirmed'
  | 'completed'
  | 'cancelled';

export interface DealDocument {
  name: string;
  url: string;
  uploadedAt: string;
}

export interface DealTimelineEvent {
  status: DealStatus;
  date: string;
}

export interface Deal {
  id: string;
  auctionId: string;
  brokerId: string;
  developerId: string;
  amount: number;
  platformFee: number;
  brokerPayout: number;
  status: DealStatus;
  createdAt: string;
  completedAt?: string;
  documents: DealDocument[];
  timeline: DealTimelineEvent[];
}

// Payout Types
export type PayoutStatus = 'pending' | 'processing' | 'paid';

export interface Payout {
  id: string;
  dealId: string;
  brokerId: string;
  amount: number;
  status: PayoutStatus;
  createdAt: string;
  paidAt: string | null;
}

// Log Types
export type LogAction =
  | 'user.login'
  | 'user.register'
  | 'user.update'
  | 'property.create'
  | 'property.update'
  | 'property.delete'
  | 'auction.create'
  | 'auction.start'
  | 'auction.complete'
  | 'auction.cancel'
  | 'bid.create'
  | 'deal.create'
  | 'deal.update'
  | 'deal.complete'
  | 'payout.create'
  | 'payout.complete';

export type LogEntityType = 'user' | 'property' | 'auction' | 'bid' | 'deal' | 'payout';

export interface Log {
  id: string;
  userId: string;
  action: LogAction;
  entityType: LogEntityType;
  entityId: string;
  details?: Record<string, unknown>;
  ip: string;
  createdAt: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalUsers: number;
  brokers: number;
  developers: number;
  activeAuctions: number;
  completedDeals: {
    week: number;
    month: number;
  };
  totalPayouts: {
    week: number;
    month: number;
  };
  charts: {
    auctionsByDay: { date: string; count: number }[];
    dealsByWeek: { week: string; count: number }[];
    usersByRole: { role: string; count: number }[];
  };
}

// Table/List Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  search?: string;
  role?: UserRole;
  status?: string;
  mode?: AuctionMode;
  dateFrom?: string;
  dateTo?: string;
  action?: LogAction;
  userId?: string;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
