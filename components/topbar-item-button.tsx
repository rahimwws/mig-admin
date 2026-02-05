import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';

import { cn } from '@/utils/cn';
import { PolymorphicComponentProps } from '@/utils/polymorphic';

type TopbarItemButtonProps = {
  hasNotification?: boolean;
  notificationCount?: number;
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const TopbarItemButton = React.forwardRef<
  HTMLButtonElement,
  TopbarItemButtonProps
>(
  (
    { children, asChild, hasNotification, notificationCount, className, ...rest },
    forwardedRef,
  ) => {
    const Component = asChild ? Slot : 'button';

    return (
      <Component
        ref={forwardedRef}
        className={cn(
          // base
          'transition duration-200 ease-out relative flex size-10 shrink-0 items-center justify-center rounded-10 text-text-sub-600',
          // hover
          'hover:bg-bg-weak-50',
          // open
          'data-[state=open]:bg-bg-weak-50 data-[state=open]:text-primary-base',
          className,
        )}
        {...rest}
      >
        <Slottable>{children}</Slottable>
        {typeof notificationCount === 'number' ? (
          <div className='absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-stroke-white-0 bg-error-base px-1 text-[10px] font-semibold leading-none text-static-white shadow-regular-xs'>
            {notificationCount > 99 ? '99+' : notificationCount}
          </div>
        ) : (
          hasNotification && (
            <div className='absolute right-2.5 top-2.5 size-2 rounded-full border-2 border-stroke-white-0 bg-error-base shadow-regular-xs' />
          )
        )}
      </Component>
    );
  },
);
TopbarItemButton.displayName = 'TopbarItemButton';

function TopbarItemButtonIcon<T extends React.ElementType>({
  as,
  className,
  ...rest
}: PolymorphicComponentProps<T, React.HTMLAttributes<HTMLDivElement>>) {
  const Component = as || 'div';

  return <Component className='size-5' {...rest} />;
}
TopbarItemButtonIcon.displayName = 'TopbarItemButtonIcon';

export { TopbarItemButton as Root, TopbarItemButtonIcon as Icon };
