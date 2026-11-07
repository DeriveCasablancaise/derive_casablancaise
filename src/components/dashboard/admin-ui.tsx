'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { toast } from '@/components/hooks/use-toast';
import { FormDescription, FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';

export type AdminButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type AdminButtonSize = 'default' | 'sm' | 'icon';

// for triggers that bring their own element, like AlertDialogAction
export const adminButtonClass = (
  variant: AdminButtonVariant = 'primary',
  size: AdminButtonSize = 'default',
  className?: string,
) =>
  cn(
    'admin-btn',
    `admin-btn-${variant}`,
    size === 'sm' && 'admin-btn-sm',
    size === 'icon' && 'admin-btn-icon',
    className,
  );

type AdminButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AdminButtonVariant;
  size?: AdminButtonSize;
  asChild?: boolean;
};

export const AdminButton = React.forwardRef<
  HTMLButtonElement,
  AdminButtonProps
>(({ variant, size, asChild, className, ...props }, ref) => {
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      ref={ref}
      className={adminButtonClass(variant, size, className)}
      {...props}
    />
  );
});
AdminButton.displayName = 'AdminButton';

export const FieldLabel = ({
  required,
  children,
}: {
  required?: boolean;
  children: React.ReactNode;
}) => (
  <FormLabel className="admin-label">
    {children}
    {required && (
      <>
        <span className="admin-required" aria-hidden="true">
          {' '}
          *
        </span>
        <span className="sr-only"> (obligatoire)</span>
      </>
    )}
  </FormLabel>
);

export const FieldHelp = ({ children }: { children: React.ReactNode }) => (
  <FormDescription className="admin-help">{children}</FormDescription>
);

// on a long form the first error can be far above the save button
export const notifyInvalid = () =>
  toast({
    variant: 'destructive',
    title: 'Formulaire incomplet',
    description: 'Corrigez les champs signalés sous chaque champ.',
  });
