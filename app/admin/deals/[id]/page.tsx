'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  RiArrowLeftLine,
  RiMailLine,
  RiPhoneLine,
  RiBuildingLine,
  RiFileList3Line,
  RiDownloadLine,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import {
  AdminHeader,
  StatCard,
  DealStatusBadge,
  StatusTimeline,
} from '../../components';
import * as Button from '@/components/ui/button';
import * as Avatar from '@/components/ui/avatar';

import { getDealById } from '../../mocks/deals';
import { getUserById } from '../../mocks/users';
import { getAuctionById } from '../../mocks/auctions';
import { getPropertyById } from '../../mocks/properties';
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  getInitials,
} from '../../utils/formatters';

export default function DealDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;

  const deal = getDealById(dealId);
  const broker = deal ? getUserById(deal.brokerId) : null;
  const developer = deal ? getUserById(deal.developerId) : null;
  const auction = deal ? getAuctionById(deal.auctionId) : null;
  const property = auction ? getPropertyById(auction.propertyId) : null;

  if (!deal) {
    return (
      <div className='flex flex-col'>
        <AdminHeader title='Сделка не найдена' />
        <div className='p-6'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={() => router.back()}
          >
            <Button.Icon as={RiArrowLeftLine} />
            Назад
          </Button.Root>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col'>
      <AdminHeader title={`Сделка ${deal.id}`}>
        <Button.Root
          variant='neutral'
          mode='ghost'
          size='small'
          onClick={() => router.back()}
        >
          <Button.Icon as={RiArrowLeftLine} />
          Назад
        </Button.Root>
      </AdminHeader>

      <div className='flex flex-col gap-6 p-6'>
        {/* Status and stats */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <div className='text-paragraph-xs text-text-sub-600'>Статус</div>
            <div className='mt-2'>
              <DealStatusBadge status={deal.status} />
            </div>
          </div>
          <StatCard
            title='Сумма сделки'
            value={formatCurrency(deal.amount)}
            className='bg-bg-white-0'
          />
          <StatCard
            title='Комиссия платформы'
            value={formatCurrency(deal.platformFee)}
            subtitle='1%'
            className='bg-bg-white-0'
          />
          <StatCard
            title='К выплате брокеру'
            value={formatCurrency(deal.brokerPayout)}
            className='bg-bg-white-0'
          />
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Participants */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Broker */}
            <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <h3 className='mb-4 text-label-md text-text-strong-950'>Брокер</h3>
              {broker && (
                <Link
                  href={`/admin/users/${broker.id}`}
                  className='flex items-start gap-4 rounded-lg p-3 transition hover:bg-bg-weak-50'
                >
                  <Avatar.Root size='48'>
                    <span className='flex size-full items-center justify-center bg-primary-alpha-10 text-label-md text-primary-base'>
                      {getInitials(broker.name)}
                    </span>
                  </Avatar.Root>
                  <div className='flex-1'>
                    <div className='text-label-md text-text-strong-950'>
                      {broker.name}
                    </div>
                    <div className='mt-1 flex flex-col gap-1 text-paragraph-sm text-text-sub-600'>
                      <div className='flex items-center gap-2'>
                        <RiMailLine className='size-4' />
                        {broker.email}
                      </div>
                      <div className='flex items-center gap-2'>
                        <RiPhoneLine className='size-4' />
                        {broker.phone}
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Developer */}
            <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <h3 className='mb-4 text-label-md text-text-strong-950'>Девелопер</h3>
              {developer && (
                <Link
                  href={`/admin/users/${developer.id}`}
                  className='flex items-start gap-4 rounded-lg p-3 transition hover:bg-bg-weak-50'
                >
                  <Avatar.Root size='48'>
                    <span className='flex size-full items-center justify-center bg-feature-alpha-10 text-label-md text-feature-base'>
                      {getInitials(developer.name)}
                    </span>
                  </Avatar.Root>
                  <div className='flex-1'>
                    <div className='text-label-md text-text-strong-950'>
                      {developer.name}
                    </div>
                    <div className='mt-1 flex flex-col gap-1 text-paragraph-sm text-text-sub-600'>
                      <div className='flex items-center gap-2'>
                        <RiMailLine className='size-4' />
                        {developer.email}
                      </div>
                      <div className='flex items-center gap-2'>
                        <RiPhoneLine className='size-4' />
                        {developer.phone}
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Property */}
            {property && (
              <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
                <h3 className='mb-4 text-label-md text-text-strong-950'>Объект</h3>
                <div className='flex items-start gap-4'>
                  <div className='flex size-16 shrink-0 items-center justify-center rounded-xl bg-bg-weak-50'>
                    <RiBuildingLine className='size-8 text-text-soft-400' />
                  </div>
                  <div>
                    <div className='text-label-md text-text-strong-950'>
                      {property.title}
                    </div>
                    <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                      {property.address}
                    </div>
                    <Link
                      href={`/admin/auctions/${deal.auctionId}`}
                      className='mt-2 inline-block text-paragraph-sm text-primary-base hover:underline'
                    >
                      Перейти к аукциону →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Documents */}
            <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <h3 className='mb-4 text-label-md text-text-strong-950'>Документы</h3>
              {deal.documents.length === 0 ? (
                <p className='text-paragraph-sm text-text-sub-600'>
                  Документы ещё не загружены
                </p>
              ) : (
                <div className='flex flex-col gap-2'>
                  {deal.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      className='flex items-center justify-between gap-4 rounded-lg border border-stroke-soft-200 p-3 transition hover:bg-bg-weak-50'
                    >
                      <div className='flex items-center gap-3'>
                        <RiFileList3Line className='size-5 text-text-sub-600' />
                        <div>
                          <div className='text-label-sm text-text-strong-950'>
                            {doc.name}
                          </div>
                          <div className='text-paragraph-xs text-text-soft-400'>
                            Загружено: {formatDateTime(doc.uploadedAt)}
                          </div>
                        </div>
                      </div>
                      <RiDownloadLine className='size-5 text-text-soft-400' />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <h3 className='mb-4 text-label-md text-text-strong-950'>
              История статусов
            </h3>
            <StatusTimeline items={deal.timeline} type='deal' />

            {/* Dates */}
            <div className='mt-6 border-t border-stroke-soft-200 pt-6'>
              <div className='flex flex-col gap-3'>
                <div>
                  <div className='text-paragraph-xs text-text-sub-600'>
                    Дата создания
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {formatDateTime(deal.createdAt)}
                  </div>
                </div>
                {deal.completedAt && (
                  <div>
                    <div className='text-paragraph-xs text-text-sub-600'>
                      Дата завершения
                    </div>
                    <div className='mt-1 text-label-sm text-text-strong-950'>
                      {formatDateTime(deal.completedAt)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
