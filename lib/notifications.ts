export type NotificationType =
  | 'user-verification'
  | 'auction-review'
  | 'auction-reverify'
  | 'payout'
  | 'deal-review';

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  entity: string;
  time: string;
  status: 'urgent' | 'pending' | 'done';
};

export const notifications: NotificationItem[] = [
  {
    id: 'notif-001',
    type: 'user-verification',
    title: 'Проверьте документы пользователя',
    description: 'Нужна верификация документов',
    entity: 'Иван Петров · USER-3321',
    time: '5 мин назад',
    status: 'urgent',
  },
  {
    id: 'notif-002',
    type: 'auction-review',
    title: 'Проверьте данный аукцион',
    description: 'Проверка условий лота перед подтверждением',
    entity: 'Аукцион A-1042',
    time: '18 мин назад',
    status: 'pending',
  },
  {
    id: 'notif-003',
    type: 'auction-reverify',
    title: 'Переверифицируйте аукцион',
    description: 'Есть спорные изменения в документах',
    entity: 'Аукцион A-0987',
    time: '1 час назад',
    status: 'urgent',
  },
  {
    id: 'notif-004',
    type: 'payout',
    title: 'Сделайте выплату',
    description: 'Выплата пользователю после завершения сделки',
    entity: 'Выплата PAY-2041 · 120 000 ₽',
    time: '2 часа назад',
    status: 'pending',
  },
  {
    id: 'notif-005',
    type: 'deal-review',
    title: 'Проверьте аукционную сделку',
    description: 'Ожидает подтверждения результатов',
    entity: 'Сделка D-8893 · 450 000 ₽',
    time: 'Сегодня, 09:12',
    status: 'pending',
  },
  {
    id: 'notif-006',
    type: 'user-verification',
    title: 'Проверьте документы пользователя',
    description: 'Заявка на первичную верификацию',
    entity: 'Алина Соколова · USER-2784',
    time: 'Сегодня, 08:20',
    status: 'pending',
  },
  {
    id: 'notif-007',
    type: 'payout',
    title: 'Сделайте выплату',
    description: 'Завершить выплату по заявке',
    entity: 'Выплата PAY-1998 · 75 500 ₽',
    time: 'Вчера, 19:04',
    status: 'pending',
  },
  {
    id: 'notif-008',
    type: 'auction-review',
    title: 'Проверьте данный аукцион',
    description: 'Новая заявка на публикацию',
    entity: 'Аукцион A-1129',
    time: 'Вчера, 17:45',
    status: 'pending',
  },
];

export const notificationStats = {
  total: notifications.length,
  userVerification: notifications.filter((item) => item.type === 'user-verification')
    .length,
  auctions: notifications.filter(
    (item) => item.type === 'auction-review' || item.type === 'auction-reverify',
  ).length,
  payouts: notifications.filter((item) => item.type === 'payout').length,
  deals: notifications.filter((item) => item.type === 'deal-review').length,
};
