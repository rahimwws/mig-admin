import * as Badge from '@/components/ui/badge';
import * as Divider from '@/components/ui/divider';
import { cn } from '@/utils/cn';
import { notifications, type NotificationItem } from '@/lib/notifications';

const statusStyles: Record<NotificationItem['status'], string> = {
  urgent: 'bg-error-base text-static-white',
  pending: 'bg-warning-base text-static-white',
  done: 'bg-success-base text-static-white',
};

const statusLabels: Record<NotificationItem['status'], string> = {
  urgent: 'Срочно',
  pending: 'В работе',
  done: 'Готово',
};

export function NotificationsList({
  className,
  items = notifications,
}: {
  className?: string;
  items?: NotificationItem[];
}) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {items.map((item, index) => (
        <div key={item.id}>
          <div className='flex items-start gap-3 rounded-lg p-3 text-paragraph-sm text-text-strong-950'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-weak-50 text-label-sm text-text-sub-600'>
              {item.type === 'payout' && '₽'}
              {item.type === 'auction-review' && 'A'}
              {item.type === 'auction-reverify' && 'A'}
              {item.type === 'user-verification' && 'U'}
              {item.type === 'deal-review' && 'D'}
            </div>
            <div className='flex-1 space-y-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <div className='text-label-sm font-medium text-text-strong-950'>
                  {item.title}
                </div>
                <Badge.Root
                  size='small'
                  variant='filled'
                  className={cn('rounded-md px-1.5', statusStyles[item.status])}
                >
                  {statusLabels[item.status]}
                </Badge.Root>
              </div>
              <div className='text-paragraph-sm text-text-sub-600'>
                {item.description}
              </div>
              <div className='flex flex-wrap items-center gap-2 text-paragraph-xs text-text-sub-600'>
                <span>{item.entity}</span>
                <span className='px-0.5'>∙</span>
                <span>{item.time}</span>
              </div>
            </div>
          </div>
          {index < items.length - 1 && <Divider.Root variant='line-spacing' />}
        </div>
      ))}
    </div>
  );
}
