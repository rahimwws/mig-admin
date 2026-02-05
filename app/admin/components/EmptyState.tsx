'use client';

import * as React from 'react';
import { RiInboxLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = RiInboxLine,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className,
      )}
    >
      <div className='flex size-16 items-center justify-center rounded-2xl bg-bg-weak-50'>
        <Icon className='size-8 text-text-soft-400' />
      </div>
      <h3 className='mt-4 text-label-md text-text-strong-950'>{title}</h3>
      {description && (
        <p className='mt-2 max-w-sm text-paragraph-sm text-text-sub-600'>
          {description}
        </p>
      )}
      {action && (
        <Button.Root
          variant='primary'
          mode='filled'
          size='small'
          className='mt-4'
          onClick={action.onClick}
        >
          {action.label}
        </Button.Root>
      )}
    </div>
  );
}
