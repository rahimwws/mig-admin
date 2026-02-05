'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { RiCalendarLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Input from '@/components/ui/input';
import * as Popover from '@/components/ui/popover';
import * as Button from '@/components/ui/button';

interface DateRangePickerProps {
  dateFrom?: string;
  dateTo?: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  className?: string;
}

export function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  className,
}: DateRangePickerProps) {
  const formatDisplayDate = (date?: string) => {
    if (!date) return '';
    try {
      return format(new Date(date), 'dd.MM.yyyy', { locale: ru });
    } catch {
      return date;
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className='relative'>
        <Input.Root size='small'>
          <Input.Wrapper>
            <Input.Icon as={RiCalendarLine} />
            <Input.Input
              type='date'
              placeholder='От'
              value={dateFrom || ''}
              onChange={(e) => onDateFromChange(e.target.value)}
              className='w-[140px]'
            />
          </Input.Wrapper>
        </Input.Root>
      </div>
      <span className='text-text-soft-400'>—</span>
      <div className='relative'>
        <Input.Root size='small'>
          <Input.Wrapper>
            <Input.Icon as={RiCalendarLine} />
            <Input.Input
              type='date'
              placeholder='До'
              value={dateTo || ''}
              onChange={(e) => onDateToChange(e.target.value)}
              className='w-[140px]'
            />
          </Input.Wrapper>
        </Input.Root>
      </div>
    </div>
  );
}

// Quick date range presets
interface QuickDateRangeProps {
  onSelect: (from: string, to: string) => void;
  className?: string;
}

export function QuickDateRange({ onSelect, className }: QuickDateRangeProps) {
  const presets = [
    { label: 'Сегодня', days: 0 },
    { label: 'Вчера', days: 1 },
    { label: 'Неделя', days: 7 },
    { label: 'Месяц', days: 30 },
    { label: '3 месяца', days: 90 },
  ];

  const handlePreset = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);

    onSelect(
      format(from, 'yyyy-MM-dd'),
      format(to, 'yyyy-MM-dd'),
    );
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {presets.map((preset) => (
        <Button.Root
          key={preset.label}
          variant='neutral'
          mode='lighter'
          size='xxsmall'
          onClick={() => handlePreset(preset.days)}
        >
          {preset.label}
        </Button.Root>
      ))}
    </div>
  );
}
