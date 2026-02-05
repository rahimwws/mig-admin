'use client';

import * as React from 'react';
import * as DialogPrimitives from '@radix-ui/react-dialog';
import { useSetAtom } from 'jotai';

import * as FancyButton from '@/components/ui/fancy-button';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import { settingsModalOpenAtom } from '@/components/settings-modal';

import ActiveSessions from './active-sessions';
import Password2FA from './password-2fa';

export default function PrivacySecurity() {
  const setSettingsModalOpen = useSetAtom(settingsModalOpenAtom);

  return (
    <div className=''>
      <div className='flex w-full flex-col gap-3.5 px-5 py-4 sm:flex-row sm:items-center'>
        <div className='flex-1'>
          <DialogPrimitives.Title className='text-label-md text-text-strong-950'>
            Privacy & Security
          </DialogPrimitives.Title>
          <DialogPrimitives.Description className='mt-1 text-paragraph-sm text-text-sub-600'>
            Customize your privacy and security settings
          </DialogPrimitives.Description>
        </div>
        <div className='grid grid-cols-2 items-center gap-3 sm:flex'>
          <FancyButton.Root
            variant='basic'
            size='small'
            className='rounded-10'
            onClick={() => setSettingsModalOpen(false)}
          >
            Discard
          </FancyButton.Root>
          <FancyButton.Root size='small' className='rounded-10'>
            Save Changes
          </FancyButton.Root>
        </div>
      </div>

      <TabMenuHorizontal.Root defaultValue='password'>
        <TabMenuHorizontal.List className='px-5'>
          <TabMenuHorizontal.Trigger value='password'>
            Password & 2FA
          </TabMenuHorizontal.Trigger>
          <TabMenuHorizontal.Trigger value='active-sessions'>
            Active Sessions
          </TabMenuHorizontal.Trigger>
        </TabMenuHorizontal.List>

        <TabMenuHorizontal.Content
          value='password'
          className='animate-setting-tab'
        >
          <Password2FA />
        </TabMenuHorizontal.Content>
        <TabMenuHorizontal.Content
          value='active-sessions'
          className='animate-setting-tab'
        >
          <ActiveSessions />
        </TabMenuHorizontal.Content>
      </TabMenuHorizontal.Root>
    </div>
  );
}
