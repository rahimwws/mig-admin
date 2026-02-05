'use client';

import Link from 'next/link';
import { RiAddLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as FancyButton from '@/components/ui/fancy-button';

export function NewProductButton({ className }: { className?: string }) {
  return (
    <FancyButton.Root className={cn('rounded-xl', className)} asChild>
      <Link href='/add-product'>
        <FancyButton.Icon as={RiAddLine} />
        New Products
      </Link>
    </FancyButton.Root>
  );
}
