'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  RiArrowLeftLine,
  RiCalendarLine,
  RiTimeLine,
  RiCloseLine,
  RiBuildingLine,
  RiMapPinLine,
  RiRulerLine,
  RiFileList3Line,
  RiDownloadLine,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import {
  AdminHeader,
  StatCard,
  AuctionStatusBadge,
  AuctionModeBadge,
  BidStatusBadge,
  StatusTimeline,
  DataTable,
  ConfirmModal,
  type Column,
} from '../../components';
import * as Button from '@/components/ui/button';
import * as Avatar from '@/components/ui/avatar';

import { getAuctionById, auctions } from '../../mocks/auctions';
import { getPropertyById } from '../../mocks/properties';
import { getUserById } from '../../mocks/users';
import { getBidsByAuction } from '../../mocks/bids';
import type { Bid } from '../../types/admin.types';
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatArea,
  getInitials,
} from '../../utils/formatters';

export default function AuctionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const auctionId = params.id as string;

  const [showCancelModal, setShowCancelModal] = React.useState(false);

  const auction = getAuctionById(auctionId);
  const property = auction ? getPropertyById(auction.propertyId) : null;
  const developer = auction ? getUserById(auction.developerId) : null;
  const bids = auction ? getBidsByAuction(auctionId) : [];

  if (!auction) {
    return (
      <div className='flex flex-col'>
        <AdminHeader title='Аукцион не найден' />
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

  // Create timeline from auction history
  const timeline = [
    { status: 'draft', date: auction.createdAt, description: 'Аукцион создан' },
    ...(auction.status !== 'draft'
      ? [{ status: 'scheduled', date: auction.startDate, description: 'Аукцион запланирован' }]
      : []),
    ...(auction.status === 'active' ||
    auction.status === 'selecting_winner' ||
    auction.status === 'completed'
      ? [{ status: 'active', date: auction.startDate, description: 'Аукцион запущен' }]
      : []),
    ...(auction.status === 'selecting_winner' || auction.status === 'completed'
      ? [{ status: 'selecting_winner', date: auction.endDate, description: 'Выбор победителя' }]
      : []),
    ...(auction.status === 'completed'
      ? [{ status: 'completed', date: auction.endDate, description: 'Аукцион завершён' }]
      : []),
  ];

  const handleCancel = () => {
    console.log('Cancel auction:', auctionId);
    setShowCancelModal(false);
  };

  const bidColumns: Column<Bid>[] = [
    {
      key: 'brokerId',
      header: 'Брокер',
      render: (bid) => {
        const broker = getUserById(bid.brokerId);
        return (
          <Link
            href={`/admin/users/${bid.brokerId}`}
            className='flex items-center gap-2 hover:text-primary-base'
          >
            <Avatar.Root size='32'>
              <span className='flex size-full items-center justify-center bg-primary-alpha-10 text-label-xs text-primary-base'>
                {broker ? getInitials(broker.name) : '??'}
              </span>
            </Avatar.Root>
            <span className='text-label-sm'>{broker?.name || 'Неизвестный'}</span>
          </Link>
        );
      },
    },
    {
      key: 'amount',
      header: 'Сумма',
      render: (bid) => (
        <span className='font-medium'>{formatCurrency(bid.amount)}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Время',
      render: (bid) => (
        <span className='text-text-sub-600'>{formatDateTime(bid.createdAt)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Статус',
      render: (bid) => <BidStatusBadge status={bid.status} />,
    },
  ];

  return (
    <div className='flex flex-col'>
      <AdminHeader title={`Аукцион ${auction.id}`}>
        <div className='flex items-center gap-3'>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='small'
            onClick={() => router.back()}
          >
            <Button.Icon as={RiArrowLeftLine} />
            Назад
          </Button.Root>

          {(auction.status === 'active' || auction.status === 'scheduled') && (
            <Button.Root
              variant='error'
              mode='stroke'
              size='small'
              onClick={() => setShowCancelModal(true)}
            >
              <Button.Icon as={RiCloseLine} />
              Отменить аукцион
            </Button.Root>
          )}
        </div>
      </AdminHeader>

      <div className='flex flex-col gap-6 p-6'>
        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Auction info */}
          <div className='lg:col-span-2'>
            <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <h3 className='mb-4 text-label-md text-text-strong-950'>
                Параметры аукциона
              </h3>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <div className='text-paragraph-xs text-text-sub-600'>Статус</div>
                  <div className='mt-1'>
                    <AuctionStatusBadge status={auction.status} />
                  </div>
                </div>
                <div>
                  <div className='text-paragraph-xs text-text-sub-600'>Режим</div>
                  <div className='mt-1'>
                    <AuctionModeBadge mode={auction.mode} />
                  </div>
                </div>
                <div>
                  <div className='text-paragraph-xs text-text-sub-600'>
                    Минимальная цена
                  </div>
                  <div className='mt-1 text-label-md text-text-strong-950'>
                    {formatCurrency(auction.minPrice)}
                  </div>
                </div>
                <div>
                  <div className='text-paragraph-xs text-text-sub-600'>
                    Текущая макс. ставка
                  </div>
                  <div className='mt-1 text-label-md text-success-base'>
                    {auction.currentMaxBid
                      ? formatCurrency(auction.currentMaxBid)
                      : 'Нет ставок'}
                  </div>
                </div>
                <div>
                  <div className='flex items-center gap-1.5 text-paragraph-xs text-text-sub-600'>
                    <RiCalendarLine className='size-4' />
                    Дата начала
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {formatDateTime(auction.startDate)}
                  </div>
                </div>
                <div>
                  <div className='flex items-center gap-1.5 text-paragraph-xs text-text-sub-600'>
                    <RiTimeLine className='size-4' />
                    Дата окончания
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {formatDateTime(auction.endDate)}
                  </div>
                </div>
              </div>

              {/* Developer info */}
              {developer && (
                <div className='mt-6 border-t border-stroke-soft-200 pt-6'>
                  <div className='text-paragraph-xs text-text-sub-600'>Девелопер</div>
                  <Link
                    href={`/admin/users/${developer.id}`}
                    className='mt-2 flex items-center gap-3 rounded-lg p-2 transition hover:bg-bg-weak-50'
                  >
                    <Avatar.Root size='40'>
                      <span className='flex size-full items-center justify-center bg-feature-alpha-10 text-label-sm text-feature-base'>
                        {getInitials(developer.name)}
                      </span>
                    </Avatar.Root>
                    <div>
                      <div className='text-label-sm text-text-strong-950'>
                        {developer.name}
                      </div>
                      <div className='text-paragraph-xs text-text-sub-600'>
                        {developer.email}
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <h3 className='mb-4 text-label-md text-text-strong-950'>
              Таймлайн событий
            </h3>
            <StatusTimeline items={timeline} type='auction' />
          </div>
        </div>

        {/* Property info */}
        {property && (
          <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <h3 className='mb-4 text-label-md text-text-strong-950'>
              Информация об объекте
            </h3>

            <div className='grid gap-6 lg:grid-cols-3'>
              {/* Property images placeholder */}
              <div className='aspect-video rounded-xl bg-bg-weak-50 lg:aspect-square'>
                <div className='flex size-full items-center justify-center'>
                  <RiBuildingLine className='size-12 text-text-soft-400' />
                </div>
              </div>

              <div className='lg:col-span-2'>
                <h4 className='text-title-h5 text-text-strong-950'>
                  {property.title}
                </h4>

                <div className='mt-4 flex flex-wrap gap-4'>
                  <div className='flex items-center gap-2 text-paragraph-sm text-text-sub-600'>
                    <RiMapPinLine className='size-4' />
                    {property.address}
                  </div>
                  <div className='flex items-center gap-2 text-paragraph-sm text-text-sub-600'>
                    <RiRulerLine className='size-4' />
                    {formatArea(property.area)}
                  </div>
                </div>

                {/* Documents */}
                {property.documents.length > 0 && (
                  <div className='mt-6'>
                    <div className='text-paragraph-xs text-text-sub-600'>
                      Документы
                    </div>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {property.documents.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          className='flex items-center gap-2 rounded-lg border border-stroke-soft-200 px-3 py-2 text-paragraph-sm text-text-sub-600 transition hover:bg-bg-weak-50'
                        >
                          <RiFileList3Line className='size-4' />
                          {doc.name}
                          <RiDownloadLine className='size-4 text-text-soft-400' />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bids table */}
        <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-label-md text-text-strong-950'>
              Ставки ({bids.length})
            </h3>
          </div>
          <DataTable
            data={bids}
            columns={bidColumns}
            keyField='id'
            emptyMessage='Нет ставок'
          />
        </div>
      </div>

      {/* Cancel modal */}
      <ConfirmModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        title='Отменить аукцион?'
        description='Аукцион будет отменён. Все ставки будут аннулированы. Это действие нельзя отменить.'
        confirmLabel='Отменить аукцион'
        variant='danger'
        onConfirm={handleCancel}
      />
    </div>
  );
}
