'use client';

import * as React from 'react';
import {
  RiSettings4Line,
  RiPercentLine,
  RiTimeLine,
  RiMailLine,
  RiShieldLine,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import { AdminHeader } from '../components';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Switch from '@/components/ui/switch';
import * as Divider from '@/components/ui/divider';
import * as Label from '@/components/ui/label';

export default function SettingsPage() {
  // Platform settings state
  const [platformFee, setPlatformFee] = React.useState('1');
  const [minBidIncrement, setMinBidIncrement] = React.useState('100000');
  const [auctionExtensionTime, setAuctionExtensionTime] = React.useState('5');
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [autoVerification, setAutoVerification] = React.useState(false);
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);

  const handleSave = () => {
    console.log('Saving settings:', {
      platformFee,
      minBidIncrement,
      auctionExtensionTime,
      emailNotifications,
      autoVerification,
      maintenanceMode,
    });
  };

  return (
    <div className='flex flex-col'>
      <AdminHeader
        title='Настройки'
        description='Настройки платформы MIG Tender'
      />

      <div className='flex flex-col gap-6 p-6'>
        {/* Commission settings */}
        <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-xl bg-primary-alpha-10'>
              <RiPercentLine className='size-5 text-primary-base' />
            </div>
            <div>
              <h3 className='text-label-md text-text-strong-950'>
                Комиссия платформы
              </h3>
              <p className='text-paragraph-sm text-text-sub-600'>
                Настройки комиссии с каждой сделки
              </p>
            </div>
          </div>

          <Divider.Root className='my-6' />

          <div className='grid gap-6 sm:grid-cols-2'>
            <div>
              <Label.Root htmlFor='platformFee'>Комиссия (%)</Label.Root>
              <Input.Root size='small' className='mt-2'>
                <Input.Wrapper>
                  <Input.Input
                    id='platformFee'
                    type='number'
                    value={platformFee}
                    onChange={(e) => setPlatformFee(e.target.value)}
                    min='0'
                    max='100'
                    step='0.1'
                  />
                  <Input.InlineAffix>%</Input.InlineAffix>
                </Input.Wrapper>
              </Input.Root>
              <p className='mt-1.5 text-paragraph-xs text-text-soft-400'>
                Процент комиссии с каждой завершённой сделки
              </p>
            </div>

            <div>
              <Label.Root htmlFor='minBidIncrement'>
                Минимальный шаг ставки (₽)
              </Label.Root>
              <Input.Root size='small' className='mt-2'>
                <Input.Wrapper>
                  <Input.Input
                    id='minBidIncrement'
                    type='number'
                    value={minBidIncrement}
                    onChange={(e) => setMinBidIncrement(e.target.value)}
                    min='0'
                    step='10000'
                  />
                  <Input.InlineAffix>₽</Input.InlineAffix>
                </Input.Wrapper>
              </Input.Root>
              <p className='mt-1.5 text-paragraph-xs text-text-soft-400'>
                Минимальная разница между ставками
              </p>
            </div>
          </div>
        </div>

        {/* Auction settings */}
        <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-xl bg-feature-alpha-10'>
              <RiTimeLine className='size-5 text-feature-base' />
            </div>
            <div>
              <h3 className='text-label-md text-text-strong-950'>
                Настройки аукционов
              </h3>
              <p className='text-paragraph-sm text-text-sub-600'>
                Параметры проведения аукционов
              </p>
            </div>
          </div>

          <Divider.Root className='my-6' />

          <div className='grid gap-6 sm:grid-cols-2'>
            <div>
              <Label.Root htmlFor='auctionExtensionTime'>
                Продление при ставке (мин)
              </Label.Root>
              <Input.Root size='small' className='mt-2'>
                <Input.Wrapper>
                  <Input.Input
                    id='auctionExtensionTime'
                    type='number'
                    value={auctionExtensionTime}
                    onChange={(e) => setAuctionExtensionTime(e.target.value)}
                    min='0'
                    max='60'
                  />
                  <Input.InlineAffix>мин</Input.InlineAffix>
                </Input.Wrapper>
              </Input.Root>
              <p className='mt-1.5 text-paragraph-xs text-text-soft-400'>
                Время продления аукциона при ставке в последние минуты
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-xl bg-information-alpha-10'>
              <RiMailLine className='size-5 text-information-base' />
            </div>
            <div>
              <h3 className='text-label-md text-text-strong-950'>Уведомления</h3>
              <p className='text-paragraph-sm text-text-sub-600'>
                Настройки email-уведомлений
              </p>
            </div>
          </div>

          <Divider.Root className='my-6' />

          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-label-sm text-text-strong-950'>
                  Email-уведомления
                </div>
                <p className='text-paragraph-xs text-text-sub-600'>
                  Отправлять уведомления пользователям о важных событиях
                </p>
              </div>
              <Switch.Root
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className='rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-xl bg-success-alpha-10'>
              <RiShieldLine className='size-5 text-success-base' />
            </div>
            <div>
              <h3 className='text-label-md text-text-strong-950'>Безопасность</h3>
              <p className='text-paragraph-sm text-text-sub-600'>
                Настройки верификации и доступа
              </p>
            </div>
          </div>

          <Divider.Root className='my-6' />

          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-label-sm text-text-strong-950'>
                  Автоматическая верификация
                </div>
                <p className='text-paragraph-xs text-text-sub-600'>
                  Автоматически верифицировать новых пользователей
                </p>
              </div>
              <Switch.Root
                checked={autoVerification}
                onCheckedChange={setAutoVerification}
              />
            </div>

            <Divider.Root />

            <div className='flex items-center justify-between'>
              <div>
                <div className='text-label-sm text-text-strong-950'>
                  Режим обслуживания
                </div>
                <p className='text-paragraph-xs text-text-sub-600'>
                  Временно закрыть доступ к платформе для пользователей
                </p>
              </div>
              <Switch.Root
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className='flex justify-end'>
          <Button.Root
            variant='primary'
            mode='filled'
            size='medium'
            onClick={handleSave}
          >
            Сохранить изменения
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
