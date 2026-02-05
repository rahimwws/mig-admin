import type { User } from '../types/admin.types';

export const users: User[] = [
  {
    id: 'usr_001',
    name: 'Алексей Петров',
    email: 'petrov@mail.ru',
    phone: '+7 900 111 2233',
    role: 'broker',
    status: 'active',
    createdAt: '2025-12-01T10:00:00Z',
    stats: { bids: 15, wins: 3, activeDeals: 1 },
  },
  {
    id: 'usr_002',
    name: 'ООО СтройИнвест',
    email: 'info@stroyinvest.ru',
    phone: '+7 900 222 3344',
    role: 'developer',
    status: 'active',
    createdAt: '2025-11-15T08:00:00Z',
    stats: { properties: 8, auctions: 5, completedDeals: 3 },
  },
  {
    id: 'usr_003',
    name: 'Мария Иванова',
    email: 'ivanova@gmail.com',
    phone: '+7 900 333 4455',
    role: 'broker',
    status: 'pending_verification',
    createdAt: '2026-01-20T14:00:00Z',
    stats: { bids: 0, wins: 0, activeDeals: 0 },
  },
  {
    id: 'usr_004',
    name: 'Дмитрий Сидоров',
    email: 'sidorov@yandex.ru',
    phone: '+7 900 444 5566',
    role: 'broker',
    status: 'suspended',
    createdAt: '2025-10-05T09:00:00Z',
    stats: { bids: 42, wins: 7, activeDeals: 0 },
  },
  {
    id: 'usr_005',
    name: 'ГК Монолит',
    email: 'sales@monolit.ru',
    phone: '+7 900 555 6677',
    role: 'developer',
    status: 'active',
    createdAt: '2025-09-01T12:00:00Z',
    stats: { properties: 15, auctions: 12, completedDeals: 9 },
  },
  {
    id: 'usr_006',
    name: 'Екатерина Волкова',
    email: 'volkova@broker.pro',
    phone: '+7 900 666 7788',
    role: 'broker',
    status: 'active',
    createdAt: '2025-08-20T11:00:00Z',
    stats: { bids: 28, wins: 5, activeDeals: 2 },
  },
  {
    id: 'usr_007',
    name: 'ООО Новый Город',
    email: 'contact@novygorod.ru',
    phone: '+7 900 777 8899',
    role: 'developer',
    status: 'pending_verification',
    createdAt: '2026-01-25T16:00:00Z',
    stats: { properties: 0, auctions: 0, completedDeals: 0 },
  },
  {
    id: 'usr_008',
    name: 'Андрей Козлов',
    email: 'kozlov.a@realty.ru',
    phone: '+7 900 888 9900',
    role: 'broker',
    status: 'active',
    createdAt: '2025-07-15T09:30:00Z',
    stats: { bids: 56, wins: 12, activeDeals: 3 },
  },
  {
    id: 'usr_009',
    name: 'ЖК Премиум',
    email: 'info@jkpremium.ru',
    phone: '+7 900 999 0011',
    role: 'developer',
    status: 'active',
    createdAt: '2025-06-10T14:00:00Z',
    stats: { properties: 22, auctions: 18, completedDeals: 14 },
  },
  {
    id: 'usr_010',
    name: 'Ольга Новикова',
    email: 'novikova@gmail.com',
    phone: '+7 900 000 1122',
    role: 'broker',
    status: 'active',
    createdAt: '2025-11-01T08:00:00Z',
    stats: { bids: 8, wins: 1, activeDeals: 1 },
  },
];

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id);
}

export function getUsersByRole(role: 'broker' | 'developer'): User[] {
  return users.filter((user) => user.role === role);
}
