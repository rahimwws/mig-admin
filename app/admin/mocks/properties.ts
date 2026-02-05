import type { Property } from '../types/admin.types';

export const properties: Property[] = [
  {
    id: 'prop_001',
    title: 'ЖК Солнечный, корпус 3',
    address: 'г. Москва, ул. Ленина, 45',
    area: 2500,
    type: 'residential',
    status: 'in_auction',
    developerId: 'usr_002',
    images: ['/mock/property1.jpg', '/mock/property1-2.jpg'],
    documents: [
      { name: 'Разрешение на строительство.pdf', url: '#' },
      { name: 'Проектная документация.pdf', url: '#' },
    ],
    createdAt: '2025-12-10T10:00:00Z',
  },
  {
    id: 'prop_002',
    title: 'БЦ Горизонт, блок А',
    address: 'г. Москва, пр. Мира, 112',
    area: 4200,
    type: 'commercial',
    status: 'in_auction',
    developerId: 'usr_005',
    images: ['/mock/property2.jpg'],
    documents: [{ name: 'Технический паспорт.pdf', url: '#' }],
    createdAt: '2025-11-20T11:00:00Z',
  },
  {
    id: 'prop_003',
    title: 'ЖК Речной, секция 2',
    address: 'г. Санкт-Петербург, наб. Фонтанки, 78',
    area: 1800,
    type: 'residential',
    status: 'sold',
    developerId: 'usr_002',
    images: ['/mock/property3.jpg', '/mock/property3-2.jpg', '/mock/property3-3.jpg'],
    documents: [
      { name: 'Договор аренды земли.pdf', url: '#' },
      { name: 'Разрешение на строительство.pdf', url: '#' },
    ],
    createdAt: '2025-10-05T09:00:00Z',
  },
  {
    id: 'prop_004',
    title: 'Склад-терминал Логистик',
    address: 'Московская обл., г. Химки, ул. Промышленная, 5',
    area: 8500,
    type: 'industrial',
    status: 'active',
    developerId: 'usr_005',
    images: ['/mock/property4.jpg'],
    documents: [{ name: 'Свидетельство о собственности.pdf', url: '#' }],
    createdAt: '2025-12-01T14:00:00Z',
  },
  {
    id: 'prop_005',
    title: 'ЖК Парковый, корпус 1',
    address: 'г. Москва, ул. Парковая, 23',
    area: 3200,
    type: 'residential',
    status: 'in_auction',
    developerId: 'usr_009',
    images: ['/mock/property5.jpg', '/mock/property5-2.jpg'],
    documents: [
      { name: 'Проект планировки.pdf', url: '#' },
      { name: 'Экспертиза.pdf', url: '#' },
    ],
    createdAt: '2026-01-05T10:00:00Z',
  },
  {
    id: 'prop_006',
    title: 'Участок под застройку',
    address: 'г. Сочи, ул. Морская, участок 12',
    area: 5000,
    type: 'land',
    status: 'draft',
    developerId: 'usr_009',
    images: ['/mock/property6.jpg'],
    documents: [{ name: 'Кадастровый паспорт.pdf', url: '#' }],
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'prop_007',
    title: 'ТЦ Галерея, этаж 2',
    address: 'г. Екатеринбург, ул. Малышева, 56',
    area: 1200,
    type: 'commercial',
    status: 'active',
    developerId: 'usr_005',
    images: ['/mock/property7.jpg'],
    documents: [{ name: 'Поэтажный план.pdf', url: '#' }],
    createdAt: '2025-11-10T12:00:00Z',
  },
  {
    id: 'prop_008',
    title: 'ЖК Звездный, корпус 5',
    address: 'г. Казань, ул. Баумана, 89',
    area: 2800,
    type: 'residential',
    status: 'sold',
    developerId: 'usr_002',
    images: ['/mock/property8.jpg', '/mock/property8-2.jpg'],
    documents: [
      { name: 'Разрешение на ввод.pdf', url: '#' },
      { name: 'Акт приемки.pdf', url: '#' },
    ],
    createdAt: '2025-09-20T15:00:00Z',
  },
];

export function getPropertyById(id: string): Property | undefined {
  return properties.find((property) => property.id === id);
}

export function getPropertiesByDeveloper(developerId: string): Property[] {
  return properties.filter((property) => property.developerId === developerId);
}
