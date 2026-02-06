'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

const TOTAL_BAR_SEGMENTS = 40;

/** Pick gradient color for bar at index (0 = left) from stops. */
function getGradientColor(
  index: number,
  filledCount: number,
  stops: string[],
): string {
  if (filledCount <= 0 || stops.length === 0) return stops[0] ?? 'transparent';
  if (stops.length === 1) return stops[0];
  const t = filledCount <= 1 ? 0 : index / (filledCount - 1);
  const stopIndex = Math.min(
    Math.round(t * (stops.length - 1)),
    stops.length - 1,
  );
  return stops[stopIndex];
}

export interface SegmentItem {
  /** CSS color (e.g. hsl(var(--teal-600))) */
  color: string;
  label: string;
  /** Share of the bar 0–1 (e.g. 0.4 = 40%) */
  share: number;
}

export interface FinancialStatCardProps {
  title: string;
  value: string;
  /** Percentage change, e.g. 7.8 or -7.8 */
  changePercent: number;
  /** Optional: 'warning' for yellow pill (e.g. expenses) */
  changeVariant?: 'positive' | 'negative' | 'warning';
  segments: SegmentItem[];
  /** Ratio of bar that is "filled" with gradient (0–1). Default: 1 minus "Прочее" share. */
  filledRatio?: number;
  /** Color stops for the filled part (left to right). Enables vertical-segment bar style. */
  gradientStops?: string[];
  className?: string;
}

function getChangeBadgeClass(
  changePercent: number,
  variant?: 'positive' | 'negative' | 'warning',
): string {
  if (variant === 'warning') {
    return 'bg-yellow-alpha-10 text-yellow-700';
  }
  if (changePercent >= 0) {
    return 'bg-green-alpha-10 text-green-600';
  }
  return 'bg-red-alpha-10 text-red-600';
}

export function FinancialStatCard({
  title,
  value,
  changePercent,
  changeVariant,
  segments,
  filledRatio,
  gradientStops,
  className,
}: FinancialStatCardProps) {
  const badgeClass = getChangeBadgeClass(changePercent, changeVariant);
  const sign = changePercent >= 0 ? '+' : '';

  const filled =
    filledRatio ??
    (() => {
      const others = segments.find((s) => s.label === 'Прочее' || s.label === 'Others');
      return 1 - (others?.share ?? 0);
    })();
  const filledCount = Math.round(TOTAL_BAR_SEGMENTS * filled);
  const stops = gradientStops ?? [
    segments[0]?.color,
    segments[Math.min(1, segments.length - 1)]?.color ?? segments[0]?.color,
  ].filter(Boolean) as string[];

  return (
    <div
      className={cn(
        'shadow-sm flex flex-col gap-4 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-5',
        className,
      )}
    >
      {/* Header: title | change pill */}
      <div className='flex items-start justify-between gap-3'>
        <span className='text-label-sm text-text-sub-600'>{title}</span>
        <span
          className={cn(
            'inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-paragraph-xs font-semibold',
            badgeClass,
          )}
        >
          {sign}
          {changePercent}%
        </span>
      </div>

      {/* Value */}
      <div className='text-[clamp(1.5rem,2.2vw,2.25rem)] font-semibold leading-tight text-text-strong-950'>
        {value}
      </div>

      {/* Vertical segment bar (lines): gradient filled + gray unfilled */}
      <div
        className='flex w-full gap-0.5 overflow-hidden rounded-full'
        style={{ height: 12 }}
      >
        {Array.from({ length: TOTAL_BAR_SEGMENTS }, (_, i) => {
          const isFilled = i < filledCount;
          const color = isFilled
            ? getGradientColor(i, filledCount, stops)
            : 'hsl(var(--gray-200))';
          return (
            <div
              key={i}
              className='min-w-0 flex-1 rounded-sm'
              style={{ backgroundColor: color }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className='flex flex-wrap items-center gap-x-4 gap-y-1.5'>
        {segments.map((seg, i) => (
          <div key={i} className='flex items-center gap-1.5'>
            <span
              className='size-2 shrink-0 rounded-full'
              style={{ backgroundColor: seg.color }}
            />
            <span className='max-w-[80px] truncate text-paragraph-xs text-text-sub-600'>
              {seg.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
