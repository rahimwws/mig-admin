import type { DashboardStats } from '../types/admin.types';

// Generate 30 days of auction data
function generateAuctionsByDay() {
  const data: { date: string; count: number }[] = [];
  const baseDate = new Date('2026-02-05');

  for (let i = 29; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 3) + (i % 7 === 0 ? 0 : 1),
    });
  }

  return data;
}

// Generate weekly deals data
function generateDealsByWeek() {
  return [
    { week: 'W1 Jan', count: 2 },
    { week: 'W2 Jan', count: 1 },
    { week: 'W3 Jan', count: 3 },
    { week: 'W4 Jan', count: 1 },
    { week: 'W1 Feb', count: 2 },
  ];
}

export const stats: DashboardStats = {
  totalUsers: 10,
  brokers: 6,
  developers: 4,
  activeAuctions: 2,
  completedDeals: {
    week: 1,
    month: 4,
  },
  totalPayouts: {
    week: 6138000,
    month: 20790000,
  },
  charts: {
    auctionsByDay: generateAuctionsByDay(),
    dealsByWeek: generateDealsByWeek(),
    usersByRole: [
      { role: 'Брокеры', count: 6 },
      { role: 'Девелоперы', count: 4 },
    ],
  },
};

export function getStats(): DashboardStats {
  return stats;
}
