'use client';

import * as React from 'react';
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
        'relative flex flex-col gap-3 rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-5',
        className,
      )}
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <div className='text-paragraph-sm text-text-sub-600'>{title}</div>
          <div className='mt-2 flex flex-wrap items-center gap-2'>
            <div className='text-[clamp(1.75rem,2.6vw,2.75rem)] leading-tight text-text-strong-950 break-words'>
              {typeof value === 'number' ? value.toLocaleString('ru-RU') : value}
            </div>
            {change && (
              <span
                className={cn(
                  'text-paragraph-sm',
                  isPositive ? 'text-success-base' : 'text-error-base',
                )}
              >
                {isPositive ? '+' : ''}
                {change.value}% <span className='text-text-sub-600'>vs {change.period}</span>
              </span>
            )}
          </div>
          {subtitle && (
            <div className='mt-1 text-paragraph-xs text-text-sub-600'>
              {subtitle}
            </div>
          )}
        </div>

        {Icon && (
          <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-weak-50'>
            <Icon className={cn('size-5', iconColor)} />
          </div>
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
        'relative flex flex-col gap-4 rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200',
        className,
      )}
    >
      <div className='flex items-start gap-3'>
        {Icon && (
          <div className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-bg-weak-50'>
            <Icon className={cn('size-6', iconColor)} />
          </div>
        )}
        <div className='flex-1'>
          <div className='text-label-sm text-text-sub-600'>{title}</div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h3 text-text-strong-950'>
              {typeof value === 'number' ? value.toLocaleString('ru-RU') : value}
            </div>
            {change && (
              <Badge.Root
                variant='light'
                color={isPositive ? 'green' : 'red'}
                size='medium'
              >
                {isPositive ? '+' : ''}
                {change.value}%
              </Badge.Root>
            )}
          </div>
        </div>
      </div>

      {chart && <div className='h-[100px] w-full'>{chart}</div>}
    </div>
  );
}
