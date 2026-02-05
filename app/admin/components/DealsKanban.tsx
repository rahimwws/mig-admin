'use client';

import * as React from 'react';
import {
  RiAddLine,
  RiCalendarLine,
  RiChat3Line,
  RiFileList3Line,
  RiMoreLine,
} from '@remixicon/react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

import { cn } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';

import { formatCurrency, formatDate, getInitials } from '../utils/formatters';
import type { Deal } from '../types/admin.types';

const DEAL_STATUS_ORDER: Deal['status'][] = [
  'obligation_sent',
  'obligation_accepted',
  'in_progress',
  'payment_confirmed',
  'completed',
  'cancelled',
];

const STATUS_LABELS: Record<Deal['status'], string> = {
  obligation_sent: 'Обяз. отправлено',
  obligation_accepted: 'Обяз. принято',
  in_progress: 'В процессе',
  payment_confirmed: 'Оплата подтв.',
  completed: 'Завершена',
  cancelled: 'Отменена',
};

const STATUS_TAG_COLORS: Record<Deal['status'], string> = {
  obligation_sent: 'bg-primary-alpha-10 text-primary-base',
  obligation_accepted: 'bg-sky-alpha-10 text-sky-600',
  in_progress: 'bg-warning-lighter text-warning-base',
  payment_confirmed: 'bg-teal-alpha-10 text-teal-600',
  completed: 'bg-success-alpha-10 text-success-base',
  cancelled: 'bg-error-alpha-10 text-error-base',
};

interface EnrichedDeal extends Deal {
  brokerName: string;
  developerName: string;
}

function getDealProgress(deal: Deal): number {
  const steps = DEAL_STATUS_ORDER.filter((s) => s !== 'cancelled');
  const idx = steps.indexOf(deal.status as (typeof steps)[number]);
  if (idx === -1) return 0;
  return Math.round(((idx + 1) / steps.length) * 100);
}

// Стили: без теней, единый rounded-xl, dashed для "Добавить сделку"
const CARD_BASE =
  'group flex cursor-grab active:cursor-grabbing flex-col gap-3 rounded-2xl border border-stroke-soft-200 bg-bg-weak-50 p-4 transition';
const ADD_DEAL_BTN =
  'flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stroke-soft-200 py-3 text-paragraph-xs text-text-sub-600 transition hover:border-primary-base hover:bg-primary-alpha-5 hover:text-primary-base';

interface DealCardContentProps {
  deal: EnrichedDeal;
}

function DealCardContent({ deal }: DealCardContentProps) {
  const progress = getDealProgress(deal);
  const documentsCount = deal.documents.length;

  return (
    <>
      <div className='flex items-start justify-between gap-2'>
        <div className='flex flex-wrap gap-1.5'>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-paragraph-xs font-medium',
              STATUS_TAG_COLORS[deal.status],
            )}
          >
            {deal.auctionId}
          </span>
          <span className='bg-bg-weak-100 inline-flex items-center rounded-full px-2 py-0.5 text-paragraph-xs font-medium text-text-sub-600'>
            {formatCurrency(deal.amount)}
          </span>
        </div>
        <button
          type='button'
          onClick={(e) => e.stopPropagation()}
          className='flex size-7 shrink-0 items-center justify-center rounded-lg text-text-sub-600 opacity-0 transition hover:bg-bg-soft-200 hover:text-text-strong-950 group-hover:opacity-100'
          aria-label='Меню'
        >
          <RiMoreLine className='size-4' />
        </button>
      </div>
      <div className='text-label-sm font-semibold text-text-strong-950'>
        {deal.id} · {deal.brokerName}
      </div>
      <div className='flex items-center gap-1.5 text-paragraph-xs text-text-sub-600'>
        <RiCalendarLine className='size-4 shrink-0' />
        {formatDate(deal.createdAt)}
      </div>
      <div className='space-y-1'>
        <div className='flex items-center justify-between text-paragraph-xs text-text-sub-600'>
          <span>Прогресс</span>
          <span>{progress}%</span>
        </div>
        <div className='bg-bg-weak-100 h-1.5 overflow-hidden rounded-full'>
          <div
            className='h-full rounded-full bg-primary-base transition-all'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-3 text-paragraph-xs text-text-sub-600'>
          <span className='flex items-center gap-1'>
            <RiChat3Line className='size-3.5' />
            0
          </span>
          <span className='flex items-center gap-1'>
            <RiFileList3Line className='size-3.5' />
            {documentsCount}
          </span>
        </div>
        <div className='flex -space-x-2'>
          <Avatar.Root size='20' className='ring-2 ring-bg-white-0'>
            <span className='flex size-full items-center justify-center bg-primary-alpha-10 text-[10px] font-medium text-primary-base'>
              {getInitials(deal.brokerName)}
            </span>
          </Avatar.Root>
          <Avatar.Root size='20' className='ring-2 ring-bg-white-0'>
            <span className='bg-feature-alpha-10 flex size-full items-center justify-center text-[10px] font-medium text-feature-base'>
              {getInitials(deal.developerName)}
            </span>
          </Avatar.Root>
        </div>
      </div>
    </>
  );
}

