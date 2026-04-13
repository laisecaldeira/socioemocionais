import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ className, variant = 'primary', ...props }: Props) {
  const styles = {
    primary: 'bg-primary text-primary-foreground hover:opacity-95',
    secondary: 'bg-card border border-border text-foreground hover:bg-muted',
    ghost: 'text-foreground hover:bg-muted'
  };

  return (
    <button
      className={cn('inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition', styles[variant], className)}
      {...props}
    />
  );
}
