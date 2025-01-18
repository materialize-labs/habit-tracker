import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'card' | 'text' | 'avatar' | 'button';
  size?: 'sm' | 'default' | 'lg';
}

export function Skeleton({
  className,
  variant = 'text',
  size = 'default',
  ...props
}: SkeletonProps) {
  const baseStyles = 'animate-pulse rounded-md bg-muted/50';
  
  const variants = {
    card: 'w-full',
    text: 'w-full',
    avatar: 'rounded-full',
    button: 'w-[100px]'
  };

  const sizes = {
    sm: {
      card: 'h-24',
      text: 'h-4',
      avatar: 'h-8 w-8',
      button: 'h-8'
    },
    default: {
      card: 'h-32',
      text: 'h-6',
      avatar: 'h-12 w-12',
      button: 'h-12'
    },
    lg: {
      card: 'h-48',
      text: 'h-8',
      avatar: 'h-16 w-16',
      button: 'h-14'
    }
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size][variant],
        className
      )}
      {...props}
    />
  );
} 