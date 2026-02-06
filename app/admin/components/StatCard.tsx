'use client';

import * as React from 'react';
import { RiMoreLine, RiLineChartLine } from '@remixicon/react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  subtitle?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-primary-base',
  subtitle,
  className,
}: StatCardProps) {
  const isPositive = change ? change.value >= 0 : true;

  return (
    <div
      className={cn(
        'relative flex flex-col gap-4 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-5 shadow-sm',
        className,
      )}
    >
      {/* Header: icon + title | ellipsis */}
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-3'>
          {Icon && (
            <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-alpha-10'>
              <Icon className={cn('size-5', iconColor)} />
            </div>
          )}
          <div className='text-label-sm text-text-sub-600'>{title}</div>
        </div>
        <button
          type='button'
          className='flex size-8 shrink-0 items-center justify-center rounded-lg text-text-sub-600 transition-colors hover:bg-bg-weak-50 hover:text-text-strong-950'
          aria-label='Дополнительные действия'
        >
          <RiMoreLine className='size-5' />
        </button>
      </div>

      {/* Value */}
      <div className='text-[clamp(1.75rem,2.5vw,2.5rem)] font-semibold leading-tight text-text-strong-950'>
        {typeof value === 'number' ? value.toLocaleString('ru-RU') : value}
      </div>

      {/* Trend + period / subtitle */}
      <div className='flex flex-wrap items-center gap-2'>
        {change && (
          <span
            className={cn(
              'inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-paragraph-xs font-semibold',
              isPositive
                ? 'bg-success-alpha-10 text-success-base'
                : 'bg-error-alpha-10 text-error-base',
            )}
          >
            <RiLineChartLine className='size-4 shrink-0' />
            {isPositive ? '+' : ''}
            {change.value}%{change.period ? ` ${change.period}` : ''}
          </span>
        )}
        {subtitle && !change && (
          <span className='text-paragraph-xs text-text-sub-600'>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

// Large stat card variant for dashboard
interface LargeStatCardProps extends StatCardProps {
  chart?: React.ReactNode;
}

export function LargeStatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-primary-base',
  chart,
  className,
}: LargeStatCardProps) {
  const isPositive = change ? change.value >= 0 : true;

  return (
    <div
      className={cn(
        'relative flex flex-col gap-4 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-5 shadow-sm',
        className,
      )}
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-3'>
          {Icon && (
            <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-alpha-10'>
              <Icon className={cn('size-5', iconColor)} />
            </div>
          )}
          <div className='text-label-sm text-text-sub-600'>{title}</div>
        </div>
        <button
          type='button'
          className='flex size-8 shrink-0 items-center justify-center rounded-lg text-text-sub-600 transition-colors hover:bg-bg-weak-50 hover:text-text-strong-950'
          aria-label='Дополнительные действия'
        >
          <RiMoreLine className='size-5' />
        </button>
      </div>

      <div className='flex items-center gap-2'>
        <div className='text-title-h3 text-text-strong-950'>
          {typeof value === 'number' ? value.toLocaleString('ru-RU') : value}
        </div>
        {change && (
          <span
            className={cn(
              'inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-paragraph-xs font-semibold',
              isPositive
                ? 'bg-success-alpha-10 text-success-base'
                : 'bg-error-alpha-10 text-error-base',
            )}
          >
            <RiLineChartLine className='size-4 shrink-0' />
            {isPositive ? '+' : ''}
            {change.value}%
          </span>
        )}
      </div>

      {change?.period && (
        <div className='text-paragraph-xs text-text-sub-600'>
          {change.period}
        </div>
      )}

      {chart && <div className='h-[100px] w-full'>{chart}</div>}
    </div>
  );
}