interface DraggableDealCardProps {
  deal: EnrichedDeal;
  onCardClick: () => void;
}

function DraggableDealCard({ deal, onCardClick }: DraggableDealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: deal.id,
    data: { deal, status: deal.status },
  });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        if (!isDragging) onCardClick();
      }}
      className={cn(
        CARD_BASE,
        isDragging && 'cursor-grabbing opacity-50',
      )}
    >
      <DealCardContent deal={deal} />
    </div>
  );
}

interface DroppableColumnProps {
  status: Deal['status'];
  deals: EnrichedDeal[];
  onDealClick: (deal: EnrichedDeal) => void;
  onAddDeal: () => void;
}

function DroppableColumn({
  status,
  deals,
  onDealClick,
  onAddDeal,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className='flex min-h-[400px] w-[300px] shrink-0 flex-col'>
      <div className='flex items-center justify-between gap-2 pb-3'>
        <span className='text-paragraph-sm font-semibold text-text-strong-950'>
          {STATUS_LABELS[status]}
        </span>
        <span className='flex min-w-[24px] justify-center rounded-lg bg-primary-alpha-10 px-2 py-0.5 text-[11px] font-medium text-primary-base'>
          {deals.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-[300px] flex-1 flex-col gap-3 rounded-xl px-1 pb-4 transition-colors',
          isOver && 'bg-primary-alpha-5',
        )}
      >
        {deals.map((deal) => (
          <DraggableDealCard
            key={deal.id}
            deal={deal}
            onCardClick={() => onDealClick(deal)}
          />
        ))}
        <button
          type='button'
          onClick={onAddDeal}
          className={ADD_DEAL_BTN}
        >
          <RiAddLine className='size-4' />
          Добавить сделку
        </button>
      </div>
    </div>
  );
}

interface DealsKanbanProps {
  deals: EnrichedDeal[];
  onDealClick: (deal: EnrichedDeal) => void;
  onStatusChange?: (dealId: string, newStatus: Deal['status']) => void;
}

export function DealsKanban({
  deals,
  onDealClick,
  onStatusChange,
}: DealsKanbanProps) {
  const [localDeals, setLocalDeals] = React.useState(deals);
  const [activeDeal, setActiveDeal] = React.useState<EnrichedDeal | null>(null);

  React.useEffect(() => {
    setLocalDeals(deals);
  }, [deals]);

  const dealsByStatus = React.useMemo(() => {
    const map: Record<Deal['status'], EnrichedDeal[]> = {
      obligation_sent: [],
      obligation_accepted: [],
      in_progress: [],
      payment_confirmed: [],
      completed: [],
      cancelled: [],
    };
    for (const deal of localDeals) {
      map[deal.status].push(deal);
    }
    return map;
  }, [localDeals]);

  const dealIdToStatus = React.useMemo(() => {
    const map: Record<string, Deal['status']> = {};
    for (const deal of localDeals) {
      map[deal.id] = deal.status;
    }
    return map;
  }, [localDeals]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const deal = localDeals.find((d) => d.id === event.active.id);
    if (deal) setActiveDeal(deal);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over) return;

    const dealId = String(active.id);
    let targetStatus: Deal['status'] | null = null;

    if (DEAL_STATUS_ORDER.includes(over.id as Deal['status'])) {
      targetStatus = over.id as Deal['status'];
    } else if (dealIdToStatus[String(over.id)]) {
      targetStatus = dealIdToStatus[String(over.id)];
    }

    if (targetStatus && targetStatus !== dealIdToStatus[dealId]) {
      setLocalDeals((prev) =>
        prev.map((d) =>
          d.id === dealId ? { ...d, status: targetStatus! } : d,
        ),
      );
      onStatusChange?.(dealId, targetStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className='flex gap-6 overflow-x-auto pb-4'>
        {DEAL_STATUS_ORDER.map((status) => (
          <DroppableColumn
            key={status}
            status={status}
            deals={dealsByStatus[status]}
            onDealClick={onDealClick}
            onAddDeal={() => { }}
          />
        ))}
      </div>

      <DragOverlay>
        {activeDeal ? (
          <div className={cn(CARD_BASE, 'cursor-grabbing')}>
            <DealCardContent deal={activeDeal} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
