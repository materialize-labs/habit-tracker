import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center">
        <div className="relative">
          <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              'h-12 w-12 flex items-center justify-center', // Large touch target
              'before:absolute before:inset-0 before:-m-2 before:rounded-full hover:before:bg-accent/10', // Touch feedback area
              'after:absolute after:inset-[calc(50%-12px)] after:h-6 after:w-6', // Actual checkbox size
              'after:rounded after:border after:border-primary after:bg-background',
              'peer-checked:after:bg-primary peer-checked:after:text-primary-foreground',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
              'transition-all',
              className
            )}
          >
            <Check
              className={cn(
                'absolute h-4 w-4 text-primary-foreground opacity-0 transition-opacity',
                'peer-checked:opacity-100'
              )}
            />
          </div>
        </div>
        {label && (
          <span className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox }; 