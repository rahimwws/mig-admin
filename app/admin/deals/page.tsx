'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import {
  AdminHeader,
  DealsKanban,
  DateRangePicker,
} from '../components';

import { deals } from '../mocks/deals';
import { getUserById } from '../mocks/users';
import { getAuctionById } from '../mocks/auctions';
import type { Deal } from '../types/admin.types';

type EnrichedDeal = Deal & {
  brokerName: string;
  developerName: string;
  auctionTitle: string;
};

export default function DealsPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [dateFrom, setDateFrom] = React.useState<string>('');
  const [dateTo, setDateTo] = React.useState<string>('');

  // Enrich deals with user and auction data
  const enrichedDeals = React.useMemo(() => {
    return deals.map((deal) => {
      const broker = getUserById(deal.brokerId);
      const developer = getUserById(deal.developerId);
      const auction = getAuctionById(deal.auctionId);
      return {
        ...deal,
        brokerName: broker?.name || 'Неизвестный',
        developerName: developer?.name || 'Неизвестный',
        auctionTitle: auction?.id || 'Неизвестный',
      };
    });
  }, []);

  // Filter deals
  const filteredDeals = React.useMemo(() => {
    let result = [...enrichedDeals];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (deal) =>
          deal.brokerName.toLowerCase().includes(searchLower) ||
          deal.developerName.toLowerCase().includes(searchLower) ||
          deal.id.toLowerCase().includes(searchLower) ||
          deal.auctionId.toLowerCase().includes(searchLower),
      );
    }

    if (dateFrom) {
      result = result.filter(
        (deal) => new Date(deal.createdAt) >= new Date(dateFrom),
      );
    }
    if (dateTo) {
      result = result.filter(
        (deal) => new Date(deal.createdAt) <= new Date(dateTo),
      );
    }

    return result;
  }, [enrichedDeals, search, dateFrom, dateTo]);

  return (
    <div className='flex flex-col'>
      <AdminHeader
        title='Сделки'
        description={`Всего: ${deals.length} сделок`}
      />

      <div className='flex flex-col gap-4 p-6'>
        {/* Filters */}
        <div className='flex flex-wrap items-center gap-3'>
          <input
            type='search'
            placeholder='Поиск по участникам...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='h-9 rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-3 text-paragraph-sm outline-none placeholder:text-text-soft-400 focus:ring-2 focus:ring-primary-base focus:ring-offset-1'
          />
          <DateRangePicker
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
          />
        </div>

        {/* Kanban board */}
        <DealsKanban
          deals={filteredDeals}
          onDealClick={(deal) => router.push(`/admin/deals/${deal.id}`)}
        />
      </div>
    </div>
  );
}
