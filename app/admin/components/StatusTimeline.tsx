'use client';

import * as React from 'react';
import {
  RiCheckLine,
  RiTimeLine,
  RiCloseLine,
  RiMailSendLine,
  RiCheckDoubleLine,
  RiFileList3Line,
  RiBankCard2Line,
} from '@remixicon/react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { cn } from '@/utils/cn';

interface TimelineItem {
  status: string;
  date: string;
  description?: string;
}

interface StatusTimelineProps {
  items: TimelineItem[];
  type?: 'deal' | 'auction';
  className?: string;
}

const dealStatusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  obligation_sent: RiMailSendLine,
  obligation_accepted: RiCheckDoubleLine,
  in_progress: RiFileList3Line,
  payment_confirmed: RiBankCard2Line,
  completed: RiCheckLine,
  cancelled: RiCloseLine,
};

const dealStatusLabels: Record<string, string> = {
  obligation_sent: 'Обязательство отправлено',
  obligation_accepted: 'Обязательство принято',
  in_progress: 'В процессе',
  payment_confirmed: 'Оплата подтверждена',
  completed: 'Сделка завершена',
  cancelled: 'Сделка отменена',
};

const auctionStatusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  draft: RiFileList3Line,
  scheduled: RiTimeLine,
  active: RiTimeLine,
  selecting_winner: RiTimeLine,
  completed: RiCheckLine,
  cancelled: RiCloseLine,
};

const auctionStatusLabels: Record<string, string> = {
  draft: 'Черновик создан',
  scheduled: 'Аукцион запланирован',
  active: 'Аукцион запущен',
  selecting_winner: 'Выбор победителя',
  completed: 'Аукцион завершён',
  cancelled: 'Аукцион отменён',
};

export function StatusTimeline({
  items,
  type = 'deal',
  className,
}: StatusTimelineProps) {
  const icons = type === 'deal' ? dealStatusIcons : auctionStatusIcons;
  const labels = type === 'deal' ? dealStatusLabels : auctionStatusLabels;

  return (
    <div className={cn('flex flex-col', className)}>
      {items.map((item, index) => {
        const Icon = icons[item.status] || RiTimeLine;
        const isLast = index === items.length - 1;
        const isCompleted = item.status === 'completed';
        const isCancelled = item.status === 'cancelled';

        return (
          <div key={index} className='relative flex gap-4'>
            {/* Line */}
            {!isLast && (
              <div className='absolute bottom-0 left-3.5 top-8 w-px bg-stroke-soft-200' />
            )}

            {/* Icon */}
            <div
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full ring-1 ring-inset',
                {
                  'bg-success-light text-success-base ring-success-base/20': isCompleted,
                  'bg-error-light text-error-base ring-error-base/20': isCancelled,
                  'bg-bg-white-0 text-text-sub-600 ring-stroke-soft-200':
                    !isCompleted && !isCancelled,
                },
              )}
            >
              <Icon className='size-4' />
            </div>

            {/* Content */}
            <div className={cn('flex-1 pb-6', { 'pb-0': isLast })}>
              <div className='flex items-center justify-between gap-2'>
                <div className='text-label-sm text-text-strong-950'>
                  {labels[item.status] || item.status}
                </div>
                <div className='text-right text-paragraph-xs text-text-soft-400'>
                  {format(new Date(item.date), 'dd MMM yyyy, HH:mm', {
                    locale: ru,
                  })}
                </div>
              </div>
              {item.description && (
                <div className='mt-1 text-paragraph-xs text-text-sub-600'>
                  {item.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Horizontal timeline variant
interface HorizontalTimelineProps {
  items: TimelineItem[];
  currentStatus: string;
  type?: 'deal' | 'auction';
  className?: string;
}

export function HorizontalTimeline({
  items,
  currentStatus,
  type = 'deal',
  className,
}: HorizontalTimelineProps) {
  const labels = type === 'deal' ? dealStatusLabels : auctionStatusLabels;
  const statusOrder = Object.keys(labels);
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {statusOrder.slice(0, -1).map((status, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isCancelled = currentStatus === 'cancelled';

        return (
          <React.Fragment key={status}>
            <div className='flex flex-col items-center gap-1'>
              <div
                className={cn(
                  'flex size-6 items-center justify-center rounded-full text-xs font-medium',
                  {
                    'bg-success-base text-static-white': isCompleted && !isCancelled,
                    'bg-primary-base text-static-white': isCurrent && !isCancelled,
                    'bg-error-base text-static-white': isCancelled && isCurrent,
                    'bg-bg-weak-50 text-text-soft-400':
                      !isCompleted && !isCurrent,
                  },
                )}
              >
                {isCompleted ? (
                  <RiCheckLine className='size-3.5' />
                ) : (
                  index + 1
                )}
              </div>
              <span className='text-center text-paragraph-xs text-text-sub-600 max-w-[80px]'>
                {labels[status]}
              </span>
            </div>
            {index < statusOrder.length - 2 && (
              <div
                className={cn('h-0.5 w-8 flex-shrink-0', {
                  'bg-success-base': isCompleted && !isCancelled,
                  'bg-stroke-soft-200': !isCompleted,
                })}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
