'use client';

import * as React from 'react';
import { RiAlertLine, RiDeleteBinLine, RiCheckLine } from '@remixicon/react';

import * as Modal from '@/components/ui/modal';
import * as FancyButton from '@/components/ui/fancy-button';

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'danger' | 'warning' | 'success';
  isLoading?: boolean;
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  onConfirm,
  onCancel,
  variant = 'warning',
  isLoading = false,
}: ConfirmModalProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  const icons = {
    danger: RiDeleteBinLine,
    warning: RiAlertLine,
    success: RiCheckLine,
  };

  const buttonVariants = {
    danger: 'destructive' as const,
    warning: 'primary' as const,
    success: 'primary' as const,
  };

  const Icon = icons[variant];

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content>
        <Modal.Header icon={Icon} title={title} description={description} />
        <Modal.Footer className='justify-end'>
          <FancyButton.Root
            variant='basic'
            size='small'
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </FancyButton.Root>
          <FancyButton.Root
            variant={buttonVariants[variant]}
            size='small'
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : confirmLabel}
          </FancyButton.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
