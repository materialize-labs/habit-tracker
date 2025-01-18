import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const dialogVariants = {
  hidden: { opacity: 0, y: '100%' },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  }
};

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ isOpen, onClose, children, title, description }, ref) => {
    if (!isOpen) return null;

    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Dialog */}
            <motion.div
              ref={ref}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={dialogVariants}
              className={cn(
                'relative z-50 w-full sm:max-w-lg',
                'bg-background p-6 shadow-lg',
                'sm:rounded-lg',
                'flex flex-col gap-4',
                'max-h-[85vh] overflow-y-auto'
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  {title && (
                    <h2 className="font-semibold text-lg tracking-tight">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className={cn(
                    'absolute right-4 top-4',
                    'rounded-sm opacity-70 ring-offset-background transition-opacity',
                    'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    'disabled:pointer-events-none',
                    'h-12 w-12 flex items-center justify-center' // Large touch target
                  )}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1">{children}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);

Dialog.displayName = 'Dialog';

export { Dialog }; 