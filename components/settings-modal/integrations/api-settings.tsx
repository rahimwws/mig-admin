'use client';

import { RiAddLine } from '@remixicon/react';

import * as FancyButton from '@/components/ui/fancy-button';

import ApiSettingsTable from './api-settings-table';

export default function ApiSettings() {
  return (
    <div className='flex w-full min-w-0 flex-col gap-5 p-6'>
      <div className='grid gap-4 sm:flex sm:items-center sm:justify-between md:gap-6'>
        <div>
          <div className='text-label-sm text-text-strong-950'>
            Production Key
          </div>
          <div className='mt-1 text-paragraph-xs text-text-sub-600'>
            Use this key for live applications and keep it secure.
          </div>
        </div>

        <FancyButton.Root
          variant='primary'
          size='xsmall'
          className='rounded-10'
        >
          <FancyButton.Icon as={RiAddLine} />
          Generate API key
        </FancyButton.Root>
      </div>

      <ApiSettingsTable />
    </div>
  );
}
